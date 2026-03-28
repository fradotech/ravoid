import type { TPaginateResponse, TPaginationRequest } from '@/app/types/common.type';
import { Modules } from '@/app/config/modules.config';
import { SiteConfig } from '@/app/config/site.config';
import { POSTS } from './post.mapper';
import type { Post } from './post.type';

// TODO: Replace with real API calls
// import { httpClient } from '@/infrastructure/api/http.client';
// import { ApiPath } from '@/app/config/path.config';
// import { mapRawApiPost, mapRawApiPosts } from './mappers/post.mapper';

const RESERVED_SLUGS = Object.values(Modules);

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.includes(slug as typeof RESERVED_SLUGS[number]);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  // TODO: return httpClient.get<RawApiPost>(ApiPath.posts.detail(slug)).then(mapRawApiPost);
  return POSTS.find((post) => post.slug === slug) ?? null;
}

export async function getAllPosts(params?: TPaginationRequest): Promise<TPaginateResponse<Post>> {
  // TODO: return httpClient.getList<RawApiPost>(ApiPath.posts.index, { params }).then(res => ({
  //   data: mapRawApiPosts(res.data),
  //   meta: res.meta,
  // }));
  let filtered = [...POSTS];

  if (params?.search) {
    const query = params.search.toLowerCase();
    filtered = filtered.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query),
    );
  }

  if (params?.filters?.tag) {
    filtered = filtered.filter((post) =>
      post.tags.some((tag) => tag.slug === params.filters?.tag),
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
    meta: { page, pageSize, total, totalPage },
  };
}

export async function getFeaturedPost(): Promise<Post> {
  // TODO: return httpClient.get<RawApiPost>(ApiPath.posts.featured).then(mapRawApiPost);
  return [...POSTS]
    .filter((post) => post.featured)
    .sort(sortByTrending)
    .at(0) ?? POSTS[0];
}

export async function getTrendingPosts(limit = 5, excludeSlugs: string[] = []): Promise<Post[]> {
  // TODO: return httpClient.getList<RawApiPost>(ApiPath.posts.trending, { params: { pageSize: limit } })
  //   .then(res => mapRawApiPosts(res.data));
  const exclude = new Set(excludeSlugs.filter(Boolean));
  return [...POSTS]
    .sort(sortByTrending)
    .filter((post) => !exclude.has(post.slug))
    .slice(0, limit);
}

export async function getRecentPosts(limit = 6): Promise<Post[]> {
  // TODO: return httpClient.getList<RawApiPost>(ApiPath.posts.recent, { params: { pageSize: limit } })
  //   .then(res => mapRawApiPosts(res.data));
  return [...POSTS]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

export async function getRelatedPosts(currentSlug: string, tags: string[], limit = 4): Promise<Post[]> {
  // TODO: return httpClient.getList<RawApiPost>(ApiPath.posts.index, {
  //   params: { pageSize: limit, 'filters[tags]': tags.join(','), exclude: currentSlug }
  // }).then(res => mapRawApiPosts(res.data));
  return POSTS
    .filter((post) => post.slug !== currentSlug)
    .filter((post) => post.tags.some((tag) => tags.includes(tag.slug)))
    .slice(0, limit);
}

function sortByTrending(a: Post, b: Post): number {
  const scoreDiff = (b.trendingScore ?? 0) - (a.trendingScore ?? 0);

  if (scoreDiff !== 0) {
    return scoreDiff;
  }

  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
}
