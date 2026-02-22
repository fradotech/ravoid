import { D as DUMMY_POSTS } from './post.dummy_DbjIcWoi.mjs';

async function getAllTags() {
  const tagMap = /* @__PURE__ */ new Map();
  DUMMY_POSTS.forEach((post) => {
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
async function getTagBySlug(slug) {
  const tags = await getAllTags();
  return tags.find((tag) => tag.slug === slug) ?? null;
}

export { getTagBySlug as a, getAllTags as g };
