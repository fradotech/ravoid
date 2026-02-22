import { describe, it, expect } from 'vitest';
import { SiteConfig } from '@/app/config/site.config';
import { EnvConfig } from '@/app/config/env.config';
import { Path } from '@/app/config/path.config';
import { Modules } from '@/app/config/modules.config';
import { DUMMY_POSTS } from '@/modules/post/post.dummy';
import { isReservedSlug } from '@/modules/post/post.api';

describe('SiteConfig', () => {
  it('has required fields', () => {
    expect(SiteConfig.name).toBeTruthy();
    expect(SiteConfig.description).toBeTruthy();
    expect(SiteConfig.language).toBeTruthy();
    expect(SiteConfig.postsPerPage).toBeGreaterThan(0);
  });
});

describe('Path config', () => {
  it('all paths start with /', () => {
    expect(Path.index).toBe('/');
    expect(Path.blog.index).toMatch(/^\//);
    expect(Path.tags.index).toMatch(/^\//);
    expect(Path.about).toMatch(/^\//);
    expect(Path.contact).toMatch(/^\//);
    expect(Path.disclaimer).toMatch(/^\//);
    expect(Path.privacyPolicy).toMatch(/^\//);
    expect(Path.terms).toMatch(/^\//);
  });

  it('dynamic paths return correct format', () => {
    expect(Path.post.detail('test-slug')).toBe('/test-slug');
    expect(Path.tags.detail('crypto')).toBe('/tags/crypto');
    expect(Path.blog.search('bitcoin')).toContain('search=bitcoin');
    expect(Path.blog.page(2)).toContain('page=2');
  });
});

describe('reserved slugs', () => {
  it('all module paths are reserved', () => {
    Object.values(Modules).forEach((mod) => {
      expect(isReservedSlug(mod)).toBe(true);
    });
  });

  it('no dummy post slug conflicts with reserved slugs', () => {
    DUMMY_POSTS.forEach((post) => {
      expect(isReservedSlug(post.slug)).toBe(false);
    });
  });
});

describe('post SEO fields', () => {
  it('all dummy posts have complete SEO data', () => {
    DUMMY_POSTS.forEach((post) => {
      expect(post.seo.metaTitle).toBeTruthy();
      expect(post.seo.metaDescription).toBeTruthy();
      expect(post.seo.metaDescription.length).toBeLessThanOrEqual(160);
      expect(post.seo.ogImage).toBeTruthy();
      expect(post.seo.noIndex).toBe(false);
    });
  });

  it('all dummy posts have valid slugs', () => {
    DUMMY_POSTS.forEach((post) => {
      expect(post.slug).toMatch(/^[a-z0-9-]+$/);
      expect(post.slug).not.toMatch(/^-|-$/);
    });
  });

  it('all dummy posts have valid dates', () => {
    DUMMY_POSTS.forEach((post) => {
      expect(new Date(post.publishedAt).getTime()).not.toBeNaN();
      expect(new Date(post.updatedAt).getTime()).not.toBeNaN();
    });
  });

  it('all dummy posts have at least one tag', () => {
    DUMMY_POSTS.forEach((post) => {
      expect(post.tags.length).toBeGreaterThanOrEqual(1);
      post.tags.forEach((tag) => {
        expect(tag.name).toBeTruthy();
        expect(tag.slug).toMatch(/^[a-z0-9-]+$/);
      });
    });
  });

  it('all dummy posts have images', () => {
    DUMMY_POSTS.forEach((post) => {
      expect(post.heroImage).toBeTruthy();
      expect(post.thumbnail).toBeTruthy();
    });
  });
});

describe('EnvConfig', () => {
  it('has default values', () => {
    expect(EnvConfig.apiBaseUrl).toBeTruthy();
    expect(EnvConfig.siteUrl).toBeTruthy();
  });
});
