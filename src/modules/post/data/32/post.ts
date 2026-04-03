import type { PostSource } from "../../post.source.type";

export const post: PostSource = {
  id: "32",
  title:
    "RAG Is Not Free: The Brutal Cost Curve After 10 Million Records (and When to Kill It)",
  slug: "rag-is-not-free-brutal-cost-curve-10-million-records",
  excerpt:
    "Vector databases look cheap at 100k records. At 10 million, the bill becomes painful, and for many use cases, simpler markdown + search often wins at a fraction of the cost and complexity.",
  tags: [
    { name: "AI", slug: "ai" },
    { name: "RAG", slug: "rag" },
    { name: "Cost", slug: "cost" },
    { name: "VectorDB", slug: "vector-db" },
    { name: "SaaS", slug: "saas" },
  ],
  imageId:
    "/images/posts/rag-is-not-free-brutal-cost-curve-10-million-records.webp",
  publishedAt: "2026-04-03T15:00:00.000Z",
  featured: false,
  trendingScore: 20,
};
