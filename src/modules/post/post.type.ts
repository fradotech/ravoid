export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: Tag[];
  heroImage: string;
  thumbnail: string;
  seo: PostSeo;
  publishedAt: string;
  updatedAt: string;
  featured?: boolean;
  trendingScore?: number;
}

export interface Tag {
  name: string;
  slug: string;
}

export interface PostSeo {
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  canonicalUrl: string | null;
  noIndex: boolean;
}
