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
        ? 'اكتب المقال كاملاً باللغة العربية الفصحى السليمة وبأسلوب صحفي تقني تحليلي رصين ومحترف.'
        : 'Write the complete content in clear, authoritative, fluent American English tech journalism.';

      const prompt = `You are a senior technology journalist, cybersecurity editor, and fact-checker writing for TechNova AI, an independent technology publication.

Your priority is not simply to produce engaging articles. Your priority is to produce accurate, trustworthy, well-researched, informative, and SEO-friendly journalism.
Language requirement: ${langPrompt}

You MUST strictly comply with the TechNova AI Editorial Standards & Content Generation Rules:

1. FACTUAL ACCURACY & VERIFICATION:
- Never invent facts, statistics, dates, research findings, product features, company announcements, quotations, or technical details.
- Never present assumptions, predictions, rumors, or speculation as confirmed facts.
- Rely on verifiable information from primary sources:
  1. Official company announcements and vendor documentation.
  2. Original research papers, benchmarks, and technical reports.
  3. Official regulatory publications and security advisories (CVE/NVD).
  4. Direct statements from named researchers or organizations.
- If a claim cannot be verified, omit it or clearly designate it as unverified.

2. SOURCE TRANSPARENCY & CITATIONS:
- Clearly distinguish between confirmed facts, expert opinions, and objective technical analysis.
- Never fabricate citations, URLs, research papers, CVE identifiers, or source names.
- Conclude the article with a dedicated "Sources & References" section containing authentic, working source links.

3. TECHNICAL ACCURACY:
- For AI, cybersecurity, software, or engineering topics: verify technical terminology and explain concepts accurately.
- Never invent CVE identifiers, CVSS scores, vulnerability details, or benchmark claims.
- Ensure all code examples are technically valid, bug-free, and clearly explained.
- Explain technical limitations and real-world conditions; do not exaggerate AI capabilities.

4. RESPONSIBLE REPORTING:
- Avoid sensationalism, misleading headlines, and exaggerated conclusions.
- Do not use expressions like "revolutionary", "unprecedented", "catastrophic", or "game-changing" unless supported by verifiable evidence.
- Do not present security risks or experimental AI findings without explaining their actual scope and conditions.

5. EDITORIAL INTEGRITY:
- Never fabricate first-hand testing, benchmarks, or personal reviews.
- Do not claim TechNova AI tested a product unless actual testing is specified in the prompt.
- Do not invent user metrics, market share numbers, or adoption statistics.
- Provide a genuinely balanced perspective with real pros and realistic limitations/cons.

6. EDITORIAL STRUCTURE (Rich HTML):
- Structured logically with descriptive <h2> and <h3> headings.
- Compelling, factual introduction establishing context.
- Evidence-based analysis with practical implications for developers, IT professionals, and technology users.
- A balanced conclusion.
- Conclude the "content" field with a clean <h2>Sources & References</h2> section citing primary sources.

7. CATEGORY CONSTRAINT:
You MUST select EXACTLY ONE category from this official registered list:
${VALID_CATEGORIES_PROMPT}

You are strictly FORBIDDEN from inventing new categories. The "category" field MUST be one of:
${JSON.stringify(VALID_CATEGORY_IDS)}

Topic / Instructions: "${topic}"

Return ONLY a valid JSON object without any conversational or Markdown code fences outside the JSON, adhering to this EXACT schema:
{
  "title": "Clear, informative, factual headline between 45 and 60 characters for optimal SEO (never exceed 65 characters, no clickbait)",
  "slug": "english-url-friendly-slug-with-hyphens",
  "excerpt": "Compelling, factual 2-sentence summary between 80 and 150 characters suitable for SEO meta description",
  "category": "one of the exact valid category IDs above",
  "readTime": "e.g. 7 min read",
  "tags": ["Tag1", "Tag2", "Tag3", "Tag4"],
  "rating": 4.8,
  "pros": [
    "Verified capability or documented benefit",
    "Second verified capability"
  ],
  "cons": [
    "Documented limitation, trade-off, or operational consideration",
    "Second documented limitation"
  ],
  "content": "Rich HTML content (minimum 600-1000 words). Use <h2>, <h3>, <p>, <ul>, <li>, <strong>, <blockquote>, and <pre><code> where relevant. Include context, technical breakdown, practical implications, balanced conclusion, and a final <h2>Sources & References</h2> section."
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
        ? 'اكتب الخبر باللغة العربية الفصحى بأسلوب إخباري تقني موجز ودقيق وموضوعي.'
        : 'Write in concise, accurate, objective breaking tech journalism English.';

      const prompt = `You are a breaking tech news editor and fact-checker for TechNova AI.
Generate a verified news item based on: "${topic}".
Language: ${langPrompt}

Strict Rules:
- Never fabricate facts, dates, quotes, statistics, or CVEs.
- Avoid sensationalism and exaggerated claims.
- Cite the primary source (e.g. Official announcement, Vendor advisory, Research paper).

Categories: "AI Models", "Industry", "Regulation", "Hardware", "Robotics", "Open Source".

Return ONLY a valid JSON object matching this schema:
{
  "headline": "Clear, informative, factual headline (no clickbait)",
  "id": "english-slug-like-news-id",
  "source": "Primary source name (e.g. Anthropic Research, Google DeepMind, NIST, CISA)",
  "category": "One of the categories above",
  "content": "1-2 sentences factual summary for the news ticker / feed.",
  "fullContent": "2-3 comprehensive paragraphs providing the background context, what happened, and verifiable implications.",
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
