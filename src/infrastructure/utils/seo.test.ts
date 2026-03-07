import { describe, it, expect } from 'vitest';
import { SiteConfig } from '@/app/config/site.config';
import { EnvConfig } from '@/app/config/env.config';
import { Path } from '@/app/config/path.config';
import { Modules } from '@/app/config/modules.config';
import { POSTS } from '@/modules/post/post.mapper';
import { isReservedSlug } from '@/modules/post/post.api';

describe('SiteConfig', () => {
  it('has required fields', () => {
    expect(SiteConfig.name).toBeTruthy();
    expect(SiteConfig.description).toBeTruthy();
    expect(SiteConfig.language).toBeTruthy();
    expect(SiteConfig.postsPerPage).toBeGreaterThan(0);
  });

  it('has tagline for hero positioning', () => {
    expect(SiteConfig.tagline).toBeTruthy();
    expect(typeof SiteConfig.tagline).toBe('string');
    expect(SiteConfig.tagline.length).toBeGreaterThan(10);
    expect(SiteConfig.tagline.length).toBeLessThan(100);
  });

  it('has organization schema data', () => {
    const { organization } = SiteConfig;
    expect(organization).toBeDefined();
    expect(organization.type).toBe('Organization');
    expect(organization.name).toBeTruthy();
    expect(organization.url).toMatch(/^https?:\/\//);
    expect(organization.logo).toMatch(/^https?:\/\//);
  });

  it('organization sameAs derives from socials', () => {
    const socialUrls = Object.values(SiteConfig.socials).filter(Boolean);
    expect(socialUrls).toBeInstanceOf(Array);
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

  it('no post slug conflicts with reserved slugs', () => {
    POSTS.forEach((post) => {
      expect(isReservedSlug(post.slug)).toBe(false);
    });
  });
});

describe('post SEO fields', () => {
  it('all posts have complete SEO data', () => {
    POSTS.forEach((post) => {
      expect(post.seo.metaTitle).toBeTruthy();
      expect(post.seo.metaDescription).toBeTruthy();
      expect(post.seo.metaDescription.length).toBeLessThanOrEqual(160);
      expect(post.seo.ogImage).toBeTruthy();
      expect(post.seo.noIndex).toBe(false);
    });
  });

  it('all posts have valid slugs', () => {
    POSTS.forEach((post) => {
      expect(post.slug).toMatch(/^[a-z0-9-]+$/);
      expect(post.slug).not.toMatch(/^-|-$/);
    });
  });

  it('all posts have valid dates', () => {
    POSTS.forEach((post) => {
      expect(new Date(post.publishedAt).getTime()).not.toBeNaN();
      expect(new Date(post.updatedAt).getTime()).not.toBeNaN();
    });
  });

  it('all posts have at least one tag', () => {
    POSTS.forEach((post) => {
      expect(post.tags.length).toBeGreaterThanOrEqual(1);
      post.tags.forEach((tag) => {
        expect(tag.name).toBeTruthy();
        expect(tag.slug).toMatch(/^[a-z0-9-]+$/);
      });
    });
  });

  it('all posts have images', () => {
    POSTS.forEach((post) => {
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

describe('Organization schema structure', () => {
  it('produces valid JSON-LD fields', () => {
    const { organization } = SiteConfig;
    const schema = {
      '@context': 'https://schema.org',
      '@type': organization.type,
      name: organization.name,
      url: organization.url,
      logo: organization.logo,
      description: SiteConfig.description,
      sameAs: Object.values(SiteConfig.socials).filter(Boolean),
    };

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Organization');
    expect(schema.name).toBe(SiteConfig.name);
    expect(schema.url).toMatch(/^https?:\/\//);
    expect(schema.logo).toMatch(/^https?:\/\//);
    expect(schema.description).toBeTruthy();
    expect(schema.sameAs).toBeInstanceOf(Array);
  });

  it('logo URL ends with valid image extension', () => {
    expect(SiteConfig.organization.logo).toMatch(/\.(svg|png|jpg|jpeg|webp)$/);
  });

  it('organization name matches site name', () => {
    expect(SiteConfig.organization.name).toBe(SiteConfig.name);
  });
});
