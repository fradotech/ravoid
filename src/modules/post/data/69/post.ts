import type { PostSource } from '../../post.source.type';

// SEO: primary="spot gpu cost" | secondary="spot instance interruption, preemptible gpu, checkpoint overhead, spot vs on-demand"
export const post: PostSource = {
  id: '69',
  title: 'Spot GPUs Are Cheap Until They Cost You More',
  slug: 'spot-gpu-cost',
  excerpt:
    'Spot GPU cost is 70% off on paper, but interruptions turn that discount into wasted work, checkpoint overhead, and retries. When preemptible GPUs are a real saving, and when reliability quietly eats it.',
  tags: [
    { name: 'Infrastructure', slug: 'infrastructure' },
    { name: 'Cost Analysis', slug: 'cost-analysis' },
    { name: 'Self-Hosted', slug: 'self-hosted' },
    { name: 'AI', slug: 'ai' },
    { name: 'Cloud', slug: 'cloud' },
    { name: 'Performance', slug: 'performance' },
  ],
  imageId: '/images/posts/spot-gpu-cost.webp',
  publishedAt: '2026-07-10T13:00:00.000Z',
  featured: false,
  trendingScore: 22,
};
