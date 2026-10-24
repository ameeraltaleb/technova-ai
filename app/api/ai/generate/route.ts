import { NextResponse } from 'next/server';
import { CATEGORIES } from '@/lib/data';

const VALID_CATEGORY_IDS = CATEGORIES.map((c) => c.id);
const VALID_CATEGORIES_PROMPT = CATEGORIES.map(
  (c) => `- "${c.id}" (${c.name}: ${c.description})`
).join('\n');

const GEMINI_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-flash-latest',
];

async function callGemini(prompt: string, apiKey: string, jsonMode = false) {
  let lastError: any = null;

  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
      const generationConfig: Record<string, any> = {
        temperature: 0.7,
        topP: 0.95,
      };

      if (jsonMode) {
        generationConfig.responseMimeType = 'application/json';
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        lastError = new Error(`Model ${model} returned ${res.status}: ${errText}`);
        continue;
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return text;
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini models failed to respond.');
}

function extractJSON(text: string): any {
  let clean = text.trim();
  if (clean.startsWith('```json')) {
    clean = clean.replace(/^```json\s*/i, '').replace(/```\s*$/, '');
  } else if (clean.startsWith('```')) {
    clean = clean.replace(/^```\s*/, '').replace(/```\s*$/, '');
  }
  
  const firstBrace = clean.indexOf('{');
  const lastBrace = clean.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    clean = clean.substring(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(clean);
  } catch {
    // Escape unescaped control characters ONLY inside strings
    let inString = false;
    let isEscaped = false;
    let fixed = '';

    for (let i = 0; i < clean.length; i++) {
      const char = clean[i];
      if (char === '"' && !isEscaped) {
        inString = !inString;
        fixed += char;
      } else if (inString && char === '\n') {
        fixed += '\\n';
      } else if (inString && char === '\r') {
        fixed += '\\r';
      } else if (inString && char === '\t') {
        fixed += '\\t';
      } else {
        fixed += char;
      }
      isEscaped = char === '\\' && !isEscaped;
    }

    return JSON.parse(fixed);
  }
}

async function verifyAdminAuth(req: Request): Promise<boolean> {
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

  if (!token) {
    return false;
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) return false;

    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: token }),
      }
    );

    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data.users && data.users.length > 0);
  } catch (err) {
    console.error('Failed to verify admin token:', err);
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const isAuthorized = await verifyAdminAuth(req);
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized: Access to AI Generation API is restricted to authenticated administrators.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { action, topic, language = 'ar', contextData = '', customApiKey } = body;

    const apiKey = customApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured. Please set GEMINI_API_KEY in .env.local or settings.' },
        { status: 400 }
      );
    }

    if (!topic && action !== 'test_connection' && action !== 'extract_pros_cons' && action !== 'generate_excerpt' && action !== 'suggest_tags') {
      return NextResponse.json(
        { error: 'Topic or context is required' },
        { status: 400 }
      );
    }

    if (action === 'test_connection') {
      const testReply = await callGemini('Reply with only {"status": "ok"}', apiKey);
      return NextResponse.json({ success: true, reply: testReply });
    }

    // 1. GENERATE COMPLETE ARTICLE
    if (action === 'generate_article') {
      const langPrompt = language === 'ar' 
        ? 'اكتب المحتوى كاملاً باللغة العربية بأسلوب تقني شيق واحترافي.'
        : 'Write the complete content in fluent, engaging tech journalism English.';

      const prompt = `You are a world-class tech journalist and AI researcher writing for "TechNova AI" blog.
Your task is to generate a comprehensive, in-depth blog article about: "${topic}".
Language requirement: ${langPrompt}

CRITICAL INSTRUCTION FOR "category":
You MUST select EXACTLY ONE category from this official registered list:
${VALID_CATEGORIES_PROMPT}

You are strictly FORBIDDEN from inventing new categories or outputting any category not in this list.
The "category" field MUST be one of these exact string IDs:
${JSON.stringify(VALID_CATEGORY_IDS)}

Return ONLY a valid JSON object without any introductory or conversational text, adhering to this EXACT schema:
{
  "title": "Catchy, SEO-optimized title",
  "slug": "english-url-friendly-slug-with-hyphens",
  "excerpt": "Engaging 2-sentence summary hook",
  "category": "one of the exact valid category IDs above",
  "readTime": "e.g. 7 min read",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "rating": 4.8,
  "pros": [
    "First strong point",
    "Second strong point",
    "Third strong point"
  ],
  "cons": [
    "First potential drawback or limitation",
    "Second limitation"
  ],
  "content": "Rich HTML content. Use <h2>, <h3>, <p>, <ul>, <li>, <strong>, <blockquote>, and <pre><code> if code is relevant. Make it detailed, highly structured, well-formatted, and at least 400 to 700 words long."
}`;

      const raw = await callGemini(prompt, apiKey, true);
      const parsed = extractJSON(raw);

      // Enforce strict category validation and fallback
      if (parsed && typeof parsed === 'object') {
        const rawCat = String(parsed.category || '').toLowerCase().trim().replace(/[\s_]+/g, '-');
        if (VALID_CATEGORY_IDS.includes(rawCat)) {
          parsed.category = rawCat;
        } else {
          // Attempt exact slug match or fallback
          const matched = VALID_CATEGORY_IDS.find(
            (id) => rawCat.includes(id) || id.includes(rawCat)
          );
          parsed.category = matched || 'ai-tools';
        }
      }

      return NextResponse.json({ success: true, data: parsed });
    }

    // 2. GENERATE QUICK NEWS FLASH
    if (action === 'generate_news') {
      const langPrompt = language === 'ar'
        ? 'اكتب الخبر باللغة العربية بأسلوب موجز ودقيق.'
        : 'Write in English with concise, breaking-tech style.';

      const prompt = `You are a breaking tech news editor for TechNova AI.
Generate a news item based on: "${topic}".
Language: ${langPrompt}

Categories: "AI Models", "Industry", "Regulation", "Hardware", "Robotics", "Open Source".

Return ONLY a valid JSON object matching this schema:
{
  "headline": "Punchy, exciting news headline",
  "id": "english-slug-like-news-id",
  "source": "TechNova News / Official Announcement",
  "category": "One of the categories above",
  "content": "1-2 sentences punchy summary for the news ticker / feed.",
  "fullContent": "2-3 comprehensive paragraphs providing the background, what happened, and what it means for the industry.",
  "tags": ["Tag1", "Tag2", "Tag3"]
}`;

      const raw = await callGemini(prompt, apiKey, true);
      const parsed = extractJSON(raw);
      return NextResponse.json({ success: true, data: parsed });
    }

    // 3. GENERATE EXCERPT FROM EXISTING CONTENT
    if (action === 'generate_excerpt') {
      const prompt = `Summarize the following article into an enticing 2-sentence excerpt/meta-description in the same language as the text:
"${contextData.slice(0, 3000)}"

Return ONLY a JSON object:
{ "excerpt": "The 2-sentence summary" }`;

      const raw = await callGemini(prompt, apiKey, true);
      const parsed = extractJSON(raw);
      return NextResponse.json({ success: true, data: parsed });
    }

    // 4. EXTRACT PROS AND CONS FROM CONTENT
    if (action === 'extract_pros_cons') {
      const prompt = `Analyze this article/review and extract the key advantages (pros) and drawbacks (cons) in the same language as the text:
"${contextData.slice(0, 3000)}"

Return ONLY a JSON object:
{
  "pros": ["Pro 1", "Pro 2", "Pro 3"],
  "cons": ["Con 1", "Con 2"]
}`;

      const raw = await callGemini(prompt, apiKey, true);
      const parsed = extractJSON(raw);
      return NextResponse.json({ success: true, data: parsed });
    }

    // 5. SUGGEST TAGS
    if (action === 'suggest_tags') {
      const prompt = `Suggest 5 to 7 relevant SEO tags for an article with this title and content:
Title: "${topic}"
Content: "${contextData.slice(0, 1500)}"

Return ONLY a JSON object:
{ "tags": ["Tag1", "Tag2", "Tag3", "Tag4", "Tag5"] }`;

      const raw = await callGemini(prompt, apiKey, true);
      const parsed = extractJSON(raw);
      return NextResponse.json({ success: true, data: parsed });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process AI generation request' },
      { status: 500 }
    );
  }
}
