import type { Tag } from './post.type';

export interface PostSource {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  tags: Tag[];
  imageId: string;
  publishedAt: string | null;
  featured: boolean;
  trendingScore: number;
}
