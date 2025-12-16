import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateApiKey } from '@/lib/api-auth';
import { revalidatePath, revalidateTag } from 'next/cache';
import { generateSlug } from '@/lib/utils';

// GET /api/posts - List all posts (with optional filters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const isBreaking = searchParams.get('isBreaking');

    const where: Record<string, unknown> = {
      isPublished: true,
    };

    if (category) {
      where.category = category.toLowerCase();
    }

    if (isBreaking === 'true') {
      where.isBreaking = true;
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create new post (n8n webhook endpoint)
export async function POST(request: NextRequest) {
  // Validate API key from header
  const apiKey = request.headers.get('X-API-Key');
  if (!(await validateApiKey(apiKey))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Validate required fields
    const { title, content, excerpt, category } = body;
    if (!title || !content || !excerpt || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, excerpt, category' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const baseSlug = generateSlug(title);
    const slug = await ensureUniqueSlug(baseSlug);

    // Create post
    const post = await prisma.post.create({
      data: {
        slug,
        title,
        content,
        excerpt,
        category: category.toLowerCase(),
        tags: body.tags || [],
        author: body.author || 'Staff Reporter',
        featuredImage: body.featuredImage || null,
        imageAlt: body.imageAlt || title,
        isBreaking: body.isBreaking || false,
        isPublished: body.isPublished !== false,
        metaTitle: body.metaTitle || title,
        metaDescription: body.metaDescription || excerpt,
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
      },
    });

    // Revalidate relevant pages for ISR
    revalidatePath('/');
    revalidatePath('/news');
    revalidatePath(`/news/${slug}`);
    revalidatePath(`/category/${category.toLowerCase()}`);
    revalidateTag('posts');
    revalidateTag('sitemap');

    return NextResponse.json(
      {
        success: true,
        post: {
          id: post.id,
          slug: post.slug,
          url: `/news/${post.slug}`,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating post:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}

async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (await prisma.post.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}
