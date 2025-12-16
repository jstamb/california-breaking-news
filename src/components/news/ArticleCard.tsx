import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { Post } from '@/types';

const getCategoryColor = (category: string) => {
  const map: Record<string, string> = {
    business: 'bg-cat-business',
    politics: 'bg-cat-politics',
    sports: 'bg-cat-sports',
    culture: 'bg-cat-culture',
    entertainment: 'bg-cat-culture',
    technology: 'bg-cat-tech',
    'local news': 'bg-primary',
  };
  return map[category.toLowerCase()] || 'bg-primary';
};

interface ArticleCardProps {
  post: Post;
  variant?: 'vertical' | 'horizontal' | 'overlay' | 'compact';
  showExcerpt?: boolean;
  className?: string;
  imageHeight?: string;
  priority?: boolean;
}

export function ArticleCard({
  post,
  variant = 'vertical',
  showExcerpt = true,
  className,
  imageHeight = 'h-48',
  priority = false,
}: ArticleCardProps) {
  const catColor = getCategoryColor(post.category);
  const imageUrl = post.featuredImage || `https://picsum.photos/seed/${post.slug}/800/600`;

  if (variant === 'overlay') {
    return (
      <article
        className={cn(
          'group relative h-full min-h-[300px] overflow-hidden rounded-md shadow-md',
          className
        )}
      >
        <Link href={`/news/${post.slug}`} className="block h-full w-full">
          <Image
            src={imageUrl}
            alt={post.imageAlt || post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Stronger gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
            <span
              className={cn(
                'inline-block px-2 py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider text-white mb-2',
                catColor
              )}
            >
              {post.category}
            </span>
            <h3
              className="text-base md:text-lg lg:text-xl font-bold leading-snug mb-2 text-white line-clamp-3 drop-shadow-lg"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
            >
              {post.title}
            </h3>
            <div className="flex items-center text-[10px] md:text-xs text-gray-200 space-x-2">
              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
              <span>&bull;</span>
              <span>{post.author}</span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === 'horizontal') {
    return (
      <article
        className={cn('group flex flex-col md:flex-row gap-6 mb-8 items-start', className)}
      >
        <Link
          href={`/news/${post.slug}`}
          className="w-full md:w-1/2 overflow-hidden rounded-md shadow-sm"
        >
          <div className={cn('relative w-full aspect-video md:aspect-[3/2]', imageHeight)}>
            <Image
              src={imageUrl}
              alt={post.imageAlt || post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <span
              className={cn(
                'absolute top-0 left-0 px-2 py-1 text-xs font-bold uppercase text-white',
                catColor
              )}
            >
              {post.category}
            </span>
          </div>
        </Link>
        <div className="flex-1 py-1">
          <Link href={`/news/${post.slug}`}>
            <h3 className="text-xl md:text-2xl font-bold leading-tight mb-3 text-black dark:text-white group-hover:text-primary dark:group-hover:text-primary transition-colors">
              {post.title}
            </h3>
          </Link>
          <div className="flex items-center text-xs text-muted-foreground mb-3 space-x-2 uppercase font-semibold">
            <span>by {post.author}</span>
            <span>&bull;</span>
            <time>{new Date(post.publishedAt).toLocaleDateString()}</time>
          </div>
          {showExcerpt && (
            <p className="text-news-text dark:text-zinc-300 text-base leading-relaxed line-clamp-3 mb-4">
              {post.excerpt}
            </p>
          )}
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article
        className={cn(
          'group flex gap-4 mb-4 items-start border-b border-dashed border-gray-200 dark:border-zinc-800 pb-4 last:border-0',
          className
        )}
      >
        <Link
          href={`/news/${post.slug}`}
          className="shrink-0 w-24 h-20 overflow-hidden rounded-sm bg-gray-100 dark:bg-zinc-800 relative"
        >
          <Image
            src={imageUrl}
            alt={post.imageAlt || post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="96px"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/news/${post.slug}`}>
            <h3 className="text-sm font-bold leading-snug mb-1 text-black dark:text-white group-hover:text-primary transition-colors line-clamp-3">
              {post.title}
            </h3>
          </Link>
          <div className="text-xs text-muted-foreground">
            <time>
              {new Date(post.publishedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })}
            </time>
          </div>
        </div>
      </article>
    );
  }

  // Default Vertical (Card)
  return (
    <article
      className={cn(
        'group flex flex-col h-full bg-white dark:bg-zinc-900 rounded-md shadow-sm overflow-hidden border border-transparent dark:border-zinc-800',
        className
      )}
    >
      <Link
        href={`/news/${post.slug}`}
        className="relative block overflow-hidden aspect-video"
      >
        <Image
          src={imageUrl}
          alt={post.imageAlt || post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <span
          className={cn(
            'absolute bottom-0 left-0 px-2 py-1 text-xs font-bold uppercase text-white',
            catColor
          )}
        >
          {post.category}
        </span>
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/news/${post.slug}`}>
          <h3 className="text-lg font-bold leading-tight mb-2 text-black dark:text-white group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        <div className="flex items-center text-xs text-muted-foreground mb-3">
          <span className="mr-2">by {post.author}</span>
          <time>{new Date(post.publishedAt).toLocaleDateString()}</time>
        </div>
        {showExcerpt && (
          <p className="text-sm text-news-text dark:text-zinc-300 leading-relaxed line-clamp-3 mt-auto">
            {post.excerpt}
          </p>
        )}
      </div>
    </article>
  );
}
