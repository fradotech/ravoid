import type { PostSource } from '../../post.source.type';

// SEO: primary="usage-based billing build vs buy" | secondary="usage metering, metered billing, idempotent metering, stripe metronome"
export const post: PostSource = {
  id: '98',
  title: 'Stripe Paid $1B for Usage Billing. Don\'t Build It.',
  slug: 'usage-based-billing-build-vs-buy',
  excerpt:
    'Usage-based billing build vs buy was decided when Stripe paid $1B for Metronome instead of building it. Why metering is a deceptively hard exactly-once problem where bugs silently leak revenue.',
  tags: [
    { name: 'SaaS', slug: 'saas' },
    { name: 'Build vs Buy', slug: 'build-vs-buy' },
    { name: 'Payments', slug: 'payments' },
    { name: 'Pricing', slug: 'pricing' },
    { name: 'Cost Analysis', slug: 'cost-analysis' },
    { name: 'Architecture', slug: 'architecture' },
  ],
  imageId: '/images/posts/usage-based-billing-build-vs-buy.webp',
  publishedAt: '2026-08-08T13:00:00.000Z',
  featured: false,
  trendingScore: 26,
};
