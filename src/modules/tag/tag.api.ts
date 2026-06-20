import { POSTS } from '@/modules/post/post.mapper';
import { isPublished } from '@/modules/post/post.api';
import type { TagWithCount } from './tag.type';

// TODO: Replace with real API calls
// import { httpClient } from '@/infrastructure/api/http.client';
// import { ApiPath } from '@/app/config/path.config';

export async function getAllTags(): Promise<TagWithCount[]> {
  // TODO: return httpClient.getList<TagWithCount>(ApiPath.tags.index).then(res => res.data);
  const tagMap = new Map<string, TagWithCount>();

  POSTS.forEach((post) => {
    if (!isPublished(post)) return;
    post.tags.forEach((tag) => {
      const existing = tagMap.get(tag.slug);
      if (existing) {
        existing.postCount = (existing.postCount ?? 0) + 1;
      } else {
        tagMap.set(tag.slug, { name: tag.name, slug: tag.slug, postCount: 1 });
      }
    });
  });

  return Array.from(tagMap.values()).sort(
    (a, b) => (b.postCount ?? 0) - (a.postCount ?? 0),
  );
}

export async function getTagBySlug(slug: string): Promise<TagWithCount | null> {
  // TODO: return httpClient.get<TagWithCount>(ApiPath.tags.detail(slug));
  const tags = await getAllTags();
  return tags.find((tag) => tag.slug === slug) ?? null;
}
