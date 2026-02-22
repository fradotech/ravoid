import { e as createAstro, f as createComponent, m as maybeRenderHead, k as renderComponent, h as addAttribute, r as renderTemplate } from './astro/server_e8a2OyHN.mjs';
import 'piccolore';
import { P as Path } from './path.config_Lcn3_rvK.mjs';
import { f as formatDate } from './PostGrid_DA9kxDMO.mjs';
import { $ as $$SectionHeader } from './SectionHeader_DcVx8eGa.mjs';

const $$Astro = createAstro("https://example.com");
const $$TrendingList = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$TrendingList;
  const { posts, title = "Trending" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div> ${renderComponent($$result, "SectionHeader", $$SectionHeader, { "title": title })} <div class="space-y-4"> ${posts.map((post, index) => renderTemplate`<a${addAttribute(Path.post.detail(post.slug), "href")} class="flex gap-3 group"> <span class="text-2xl font-extrabold text-gray-200/80 dark:text-gray-100/[0.08] leading-none tabular-nums"> ${String(index + 1).padStart(2, "0")} </span> <div class="flex-1 min-w-0"> <h4 class="text-sm font-medium text-gray-900 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug"> ${post.title} </h4> <time class="text-xs text-gray-400 dark:text-gray-500 mt-0.5 block"${addAttribute(post.publishedAt, "datetime")}> ${formatDate(post.publishedAt)} </time> </div> </a>`)} </div> </div>`;
}, "/Users/fradotech/Documents/Projects/@frado/blog/src/infrastructure/components/blog/TrendingList.astro", void 0);

export { $$TrendingList as $ };
