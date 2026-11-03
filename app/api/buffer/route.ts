import { NextResponse } from 'next/server';
import {
  getBufferChannels,
  publishArticleToBuffer,
} from '@/lib/buffer-service';

/**
 * GET /api/buffer
 * Test connection & list connected social profiles
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token') || undefined;

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
 * Publish an article to Buffer channels immediately
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const token = body.token || undefined;

    const result = await publishArticleToBuffer(body, {
      customToken: token,
      profileIds: body.profileIds,
    });

    if (!result.success) {
      const errorDetails = (result.results || [])
        .filter((r: any) => !r.success)
        .map((f: any) => `${f.service}: ${f.error || 'فشل'}`)
        .join(' | ');

      return NextResponse.json(
        {
          success: false,
          error: errorDetails || result.error || 'فشل النشر إلى Buffer',
          results: result.results,
        },
        { status: 400 }
      );
    }

    const succeededNames = (result.results || [])
      .filter((r: any) => r.success)
      .map((s: any) => `${s.service} (${s.channel})`)
      .join('، ');

    return NextResponse.json({
      success: true,
      message: `تم النشر فورياً بنجاح على ${succeededNames}! 🚀`,
      results: result.results,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'حدث خطأ داخلي أثناء النشر' },
      { status: 500 }
    );
  }
}
