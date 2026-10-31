import { NextResponse } from 'next/server';

interface BufferProfile {
  id: string;
  service: string;
  service_username: string;
  formatted_username: string;
  avatar: string;
  default?: boolean;
}

function cleanToken(token: string): string {
  return token.replace(/^Bearer\s+/i, '').replace(/["']/g, '').trim();
}

/**
 * Fetch profiles via REST v1 or GraphQL
 */
async function fetchProfiles(token: string): Promise<{ success: boolean; profiles?: BufferProfile[]; error?: string; status?: number }> {
  const tokenClean = cleanToken(token);

  // 1. Try REST v1 with both Header and Query Param
  try {
    const res = await fetch(`https://api.bufferapp.com/1/profiles.json?access_token=${encodeURIComponent(tokenClean)}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${tokenClean}`,
      },
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        const profiles: BufferProfile[] = data.map((p: any) => ({
          id: p.id,
          service: p.service,
          service_username: p.service_username || p.formatted_username || p.service,
          formatted_username: p.formatted_username || p.service_username || p.service,
          avatar: p.avatar || p.avatar_https || '',
          default: p.default,
        }));
        return { success: true, profiles };
      }
    }
  } catch (e) {
    // Continue to GraphQL fallback
  }

  // 2. Fallback: Try Buffer GraphQL API (api.buffer.com)
  try {
    const gqlRes = await fetch('https://api.buffer.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenClean}`,
      },
      body: JSON.stringify({
        query: `
          query GetAccount {
            account {
              id
              channels {
                id
                name
                service
                avatarUrl
              }
            }
          }
        `,
      }),
      cache: 'no-store',
    });

    if (gqlRes.ok) {
      const gqlData = await gqlRes.json();
      const channels = gqlData?.data?.account?.channels;
      if (Array.isArray(channels)) {
        const profiles: BufferProfile[] = channels.map((c: any) => ({
          id: c.id,
          service: c.service,
          service_username: c.name || c.service,
          formatted_username: c.name || c.service,
          avatar: c.avatarUrl || '',
        }));
        return { success: true, profiles };
      }
    }
  } catch (e) {
    // Both failed
  }

  return {
    success: false,
    status: 401,
    error: 'رمز الـ Access Token غير صالح أو انتهت صلاحيته (401 Unauthorized).\n\nتنبيه مهم: تأكد من نسخ (Access Token) وليس (Client ID) من صفحة https://buffer.com/developers/apps تحت تطبيقك.',
  };
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

    const result = await fetchProfiles(token);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: result.status || 401 });
    }

    return NextResponse.json({ success: true, profiles: result.profiles });
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

    const tokenClean = cleanToken(token);

    // 1. Fetch available profiles if not specified
    let profileIds: string[] = Array.isArray(body.profileIds) && body.profileIds.length > 0 ? body.profileIds : [];

    if (profileIds.length === 0) {
      const pRes = await fetchProfiles(tokenClean);
      if (pRes.success && pRes.profiles) {
        profileIds = pRes.profiles.map((p) => p.id);
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
      text = `🔥 New on TechNova AI:\n\n${title}\n\n${cleanExcerpt}${cleanExcerpt.length >= 180 ? '...' : ''}\n\n👉 Read full guide: ${link}\n\n#TechNova #AI #TechNews #ArtificialIntelligence`;
    }

    // 3. Build Form Data for REST v1
    const params = new URLSearchParams();
    params.append('access_token', tokenClean);
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
        Authorization: `Bearer ${tokenClean}`,
      },
      body: params.toString(),
    });

    const result = await postRes.json();

    if (!postRes.ok || result.success === false) {
      return NextResponse.json(
        {
          success: false,
          error: result.message || 'فشل النشر عبر Buffer API',
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
