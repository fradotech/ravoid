import type { PostSource } from '../../post.source.type';

// SEO: primary="prompt caching cost" | secondary="prompt caching savings, llm input token cost, claude prompt caching, cache hit rate"
export const post: PostSource = {
  id: '52',
  title: 'Prompt Caching: The 90% Bill Cut You Never Turned On',
  slug: 'prompt-caching-cost-savings',
  excerpt:
    'Prompt caching is the highest-ROI LLM cost lever in 2026, and most teams leave it off. How it cuts input token cost 60 to 90 percent, and the cache structure that makes or breaks it.',
  tags: [
    { name: 'LLM', slug: 'llm' },
    { name: 'Cost Analysis', slug: 'cost-analysis' },
    { name: 'Token Economics', slug: 'token-economics' },
    { name: 'AI', slug: 'ai' },
    { name: 'Production', slug: 'production' },
    { name: 'Performance', slug: 'performance' },
  ],
  imageId: '/images/posts/prompt-caching-cost-savings.webp',
  publishedAt: '2026-06-24T02:00:00.000Z',
  featured: false,
  trendingScore: 25,
};
