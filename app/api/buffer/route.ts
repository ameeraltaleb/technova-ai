import { NextResponse } from 'next/server';
import { getArticleImage } from '@/lib/utils';

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
async function publishToChannel(
  token: string,
  channelId: string,
  service: string,
  text: string,
  isNow: boolean,
  meta?: {
    link?: string;
    title?: string;
    excerpt?: string;
    imageUrl?: string;
  }
) {
  const tokenClean = cleanToken(token);

  const mutation = `
    mutation CreatePost($input: CreatePostInput!) {
      createPost(input: $input) {
        __typename
        ... on PostActionSuccess {
          post {
            id
            status
            sentAt
            error {
              message
            }
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

  const link = meta?.link;
  const title = meta?.title;
  const excerpt = meta?.excerpt;
  const imageUrl = meta?.imageUrl;

  // Build input payload tailored for each service requirements
  const input: Record<string, any> = {
    channelId,
    text,
    mode: isNow ? 'shareNow' : 'addToQueue',
    schedulingType: 'automatic',
    needsApproval: false,
    assets: [],
  };

  // Facebook requires explicit type: "post" | "reel" | "story"
  if (service === 'facebook') {
    const facebookMeta: Record<string, any> = {
      type: 'post',
    };

    // Link Attachment Card provides the rich clickable preview (image + title + domain + excerpt)
    if (link) {
      facebookMeta.linkAttachment = {
        url: link,
        title: title || 'TechNova AI',
        description: excerpt ? excerpt.slice(0, 200) : '',
        ...(imageUrl && imageUrl.startsWith('http') ? { thumbnail: { url: imageUrl } } : {}),
      };
      // Buffer API rule: A link attachment cannot be combined with assets
      input.assets = [];
    } else if (imageUrl && imageUrl.startsWith('http')) {
      input.assets = [{ image: { url: imageUrl } }];
    }

    input.metadata = {
      facebook: facebookMeta,
    };
  } else if (service === 'twitter') {
    // Twitter renders image attachments directly in feed
    if (imageUrl && imageUrl.startsWith('http')) {
      input.assets = [{ image: { url: imageUrl } }];
    }
  } else {
    // Other channels (LinkedIn, etc.)
    if (imageUrl && imageUrl.startsWith('http')) {
      input.assets = [{ image: { url: imageUrl } }];
    }
  }

  const res = await fetch('https://api.buffer.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenClean}`,
    },
    body: JSON.stringify({
      query: mutation,
      variables: { input },
    }),
  });

  const data = await res.json();
  const payload = data?.data?.createPost;

  if (payload?.__typename === 'PostActionSuccess') {
    if (payload.post?.status === 'error') {
      const errMsg = payload.post?.error?.message || 'خطأ أثناء النشر عبر المنصة';
      return {
        success: false,
        status: 'error',
        error: errMsg.includes('reauthorize')
          ? 'يحتاج الحساب لإعادة التوثيق (Reconnect) في Buffer'
          : errMsg,
        postId: payload.post.id,
      };
    }
    return {
      success: true,
      status: payload.post?.status || 'sent',
      postId: payload.post?.id,
    };
  }

  const errorMsg =
    payload?.message ||
    data?.errors?.[0]?.message ||
    'فشل إرسال المنشور إلى Buffer';

  return { success: false, error: errorMsg };
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

    // 2. Prepare post content & media
    const title = (body.title || '').trim();
    const excerpt = (body.excerpt || '').trim();
    const articleId = body.id || '';
    const link = (body.url || (articleId ? `https://www.technova-ai.online/article/${articleId}` : 'https://www.technova-ai.online')).trim();
    const isNow = body.now !== false; // Default: true (Immediate publishing)

    // Resolve high-resolution article preview image
    let imageUrl = (body.image || '').trim();
    if (!imageUrl) {
      imageUrl = getArticleImage({
        image: body.image,
        id: articleId,
        category: body.category,
      });
    }
    if (imageUrl && imageUrl.startsWith('/')) {
      imageUrl = `https://www.technova-ai.online${imageUrl}`;
    }

    // Craft formatted viral text
    let text = body.customText;
    if (!text) {
      const cleanExcerpt = excerpt.replace(/\s+/g, ' ').slice(0, 160);
      text = `🔥 New on TechNova AI:\n\n${title}\n\n${cleanExcerpt}${cleanExcerpt.length >= 160 ? '...' : ''}\n\n👉 Read full article: ${link}\n\n#TechNova #AI #TechNews #ArtificialIntelligence`;
    }

    // 3. Publish to each channel with media & metadata
    const publishPromises = targetChannels.map(async (c) => {
      // For Twitter/X (character limit 280), optimize length if needed
      let channelText = text;
      if (c.service === 'twitter' && channelText.length > 275) {
        channelText = `🔥 New on TechNova AI: ${title}\n\n👉 Read: ${link}\n\n#AI #TechNews`;
      }

      try {
        const res = await publishToChannel(token, c.id, c.service, channelText, isNow, {
          link,
          title,
          excerpt,
          imageUrl,
        });
        return { channel: c.name, service: c.service, ...res };
      } catch (err: any) {
        return { channel: c.name, service: c.service, success: false, error: err.message };
      }
    });

    const results = await Promise.all(publishPromises);

    const succeeded = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    if (succeeded.length === 0) {
      const errorDetails = failed
        .map((f) => `${f.service}: ${f.error || 'فشل'}`)
        .join(' | ');
      return NextResponse.json(
        {
          success: false,
          error: `تعذر النشر: ${errorDetails}`,
          results,
        },
        { status: 400 }
      );
    }

    const successNames = succeeded.map((s) => `${s.service} (${s.channel})`).join('، ');
    let summaryMessage = isNow
      ? `تم النشر فورياً بنجاح على ${successNames}! 🚀`
      : `تمت جدولة المنشور بنجاح على ${successNames}!`;

    if (failed.length > 0) {
      const failedNotes = failed
        .map((f) => `${f.service}: ${f.error}`)
        .join(' - ');
      summaryMessage += ` (تنبيه: ${failedNotes})`;
    }

    return NextResponse.json({
      success: true,
      message: summaryMessage,
      results,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'حدث خطأ داخلي أثناء النشر' },
      { status: 500 }
    );
  }
}
