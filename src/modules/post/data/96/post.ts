import type { PostSource } from '../../post.source.type';

// SEO: primary="self-hosted runners cost" | secondary="github actions self-hosted, ci runner tco, self-hosted vs hosted runners, runner maintenance cost"
export const post: PostSource = {
  id: '96',
  title: 'Self-Hosted CI Runners Just Got a New Tax',
  slug: 'self-hosted-runners-cost',
  excerpt:
    'Self-hosted runners cost more than the per-minute savings suggest. Why a new GitHub platform fee, firm version deadlines, idle compute, and maintenance hours turn free CI into a total-cost-of-ownership trap.',
  tags: [
    { name: 'Cost Analysis', slug: 'cost-analysis' },
    { name: 'Infrastructure', slug: 'infrastructure' },
    { name: 'Tooling', slug: 'tooling' },
    { name: 'Build vs Buy', slug: 'build-vs-buy' },
    { name: 'Engineering Leadership', slug: 'engineering-leadership' },
  ],
  imageId: '/images/posts/self-hosted-runners-cost.webp',
  publishedAt: '2026-08-06T02:00:00.000Z',
  featured: false,
  trendingScore: 23,
};
