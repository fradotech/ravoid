import { S as SiteConfig, M as Modules } from './path.config_Lcn3_rvK.mjs';
import { D as DUMMY_POSTS } from './post.dummy_DbjIcWoi.mjs';

const RESERVED_SLUGS = Object.values(Modules);
function isReservedSlug(slug) {
  return RESERVED_SLUGS.includes(slug);
}
async function getPostBySlug(slug) {
  return DUMMY_POSTS.find((post) => post.slug === slug) ?? null;
}
async function getAllPosts(params) {
  let filtered = [...DUMMY_POSTS];
  if (params?.search) {
    const query = params.search.toLowerCase();
    filtered = filtered.filter(
      (post) => post.title.toLowerCase().includes(query) || post.excerpt.toLowerCase().includes(query)
    );
  }
  if (params?.filters?.tag) {
    filtered = filtered.filter(
      (post) => post.tags.some((tag) => tag.slug === params.filters?.tag)
    );
  }
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? SiteConfig.postsPerPage;
  const total = filtered.length;
  const totalPage = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);
  return {
    data,
    meta: { page, pageSize, total, totalPage }
  };
}
async function getFeaturedPost() {
  return DUMMY_POSTS[0];
}
async function getTrendingPosts(limit = 5) {
  return DUMMY_POSTS.slice(0, limit);
}
async function getRecentPosts(limit = 6) {
  return [...DUMMY_POSTS].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).slice(0, limit);
}
async function getRelatedPosts(currentSlug, tags, limit = 4) {
  return DUMMY_POSTS.filter((post) => post.slug !== currentSlug).filter((post) => post.tags.some((tag) => tags.includes(tag.slug))).slice(0, limit);
}

export { getAllPosts as a, getRecentPosts as b, getPostBySlug as c, getRelatedPosts as d, getFeaturedPost as e, getTrendingPosts as g, isReservedSlug as i };
