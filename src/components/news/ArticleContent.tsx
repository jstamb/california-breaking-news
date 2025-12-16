import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import type { Post } from '@/types';

interface ArticleContentProps {
  post: Post;
}

export function ArticleContent({ post }: ArticleContentProps) {
  return (
    <>
      <header className="mb-8">
        <div className="flex gap-2 mb-4">
          <Link href={`/category/${encodeURIComponent(post.category.toLowerCase())}`}>
            <Badge variant="secondary">{post.category}</Badge>
          </Link>
          {post.isBreaking && <Badge variant="destructive">Breaking</Badge>}
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
          {post.title}
        </h1>

        <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>

        <div className="flex items-center justify-between border-b pb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">
              {post.author.charAt(0)}
            </div>
            <div className="text-sm">
              <p className="font-medium text-foreground">{post.author}</p>
              <p className="text-muted-foreground">
                {new Date(post.publishedAt).toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        </div>
      </header>

      {post.featuredImage && (
        <figure className="mb-10">
          <div className="relative w-full aspect-video max-h-[500px]">
            <Image
              src={post.featuredImage}
              alt={post.imageAlt || post.title}
              fill
              className="rounded-lg object-cover"
              priority
              sizes="(max-width: 1200px) 100vw, 900px"
            />
          </div>
          {post.imageAlt && (
            <figcaption className="mt-2 text-sm text-center text-muted-foreground">
              {post.imageAlt}
            </figcaption>
          )}
        </figure>
      )}

      <div
        className="prose prose-neutral dark:prose-invert max-w-none prose-lg prose-a:text-primary"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="mt-12 pt-8 border-t">
        <h3 className="text-sm font-semibold text-muted-foreground mb-4">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              #{tag}
            </Badge>
          ))}
        </div>
      </div>
    </>
  );
}
