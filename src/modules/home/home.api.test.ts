import { describe, it, expect } from 'vitest';
import { getHomeData } from './home.api';

describe('getHomeData', () => {
  it('returns featured, trending, and latest posts', async () => {
    const data = await getHomeData();

    expect(data.featured).toBeDefined();
    expect(data.featured.title).toBeTruthy();
    expect(data.featured.slug).toBeTruthy();

    expect(data.trending).toBeInstanceOf(Array);
    expect(data.trending.length).toBeLessThanOrEqual(5);
    expect(data.trending.some((p) => p.slug === data.featured.slug)).toBe(false);

    expect(data.latest).toBeInstanceOf(Array);
    expect(data.latest.length).toBeLessThanOrEqual(6);
  });

  it('returns latest posts sorted by publishedAt descending', async () => {
    const { latest } = await getHomeData();

    for (let i = 1; i < latest.length; i++) {
      const prev = new Date(latest[i - 1].publishedAt).getTime();
      const curr = new Date(latest[i].publishedAt).getTime();
      expect(prev).toBeGreaterThanOrEqual(curr);
    }
  });

  it('returns posts with required fields', async () => {
    const { featured, trending, latest } = await getHomeData();
    const allPosts = [featured, ...trending, ...latest];

    allPosts.forEach((post) => {
      expect(post.id).toBeTruthy();
      expect(post.title).toBeTruthy();
      expect(post.slug).toBeTruthy();
      expect(post.excerpt).toBeTruthy();
      expect(post.tags).toBeInstanceOf(Array);
      expect(post.heroImage).toBeTruthy();
      expect(post.thumbnail).toBeTruthy();
      expect(post.seo).toBeDefined();
      expect(post.publishedAt).toBeTruthy();
    });
  });
});
