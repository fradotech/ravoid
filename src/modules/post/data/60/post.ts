import type { PostSource } from '../../post.source.type';

// SEO: primary="kubernetes cost" | secondary="kubernetes cost optimization, cluster utilization, overprovisioned requests, k8s bill 2026"
export const post: PostSource = {
  id: '60',
  title: "Your Kubernetes Bill Grew While Traffic Didn't",
  slug: 'kubernetes-cost-2026',
  excerpt:
    'Kubernetes cost climbs even when traffic is flat, because you pay for nodes provisioned, not pods used. Why cluster utilization sits near 20%, and the right-sizing that reclaims most of the bill.',
  tags: [
    { name: 'Infrastructure', slug: 'infrastructure' },
    { name: 'Cost Analysis', slug: 'cost-analysis' },
    { name: 'Scaling', slug: 'scaling' },
    { name: 'Cloud', slug: 'cloud' },
    { name: 'Performance', slug: 'performance' },
    { name: 'Architecture', slug: 'architecture' },
  ],
  imageId: '/images/posts/kubernetes-cost-2026.webp',
  publishedAt: '2026-07-01T13:00:00.000Z',
  featured: false,
  trendingScore: 23,
};
