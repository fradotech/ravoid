import { POSTS } from '@/modules/post/post.mapper';
import type { TagWithCount } from './tag.type';

// TODO: Replace with real API calls
// import { httpClient } from '@/infrastructure/api/http.client';
// import { ApiPath } from '@/app/config/path.config';

export async function getAllTags(): Promise<TagWithCount[]> {
  // TODO: return httpClient.getList<TagWithCount>(ApiPath.tags.index).then(res => res.data);
  const tagMap = new Map<string, TagWithCount>();

  POSTS.forEach((post) => {
    post.tags.forEach((tag) => {
      const existing = tagMap.get(tag.slug);
      if (existing) {
        existing.postCount++;
      } else {
        tagMap.set(tag.slug, { name: tag.name, slug: tag.slug, postCount: 1 });
      }
    });
  });

  return Array.from(tagMap.values()).sort((a, b) => b.postCount - a.postCount);
}

export async function getTagBySlug(slug: string): Promise<TagWithCount | null> {
  // TODO: return httpClient.get<TagWithCount>(ApiPath.tags.detail(slug));
  const tags = await getAllTags();
  return tags.find((tag) => tag.slug === slug) ?? null;
}
