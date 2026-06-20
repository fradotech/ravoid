import type { PostSource } from '../../post.source.type';

// SEO: primary="continuous batching vllm" | secondary="gpu utilization llm serving, static vs continuous batching, llm inference throughput, vllm cost"
export const post: PostSource = {
  id: '85',
  title: 'Naive LLM Serving Wastes Most of Your GPU',
  slug: 'continuous-batching-vllm',
  excerpt:
    'Continuous batching in vLLM is the difference between a GPU that is 60% idle and one that earns its rent. Why static batching strands compute waiting for the slowest request, and how scheduling cuts your fleet.',
  tags: [
    { name: 'AI', slug: 'ai' },
    { name: 'LLM', slug: 'llm' },
    { name: 'Self-Hosted', slug: 'self-hosted' },
    { name: 'Infrastructure', slug: 'infrastructure' },
    { name: 'Performance', slug: 'performance' },
    { name: 'Cost Analysis', slug: 'cost-analysis' },
  ],
  imageId: '/images/posts/continuous-batching-vllm.webp',
  publishedAt: '2026-07-26T02:00:00.000Z',
  featured: false,
  trendingScore: 25,
};
