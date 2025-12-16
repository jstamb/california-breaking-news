export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string | null;
  imageAlt: string | null;
  category: string;
  tags: string[];
  author: string;
  isBreaking: boolean;
  isPublished: boolean;
  publishedAt: Date;
  updatedAt: Date;
  createdAt: Date;
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  viewCount: number;
}

export interface NavItem {
  name: string;
  path: string;
}

export interface CreatePostPayload {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags?: string[];
  author?: string;
  featuredImage?: string;
  imageAlt?: string;
  isBreaking?: boolean;
  isPublished?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  publishedAt?: string;
}
