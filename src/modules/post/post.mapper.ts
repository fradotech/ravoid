import type { Post } from './post.type';
import type { PostSource } from './post.source.type';

function img(id: string, w = 1200, h = 630): string {
  return `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format`;
}

function toMetaDescription(excerpt: string): string {
  return excerpt.length > 155
    ? excerpt.slice(0, excerpt.lastIndexOf(' ', 155)) + '...'
    : excerpt;
}

function mapPostSource(post: PostSource, content: string): Post {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content,
    tags: post.tags,
    heroImage: img(post.imageId),
    thumbnail: img(post.imageId, 400, 300),
    seo: {
      metaTitle: post.title,
      metaDescription: toMetaDescription(post.excerpt),
      ogImage: img(post.imageId),
      canonicalUrl: null,
      noIndex: false,
    },
    publishedAt: post.publishedAt,
    updatedAt: post.publishedAt,
    featured: post.featured,
    trendingScore: post.trendingScore,
  };
}

const postModules = import.meta.glob('./data/*/post.ts', {
  eager: true,
}) as Record<string, { post: PostSource }>;

const contentModules = import.meta.glob('./data/*/content.md', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

export const POSTS: Post[] = Object.entries(postModules)
  .map(([filePath, module]) => {
    const folder = filePath.split('/').at(-2);
    const content = folder ? contentModules[`./data/${folder}/content.md`] : '';
    return mapPostSource(module.post, content || '');
  })
  .sort((a, b) => Number(a.id) - Number(b.id));
