import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ArticleCard } from '@/components/news/ArticleCard';

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);
  const formattedCategory = decodedCategory
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${formattedCategory} News`,
    description: `Latest ${formattedCategory} news and updates from California Breaking News.`,
  };
}

// Force dynamic rendering - don't cache at build time
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getPostsByCategory(category: string) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        isPublished: true,
        category: {
          equals: decodeURIComponent(category),
          mode: 'insensitive',
        },
      },
      orderBy: { publishedAt: 'desc' },
    });
    return posts;
  } catch {
    return [];
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const posts = await getPostsByCategory(category);

  const decodedCategory = decodeURIComponent(category);
  const formattedCategory = decodedCategory
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  if (posts.length === 0) {
    return (
      <div className="space-y-8">
        <div className="border-b border-gray-200 dark:border-zinc-800 pb-4">
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wide">
            {formattedCategory}
          </h1>
        </div>
        <div className="text-center py-16">
          <h2 className="text-xl font-bold mb-4">No articles in this category</h2>
          <p className="text-muted-foreground">Check back soon for more content!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-200 dark:border-zinc-800 pb-4">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wide">
          {formattedCategory}
        </h1>
        <p className="text-muted-foreground mt-2">
          {posts.length} article{posts.length !== 1 ? 's' : ''} in this category
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <ArticleCard key={post.id} post={post} variant="vertical" priority={index < 3} />
        ))}
      </div>
    </div>
  );
}
