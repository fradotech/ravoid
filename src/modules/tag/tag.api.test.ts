import { describe, it, expect } from 'vitest';
import { getAllTags, getTagBySlug } from './tag.api';
import { POSTS } from '@/modules/post/post.mapper';

const sampleTag = POSTS[0].tags[0];

describe('getAllTags', () => {
  it('returns tags sorted by post count descending', async () => {
    const tags = await getAllTags();

    expect(tags.length).toBeGreaterThan(0);

    for (let i = 1; i < tags.length; i++) {
      expect(tags[i - 1].postCount).toBeGreaterThanOrEqual(tags[i].postCount);
    }
  });

  it('returns tags with required fields', async () => {
    const tags = await getAllTags();

    tags.forEach((tag) => {
      expect(tag.name).toBeTruthy();
      expect(tag.slug).toBeTruthy();
      expect(tag.postCount).toBeGreaterThanOrEqual(1);
    });
  });

  it('has no duplicate slugs', async () => {
    const tags = await getAllTags();
    const slugs = tags.map((t) => t.slug);
    const uniqueSlugs = new Set(slugs);

    expect(slugs.length).toBe(uniqueSlugs.size);
  });
});

describe('getTagBySlug', () => {
  it('returns tag for valid slug', async () => {
    const tag = await getTagBySlug(sampleTag.slug);

    expect(tag).not.toBeNull();
    expect(tag?.name).toBe(sampleTag.name);
    expect(tag?.postCount).toBeGreaterThanOrEqual(1);
  });

  it('returns null for invalid slug', async () => {
    const tag = await getTagBySlug('nonexistent-tag');

    expect(tag).toBeNull();
  });
});
