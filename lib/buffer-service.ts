import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ArticleItem } from './admin-store';
import { getLiveArticles, isArticlePublished } from './public-data';
import { getArticleImage } from './utils';
import { CATEGORIES } from './data';

export interface BufferChannel {
  id: string;
  name: string;
  service: string;
  avatar: string;
}

export function cleanToken(token?: string): string {
  const raw = token || process.env.BUFFER_ACCESS_TOKEN || '';
  return raw.replace(/^Bearer\s+/i, '').replace(/["']/g, '').trim();
}

/**
 * Fetch connected channels from Buffer's official GraphQL API
 */
export async function getBufferChannels(customToken?: string): Promise<{
  success: boolean;
  channels?: BufferChannel[];
  error?: string;
}> {
  const token = cleanToken(customToken);
  if (!token) {
    return { success: false, error: 'Buffer Access Token is missing' };
  }

  try {
    // 1. Get Organization ID
    const accRes = await fetch('https://api.buffer.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
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
      return { success: false, error: 'No Buffer organization found for this account' };
    }

    // 2. Query channels for this organization
    const chanRes = await fetch('https://api.buffer.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
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
        variables: { input: { organizationId: orgId } },
      }),
      cache: 'no-store',
    });

    const chanData = await chanRes.json();
    const rawChannels = chanData?.data?.channels;

    if (!Array.isArray(rawChannels) || rawChannels.length === 0) {
      return {
        success: false,
        error: 'No connected social channels found in Buffer',
      };
    }

    const channels: BufferChannel[] = rawChannels.map((c: any) => ({
      id: c.id,
      name: c.name || c.service,
      service: c.service,
      avatar: c.avatar || '',
    }));

    return { success: true, channels };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to reach Buffer API' };
  }
}

/**
 * Publish post to a single Buffer channel
 */
export async function publishToChannel(
  token: string,
  channelId: string,
  service: string,
  text: string,
  isNow: boolean = true,
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

  const input: Record<string, any> = {
    channelId,
    text,
    mode: isNow ? 'shareNow' : 'addToQueue',
    schedulingType: 'automatic',
    needsApproval: false,
    assets: [],
  };

  // Service-specific formatting
  if (service === 'facebook') {
    const facebookMeta: Record<string, any> = { type: 'post' };
    if (link) {
      const fbUrl = link.includes('?') ? `${link}&fb_v=${Date.now()}` : `${link}?fb_v=${Date.now()}`;
      facebookMeta.linkAttachment = {
        url: fbUrl,
        title: title || 'TechNova AI',
        description: excerpt ? excerpt.slice(0, 200) : '',
        ...(imageUrl && imageUrl.startsWith('http') ? { thumbnail: { url: imageUrl } } : {}),
      };
      input.assets = [];
    } else if (imageUrl && imageUrl.startsWith('http')) {
      input.assets = [{ image: { url: imageUrl } }];
    }
    input.metadata = { facebook: facebookMeta };
  } else {
    // Twitter, LinkedIn, etc.
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
      const errMsg = payload.post?.error?.message || 'Error occurred during publishing';
      return {
        success: false,
        status: 'error',
        error: errMsg,
        postId: payload.post?.id,
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
    'Failed to dispatch post to Buffer';

  return { success: false, error: errorMsg };
}

/**
 * Publish a full article to all connected Buffer channels
 */
export async function publishArticleToBuffer(
  article: Partial<ArticleItem>,
  options?: { customToken?: string; profileIds?: string[] }
) {
  const token = cleanToken(options?.customToken);
  if (!token) {
    return { success: false, error: 'Buffer Access Token is missing' };
  }

  const chanRes = await getBufferChannels(token);
  if (!chanRes.success || !chanRes.channels || chanRes.channels.length === 0) {
    return { success: false, error: chanRes.error || 'No connected channels found in Buffer' };
  }

  let targetChannels = chanRes.channels;
  if (Array.isArray(options?.profileIds) && options.profileIds.length > 0) {
    targetChannels = chanRes.channels.filter((c) => options.profileIds!.includes(c.id));
    if (targetChannels.length === 0) targetChannels = chanRes.channels;
  }

  const title = (article.title || '').trim();
  const excerpt = (article.excerpt || '').trim();
  const articleId = article.id || '';
  const link = (articleId ? `https://www.technova-ai.online/article/${articleId}` : 'https://www.technova-ai.online').trim();

  let imageUrl = (article.image || '').trim();
  if (!imageUrl) {
    imageUrl = getArticleImage({
      image: article.image,
      id: articleId,
      title: title,
      category: article.category,
    });
  }
  if (imageUrl && imageUrl.startsWith('/')) {
    imageUrl = `https://www.technova-ai.online${imageUrl}`;
  }

  const categoryObj = CATEGORIES.find((c) => c.id === article.category);
  const catLabel = categoryObj ? categoryObj.name : (article.category || 'Tech');
  const catHashtag = catLabel.replace(/[^a-zA-Z0-9]/g, '');

  const cleanExcerpt = excerpt ? excerpt.replace(/\s+/g, ' ').slice(0, 180) : '';
  const excerptLine = cleanExcerpt ? `\n\n${cleanExcerpt}${cleanExcerpt.length >= 180 ? '...' : ''}` : '';
  const baseText = `[${catLabel}] ${title}${excerptLine}\n\n👉 Full story: ${link}\n\n#TechNova #${catHashtag} #AI`;

  const results = await Promise.all(
    targetChannels.map(async (c) => {
      let channelText = baseText;
      if (c.service === 'twitter' && channelText.length > 275) {
        channelText = `[${catLabel}] ${title}\n\n👉 Read: ${link}\n\n#TechNova #${catHashtag} #AI`;
      }
      try {
        const res = await publishToChannel(token, c.id, c.service, channelText, true, {
          link,
          title,
          excerpt,
          imageUrl,
        });
        return { channel: c.name, service: c.service, ...res };
      } catch (err: any) {
        return { channel: c.name, service: c.service, success: false, error: err.message };
      }
    })
  );

  const succeeded = results.filter((r) => r.success);
  return {
    success: succeeded.length > 0,
    results,
    succeededCount: succeeded.length,
  };
}

/**
 * Scan for any published or scheduled article that is due but not yet shared on Buffer,
 * publish it automatically to Buffer, and persist bufferShared = true to Firestore.
 */
export async function autoPublishDueArticles(customToken?: string) {
  const token = cleanToken(customToken);
  if (!token) {
    return { success: false, error: 'Buffer Access Token is missing' };
  }

  const allArticles = await getLiveArticles({ includeUnpublished: true });
  const now = Date.now();

  // Find articles that are published (or due scheduled) and have not been shared yet
  const dueArticles = allArticles.filter((art) => {
    if (art.status === 'draft') return false;
    if (art.bufferShared) return false;

    // Check if live or scheduled time has arrived
    if (isArticlePublished(art)) {
      return true;
    }
    if (art.status === 'scheduled' && art.scheduledFor) {
      const scheduledTime = new Date(art.scheduledFor).getTime();
      return !isNaN(scheduledTime) && scheduledTime <= now;
    }
    return false;
  });

  if (dueArticles.length === 0) {
    return {
      success: true,
      message: 'No pending articles due for Buffer publishing.',
      publishedCount: 0,
      articles: [],
    };
  }

  const publishedResults = [];

  for (const art of dueArticles) {
    try {
      const pubRes = await publishArticleToBuffer(art, { customToken: token });
      if (pubRes.success) {
        // Mark as bufferShared and persist to Firestore
        const updatedArticle: ArticleItem = {
          ...art,
          status: 'published',
          bufferShared: true,
          bufferSharedAt: new Date().toISOString(),
        };

        try {
          const docRef = doc(db, 'articles', art.id);
          await setDoc(docRef, {
            ...updatedArticle,
            updatedAt: new Date(),
          }, { merge: true });
        } catch (dbErr) {
          console.warn(`Failed to update Firestore for ${art.id}:`, dbErr);
        }

        publishedResults.push({
          id: art.id,
          title: art.title,
          status: 'shared',
          channels: (pubRes.results || []).map((r: any) => `${r.service}: ${r.success ? 'OK' : r.error}`),
        });
      } else {
        publishedResults.push({
          id: art.id,
          title: art.title,
          status: 'failed',
          error: pubRes.error || 'Channel publishing failed',
        });
      }
    } catch (err: any) {
      publishedResults.push({
        id: art.id,
        title: art.title,
        status: 'error',
        error: err.message,
      });
    }
  }

  return {
    success: true,
    message: `Processed ${dueArticles.length} due article(s). Shared ${publishedResults.filter((p) => p.status === 'shared').length} to Buffer.`,
    publishedCount: publishedResults.filter((p) => p.status === 'shared').length,
    articles: publishedResults,
  };
}
