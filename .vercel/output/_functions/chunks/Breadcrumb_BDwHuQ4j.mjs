import { e as createAstro, f as createComponent, r as renderTemplate, u as unescapeHTML, h as addAttribute, m as maybeRenderHead } from './astro/server_e8a2OyHN.mjs';
import 'piccolore';
import 'clsx';
import { P as Path } from './path.config_Lcn3_rvK.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://example.com");
const $$Breadcrumb = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Breadcrumb;
  const { items } = Astro2.props;
  const allItems = [
    { label: "Home", href: Path.index },
    ...items
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...item.href && { item: new URL(item.href, Astro2.site).href }
    }))
  };
  return renderTemplate(_a || (_a = __template(["", '<nav aria-label="Breadcrumb" class="text-sm text-gray-500 dark:text-gray-400 mb-4"> <ol class="flex items-center gap-1.5 flex-wrap"> ', ' </ol> </nav> <script type="application/ld+json">', "<\/script>"])), maybeRenderHead(), allItems.map((item, index) => renderTemplate`<li class="flex items-center gap-1.5"> ${index > 0 && renderTemplate`<span class="text-gray-300 dark:text-gray-600">/</span>`} ${item.href && index < allItems.length - 1 ? renderTemplate`<a${addAttribute(item.href, "href")} class="hover:text-gray-900 dark:hover:text-gray-200 transition-colors"> ${item.label} </a>` : renderTemplate`<span class="text-gray-900 dark:text-gray-300">${item.label}</span>`} </li>`), unescapeHTML(JSON.stringify(jsonLd)));
}, "/Users/fradotech/Documents/Projects/@frado/blog/src/infrastructure/components/seo/Breadcrumb.astro", void 0);

export { $$Breadcrumb as $ };
