import type { PostSource } from '../../post.source.type';

// SEO: primary="data pipeline cost" | secondary="fivetran mar pricing, ingestion cost, elt pricing, monthly active rows cost"
export const post: PostSource = {
  id: '97',
  title: 'Your Data Pipeline Bill Doubled in a Year',
  slug: 'data-pipeline-cost',
  excerpt:
    'Data pipeline cost is billed per row moved, not per row used, so a few high-churn log tables can dominate the bill. Why per-connector MAR pricing doubled costs, and how to sync only what you analyze.',
  tags: [
    { name: 'Cost Analysis', slug: 'cost-analysis' },
    { name: 'Infrastructure', slug: 'infrastructure' },
    { name: 'Cloud', slug: 'cloud' },
    { name: 'Build vs Buy', slug: 'build-vs-buy' },
    { name: 'Scaling', slug: 'scaling' },
    { name: 'Observability', slug: 'observability' },
  ],
  imageId: '/images/posts/data-pipeline-cost.webp',
  publishedAt: '2026-08-07T13:00:00.000Z',
  featured: false,
  trendingScore: 24,
};
