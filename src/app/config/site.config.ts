export const SiteConfig = {
  name: "Ravoid",
  tagline: "Infrastructure Economics for Serious SaaS Builders",
  description:
    "Practical breakdowns of SaaS pricing models, tool comparisons, and infrastructure decisions",
  siteUrl: "https://ravoid.com",
  language: "en",
  postsPerPage: 9,
  socials: {
    twitter: "https://x.com/frado_id",
    github: "https://github.com/fradotech",
    linkedin: "https://linkedin.com/in/fradotech",
  },
  organization: {
    type: "Organization" as const,
    name: "Ravoid",
    url: "https://ravoid.com",
    logo: "https://ravoid.com/favicon.svg",
  },
  author: {
    name: "Framesta Fernando",
    avatar: "/images/profile-picture.jpg",
    title: "Engineering Manager & Technical Architect",
    excerpt:
      "Engineering Manager at MrScraper, having previously served as a Technical Architect at DOT Indonesia. For the past 5+ years, I've specialized in designing scalable backend systems that power hundreds of microservices and workers, consistently handling hundreds of requests per second.",
  },
};
