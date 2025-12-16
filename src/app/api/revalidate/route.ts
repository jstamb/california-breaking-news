import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/api-auth';
import { revalidatePath, revalidateTag } from 'next/cache';

// POST /api/revalidate - Trigger on-demand ISR revalidation
export async function POST(request: NextRequest) {
  const apiKey = request.headers.get('X-API-Key');
  if (!(await validateApiKey(apiKey))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { paths, tags } = body;

    const revalidated: { paths: string[]; tags: string[] } = {
      paths: [],
      tags: [],
    };

    // Revalidate specific paths
    if (paths && Array.isArray(paths)) {
      for (const path of paths) {
        revalidatePath(path);
        revalidated.paths.push(path);
      }
    }

    // Revalidate specific tags
    if (tags && Array.isArray(tags)) {
      for (const tag of tags) {
        revalidateTag(tag);
        revalidated.tags.push(tag);
      }
    }

    // If no specific paths or tags, revalidate common pages
    if (!paths && !tags) {
      revalidatePath('/');
      revalidatePath('/news');
      revalidateTag('posts');
      revalidateTag('sitemap');
      revalidated.paths.push('/', '/news');
      revalidated.tags.push('posts', 'sitemap');
    }

    return NextResponse.json({
      success: true,
      revalidated,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error revalidating:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
