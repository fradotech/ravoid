import type { PostSource } from '../../post.source.type';

// SEO: primary="logging cost at scale" | secondary="observability cost, datadog log pricing, log ingestion cost, reduce log spend"
export const post: PostSource = {
  id: '99',
  title: 'Your Logs Cost More Than the App That Wrote Them',
  slug: 'logging-cost-at-scale',
  excerpt:
    'Logging cost at scale can exceed the infrastructure it observes. Why logs bill twice, on ingestion and indexing, why most volume is noise nobody queries, and how to sample and route before the premium store.',
  tags: [
    { name: 'Cost Analysis', slug: 'cost-analysis' },
    { name: 'Observability', slug: 'observability' },
    { name: 'Infrastructure', slug: 'infrastructure' },
    { name: 'Cloud', slug: 'cloud' },
    { name: 'Scaling', slug: 'scaling' },
    { name: 'Build vs Buy', slug: 'build-vs-buy' },
  ],
  imageId: '/images/posts/logging-cost-at-scale.webp',
  publishedAt: '2026-08-09T02:00:00.000Z',
  featured: false,
  trendingScore: 24,
};
