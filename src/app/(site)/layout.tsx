import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { prisma } from '@/lib/prisma';
import { BreakingNewsBanner } from '@/components/news/BreakingNewsBanner';

async function getBreakingNews() {
  try {
    const breakingPost = await prisma.post.findFirst({
      where: {
        isBreaking: true,
        isPublished: true,
      },
      orderBy: { publishedAt: 'desc' },
    });
    return breakingPost;
  } catch {
    return null;
  }
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const breakingPost = await getBreakingNews();

  return (
    <div className="flex min-h-screen flex-col bg-news-gray dark:bg-black text-foreground dark:text-zinc-100 transition-colors duration-300">
      {breakingPost && <BreakingNewsBanner post={breakingPost} />}
      <Header />
      <main className="flex-1 w-full max-w-[1200px] mx-auto bg-transparent py-6 md:py-10 px-4 sm:px-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}
