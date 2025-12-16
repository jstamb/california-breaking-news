import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ArticleContent } from '@/components/news/ArticleContent';
import { RelatedArticles } from '@/components/news/RelatedArticles';
import { ArticleSchema } from '@/components/seo/ArticleSchema';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://californiabreakingnews.com';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for most recent posts (SSG)
export async function generateStaticParams() {
  try {
    const posts = await prisma.post.findMany({
      where: { isPublished: true },
      select: { slug: true },
      orderBy: { publishedAt: 'desc' },
      take: 100,
    });

    return posts.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await prisma.post.findUnique({
      where: { slug, isPublished: true },
    });

    if (!post) return {};

    const title = post.metaTitle || post.title;
    const description = post.metaDescription || post.excerpt;
    const url = `${BASE_URL}/news/${post.slug}`;

    return {
      title,
      description,
      authors: [{ name: post.author }],
      openGraph: {
        title,
        description,
        type: 'article',
        url,
        publishedTime: post.publishedAt.toISOString(),
        modifiedTime: post.updatedAt.toISOString(),
        authors: [post.author],
        section: post.category,
        tags: post.tags,
        images: post.featuredImage
          ? [
              {
                url: post.featuredImage,
                width: 1200,
                height: 630,
                alt: post.imageAlt || post.title,
              },
            ]
          : [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: post.featuredImage ? [post.featuredImage] : [],
      },
      alternates: {
        canonical: post.canonicalUrl || url,
      },
    };
  } catch {
    return {};
  }
}

export const revalidate = 3600; // ISR: Revalidate every hour

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;

  let post;
  try {
    post = await prisma.post.findUnique({
      where: { slug, isPublished: true },
    });
  } catch {
    notFound();
  }

  if (!post) notFound();

  // Increment view count (fire and forget)
  prisma.post
    .update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    })
    .catch(() => {});

  // Fetch related articles
  let relatedPosts = [];
  try {
    relatedPosts = await prisma.post.findMany({
      where: {
        isPublished: true,
        category: post.category,
        id: { not: post.id },
      },
      take: 3,
      orderBy: { publishedAt: 'desc' },
    });
  } catch {
    relatedPosts = [];
  }

  const breadcrumbs = [
    { name: 'Home', url: BASE_URL },
    { name: 'News', url: `${BASE_URL}/news` },
    {
      name: post.category,
      url: `${BASE_URL}/category/${encodeURIComponent(post.category.toLowerCase())}`,
    },
    { name: post.title, url: `${BASE_URL}/news/${post.slug}` },
  ];

  return (
    <>
      {/* JSON-LD Structured Data */}
      <ArticleSchema post={post} url={`${BASE_URL}/news/${post.slug}`} />
      <BreadcrumbSchema items={breadcrumbs} />

      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <ArticleContent post={post} />
      </article>

      {relatedPosts.length > 0 && (
        <aside className="container mx-auto px-4 py-8 max-w-4xl">
          <RelatedArticles posts={relatedPosts} />
        </aside>
      )}
    </>
  );
}
