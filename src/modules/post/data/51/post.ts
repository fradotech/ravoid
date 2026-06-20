import type { PostSource } from '../../post.source.type';

// SEO: primary="datadog cost" | secondary="observability cost at scale, datadog alternatives, custom metrics cardinality, high-watermark billing"
export const post: PostSource = {
  id: '51',
  title: 'Your Datadog Bill Is an Architecture Problem',
  slug: 'datadog-cost-observability-trap',
  excerpt:
    'Datadog cost does not explode because you monitor too much. It explodes because of cardinality and high-watermark billing. Where the observability bill leaks, and when to leave.',
  tags: [
    { name: 'Observability', slug: 'observability' },
    { name: 'Cost Analysis', slug: 'cost-analysis' },
    { name: 'Infrastructure', slug: 'infrastructure' },
    { name: 'SaaS', slug: 'saas' },
    { name: 'Engineering Leadership', slug: 'engineering-leadership' },
    { name: 'Build vs Buy', slug: 'build-vs-buy' },
  ],
  imageId: '/images/posts/datadog-cost-observability-trap.webp',
  publishedAt: '2026-06-22T01:00:00.000Z',
  featured: false,
  trendingScore: 24,
};
