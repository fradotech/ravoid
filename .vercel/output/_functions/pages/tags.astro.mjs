/* empty css                                  */
import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_e8a2OyHN.mjs';
import 'piccolore';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_CQoz6Qiq.mjs';
import { P as Path } from '../chunks/path.config_Lcn3_rvK.mjs';
import { p as pluralize } from '../chunks/format.util_CfTDCMbb.mjs';
import { g as getAllTags } from '../chunks/tag.api_D4QO5R5M.mjs';
export { renderers } from '../renderers.mjs';

const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const tags = await getAllTags();
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Tags", "description": "Browse articles by topic" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-6xl mx-auto px-4 py-8"> <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Tags</h1> <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"> ${tags.map((tag) => renderTemplate`<a${addAttribute(Path.tags.detail(tag.slug), "href")} class="flex items-center justify-between p-4 glass-card"> <span class="font-medium text-gray-900 dark:text-gray-100">${tag.name}</span> <span class="text-sm text-gray-500 dark:text-gray-400">${pluralize(tag.postCount, "post")}</span> </a>`)} </div> </div> ` })}`;
}, "/Users/fradotech/Documents/Projects/@frado/blog/src/pages/tags/index.astro", void 0);

const $$file = "/Users/fradotech/Documents/Projects/@frado/blog/src/pages/tags/index.astro";
const $$url = "/tags";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
