import type { PostSource } from '../../post.source.type';

// SEO: primary="fine-tuning deprecation" | secondary="fine-tuned model lifecycle, base model deprecation, fine-tuning tco, model staleness"
export const post: PostSource = {
  id: '64',
  title: 'Your Fine-Tuned Model Expires in 90 Days',
  slug: 'fine-tuning-deprecation',
  excerpt:
    'Fine-tuning deprecation is the cost nobody amortizes: your fine-tune is built on a base snapshot that gets retired, and your knowledge goes stale. Why a fine-tune is a depreciating asset, not a one-time spend.',
  tags: [
    { name: 'AI', slug: 'ai' },
    { name: 'LLM', slug: 'llm' },
    { name: 'Cost Analysis', slug: 'cost-analysis' },
    { name: 'Migration', slug: 'migration' },
    { name: 'Frontier Models', slug: 'frontier-models' },
    { name: 'Production', slug: 'production' },
  ],
  imageId: '/images/posts/fine-tuning-deprecation.webp',
  publishedAt: '2026-07-05T13:00:00.000Z',
  featured: false,
  trendingScore: 22,
};
