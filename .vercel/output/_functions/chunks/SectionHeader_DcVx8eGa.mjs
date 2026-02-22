import { e as createAstro, f as createComponent, m as maybeRenderHead, h as addAttribute, r as renderTemplate } from './astro/server_e8a2OyHN.mjs';
import 'piccolore';
import 'clsx';

const $$Astro = createAstro("https://example.com");
const $$SectionHeader = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$SectionHeader;
  const { title, href, linkText = "View all" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="flex items-center justify-between mb-5"> <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">${title}</h2> ${href && renderTemplate`<a${addAttribute(href, "href")} class="text-sm font-medium text-blue-500 dark:text-blue-400 hover:underline"> ${linkText} &rarr;
</a>`} </div>`;
}, "/Users/fradotech/Documents/Projects/@frado/blog/src/infrastructure/components/ui/SectionHeader.astro", void 0);

export { $$SectionHeader as $ };
