import { e as createAstro, f as createComponent, h as addAttribute, r as renderTemplate, m as maybeRenderHead, o as renderScript, k as renderComponent, n as renderSlot, p as renderHead } from './astro/server_e8a2OyHN.mjs';
import 'piccolore';
/* empty css                         */
import { S as SiteConfig, P as Path } from './path.config_Lcn3_rvK.mjs';
import 'clsx';

const EnvConfig = {
  siteUrl: "https://example.com"
};

const $$Astro$2 = createAstro("https://example.com");
const $$SEOHead = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$SEOHead;
  const {
    title,
    description = SiteConfig.description,
    ogImage,
    canonicalUrl,
    noIndex = false,
    type = "website",
    publishedAt,
    updatedAt
  } = Astro2.props;
  const pageTitle = title ? `${title} | ${SiteConfig.name}` : SiteConfig.name;
  const siteBase = Astro2.site?.href || EnvConfig.siteUrl;
  const canonical = canonicalUrl || new URL(Astro2.url.pathname, siteBase).href;
  const ogImageUrl = ogImage || new URL("/og-default.jpg", siteBase).href;
  const metaDescription = description.length > 155 ? description.slice(0, description.lastIndexOf(" ", 155)) + "..." : description;
  return renderTemplate`<title>${pageTitle}</title><meta name="description"${addAttribute(metaDescription, "content")}><link rel="canonical"${addAttribute(canonical, "href")}>${noIndex && renderTemplate`<meta name="robots" content="noindex, follow">`}<meta property="og:title"${addAttribute(pageTitle, "content")}><meta property="og:description"${addAttribute(metaDescription, "content")}><meta property="og:type"${addAttribute(type, "content")}><meta property="og:url"${addAttribute(canonical, "content")}><meta property="og:image"${addAttribute(ogImageUrl, "content")}><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:site_name"${addAttribute(SiteConfig.name, "content")}><meta property="og:locale"${addAttribute(SiteConfig.language, "content")}><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"${addAttribute(pageTitle, "content")}><meta name="twitter:description"${addAttribute(metaDescription, "content")}><meta name="twitter:image"${addAttribute(ogImageUrl, "content")}>${publishedAt && renderTemplate`<meta property="article:published_time"${addAttribute(publishedAt, "content")}>`}${updatedAt && renderTemplate`<meta property="article:modified_time"${addAttribute(updatedAt, "content")}>`}`;
}, "/Users/fradotech/Documents/Projects/@frado/blog/src/infrastructure/components/seo/SEOHead.astro", void 0);

const $$DarkModeToggle = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<button type="button" aria-label="Toggle dark mode" data-dark-toggle class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"> <svg data-icon-sun class="w-5 h-5 hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path> </svg> <svg data-icon-moon class="w-5 h-5 hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path> </svg> </button> ${renderScript($$result, "/Users/fradotech/Documents/Projects/@frado/blog/src/infrastructure/components/ui/DarkModeToggle.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/fradotech/Documents/Projects/@frado/blog/src/infrastructure/components/ui/DarkModeToggle.astro", void 0);

const $$Astro$1 = createAstro("https://example.com");
const $$Navbar = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Navbar;
  const navLinks = [
    { label: "Home", href: Path.index },
    { label: "Blog", href: Path.blog.index },
    { label: "Tags", href: Path.tags.index },
    { label: "About", href: Path.about }
  ];
  const currentPath = Astro2.url.pathname;
  function isActive(href) {
    if (href === "/") return currentPath === "/";
    return currentPath.startsWith(href);
  }
  return renderTemplate`${maybeRenderHead()}<header class="sticky top-0 z-50 glass-nav"> <nav class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between"> <a${addAttribute(Path.index, "href")} class="text-lg font-bold tracking-tight"> <span class="gradient-text">${SiteConfig.name}</span> </a> <div class="hidden md:flex items-center gap-1"> ${navLinks.map((link) => renderTemplate`<a${addAttribute(link.href, "href")}${addAttribute([
    "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
    isActive(link.href) ? "text-white bg-white/10" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-white/[0.06]"
  ], "class:list")}> ${link.label} </a>`)} <div class="ml-2"> ${renderComponent($$result, "DarkModeToggle", $$DarkModeToggle, {})} </div> </div> <div class="flex items-center gap-2 md:hidden"> ${renderComponent($$result, "DarkModeToggle", $$DarkModeToggle, {})} <button id="mobile-menu-toggle" type="button" aria-label="Toggle menu" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"> <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path> </svg> </button> </div> </nav> <div id="mobile-menu" class="hidden md:hidden border-t border-gray-200/40 dark:border-white/[0.06]"> <div class="px-4 py-3 space-y-1"> ${navLinks.map((link) => renderTemplate`<a${addAttribute(link.href, "href")}${addAttribute([
    "block px-3 py-2 text-sm font-medium rounded-lg transition-colors",
    isActive(link.href) ? "text-white bg-white/10" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
  ], "class:list")}> ${link.label} </a>`)} </div> </div> </header> ${renderScript($$result, "/Users/fradotech/Documents/Projects/@frado/blog/src/infrastructure/components/layout/Navbar.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/fradotech/Documents/Projects/@frado/blog/src/infrastructure/components/layout/Navbar.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const footerLinks = [
    { label: "About", href: Path.about },
    { label: "Contact", href: Path.contact },
    { label: "Disclaimer", href: Path.disclaimer },
    { label: "Privacy Policy", href: Path.privacyPolicy },
    { label: "Terms", href: Path.terms }
  ];
  return renderTemplate`${maybeRenderHead()}<footer class="border-t border-gray-200/40 dark:border-white/[0.06] mt-20"> <div class="max-w-6xl mx-auto px-4 py-14"> <div class="grid grid-cols-1 md:grid-cols-3 gap-10"> <div> <a${addAttribute(Path.index, "href")} class="text-lg font-bold tracking-tight"> <span class="gradient-text">${SiteConfig.name}</span> </a> <p class="mt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs"> ${SiteConfig.description} </p> </div> <div> <h3 class="text-xs font-semibold text-gray-900 dark:text-gray-300 uppercase tracking-widest mb-4">Resources</h3> <ul class="space-y-2.5"> ${footerLinks.map((link) => renderTemplate`<li> <a${addAttribute(link.href, "href")} class="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"> ${link.label} </a> </li>`)} </ul> </div> <div> <h3 class="text-xs font-semibold text-gray-900 dark:text-gray-300 uppercase tracking-widest mb-4">Stay Updated</h3> <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
Get the latest investment and crypto insights delivered to your inbox.
</p> </div> </div> <div class="mt-12 pt-6 border-t border-gray-200/40 dark:border-white/[0.06] text-center text-xs text-gray-400 dark:text-gray-600">
&copy; ${currentYear} ${SiteConfig.name}. All rights reserved.
</div> </div> </footer>`;
}, "/Users/fradotech/Documents/Projects/@frado/blog/src/infrastructure/components/layout/Footer.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://example.com");
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const props = Astro2.props;
  return renderTemplate(_a || (_a = __template(["<html", '> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="sitemap" href="/sitemap-index.xml"><link rel="alternate" type="application/rss+xml" title="RSS Feed" href="/rss.xml"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">', "<script>\n      (function() {\n        const theme = localStorage.getItem('theme');\n        if (theme === 'light') {\n          document.documentElement.classList.remove('dark');\n        } else {\n          document.documentElement.classList.add('dark');\n        }\n      })();\n    <\/script>", '</head> <body class="min-h-screen flex flex-col font-sans"> ', ' <main class="flex-1"> ', " </main> ", " </body></html>"])), addAttribute(SiteConfig.language, "lang"), renderComponent($$result, "SEOHead", $$SEOHead, { ...props }), renderHead(), renderComponent($$result, "Navbar", $$Navbar, {}), renderSlot($$result, $$slots["default"]), renderComponent($$result, "Footer", $$Footer, {}));
}, "/Users/fradotech/Documents/Projects/@frado/blog/src/infrastructure/components/layout/BaseLayout.astro", void 0);

export { $$BaseLayout as $ };
