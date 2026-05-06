import type { PostSource } from "../../post.source.type";

export const post: PostSource = {
  id: "46",
  title:
    "The Residential Proxy Black Hole: Why Data Extraction Costs Do Not Scale Linearly",
  slug: "residential-proxy-cost-scaling-trap",
  excerpt:
    "Most engineering teams assume residential proxy cost scaling is a linear math problem. This false mental model ignores the exponential compute tax of retry logic, 406 failure multipliers, and bandwidth bloat. Here is the math for when to abandon off-the-shelf proxy networks.",
  tags: [
    { name: "Infrastructure", slug: "infrastructure" },
    { name: "Cost Analysis", slug: "cost-analysis" },
    { name: "Scaling", slug: "scaling" },
    { name: "Architecture", slug: "architecture" },
    { name: "SaaS", slug: "saas" },
  ],
  imageId: "/images/posts/residential-proxy-cost-scaling-trap.webp",
  publishedAt: "2026-05-06T10:00:00.000Z",
  featured: false,
  trendingScore: 20,
};
