import type { PostSource } from '../../post.source.type';

// SEO: primary="reasoning model cost" | secondary="thinking tokens cost, reasoning tokens billing, chain of thought cost, test-time compute"
export const post: PostSource = {
  id: '75',
  title: 'Reasoning Models Think Themselves Into Your Budget',
  slug: 'reasoning-model-cost',
  excerpt:
    'Reasoning model cost is driven by thinking tokens you never see but still pay for. Why a model can bill 5,000 output tokens to show you 500, and when extended reasoning actually earns its price.',
  tags: [
    { name: 'AI', slug: 'ai' },
    { name: 'LLM', slug: 'llm' },
    { name: 'Token Economics', slug: 'token-economics' },
    { name: 'Cost Analysis', slug: 'cost-analysis' },
    { name: 'Frontier Models', slug: 'frontier-models' },
    { name: 'Production', slug: 'production' },
  ],
  imageId: '/images/posts/reasoning-model-cost.webp',
  publishedAt: '2026-07-16T02:00:00.000Z',
  featured: false,
  trendingScore: 27,
};
