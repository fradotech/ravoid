import type { PostSource } from '../../post.source.type';

// SEO: primary="long-context inference cost" | secondary="million token window cost, quadratic attention, prefill cost, context window economics"
export const post: PostSource = {
  id: '100',
  title: 'A 1M-Token Window Is a Serving Bill, Not a Feature',
  slug: 'long-context-inference-cost',
  excerpt:
    'Long-context inference cost scales quadratically in compute and linearly in memory, so a 1M-token window is a per-request bill, not a free feature. Why support is not performance, and when to retrieve instead.',
  tags: [
    { name: 'AI', slug: 'ai' },
    { name: 'LLM', slug: 'llm' },
    { name: 'Cost Analysis', slug: 'cost-analysis' },
    { name: 'Infrastructure', slug: 'infrastructure' },
    { name: 'Frontier Models', slug: 'frontier-models' },
    { name: 'Performance', slug: 'performance' },
  ],
  imageId: '/images/posts/long-context-inference-cost.webp',
  publishedAt: '2026-08-10T13:00:00.000Z',
  featured: false,
  trendingScore: 28,
};
