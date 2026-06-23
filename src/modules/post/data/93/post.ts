import type { PostSource } from '../../post.source.type';

// SEO: primary="multi-tenant llm isolation" | secondary="llm serving fairness, head-of-line blocking, noisy neighbor llm, llm scheduling fifo"
export const post: PostSource = {
  id: '93',
  title: "One Tenant's Long Prompt Starves Everyone Else",
  slug: 'multi-tenant-llm-isolation',
  excerpt:
    'Multi-tenant LLM isolation fails under the default FIFO scheduler, where one long prompt blocks every short request behind it. Why head-of-line blocking wrecks latency, and how per-tenant scheduling fixes it.',
  tags: [
    { name: 'AI', slug: 'ai' },
    { name: 'LLM', slug: 'llm' },
    { name: 'Multi-Tenant', slug: 'multi-tenant' },
    { name: 'Infrastructure', slug: 'infrastructure' },
    { name: 'Performance', slug: 'performance' },
    { name: 'Scaling', slug: 'scaling' },
  ],
  imageId: '/images/posts/multi-tenant-llm-isolation.webp',
  publishedAt: '2026-08-03T13:00:00.000Z',
  featured: false,
  trendingScore: 25,
};
