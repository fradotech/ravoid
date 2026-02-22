import { e as createAstro, f as createComponent, m as maybeRenderHead, h as addAttribute, r as renderTemplate } from './astro/server_e8a2OyHN.mjs';
import 'piccolore';
import 'clsx';

const $$Astro = createAstro("https://example.com");
const $$AdBanner = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AdBanner;
  const { format = "horizontal", sticky = false } = Astro2.props;
  const heightClasses = {
    horizontal: "min-h-[90px]",
    rectangle: "min-h-[250px]",
    sidebar: "min-h-[600px]"
  };
  return renderTemplate`${maybeRenderHead()}<div${addAttribute([
    "ad-container flex items-center justify-center rounded-xl border border-gray-200/40 dark:border-white/[0.06] bg-gray-50/50 dark:bg-white/[0.02]",
    heightClasses[format],
    sticky && "sticky top-20"
  ], "class:list")}> <span class="text-xs text-gray-300 dark:text-gray-600">Advertisement</span> </div>`;
}, "/Users/fradotech/Documents/Projects/@frado/blog/src/infrastructure/components/ads/AdBanner.astro", void 0);

export { $$AdBanner as $ };
