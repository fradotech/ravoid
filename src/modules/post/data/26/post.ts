import type { PostSource } from "../../post.source.type";

export const post: PostSource = {
  id: "26",
  title:
    "RAG Is Not Free: The Real Cost of Vector Databases After 10 Million Records",
  slug: "rag-vector-database-real-cost-at-scale",
  excerpt:
    "Vector databases look cheap at first, but RAG cost is distributed across storage, embeddings, queries, and re-ranking. This article breaks down where cost actually lives and why most teams underestimate it by 3x to 10x.",
  tags: [
    { name: "AI", slug: "ai" },
    { name: "Infrastructure", slug: "infrastructure" },
    { name: "Cost", slug: "cost" },
    { name: "RAG", slug: "rag" },
  ],
  imageId: "/images/posts/rag-vector-database-real-cost-at-scale.webp",
  publishedAt: null,
  featured: false,
  trendingScore: 23,
};
