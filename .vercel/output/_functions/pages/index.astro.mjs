/* empty css                                  */
import { e as createAstro, f as createComponent, m as maybeRenderHead, h as addAttribute, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_e8a2OyHN.mjs';
import 'piccolore';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_CQoz6Qiq.mjs';
import { P as Path } from '../chunks/path.config_Lcn3_rvK.mjs';
import { a as $$TagList, f as formatDate, b as $$TagBadge, $ as $$PostGrid } from '../chunks/PostGrid_DA9kxDMO.mjs';
import { $ as $$TrendingList } from '../chunks/TrendingList_DE23z3yF.mjs';
import { $ as $$AdBanner } from '../chunks/AdBanner_BkhGnk08.mjs';
import { $ as $$SectionHeader } from '../chunks/SectionHeader_DcVx8eGa.mjs';
import { e as getFeaturedPost, g as getTrendingPosts, b as getRecentPosts } from '../chunks/post.api_B3mRcmPb.mjs';
import { g as getAllTags } from '../chunks/tag.api_D4QO5R5M.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro$1 = createAstro("https://example.com");
const $$FeaturedPost = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$FeaturedPost;
  const { post } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<article class="group relative rounded-2xl overflow-hidden glass-card !p-0"> <a${addAttribute(Path.post.detail(post.slug), "href")} class="block"> <div class="aspect-[2/1] md:aspect-[21/9] overflow-hidden"> <img${addAttribute(post.heroImage, "src")}${addAttribute(post.title, "alt")} class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"> </div> <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div> <div class="absolute top-4 left-4 md:top-6 md:left-8"> <span class="px-3 py-1 text-xs font-semibold rounded-full bg-blue-600/90 text-white backdrop-blur-sm">
Featured
</span> </div> <div class="absolute bottom-0 left-0 right-0 p-5 md:p-8 lg:p-10"> <div class="mb-3"> ${renderComponent($$result, "TagList", $$TagList, { "tags": post.tags })} </div> <h2 class="text-xl md:text-3xl lg:text-4xl font-extrabold text-white line-clamp-2 leading-tight tracking-tight"> ${post.title} </h2> <p class="mt-2 md:mt-3 text-sm md:text-base text-gray-300 line-clamp-2 max-w-2xl leading-relaxed"> ${post.excerpt} </p> <time class="block mt-3 md:mt-4 text-sm text-gray-400"${addAttribute(post.publishedAt, "datetime")}> ${formatDate(post.publishedAt)} </time> </div> </a> </article>`;
}, "/Users/fradotech/Documents/Projects/@frado/blog/src/infrastructure/components/blog/FeaturedPost.astro", void 0);

const $$Astro = createAstro("https://example.com");
const $$TagCloud = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$TagCloud;
  const { tags } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="flex flex-wrap gap-2"> ${tags.map((tag) => renderTemplate`${renderComponent($$result, "TagBadge", $$TagBadge, { "name": `${tag.name} (${tag.postCount})`, "slug": tag.slug, "size": "md" })}`)} </div>`;
}, "/Users/fradotech/Documents/Projects/@frado/blog/src/infrastructure/components/blog/TagCloud.astro", void 0);

async function getHomeData() {
  const [featured, trending, latest] = await Promise.all([
    getFeaturedPost(),
    getTrendingPosts(5),
    getRecentPosts(6)
  ]);
  return { featured, trending, latest };
}

const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const { featured, trending, latest } = await getHomeData();
  const tags = await getAllTags();
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-6xl mx-auto px-4 py-8"> <section> ${renderComponent($$result2, "FeaturedPost", $$FeaturedPost, { "post": featured })} </section> <section class="mt-12"> ${renderComponent($$result2, "AdBanner", $$AdBanner, { "format": "horizontal" })} </section> <section class="mt-12"> <div class="grid grid-cols-1 lg:grid-cols-3 gap-8"> <div class="lg:col-span-2"> ${renderComponent($$result2, "SectionHeader", $$SectionHeader, { "title": "Latest", "href": Path.blog.index })} ${renderComponent($$result2, "PostGrid", $$PostGrid, { "posts": latest, "columns": 2 })} </div> <aside class="space-y-8"> ${renderComponent($$result2, "TrendingList", $$TrendingList, { "posts": trending })} <div> ${renderComponent($$result2, "SectionHeader", $$SectionHeader, { "title": "Topics", "href": Path.tags.index })} ${renderComponent($$result2, "TagCloud", $$TagCloud, { "tags": tags })} </div> </aside> </div> </section> <section class="mt-12"> ${renderComponent($$result2, "AdBanner", $$AdBanner, { "format": "horizontal" })} </section> </div> ` })}`;
}, "/Users/fradotech/Documents/Projects/@frado/blog/src/pages/index.astro", void 0);

const $$file = "/Users/fradotech/Documents/Projects/@frado/blog/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
