const SiteConfig = {
  name: "InvestBlog",
  description: "Your trusted source for investment and crypto insights",
  language: "en",
  postsPerPage: 9};

const Modules = {
  Blog: "blog",
  Tags: "tags",
  About: "about",
  Contact: "contact",
  Disclaimer: "disclaimer",
  PrivacyPolicy: "privacy-policy",
  Terms: "terms",
  Posts: "posts"
};

const Path = {
  index: "/",
  blog: {
    index: `/${Modules.Blog}`},
  post: {
    detail: (slug) => `/${slug}`
  },
  tags: {
    index: `/${Modules.Tags}`,
    detail: (slug) => `/${Modules.Tags}/${slug}`
  },
  about: `/${Modules.About}`,
  contact: `/${Modules.Contact}`,
  disclaimer: `/${Modules.Disclaimer}`,
  privacyPolicy: `/${Modules.PrivacyPolicy}`,
  terms: `/${Modules.Terms}`
};

export { Modules as M, Path as P, SiteConfig as S };
