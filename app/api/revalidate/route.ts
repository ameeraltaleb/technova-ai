import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

/**
 * POST /api/revalidate
 * Called by the admin dashboard after an article is saved or deleted so the
 * cached (ISR) pages reflect the change immediately.
 * Body: { id?: string }
 */
export async function POST(req: Request) {
  let id: string | undefined;
  try {
    const body = await req.json();
    if (typeof body?.id === 'string' && /^[a-z0-9-]{1,200}$/i.test(body.id)) {
      id = body.id;
    }
  } catch {
    // empty body is fine
  }

  if (id) revalidatePath(`/article/${id}`);
  revalidatePath('/');
  revalidatePath('/category/[id]', 'page');
  revalidatePath('/category');
  revalidatePath('/sitemap.xml');
  revalidatePath('/feed.xml');

  return NextResponse.json({ success: true, revalidated: id || 'listings' });
}
