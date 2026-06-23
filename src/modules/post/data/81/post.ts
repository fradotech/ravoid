import type { PostSource } from '../../post.source.type';

// SEO: primary="bi dashboard warehouse cost" | secondary="dashboard refresh cost, bigquery cost, snowflake dashboard cost, data warehouse query cost"
export const post: PostSource = {
  id: '81',
  title: 'A Dashboard Refreshing Every Minute Costs $40k a Year',
  slug: 'bi-dashboard-warehouse-cost',
  excerpt:
    'BI dashboard warehouse cost, not ETL, drives most data bills. Why a dashboard refreshing every minute scans terabytes nobody reads, and how cadence, partitioning, and caching cut it by orders of magnitude.',
  tags: [
    { name: 'Cost Analysis', slug: 'cost-analysis' },
    { name: 'Infrastructure', slug: 'infrastructure' },
    { name: 'Cloud', slug: 'cloud' },
    { name: 'Performance', slug: 'performance' },
    { name: 'Observability', slug: 'observability' },
    { name: 'Scaling', slug: 'scaling' },
  ],
  imageId: '/images/posts/bi-dashboard-warehouse-cost.webp',
  publishedAt: '2026-07-22T13:00:00.000Z',
  featured: false,
  trendingScore: 25,
};
