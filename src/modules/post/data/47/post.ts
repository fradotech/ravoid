import type { PostSource } from "../../post.source.type";

export const post: PostSource = {
  id: "47",
  title: "Stop Scaling Headless Browsers: The Data Extraction Compute Trap",
  slug: "headless-browser-scraping-architecture",
  excerpt:
    "Scaling Puppeteer or Playwright is an incredibly expensive architectural mistake. You are paying cloud providers to render CSS and parse DOM trees just to extract simple JSON. Learn why TLS impersonation and raw HTTP clients are the only way to scale.",
  tags: [
    { name: "Architecture", slug: "architecture" },
    { name: "Infrastructure", slug: "infrastructure" },
    { name: "Scaling", slug: "scaling" },
    { name: "Cost Analysis", slug: "cost-analysis" },
    { name: "Performance", slug: "performance" },
  ],
  imageId: "/images/posts/headless-browser-scraping-architecture.webp",
  publishedAt: "2026-05-15T11:00:00.000Z",
  featured: false,
  trendingScore: 22,
};
