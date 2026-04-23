import type { PostSource } from "../../post.source.type";

export const post: PostSource = {
  id: "43",
  title:
    "The pgvector Illusion: How 'Free' RAG Infrastructure Destroys Your Primary Database",
  slug: "pgvector-scaling-issues",
  excerpt:
    "Consolidating RAG infrastructure into Postgres seems pragmatic. However, at scale, critical pgvector scaling issues emerge. HNSW index traversals starve your primary database of memory, evict your OLTP cache, and force massive RDS overprovisioning.",
  tags: [
    { name: "Postgres", slug: "postgres" },
    { name: "Vector DB", slug: "vector-db" },
    { name: "Infrastructure", slug: "infrastructure" },
    { name: "Cost Analysis", slug: "cost-analysis" },
    { name: "Scaling", slug: "scaling" },
    { name: "Architecture", slug: "architecture" },
    { name: "Performance", slug: "performance" },
  ],
  imageId: "/images/posts/pgvector-scaling-issues.webp",
  publishedAt: "2026-04-23T16:00:00.000Z",
  featured: false,
  trendingScore: 23,
};
