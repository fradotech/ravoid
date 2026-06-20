import type { PostSource } from '../../post.source.type';

// SEO: primary="rag vs fine-tuning cost" | secondary="rag vs fine-tuning, cost per query, fine-tuning tco, retrieval cost"
export const post: PostSource = {
  id: '57',
  title: 'Stop Asking RAG vs Fine-Tuning. Ask This.',
  slug: 'rag-vs-fine-tuning-cost',
  excerpt:
    'RAG vs fine-tuning cost is the wrong question. The real axis is cost-per-query versus cost-per-update. Which one bankrupts you depends on how often your knowledge changes, not which is better.',
  tags: [
    { name: 'RAG', slug: 'rag' },
    { name: 'AI', slug: 'ai' },
    { name: 'Cost Analysis', slug: 'cost-analysis' },
    { name: 'LLM', slug: 'llm' },
    { name: 'Architecture', slug: 'architecture' },
    { name: 'Token Economics', slug: 'token-economics' },
  ],
  imageId: '/images/posts/rag-vs-fine-tuning-cost.webp',
  publishedAt: '2026-07-03T10:00:00.000Z',
  featured: false,
  trendingScore: 24,
};
