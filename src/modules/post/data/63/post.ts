import type { PostSource } from '../../post.source.type';

// SEO: primary="multi-region cost" | secondary="multi-region architecture, cross-region replication cost, active-active, latency budget"
export const post: PostSource = {
  id: '63',
  title: 'Going Multi-Region Doubled Your Bill for Nothing',
  slug: 'multi-region-cost',
  excerpt:
    'Multi-region cost roughly doubles infra for latency most users never perceive. Active-active is sold as a performance win and bought as a resilience story. When the second region is worth it, and when it is vanity.',
  tags: [
    { name: 'Infrastructure', slug: 'infrastructure' },
    { name: 'Cost Analysis', slug: 'cost-analysis' },
    { name: 'Architecture', slug: 'architecture' },
    { name: 'Scaling', slug: 'scaling' },
    { name: 'Cloud', slug: 'cloud' },
    { name: 'Performance', slug: 'performance' },
  ],
  imageId: '/images/posts/multi-region-cost.webp',
  publishedAt: '2026-07-04T10:00:00.000Z',
  featured: false,
  trendingScore: 22,
};
