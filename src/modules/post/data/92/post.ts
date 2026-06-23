import type { PostSource } from '../../post.source.type';

// SEO: primary="zombie infrastructure cost" | secondary="idle cloud resources, orphaned resources aws, cloud waste, unused ebs volumes"
export const post: PostSource = {
  id: '92',
  title: 'The Infrastructure Nobody Remembers Provisioning',
  slug: 'zombie-infrastructure-cost',
  excerpt:
    'Zombie infrastructure cost is the 30 to 40% of cloud spend going to idle resources nobody remembers creating. Why orphaned assets accumulate because deletion feels risky, and how to find and kill them safely.',
  tags: [
    { name: 'AWS', slug: 'aws' },
    { name: 'Cloud', slug: 'cloud' },
    { name: 'Cost Analysis', slug: 'cost-analysis' },
    { name: 'Infrastructure', slug: 'infrastructure' },
    { name: 'Observability', slug: 'observability' },
    { name: 'Scaling', slug: 'scaling' },
  ],
  imageId: '/images/posts/zombie-infrastructure-cost.webp',
  publishedAt: '2026-08-02T13:00:00.000Z',
  featured: false,
  trendingScore: 24,
};
