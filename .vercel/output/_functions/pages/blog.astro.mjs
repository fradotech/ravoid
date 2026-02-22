/* empty css                                  */
import { e as createAstro, f as createComponent, m as maybeRenderHead, h as addAttribute, r as renderTemplate, k as renderComponent, l as Fragment } from '../chunks/astro/server_e8a2OyHN.mjs';
import 'piccolore';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_CQoz6Qiq.mjs';
import { $ as $$PostGrid } from '../chunks/PostGrid_DA9kxDMO.mjs';
import { $ as $$SearchBar } from '../chunks/SearchBar_CmNzLd7U.mjs';
import { $ as $$Pagination } from '../chunks/Pagination_SFWsUHRE.mjs';
import 'clsx';
import { $ as $$AdBanner } from '../chunks/AdBanner_BkhGnk08.mjs';
import { P as Path } from '../chunks/path.config_Lcn3_rvK.mjs';
import { a as getAllPosts } from '../chunks/post.api_B3mRcmPb.mjs';
import { g as getAllTags } from '../chunks/tag.api_D4QO5R5M.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro$1 = createAstro("https://example.com");
const $$FilterChip = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$FilterChip;
  const { href, active = false, label } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(href, "href")}${addAttribute([
    "px-3.5 py-1.5 text-sm rounded-full font-medium transition-all duration-200 border",
    active ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20" : "text-gray-500 border-gray-200 hover:border-gray-400 dark:text-gray-400 dark:border-white/[0.12] dark:hover:border-white/[0.25]"
  ], "class:list")}> ${label} </a>`;
}, "/Users/fradotech/Documents/Projects/@frado/blog/src/infrastructure/components/ui/FilterChip.astro", void 0);

const $$Astro = createAstro("https://example.com");
const prerender = false;
const $$Blog = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Blog;
  const search = Astro2.url.searchParams.get("search") || void 0;
  const tag = Astro2.url.searchParams.get("tag") || void 0;
  const page = Number(Astro2.url.searchParams.get("page")) || 1;
  const [postsResult, tags] = await Promise.all([
    getAllPosts({ page, search, filters: tag ? { tag } : void 0 }),
    getAllTags()
  ]);
  const hasSearch = !!search;
  const pageTitle = hasSearch ? `Search: ${search}` : "Blog";
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": pageTitle, "description": "Browse all investment and crypto articles", "noIndex": hasSearch, "canonicalUrl": hasSearch ? null : void 0 }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-6xl mx-auto px-4 py-8"> <div class="mb-8"> <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4"> ${hasSearch ? `Results for "${search}"` : "All Articles"} </h1> <div class="max-w-md"> ${renderComponent($$result2, "SearchBar", $$SearchBar, { "value": search })} </div> </div> <div class="flex flex-wrap gap-2 mb-8"> ${renderComponent($$result2, "FilterChip", $$FilterChip, { "href": Path.blog.index, "active": !tag, "label": "All" })} ${tags.map((t) => renderTemplate`${renderComponent($$result2, "FilterChip", $$FilterChip, { "href": `${Path.blog.index}?tag=${t.slug}`, "active": tag === t.slug, "label": t.name })}`)} </div> ${postsResult.data.length > 0 ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "PostGrid", $$PostGrid, { "posts": postsResult.data })} <section class="mt-8"> ${renderComponent($$result3, "AdBanner", $$AdBanner, { "format": "horizontal" })} </section> ${postsResult.meta && renderTemplate`${renderComponent($$result3, "Pagination", $$Pagination, { "currentPage": page, "totalPages": postsResult.meta.totalPage, "baseUrl": Path.blog.index, "preserveParams": { search, tag } })}`}` })}` : renderTemplate`<div class="text-center py-16"> <p class="text-lg text-gray-500 dark:text-gray-400"> ${hasSearch ? `No articles found for "${search}"` : "No articles found"} </p> <a${addAttribute(Path.blog.index, "href")} class="mt-4 inline-block text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
View all articles
</a> </div>`} </div> ` })}`;
}, "/Users/fradotech/Documents/Projects/@frado/blog/src/pages/blog.astro", void 0);

const $$file = "/Users/fradotech/Documents/Projects/@frado/blog/src/pages/blog.astro";
const $$url = "/blog";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Blog,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
