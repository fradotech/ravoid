import type { PostSource } from '../../post.source.type';

// SEO: primary="batch inference cost" | secondary="batch api discount, async llm, openai batch api, 50 percent off inference"
export const post: PostSource = {
  id: '61',
  title: 'The 50% AI Discount Hiding Behind "Async"',
  slug: 'batch-inference-cost-savings',
  excerpt:
    'Batch inference cost is half the price of real-time, yet teams run everything synchronously. Most LLM work does not need to be instant. The discount you forfeit by treating latency as free.',
  tags: [
    { name: 'AI', slug: 'ai' },
    { name: 'Cost Analysis', slug: 'cost-analysis' },
    { name: 'Token Economics', slug: 'token-economics' },
    { name: 'LLM', slug: 'llm' },
    { name: 'Production', slug: 'production' },
    { name: 'OpenAI', slug: 'openai' },
  ],
  imageId: '/images/posts/batch-inference-cost-savings.webp',
  publishedAt: '2026-07-02T13:00:00.000Z',
  featured: false,
  trendingScore: 23,
};
