import type { PostSource } from '../../post.source.type';

// SEO: primary="ai data residency" | secondary="llm gdpr compliance, data sovereignty ai, eu inference region, schrems ii llm"
export const post: PostSource = {
  id: '94',
  title: 'Your EU Data Took a Trip to a US Model',
  slug: 'ai-data-residency',
  excerpt:
    'AI data residency is not one pinned endpoint, it is a property of the whole pipeline. Why embeddings, caches, logs, and failover quietly send EU data to US regions, and how to pin every stage before August 2026.',
  tags: [
    { name: 'AI', slug: 'ai' },
    { name: 'Compliance', slug: 'compliance' },
    { name: 'Infrastructure', slug: 'infrastructure' },
    { name: 'Architecture', slug: 'architecture' },
    { name: 'Production', slug: 'production' },
    { name: 'Multi-Tenant', slug: 'multi-tenant' },
  ],
  imageId: '/images/posts/ai-data-residency.webp',
  publishedAt: '2026-08-04T02:00:00.000Z',
  featured: false,
  trendingScore: 26,
};
