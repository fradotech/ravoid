import type { PostSource } from '../../post.source.type';

// SEO: primary="s3 storage class cost" | secondary="s3 intelligent tiering, glacier pricing, s3 lifecycle policy, cold data storage cost"
export const post: PostSource = {
  id: '86',
  title: "You're Paying Hot Prices for Cold Data",
  slug: 's3-storage-class-cost',
  excerpt:
    'S3 storage class cost depends on data temperature, but most data sits in Standard regardless of access. Why you pay hot prices for cold bytes, and how lifecycle and intelligent tiering cut storage 40 to 95%.',
  tags: [
    { name: 'AWS', slug: 'aws' },
    { name: 'Cloud', slug: 'cloud' },
    { name: 'Cost Analysis', slug: 'cost-analysis' },
    { name: 'Infrastructure', slug: 'infrastructure' },
    { name: 'Scaling', slug: 'scaling' },
  ],
  imageId: '/images/posts/s3-storage-class-cost.webp',
  publishedAt: '2026-07-27T13:00:00.000Z',
  featured: false,
  trendingScore: 24,
};
