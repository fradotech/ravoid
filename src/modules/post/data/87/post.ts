import type { PostSource } from '../../post.source.type';

// SEO: primary="stripe fees 2026" | secondary="payment processing fees, interchange plus pricing, stripe cost at scale, reduce processing fees"
export const post: PostSource = {
  id: '87',
  title: "Stripe's 2.9% Is a Tax That Grows With You",
  slug: 'stripe-fees-2026',
  excerpt:
    'Stripe fees in 2026 are a flat 2.9% plus 30 cents that scales linearly with revenue forever. Why flat-rate pricing hides a fat markup, and how interchange-plus exposes what is actually negotiable at scale.',
  tags: [
    { name: 'Payments', slug: 'payments' },
    { name: 'SaaS', slug: 'saas' },
    { name: 'Cost Analysis', slug: 'cost-analysis' },
    { name: 'Pricing', slug: 'pricing' },
    { name: 'Build vs Buy', slug: 'build-vs-buy' },
  ],
  imageId: '/images/posts/stripe-fees-2026.webp',
  publishedAt: '2026-07-28T13:00:00.000Z',
  featured: false,
  trendingScore: 25,
};
