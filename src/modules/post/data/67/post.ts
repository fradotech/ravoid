import type { PostSource } from '../../post.source.type';

// SEO: primary="embedding migration cost" | secondary="re-embedding corpus, switching embedding models, vector reindex, embedding dimensions"
export const post: PostSource = {
  id: '67',
  title: 'The Five-Figure Cost of Changing Embedding Models',
  slug: 'embedding-migration-cost',
  excerpt:
    'Embedding migration cost turns a one-line model swap into a full re-platform. New embeddings are incompatible with old, so you re-embed the entire corpus and rebuild the index. Why switching is all-or-nothing.',
  tags: [
    { name: 'Embeddings', slug: 'embeddings' },
    { name: 'RAG', slug: 'rag' },
    { name: 'AI', slug: 'ai' },
    { name: 'Cost Analysis', slug: 'cost-analysis' },
    { name: 'Vector DB', slug: 'vector-db' },
    { name: 'Migration', slug: 'migration' },
  ],
  imageId: '/images/posts/embedding-migration-cost.webp',
  publishedAt: '2026-07-08T10:00:00.000Z',
  featured: false,
  trendingScore: 22,
};
