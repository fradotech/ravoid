import type { PostSource } from '../../post.source.type';

// SEO: primary="github actions cost" | secondary="ci cost optimization, runner minutes, github actions pricing 2026, ci minute rounding"
export const post: PostSource = {
  id: '83',
  title: 'Your CI Bill Moved and Nobody Can Explain Why',
  slug: 'github-actions-cost',
  excerpt:
    'GitHub Actions cost is set by job count and config, not compute time. Why per-minute rounding, matrix builds, and runner choice multiply the bill faster than your team grows, and how to cut it.',
  tags: [
    { name: 'Cost Analysis', slug: 'cost-analysis' },
    { name: 'Infrastructure', slug: 'infrastructure' },
    { name: 'Tooling', slug: 'tooling' },
    { name: 'Engineering Leadership', slug: 'engineering-leadership' },
    { name: 'Performance', slug: 'performance' },
  ],
  imageId: '/images/posts/github-actions-cost.webp',
  publishedAt: '2026-07-24T02:00:00.000Z',
  featured: false,
  trendingScore: 24,
};
