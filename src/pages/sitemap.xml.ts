import type { APIContext } from 'astro';
import { SiteConfig } from '@/app/config/site.config';
import { POSTS } from '@/modules/post/post.mapper';
import { getAllTags } from '@/modules/tag/tag.api';

const site = SiteConfig.siteUrl;

interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq: string;
  priority: string;
}

export async function GET(_context: APIContext) {
  const tags = await getAllTags();

  const staticPages: SitemapEntry[] = [
    { loc: site, changefreq: 'daily', priority: '1.0' },
    { loc: `${site}/blog`, changefreq: 'daily', priority: '0.9' },
    { loc: `${site}/tags`, changefreq: 'weekly', priority: '0.7' },
    { loc: `${site}/about`, changefreq: 'monthly', priority: '0.5' },
    { loc: `${site}/contact`, changefreq: 'monthly', priority: '0.5' },
    { loc: `${site}/disclaimer`, changefreq: 'yearly', priority: '0.2' },
    { loc: `${site}/privacy-policy`, changefreq: 'yearly', priority: '0.2' },
    { loc: `${site}/terms`, changefreq: 'yearly', priority: '0.2' },
  ];

  const postPages: SitemapEntry[] = POSTS.map((post) => ({
    loc: `${site}/blog/${post.slug}`,
    lastmod: post.updatedAt?.split('T')[0] ?? post.publishedAt.split('T')[0],
    changefreq: 'weekly',
    priority: '0.8',
  }));

  const tagPages: SitemapEntry[] = tags.map((tag) => ({
    loc: `${site}/tags/${tag.slug}`,
    changefreq: 'weekly',
    priority: '0.6',
  }));

  const entries = [...staticPages, ...postPages, ...tagPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) => `  <url>
    <loc>${e.loc}</loc>${e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ''}
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
