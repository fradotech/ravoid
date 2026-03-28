import { Modules } from './modules.config';

export const Path = {
  index: '/',

  blog: {
    index: `/${Modules.Blog}`,
    search: (query: string) => `/${Modules.Blog}?search=${encodeURIComponent(query)}`,
    page: (page: number) => `/${Modules.Blog}?page=${page}`,
  },

  post: {
    detail: (slug: string) => `/${Modules.Blog}/${slug}`,
  },

  tags: {
    index: `/${Modules.Tags}`,
    detail: (slug: string) => `/${Modules.Tags}/${slug}`,
  },

  about: `/${Modules.About}`,
  contact: `/${Modules.Contact}`,
  disclaimer: `/${Modules.Disclaimer}`,
  privacyPolicy: `/${Modules.PrivacyPolicy}`,
  terms: `/${Modules.Terms}`,
};

export const ApiPath = {
  posts: {
    index: `/${Modules.Posts}`,
    detail: (slug: string) => `/${Modules.Posts}/${slug}`,
    featured: `/${Modules.Posts}/featured`,
    trending: `/${Modules.Posts}/trending`,
    recent: `/${Modules.Posts}/recent`,
  },

  tags: {
    index: `/${Modules.Tags}`,
    detail: (slug: string) => `/${Modules.Tags}/${slug}`,
  },
};
