import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { autoPublishDueArticles } from '@/lib/buffer-service';
import { getLiveArticles } from '@/lib/public-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// The external scheduler (GitHub Actions) pings this endpoint every 30 minutes.
// Use a slightly wider window so no scheduled article is missed between pings.
const RELEASE_WINDOW_MS = 40 * 60 * 1000;

/**
 * Invalidate cached (ISR) pages when a scheduled article has just gone live,
 * so it appears on the homepage, category pages and its own URL immediately
 * instead of waiting for the regular revalidation interval.
 */
async function revalidateNewlyReleasedArticles(): Promise<string[]> {
  const now = Date.now();
  const all = await getLiveArticles({ includeUnpublished: true });
  const released = all.filter((art) => {
    if (art.status === 'draft' || !art.scheduledFor) return false;
    const t = new Date(art.scheduledFor).getTime();
    return !isNaN(t) && t <= now && now - t <= RELEASE_WINDOW_MS;
  });

  if (released.length > 0) {
    // Lazily invalidates every page under the root layout; each page is
    // regenerated only on its next visit, so this stays cheap.
    revalidatePath('/', 'layout');
  }
  return released.map((a) => a.id);
}

async function runCron(token?: string) {
  let revalidated: string[] = [];
  try {
    revalidated = await revalidateNewlyReleasedArticles();
  } catch (err) {
    console.warn('Cron revalidation check failed:', err);
  }

  const result = await autoPublishDueArticles(token);
  if (result.success && (result as any).publishedCount > 0 && revalidated.length === 0) {
    revalidatePath('/', 'layout');
  }
  return { ...result, revalidated };
}

/**
 * GET & POST /api/cron/publish
 * Releases due scheduled articles (cache invalidation), dispatches them to
 * Buffer social channels, and marks them in Firestore to prevent double-posting.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token') || undefined;
    const result = await runCron(token);
    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Auto-publish cron failed' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    let token: string | undefined;
    try {
      const body = await req.json();
      token = body?.token;
    } catch {
      // Body may be empty in automated pings
    }
    const result = await runCron(token);
    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Auto-publish cron failed' },
      { status: 500 }
    );
  }
}
