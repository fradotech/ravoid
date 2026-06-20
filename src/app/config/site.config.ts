export const SiteConfig = {
  name: "Ravoid",
  tagline: "Infrastructure Economics for Serious SaaS Builders",
  description:
    "Practical breakdowns of SaaS pricing models, tool comparisons, and infrastructure decisions",
  siteUrl: "https://ravoid.com",
  language: "en",
  ogLocale: "en_US",
  twitterHandle: "@frado_id",
  postsPerPage: 9,
  ogImage: {
    width: 1200,
    height: 630,
  },
  socials: {
    twitter: "https://x.com/frado_id",
    github: "https://github.com/fradotech",
    linkedin: "https://linkedin.com/in/fradotech",
  },
  organization: {
    type: "Organization" as const,
    name: "Ravoid",
    url: "https://ravoid.com",
    logo: "https://ravoid.com/favicon-512.webp",
  },
  author: {
    name: "Framesta Fernando",
    url: "https://frado.id",
    avatar: "/images/profile-picture.jpg",
    title: "Engineering Manager & Technical Architect",
    excerpt:
      "5 years of experience leading dozens of engineers and architecting robust backend ecosystems to handle massive data volumes powering 100+ microservices, consistently sustaining hundreds of RPS, and optimizing databases to query millions of records in milliseconds.",
  },
};
