import { getFeaturedPost, getTrendingPosts, getRecentPosts } from '@/modules/post/post.api';
import type { HomeData } from './home.type';

export async function getHomeData(): Promise<HomeData> {
  const featured = await getFeaturedPost();
  const [trending, recent] = await Promise.all([
    getTrendingPosts(5, [featured.slug]),
    getRecentPosts(7),
  ]);

  const latest = recent.filter((post) => post.id !== featured.id).slice(0, 6);

  return { featured, trending, latest };
}
