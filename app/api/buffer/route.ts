import { NextResponse } from 'next/server';

interface BufferChannel {
  id: string;
  name: string;
  service: string;
  service_username: string;
  formatted_username: string;
  avatar: string;
}

function cleanToken(token: string): string {
  return token.replace(/^Bearer\s+/i, '').replace(/["']/g, '').trim();
}

/**
 * Fetch connected channels from Buffer's official GraphQL API
 */
async function getBufferChannels(token: string): Promise<{ success: boolean; channels?: BufferChannel[]; error?: string }> {
  const tokenClean = cleanToken(token);

  try {
    // 1. Get Organization ID from Account
    const accRes = await fetch('https://api.buffer.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenClean}`,
      },
      body: JSON.stringify({
        query: `
          query GetAccountOrg {
            account {
              id
              email
              organizations {
                id
                name
              }
            }
          }
        `,
      }),
      cache: 'no-store',
    });

    if (!accRes.ok) {
      return { success: false, error: `Buffer API rejected token (${accRes.status})` };
    }

    const accData = await accRes.json();
    if (accData.errors && accData.errors.length > 0) {
      return { success: false, error: accData.errors[0]?.message || 'GraphQL Error' };
    }

    const orgId = accData?.data?.account?.organizations?.[0]?.id;
    if (!orgId) {
      return { success: false, error: 'لم يتم العثور على أي منظمة تابعة لحسابك في Buffer' };
    }

    // 2. Query channels for this organization
    const chanRes = await fetch('https://api.buffer.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenClean}`,
      },
      body: JSON.stringify({
        query: `
          query GetChannels($input: ChannelsInput!) {
            channels(input: $input) {
              id
              name
              service
              avatar
            }
          }
        `,
        variables: {
          input: { organizationId: orgId },
        },
      }),
      cache: 'no-store',
    });

    const chanData = await chanRes.json();
    const rawChannels = chanData?.data?.channels;

    if (!Array.isArray(rawChannels) || rawChannels.length === 0) {
      return {
        success: false,
        error: 'لم يتم العثور على أي حسابات تواصل مرتبطة بحساب Buffer الخاص بك. يرجى ربط حساب X أو Facebook أولاً.',
      };
    }

    const channels: BufferChannel[] = rawChannels.map((c: any) => ({
      id: c.id,
      name: c.name || c.service,
      service: c.service,
      service_username: c.name || c.service,
      formatted_username: c.name || c.service,
      avatar: c.avatar || '',
    }));

    return { success: true, channels };
  } catch (err: any) {
    return { success: false, error: err.message || 'فشل الاتصال بسيرفر Buffer' };
  }
}

/**
 * Publish a post to a single Buffer channel
 */
async function publishToChannel(token: string, channelId: string, text: string, isNow: boolean) {
  const tokenClean = cleanToken(token);

  const mutation = `
    mutation CreatePost($input: CreatePostInput!) {
      createPost(input: $input) {
        __typename
        ... on PostActionSuccess {
          post {
            id
            status
          }
        }
        ... on InvalidInputError {
          message
        }
        ... on LimitReachedError {
          message
        }
        ... on UnexpectedError {
          message
        }
      }
    }
  `;

  const res = await fetch('https://api.buffer.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenClean}`,
    },
    body: JSON.stringify({
      query: mutation,
      variables: {
        input: {
          channelId,
          text,
          mode: isNow ? 'shareNow' : 'addToQueue',
          schedulingType: 'automatic',
          needsApproval: false,
          assets: [],
        },
      },
    }),
  });

  return await res.json();
}

/**
 * GET /api/buffer
 * Test connection & list connected social profiles
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

    const result = await getBufferChannels(token);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      profiles: result.channels,
    });
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

    // 1. Get connected channels
    const chanRes = await getBufferChannels(token);
    if (!chanRes.success || !chanRes.channels || chanRes.channels.length === 0) {
      return NextResponse.json({ success: false, error: chanRes.error || 'لا توجد قنوات مرتبطة' }, { status: 400 });
    }

    // Target profiles: either specific requested ones, or all active channels
    let targetChannels = chanRes.channels;
    if (Array.isArray(body.profileIds) && body.profileIds.length > 0) {
      targetChannels = chanRes.channels.filter((c) => body.profileIds.includes(c.id));
      if (targetChannels.length === 0) targetChannels = chanRes.channels;
    }

    // 2. Prepare post content
    const title = (body.title || '').trim();
    const excerpt = (body.excerpt || '').trim();
    const articleId = body.id || '';
    const link = (body.url || (articleId ? `https://www.technova-ai.online/article/${articleId}` : 'https://www.technova-ai.online')).trim();
    const isNow = body.now !== false; // Default: true (Immediate publishing)

    // Craft formatted viral text
    let text = body.customText;
    if (!text) {
      const cleanExcerpt = excerpt.replace(/\s+/g, ' ').slice(0, 160);
      text = `🔥 New on TechNova AI:\n\n${title}\n\n${cleanExcerpt}${cleanExcerpt.length >= 160 ? '...' : ''}\n\n👉 Read full article: ${link}\n\n#TechNova #AI #TechNews #ArtificialIntelligence`;
    }

    // 3. Publish to each channel
    const publishPromises = targetChannels.map(async (c) => {
      // For Twitter/X (character limit 280), optimize length if needed
      let channelText = text;
      if (c.service === 'twitter' && channelText.length > 275) {
        channelText = `🔥 New on TechNova AI: ${title}\n\n👉 Read: ${link}\n\n#AI #TechNews`;
      }

      try {
        const res = await publishToChannel(token, c.id, channelText, isNow);
        return { channel: c.name, service: c.service, result: res };
      } catch (err: any) {
        return { channel: c.name, service: c.service, error: err.message };
      }
    });

    const results = await Promise.all(publishPromises);

    const channelNames = targetChannels.map((c) => `${c.service}: ${c.name}`).join(' و ');

    return NextResponse.json({
      success: true,
      message: isNow
        ? `تم النشر فورياً بنجاح على (${channelNames})! 🚀`
        : `تمت جدولة المنشور بنجاح على (${channelNames})!`,
      results,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'حدث خطأ داخلي أثناء النشر' },
      { status: 500 }
    );
  }
}
