import type { Post } from '@/modules/post/post.type';

export interface HomeData {
  featured: Post;
  trending: Post[];
  latest: Post[];
}
