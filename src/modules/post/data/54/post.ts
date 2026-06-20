import type { PostSource } from '../../post.source.type';

// SEO: primary="cloud egress cost" | secondary="aws data transfer cost, egress fees, cloudflare r2 zero egress, cross-az transfer"
export const post: PostSource = {
  id: '54',
  title: 'The $0.09 That Quietly Doubles Your Cloud Bill',
  slug: 'cloud-egress-cost-trap',
  excerpt:
    'Cloud egress cost is the line nobody budgets until it doubles the bill. Why $0.09 per GB and cross-AZ traffic leak money at the network edge, and the architecture that stops it.',
  tags: [
    { name: 'Infrastructure', slug: 'infrastructure' },
    { name: 'Cost Analysis', slug: 'cost-analysis' },
    { name: 'Cloud', slug: 'cloud' },
    { name: 'AWS', slug: 'aws' },
    { name: 'Cloudflare', slug: 'cloudflare' },
    { name: 'Architecture', slug: 'architecture' },
  ],
  imageId: '/images/posts/cloud-egress-cost-trap.webp',
  publishedAt: '2026-06-26T10:00:00.000Z',
  featured: false,
  trendingScore: 23,
};
