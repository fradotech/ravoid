import type { PostSource } from '../../post.source.type';

// SEO: primary="websocket cost at scale" | secondary="websocket scaling cost, connection minutes, real-time infrastructure cost, fan-out cost"
export const post: PostSource = {
  id: '77',
  title: 'Real-Time Features Have a Memory Wall Too',
  slug: 'websocket-cost-at-scale',
  excerpt:
    'WebSocket cost at scale is set by held connections and message fan-out, not request volume. Why an idle connection still bills, why fan-out scales superlinearly, and how to size real-time before it sizes your bill.',
  tags: [
    { name: 'Infrastructure', slug: 'infrastructure' },
    { name: 'Cost Analysis', slug: 'cost-analysis' },
    { name: 'Scaling', slug: 'scaling' },
    { name: 'Architecture', slug: 'architecture' },
    { name: 'Performance', slug: 'performance' },
    { name: 'Multi-Tenant', slug: 'multi-tenant' },
  ],
  imageId: '/images/posts/websocket-cost-at-scale.webp',
  publishedAt: '2026-07-18T02:00:00.000Z',
  featured: false,
  trendingScore: 25,
};
