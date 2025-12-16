import { prisma } from '@/lib/prisma';
import { ArticleCard } from '@/components/news/ArticleCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'News Archive',
  description: 'Browse all California breaking news articles and stories.',
};

// Force dynamic rendering - don't cache at build time
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
    });
    return posts;
  } catch {
    return [];
  }
}

export default async function NewsPage() {
  const posts = await getPosts();

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-200 dark:border-zinc-800 pb-4">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wide">News Archive</h1>
        <p className="text-muted-foreground mt-2">
          Browse all our latest California news stories
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-xl font-bold mb-4">No articles yet</h2>
          <p className="text-muted-foreground">Check back soon for breaking news!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <ArticleCard
              key={post.id}
              post={post}
              variant="vertical"
              priority={index < 3}
            />
          ))}
        </div>
      )}
    </div>
  );
}
