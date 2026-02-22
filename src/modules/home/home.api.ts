import { getFeaturedPost, getTrendingPosts, getRecentPosts } from '@/modules/post/post.api';
import type { HomeData } from './home.type';

export async function getHomeData(): Promise<HomeData> {
  const [featured, trending, latest] = await Promise.all([
    getFeaturedPost(),
    getTrendingPosts(5),
    getRecentPosts(6),
  ]);

  return { featured, trending, latest };
}
