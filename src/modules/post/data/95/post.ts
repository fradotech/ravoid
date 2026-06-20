import type { PostSource } from '../../post.source.type';

// SEO: primary="semantic cache llm" | secondary="llm semantic caching, cache hit rate llm, reduce llm cost cache, similarity threshold cache"
export const post: PostSource = {
  id: '95',
  title: 'Half Your LLM Calls Are Questions You Already Answered',
  slug: 'semantic-cache-llm',
  excerpt:
    'A semantic cache for LLM calls reuses answers to questions you already answered, cutting cost up to 86%. Why repeated queries are a third of traffic, and why a loose threshold quietly returns wrong answers.',
  tags: [
    { name: 'AI', slug: 'ai' },
    { name: 'LLM', slug: 'llm' },
    { name: 'Cost Analysis', slug: 'cost-analysis' },
    { name: 'Performance', slug: 'performance' },
    { name: 'Production', slug: 'production' },
    { name: 'Token Economics', slug: 'token-economics' },
  ],
  imageId: '/images/posts/semantic-cache-llm.webp',
  publishedAt: '2026-08-05T02:00:00.000Z',
  featured: false,
  trendingScore: 25,
};
