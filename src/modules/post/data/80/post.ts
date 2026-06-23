import type { PostSource } from '../../post.source.type';

// SEO: primary="llm quantization production" | secondary="4-bit quantization accuracy, int4 vs int8, fp8 inference, quantization quality loss"
export const post: PostSource = {
  id: '80',
  title: "4-Bit Models Are Cheaper Until They're Wrong",
  slug: 'llm-quantization-production',
  excerpt:
    'LLM quantization in production trades memory for accuracy, but the loss hides in the long tail. Why 4-bit can pass your median eval and fail 59% on long inputs, and how to size precision to the workload.',
  tags: [
    { name: 'AI', slug: 'ai' },
    { name: 'LLM', slug: 'llm' },
    { name: 'Self-Hosted', slug: 'self-hosted' },
    { name: 'Cost Analysis', slug: 'cost-analysis' },
    { name: 'Performance', slug: 'performance' },
    { name: 'Production', slug: 'production' },
  ],
  imageId: '/images/posts/llm-quantization-production.webp',
  publishedAt: '2026-07-21T13:00:00.000Z',
  featured: false,
  trendingScore: 25,
};
