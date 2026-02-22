import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SiteConfig } from '@/app/config/site.config';
import { Path } from '@/app/config/path.config';
import { getRecentPosts } from '@/modules/post/post.api';

export async function GET(context: APIContext) {
  const posts = await getRecentPosts(50);

  return rss({
    title: SiteConfig.name,
    description: SiteConfig.description,
    site: context.site!.toString(),
    items: posts.map((post) => ({
      title: post.title,
      pubDate: new Date(post.publishedAt),
      description: post.excerpt,
      link: Path.post.detail(post.slug),
    })),
  });
}
