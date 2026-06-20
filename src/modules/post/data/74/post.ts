import type { PostSource } from '../../post.source.type';

// SEO: primary="snowflake cost" | secondary="snowflake cost optimization, auto-suspend, warehouse right-sizing, snowflake credits"
export const post: PostSource = {
  id: '74',
  title: '80% of Your Snowflake Bill Is One Setting',
  slug: 'snowflake-cost',
  excerpt:
    'Snowflake cost is dominated by two compute defaults: a 10-minute auto-suspend and oversized warehouses. Why you pay for wall-clock time, not queries, and the settings that cut the bill fast.',
  tags: [
    { name: 'Cost Analysis', slug: 'cost-analysis' },
    { name: 'Infrastructure', slug: 'infrastructure' },
    { name: 'Cloud', slug: 'cloud' },
    { name: 'Performance', slug: 'performance' },
    { name: 'Scaling', slug: 'scaling' },
    { name: 'Observability', slug: 'observability' },
  ],
  imageId: '/images/posts/snowflake-cost.webp',
  publishedAt: '2026-07-15T02:00:00.000Z',
  featured: false,
  trendingScore: 26,
};
