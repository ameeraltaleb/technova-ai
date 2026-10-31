import { NextResponse } from 'next/server';

interface BufferProfile {
  id: string;
  service: string;
  service_username: string;
  formatted_username: string;
  avatar: string;
  default?: boolean;
}

/**
 * GET /api/buffer
 * Test connection & list connected social profiles (X, LinkedIn, Facebook, etc.)
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token') || process.env.BUFFER_ACCESS_TOKEN;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'يرجى إدخال Buffer Access Token أولاً' },
        { status: 400 }
      );
    }

    const res = await fetch(`https://api.bufferapp.com/1/profiles.json?access_token=${encodeURIComponent(token.trim())}`, {
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const errText = await res.text();
      let errorMsg = `خطأ من Buffer API (${res.status})`;
      try {
        const parsed = JSON.parse(errText);
        if (parsed.message) errorMsg = parsed.message;
      } catch {
        errorMsg = errText || errorMsg;
      }
      return NextResponse.json({ success: false, error: errorMsg }, { status: res.status });
    }

    const data = await res.json();
    if (!Array.isArray(data)) {
      return NextResponse.json({ success: false, error: 'استجابة غير متوقعة من Buffer' }, { status: 500 });
    }

    const profiles: BufferProfile[] = data.map((p: any) => ({
      id: p.id,
      service: p.service,
      service_username: p.service_username || p.formatted_username || p.service,
      formatted_username: p.formatted_username || p.service_username || p.service,
      avatar: p.avatar || p.avatar_https || '',
      default: p.default,
    }));

    return NextResponse.json({ success: true, profiles });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'فشل الاتصال بسيرفر Buffer' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/buffer
 * Publish status update immediately (or schedule) to connected profiles
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const token = body.token || process.env.BUFFER_ACCESS_TOKEN;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'مفتاح Buffer Access Token غير متوفر' },
        { status: 400 }
      );
    }

    // 1. Determine profile IDs
    let profileIds: string[] = Array.isArray(body.profileIds) && body.profileIds.length > 0 ? body.profileIds : [];

    // If none provided, fetch all active profiles for this account
    if (profileIds.length === 0) {
      const pRes = await fetch(`https://api.bufferapp.com/1/profiles.json?access_token=${encodeURIComponent(token.trim())}`, {
        cache: 'no-store',
      });
      if (pRes.ok) {
        const pData = await pRes.json();
        if (Array.isArray(pData)) {
          profileIds = pData.map((p: any) => p.id);
        }
      }
    }

    if (profileIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'لم يتم العثور على أي حسابات تواصل مرتبطة بحسابك على Buffer. يرجى ربط حساب X أو LinkedIn أو Facebook في buffer.com أولاً.',
        },
        { status: 400 }
      );
    }

    // 2. Prepare post content
    const title = (body.title || '').trim();
    const excerpt = (body.excerpt || '').trim();
    const articleId = body.id || '';
    const link = (body.url || (articleId ? `https://www.technova-ai.online/article/${articleId}` : 'https://www.technova-ai.online')).trim();
    const image = (body.image || '').trim();
    const isNow = body.now !== false; // Default: true (Immediate publishing)

    // Craft formatted viral text
    let text = body.customText;
    if (!text) {
      const cleanExcerpt = excerpt.replace(/\s+/g, ' ').slice(0, 180);
      text = `🔥 New on TechNova AI:\n\n${title}\n\n${cleanExcerpt}${cleanExcerpt.length >= 180 ? '...' : ''}\n\n👉 Read the full article: ${link}\n\n#TechNova #AI #ArtificialIntelligence #TechNews`;
    }

    // 3. Build Form Data for Buffer API
    const params = new URLSearchParams();
    params.append('access_token', token.trim());
    params.append('text', text);
    if (isNow) {
      params.append('now', 'true');
    }
    params.append('shorten', 'false');

    if (link) {
      params.append('media[link]', link);
    }
    if (image && !image.includes('placeholder')) {
      params.append('media[photo]', image);
    }

    profileIds.forEach((pid: string) => {
      params.append('profile_ids[]', pid);
    });

    const postRes = await fetch('https://api.bufferapp.com/1/updates/create.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const result = await postRes.json();

    if (!postRes.ok || result.success === false) {
      return NextResponse.json(
        {
          success: false,
          error: result.message || 'فشل النشر عبر Buffer',
          details: result,
        },
        { status: postRes.status || 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: isNow ? 'تم النشر فورياً على حسابات التواصل المتصلة بنجاح! 🚀' : 'تمت جدولة المنشور في طابور Buffer بنجاح!',
      updates: result.updates || [],
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'حدث خطأ داخلي أثناء النشر' },
      { status: 500 }
    );
  }
}

