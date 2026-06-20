import type { PostSource } from '../../post.source.type';

// SEO: primary="reserved vs on-demand" | secondary="aws savings plans, reserved instances, commitment discount, cloud cost lock-in"
export const post: PostSource = {
  id: '79',
  title: 'Your Savings Plan Is a Bet You Keep Losing',
  slug: 'reserved-vs-on-demand',
  excerpt:
    'Reserved vs on-demand is not a discount decision, it is a bet on your future usage. Why an unused commitment still bills, why the deepest discount carries the worst lock-in, and how to hedge.',
  tags: [
    { name: 'AWS', slug: 'aws' },
    { name: 'Cloud', slug: 'cloud' },
    { name: 'Cost Analysis', slug: 'cost-analysis' },
    { name: 'Infrastructure', slug: 'infrastructure' },
    { name: 'Build vs Buy', slug: 'build-vs-buy' },
  ],
  imageId: '/images/posts/reserved-vs-on-demand.webp',
  publishedAt: '2026-07-20T02:00:00.000Z',
  featured: false,
  trendingScore: 24,
};
