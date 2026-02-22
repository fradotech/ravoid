/* empty css                                     */
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, l as Fragment } from '../../chunks/astro/server_e8a2OyHN.mjs';
import 'piccolore';
import { $ as $$BaseLayout } from '../../chunks/BaseLayout_CQoz6Qiq.mjs';
import { $ as $$Breadcrumb } from '../../chunks/Breadcrumb_BDwHuQ4j.mjs';
import { $ as $$PostGrid } from '../../chunks/PostGrid_DA9kxDMO.mjs';
import { $ as $$Pagination } from '../../chunks/Pagination_SFWsUHRE.mjs';
import { P as Path } from '../../chunks/path.config_Lcn3_rvK.mjs';
import { p as pluralize } from '../../chunks/format.util_CfTDCMbb.mjs';
import { a as getTagBySlug } from '../../chunks/tag.api_D4QO5R5M.mjs';
import { a as getAllPosts } from '../../chunks/post.api_B3mRcmPb.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://example.com");
const prerender = false;
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  if (!slug) {
    return Astro2.redirect("/404");
  }
  const tag = await getTagBySlug(slug);
  if (!tag) {
    return Astro2.redirect("/404");
  }
  const page = Number(Astro2.url.searchParams.get("page")) || 1;
  const postsResult = await getAllPosts({ page, filters: { tag: slug } });
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": tag.name, "description": `Articles tagged with ${tag.name}` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-6xl mx-auto px-4 py-8"> ${renderComponent($$result2, "Breadcrumb", $$Breadcrumb, { "items": [
    { label: "Tags", href: Path.tags.index },
    { label: tag.name }
  ] })} <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">${tag.name}</h1> <p class="text-gray-500 dark:text-gray-400 mb-8">${pluralize(tag.postCount, "article")}</p> ${postsResult.data.length > 0 ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "PostGrid", $$PostGrid, { "posts": postsResult.data })} ${postsResult.meta && renderTemplate`${renderComponent($$result3, "Pagination", $$Pagination, { "currentPage": page, "totalPages": postsResult.meta.totalPage, "baseUrl": Path.tags.detail(slug) })}`}` })}` : renderTemplate`<p class="text-center py-16 text-lg text-gray-500 dark:text-gray-400">
No articles found for this tag.
</p>`} </div> ` })}`;
}, "/Users/fradotech/Documents/Projects/@frado/blog/src/pages/tags/[slug].astro", void 0);

const $$file = "/Users/fradotech/Documents/Projects/@frado/blog/src/pages/tags/[slug].astro";
const $$url = "/tags/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
