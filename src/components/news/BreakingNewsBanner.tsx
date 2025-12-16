import Link from 'next/link';
import type { Post } from '@/types';

interface BreakingNewsBannerProps {
  post: Post;
}

export function BreakingNewsBanner({ post }: BreakingNewsBannerProps) {
  return (
    <div className="bg-destructive text-destructive-foreground px-4 py-3 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <span className="flex-shrink-0 animate-pulse font-bold uppercase tracking-wider text-xs bg-white text-destructive px-2 py-1 rounded">
            Breaking
          </span>
          <Link
            href={`/news/${post.slug}`}
            className="truncate font-medium hover:underline text-sm md:text-base"
          >
            {post.title}
          </Link>
        </div>
        <Link
          href={`/news/${post.slug}`}
          className="flex-shrink-0 ml-4 text-sm font-semibold hover:opacity-80 hidden sm:block"
        >
          Read Now &rarr;
        </Link>
      </div>
    </div>
  );
}
