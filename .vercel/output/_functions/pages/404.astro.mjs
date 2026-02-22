/* empty css                                  */
import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_e8a2OyHN.mjs';
import 'piccolore';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_CQoz6Qiq.mjs';
import { $ as $$PostGrid } from '../chunks/PostGrid_DA9kxDMO.mjs';
import { $ as $$SectionHeader } from '../chunks/SectionHeader_DcVx8eGa.mjs';
import { $ as $$SearchBar } from '../chunks/SearchBar_CmNzLd7U.mjs';
import { P as Path } from '../chunks/path.config_Lcn3_rvK.mjs';
import { g as getTrendingPosts } from '../chunks/post.api_B3mRcmPb.mjs';
export { renderers } from '../renderers.mjs';

const $$404 = createComponent(async ($$result, $$props, $$slots) => {
  const trending = await getTrendingPosts(3);
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Page Not Found", "noIndex": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-6xl mx-auto px-4 py-16 text-center"> <p class="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-4">404</p> <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Page not found</h1> <p class="text-gray-500 dark:text-gray-400 mb-8">
The page you are looking for does not exist or has been moved.
</p> <div class="max-w-md mx-auto mb-12"> ${renderComponent($$result2, "SearchBar", $$SearchBar, { "placeholder": "Search for articles..." })} </div> <div class="flex justify-center gap-4 mb-16"> <a${addAttribute(Path.index, "href")} class="px-6 py-2.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
Go Home
</a> <a${addAttribute(Path.blog.index, "href")} class="px-6 py-2.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
Browse Articles
</a> </div> ${trending.length > 0 && renderTemplate`<div class="text-left max-w-4xl mx-auto"> ${renderComponent($$result2, "SectionHeader", $$SectionHeader, { "title": "Popular Articles", "href": Path.blog.index })} ${renderComponent($$result2, "PostGrid", $$PostGrid, { "posts": trending, "columns": 3 })} </div>`} </div> ` })}`;
}, "/Users/fradotech/Documents/Projects/@frado/blog/src/pages/404.astro", void 0);

const $$file = "/Users/fradotech/Documents/Projects/@frado/blog/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
