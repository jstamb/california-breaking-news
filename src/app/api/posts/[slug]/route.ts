import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateApiKey } from '@/lib/api-auth';
import { revalidatePath, revalidateTag } from 'next/cache';

interface RouteContext {
  params: Promise<{ slug: string }>;
}

// GET /api/posts/[slug] - Get single post by slug
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const post = await prisma.post.findUnique({
      where: { slug },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/posts/[slug] - Update post
export async function PATCH(request: NextRequest, context: RouteContext) {
  const apiKey = request.headers.get('X-API-Key');
  if (!(await validateApiKey(apiKey))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { slug } = await context.params;
    const body = await request.json();

    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const updatedPost = await prisma.post.update({
      where: { slug },
      data: {
        title: body.title ?? existingPost.title,
        content: body.content ?? existingPost.content,
        excerpt: body.excerpt ?? existingPost.excerpt,
        category: body.category?.toLowerCase() ?? existingPost.category,
        tags: body.tags ?? existingPost.tags,
        author: body.author ?? existingPost.author,
        featuredImage: body.featuredImage ?? existingPost.featuredImage,
        imageAlt: body.imageAlt ?? existingPost.imageAlt,
        isBreaking: body.isBreaking ?? existingPost.isBreaking,
        isPublished: body.isPublished ?? existingPost.isPublished,
        metaTitle: body.metaTitle ?? existingPost.metaTitle,
        metaDescription: body.metaDescription ?? existingPost.metaDescription,
      },
    });

    // Revalidate pages
    revalidatePath('/');
    revalidatePath('/news');
    revalidatePath(`/news/${slug}`);
    revalidatePath(`/category/${updatedPost.category}`);
    revalidateTag('posts');
    revalidateTag('sitemap');

    return NextResponse.json({
      success: true,
      post: updatedPost,
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[slug] - Delete post
export async function DELETE(request: NextRequest, context: RouteContext) {
  const apiKey = request.headers.get('X-API-Key');
  if (!(await validateApiKey(apiKey))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { slug } = await context.params;
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    await prisma.post.delete({
      where: { slug },
    });

    // Revalidate pages
    revalidatePath('/');
    revalidatePath('/news');
    revalidatePath(`/category/${existingPost.category}`);
    revalidateTag('posts');
    revalidateTag('sitemap');

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
