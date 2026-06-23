import type { PostSource } from '../../post.source.type';

// SEO: primary="postgres for everything" | secondary="postgres scaling limits, postgres as queue, connection pool exhaustion, one database"
export const post: PostSource = {
  id: '58',
  title: 'The Day "Just Use Postgres" Stops Working',
  slug: 'postgres-for-everything-limits',
  excerpt:
    'Postgres for everything is great advice until queue, vector, and analytics workloads fight your OLTP traffic for the same connections and cache. Where one database stops scaling, and what to split off first.',
  tags: [
    { name: 'Infrastructure', slug: 'infrastructure' },
    { name: 'Architecture', slug: 'architecture' },
    { name: 'Scaling', slug: 'scaling' },
    { name: 'Performance', slug: 'performance' },
    { name: 'Cost Analysis', slug: 'cost-analysis' },
    { name: 'Vector DB', slug: 'vector-db' },
  ],
  imageId: '/images/posts/postgres-for-everything-limits.webp',
  publishedAt: '2026-06-29T13:00:00.000Z',
  featured: false,
  trendingScore: 23,
};
