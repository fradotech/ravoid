import type { PostSource } from '../../post.source.type';

// SEO: primary="kv cache cost" | secondary="kv cache memory, llm inference cost, gpu memory inference, long context serving cost"
export const post: PostSource = {
  id: '70',
  title: 'The Memory Wall Quietly Capping Your AI Margins',
  slug: 'kv-cache-cost',
  excerpt:
    'KV cache cost, not raw compute, is what caps how many users your GPU can serve. Why long-context inference fills HBM before it runs out of FLOPs, and how to claw the memory back.',
  tags: [
    { name: 'AI', slug: 'ai' },
    { name: 'LLM', slug: 'llm' },
    { name: 'Infrastructure', slug: 'infrastructure' },
    { name: 'Cost Analysis', slug: 'cost-analysis' },
    { name: 'Self-Hosted', slug: 'self-hosted' },
    { name: 'Performance', slug: 'performance' },
    { name: 'Scaling', slug: 'scaling' },
  ],
  imageId: '/images/posts/kv-cache-cost.webp',
  publishedAt: '2026-07-11T13:00:00.000Z',
  featured: false,
  trendingScore: 27,
};
