import { describe, it, expect } from 'vitest';
import { getAllPosts, getPostBySlug, isReservedSlug, getRelatedPosts } from './post.api';

describe('getAllPosts', () => {
  it('returns paginated posts with default params', async () => {
    const result = await getAllPosts();

    expect(result.data).toBeInstanceOf(Array);
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.meta).toBeDefined();
    expect(result.meta?.page).toBe(1);
    expect(result.meta?.totalPage).toBeGreaterThanOrEqual(1);
  });

  it('filters posts by search query', async () => {
    const result = await getAllPosts({ search: 'bitcoin' });

    result.data.forEach((post) => {
      const matchesTitle = post.title.toLowerCase().includes('bitcoin');
      const matchesExcerpt = post.excerpt.toLowerCase().includes('bitcoin');
      expect(matchesTitle || matchesExcerpt).toBe(true);
    });
  });

  it('returns empty when search has no matches', async () => {
    const result = await getAllPosts({ search: 'xyznonexistent123' });

    expect(result.data).toHaveLength(0);
    expect(result.meta?.total).toBe(0);
  });

  it('filters posts by tag', async () => {
    const result = await getAllPosts({ filters: { tag: 'defi' } });

    result.data.forEach((post) => {
      const hasTag = post.tags.some((tag) => tag.slug === 'defi');
      expect(hasTag).toBe(true);
    });
  });

  it('paginates correctly', async () => {
    const result = await getAllPosts({ page: 1, pageSize: 2 });

    expect(result.data.length).toBeLessThanOrEqual(2);
    expect(result.meta?.page).toBe(1);
    expect(result.meta?.pageSize).toBe(2);
  });

  it('returns empty data for out-of-range page', async () => {
    const result = await getAllPosts({ page: 999 });

    expect(result.data).toHaveLength(0);
  });
});

describe('getPostBySlug', () => {
  it('returns post for valid slug', async () => {
    const post = await getPostBySlug('bitcoin-halving-2026-what-investors-need-to-know');

    expect(post).not.toBeNull();
    expect(post?.title).toContain('Bitcoin Halving');
  });

  it('returns null for invalid slug', async () => {
    const post = await getPostBySlug('nonexistent-slug');

    expect(post).toBeNull();
  });
});

describe('isReservedSlug', () => {
  it('returns true for reserved slugs', () => {
    expect(isReservedSlug('blog')).toBe(true);
    expect(isReservedSlug('tags')).toBe(true);
    expect(isReservedSlug('about')).toBe(true);
    expect(isReservedSlug('contact')).toBe(true);
    expect(isReservedSlug('disclaimer')).toBe(true);
    expect(isReservedSlug('privacy-policy')).toBe(true);
    expect(isReservedSlug('terms')).toBe(true);
  });

  it('returns false for non-reserved slugs', () => {
    expect(isReservedSlug('bitcoin-halving')).toBe(false);
    expect(isReservedSlug('my-article')).toBe(false);
  });
});

describe('getRelatedPosts', () => {
  it('excludes current post from results', async () => {
    const slug = 'bitcoin-halving-2026-what-investors-need-to-know';
    const related = await getRelatedPosts(slug, ['crypto']);

    related.forEach((post) => {
      expect(post.slug).not.toBe(slug);
    });
  });

  it('returns posts matching given tags', async () => {
    const related = await getRelatedPosts('some-slug', ['crypto']);

    related.forEach((post) => {
      const hasMatchingTag = post.tags.some((tag) => tag.slug === 'crypto');
      expect(hasMatchingTag).toBe(true);
    });
  });

  it('respects limit parameter', async () => {
    const related = await getRelatedPosts('some-slug', ['crypto'], 2);

    expect(related.length).toBeLessThanOrEqual(2);
  });

  it('returns empty for tags with no matches', async () => {
    const related = await getRelatedPosts('some-slug', ['nonexistent-tag']);

    expect(related).toHaveLength(0);
  });
});
