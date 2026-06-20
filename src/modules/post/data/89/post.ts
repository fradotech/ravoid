import type { PostSource } from '../../post.source.type';

// SEO: primary="databricks cost" | secondary="dbu pricing, jobs vs all-purpose compute, databricks dual billing, databricks tier retirement"
export const post: PostSource = {
  id: '89',
  title: 'Your Databricks Tier Retires, the Bill Jumps 35%',
  slug: 'databricks-cost',
  excerpt:
    'Databricks cost is two bills that never reconcile, DBUs plus cloud VMs, and workload type swings the rate 3x. Why the Standard tier retirement adds an automatic 35%, and the levers that cut spend 40 to 60%.',
  tags: [
    { name: 'Cost Analysis', slug: 'cost-analysis' },
    { name: 'Infrastructure', slug: 'infrastructure' },
    { name: 'Cloud', slug: 'cloud' },
    { name: 'Performance', slug: 'performance' },
    { name: 'Scaling', slug: 'scaling' },
    { name: 'Observability', slug: 'observability' },
  ],
  imageId: '/images/posts/databricks-cost.webp',
  publishedAt: '2026-07-30T02:00:00.000Z',
  featured: false,
  trendingScore: 24,
};
