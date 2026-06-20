import type { PostSource } from '../../post.source.type';

// SEO: primary="self-hosted llm cost" | secondary="self-hosting llm devops, gpu utilization, self-hosted inference crossover, mlops cost"
export const post: PostSource = {
  id: '66',
  title: 'Self-Hosting Your LLM Is Cheaper, On Paper',
  slug: 'self-hosted-llm-devops-tax',
  excerpt:
    'Self-hosted LLM cost looks lower per token until you add GPU idle time and the MLOps salary to run it. The per-token math ignores the man-hours. Where self-hosting actually wins, and where it just looks like it does.',
  tags: [
    { name: 'Self-Hosted', slug: 'self-hosted' },
    { name: 'AI', slug: 'ai' },
    { name: 'Cost Analysis', slug: 'cost-analysis' },
    { name: 'Infrastructure', slug: 'infrastructure' },
    { name: 'LLM', slug: 'llm' },
    { name: 'Production', slug: 'production' },
  ],
  imageId: '/images/posts/self-hosted-llm-devops-tax.webp',
  publishedAt: '2026-07-07T10:00:00.000Z',
  featured: false,
  trendingScore: 23,
};
