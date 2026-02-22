import type { Post, PostSeo, Tag } from '../post.type';

export interface RawApiPost {
  id: string;
  title: string;
  type: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  metadata: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  heroImage: string;
}

function parseMetadata(metadata: string): PostSeo {
  try {
    const parsed = JSON.parse(metadata);
    return {
      metaTitle: parsed.title || '',
      metaDescription: parsed.description || '',
      ogImage: parsed.image || '',
      canonicalUrl: null,
      noIndex: false,
    };
  } catch {
    return {
      metaTitle: '',
      metaDescription: '',
      ogImage: '',
      canonicalUrl: null,
      noIndex: false,
    };
  }
}

function normalizeSlug(slug: string): string {
  return slug.toLowerCase().replace(/\s+/g, '-');
}

function categoryToTags(category: string): Tag[] {
  if (!category) return [];
  return [{ name: category.charAt(0).toUpperCase() + category.slice(1), slug: category.toLowerCase() }];
}

export function mapRawApiPost(raw: RawApiPost): Post {
  const seo = parseMetadata(raw.metadata);

  return {
    id: raw.id,
    title: raw.title,
    slug: normalizeSlug(raw.slug),
    excerpt: raw.excerpt,
    content: raw.content,
    tags: categoryToTags(raw.category),
    heroImage: raw.heroImage,
    thumbnail: raw.heroImage,
    seo: {
      ...seo,
      metaTitle: seo.metaTitle || raw.title,
      metaDescription: seo.metaDescription || raw.excerpt,
      ogImage: seo.ogImage || raw.heroImage,
    },
    publishedAt: raw.publishedAt,
    updatedAt: raw.updatedAt,
  };
}

export function mapRawApiPosts(rawPosts: RawApiPost[]): Post[] {
  return rawPosts.map(mapRawApiPost);
}
