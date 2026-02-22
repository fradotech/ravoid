import rss from '@astrojs/rss';
import { S as SiteConfig, P as Path } from '../chunks/path.config_Lcn3_rvK.mjs';
import { b as getRecentPosts } from '../chunks/post.api_B3mRcmPb.mjs';
export { renderers } from '../renderers.mjs';

async function GET(context) {
  const posts = await getRecentPosts(50);
  return rss({
    title: SiteConfig.name,
    description: SiteConfig.description,
    site: context.site.toString(),
    items: posts.map((post) => ({
      title: post.title,
      pubDate: new Date(post.publishedAt),
      description: post.excerpt,
      link: Path.post.detail(post.slug)
    }))
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
