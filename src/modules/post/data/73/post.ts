import type { PostSource } from '../../post.source.type';

// SEO: primary="nat gateway cost" | secondary="aws data transfer cost, vpc endpoint cost, nat gateway data processing, aws networking cost"
export const post: PostSource = {
  id: '73',
  title: 'The $0.045 NAT Gateway Tax on Every Byte',
  slug: 'nat-gateway-cost',
  excerpt:
    'NAT gateway cost is the AWS line item nobody provisions on purpose. Why a $0.045-per-GB processing fee quietly taxes traffic that never leaves AWS, and the free endpoints that erase most of it.',
  tags: [
    { name: 'AWS', slug: 'aws' },
    { name: 'Cloud', slug: 'cloud' },
    { name: 'Cost Analysis', slug: 'cost-analysis' },
    { name: 'Infrastructure', slug: 'infrastructure' },
    { name: 'Architecture', slug: 'architecture' },
    { name: 'Scaling', slug: 'scaling' },
  ],
  imageId: '/images/posts/nat-gateway-cost.webp',
  publishedAt: '2026-07-14T02:00:00.000Z',
  featured: false,
  trendingScore: 25,
};
