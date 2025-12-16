import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ArticleCard } from '@/components/news/ArticleCard';
import { Button } from '@/components/ui/button';

export const revalidate = 3600; // Revalidate every hour

async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
      take: 15,
    });
    return posts;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const posts = await getPosts();

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">No articles yet</h2>
        <p className="text-muted-foreground">Check back soon for breaking news!</p>
      </div>
    );
  }

  // Organizing data
  const heroPosts = posts.slice(0, 5);
  const recentNews = posts.slice(1, 5);
  const politicsPosts = posts.filter((p) => p.category.toLowerCase() === 'politics').slice(0, 3);
  const sidebarLatest = posts.slice(0, 6);
  const sidebarOpinion = posts.slice(2, 6);

  return (
    <>
      {/* Hero Section - 5 Columns grid */}
      <section className="mb-8 hidden md:grid grid-cols-5 gap-1 h-[250px]">
        {heroPosts.map((post, index) => (
          <div key={post.id} className="relative h-full w-full">
            <ArticleCard
              post={post}
              variant="overlay"
              className="rounded-none h-full"
              showExcerpt={false}
              priority={index === 0}
            />
          </div>
        ))}
      </section>

      {/* Mobile Hero */}
      <section className="mb-8 md:hidden">
        {heroPosts[0] && (
          <ArticleCard post={heroPosts[0]} variant="overlay" className="h-[300px]" priority />
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column (2/3) */}
        <div className="lg:col-span-2 space-y-12">
          {/* Latest News Section */}
          <section className="bg-white dark:bg-zinc-900 p-6 rounded-md shadow-sm border-t-4 border-black dark:border-white transition-colors">
            <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-100 dark:border-zinc-800">
              <h2 className="text-xl font-black uppercase tracking-wide text-black dark:text-white">
                Recent News
              </h2>
              <div className="flex gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-zinc-700"></span>
              </div>
            </div>

            <div className="space-y-6">
              {recentNews.map((post) => (
                <ArticleCard key={post.id} post={post} variant="horizontal" />
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link href="/news">
                <Button
                  variant="outline"
                  className="w-full uppercase font-bold text-xs tracking-wider border-gray-200 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800"
                >
                  View All News
                </Button>
              </Link>
            </div>
          </section>

          {/* Category Block: Politics */}
          {politicsPosts.length > 0 && (
            <section className="bg-white dark:bg-zinc-900 p-6 rounded-md shadow-sm border-t-4 border-cat-politics transition-colors">
              <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-100 dark:border-zinc-800">
                <h2 className="text-xl font-black uppercase tracking-wide text-cat-politics">
                  Politics
                </h2>
                <Link
                  href="/category/politics"
                  className="text-xs font-bold uppercase text-muted-foreground hover:text-cat-politics"
                >
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {politicsPosts.length > 0 && (
                  <div className="md:col-span-2">
                    <ArticleCard
                      post={politicsPosts[0]}
                      variant="horizontal"
                      imageHeight="h-64"
                    />
                  </div>
                )}
                {politicsPosts.slice(1).map((post) => (
                  <ArticleCard key={post.id} post={post} variant="vertical" showExcerpt={false} />
                ))}
              </div>
            </section>
          )}

          {/* Ads Block */}
          <div className="w-full bg-gray-200 dark:bg-zinc-800 h-32 flex items-center justify-center text-gray-400 dark:text-zinc-600 text-sm font-mono border border-gray-300 dark:border-zinc-700">
            ADVERTISEMENT SPACE (728x90)
          </div>
        </div>

        {/* Sidebar Column (1/3) */}
        <aside className="space-y-8">
          {/* Social Widget */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-md shadow-sm transition-colors">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-[#3b5998] text-white p-2 rounded-sm cursor-pointer hover:opacity-90">
                <div className="font-bold text-sm">25k</div>
                <div className="text-[10px] uppercase">Fans</div>
              </div>
              <div className="bg-[#1da1f2] text-white p-2 rounded-sm cursor-pointer hover:opacity-90">
                <div className="font-bold text-sm">45k</div>
                <div className="text-[10px] uppercase">Followers</div>
              </div>
              <div className="bg-[#cd201f] text-white p-2 rounded-sm cursor-pointer hover:opacity-90">
                <div className="font-bold text-sm">12k</div>
                <div className="text-[10px] uppercase">Subs</div>
              </div>
            </div>
          </div>

          {/* The Latest Sidebar */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-md shadow-sm border-t-4 border-black dark:border-white transition-colors">
            <h2 className="text-lg font-black uppercase tracking-wide mb-6 pb-2 border-b border-gray-100 dark:border-zinc-800 text-black dark:text-white">
              The Latest
            </h2>
            <div className="space-y-4">
              {sidebarLatest.map((post) => (
                <ArticleCard key={`sidebar-${post.id}`} post={post} variant="compact" />
              ))}
            </div>
          </div>

          {/* Ad Widget */}
          <div className="bg-gray-200 dark:bg-zinc-800 h-64 w-full flex items-center justify-center text-gray-400 dark:text-zinc-600 text-sm font-mono border border-gray-300 dark:border-zinc-700">
            ADVERTISEMENT (300x250)
          </div>

          {/* Opinion Widget */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-md shadow-sm border-t-4 border-cat-culture transition-colors">
            <h2 className="text-lg font-black uppercase tracking-wide mb-6 pb-2 border-b border-gray-100 dark:border-zinc-800 text-cat-culture">
              Opinion
            </h2>
            <div className="space-y-4">
              {sidebarOpinion.map((post) => (
                <div
                  key={`op-${post.id}`}
                  className="border-b border-gray-100 dark:border-zinc-800 pb-3 last:border-0"
                >
                  <span className="text-xs font-bold text-cat-culture uppercase block mb-1">
                    Op-Ed
                  </span>
                  <Link
                    href={`/news/${post.slug}`}
                    className="font-bold text-sm leading-snug text-black dark:text-white hover:text-cat-culture dark:hover:text-cat-culture transition-colors"
                  >
                    {post.title}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
