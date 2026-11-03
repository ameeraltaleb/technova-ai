import { NextResponse } from 'next/server';
import { autoPublishDueArticles } from '@/lib/buffer-service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET & POST /api/cron/publish
 * Runs automated publishing check:
 * Identifies any due scheduled articles or newly published articles,
 * dispatches them to Buffer social channels (Facebook, Twitter, etc.),
 * and marks them in Firestore to prevent double-posting.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token') || undefined;

    const result = await autoPublishDueArticles(token);
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

    const result = await autoPublishDueArticles(token);
    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Auto-publish cron failed' },
      { status: 500 }
    );
  }
}

