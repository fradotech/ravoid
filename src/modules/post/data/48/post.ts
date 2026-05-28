import type { PostSource } from "../../post.source.type";

export const post: PostSource = {
  id: "48",
  title: "The Token Bloat Trap: Stop Paying LLMs to Read DOM Trash",
  slug: "llm-token-bloat-trap-html-parsing",
  excerpt:
    "LLM token cost optimization requires stopping the practice of sending raw HTML to frontier models. Learn why shifting data cleaning to local Rust workers reduces input tokens by up to 90 percent and fixes broken unit economics.",
  tags: [
    { name: "AI", slug: "ai" },
    { name: "LLM", slug: "llm" },
    { name: "Cost Analysis", slug: "cost-analysis" },
    { name: "Token Economics", slug: "token-economics" },
    { name: "Architecture", slug: "architecture" },
    { name: "Infrastructure", slug: "infrastructure" },
  ],
  imageId: "/images/posts/llm-token-bloat-trap-html-parsing.webp",
  publishedAt: "2026-05-28T10:00:00.000Z",
  featured: false,
  trendingScore: 20,
};
