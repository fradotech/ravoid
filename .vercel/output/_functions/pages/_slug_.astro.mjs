/* empty css                                  */
import { e as createAstro, f as createComponent, m as maybeRenderHead, k as renderComponent, h as addAttribute, r as renderTemplate, u as unescapeHTML } from '../chunks/astro/server_e8a2OyHN.mjs';
import 'piccolore';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_CQoz6Qiq.mjs';
import { $ as $$Breadcrumb } from '../chunks/Breadcrumb_BDwHuQ4j.mjs';
import { f as formatDate, $ as $$PostGrid, a as $$TagList } from '../chunks/PostGrid_DA9kxDMO.mjs';
import { $ as $$TrendingList } from '../chunks/TrendingList_DE23z3yF.mjs';
import { P as Path, S as SiteConfig } from '../chunks/path.config_Lcn3_rvK.mjs';
import { $ as $$SectionHeader } from '../chunks/SectionHeader_DcVx8eGa.mjs';
import 'clsx';
import { $ as $$AdBanner } from '../chunks/AdBanner_BkhGnk08.mjs';
import { Marked } from 'marked';
import { codeToHtml } from 'shiki';
import { i as isReservedSlug, c as getPostBySlug, d as getRelatedPosts, g as getTrendingPosts, b as getRecentPosts } from '../chunks/post.api_B3mRcmPb.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro$5 = createAstro("https://example.com");
const $$RecentPosts = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$RecentPosts;
  const { posts, title = "Recent Posts" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div> ${renderComponent($$result, "SectionHeader", $$SectionHeader, { "title": title })} <div class="space-y-3"> ${posts.map((post) => renderTemplate`<a${addAttribute(Path.post.detail(post.slug), "href")} class="flex gap-3 group"> <div class="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-white/[0.03]"> <img${addAttribute(post.thumbnail, "src")}${addAttribute(post.title, "alt")} class="w-full h-full object-cover" loading="lazy"> </div> <div class="flex-1 min-w-0"> <h4 class="text-sm font-medium text-gray-900 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug"> ${post.title} </h4> <time class="text-xs text-gray-400 dark:text-gray-500 mt-0.5 block"${addAttribute(post.publishedAt, "datetime")}> ${formatDate(post.publishedAt)} </time> </div> </a>`)} </div> </div>`;
}, "/Users/fradotech/Documents/Projects/@frado/blog/src/infrastructure/components/blog/RecentPosts.astro", void 0);

const $$Astro$4 = createAstro("https://example.com");
const $$ShareButtons = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$ShareButtons;
  const { url, title } = Astro2.props;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const links = [
    {
      label: "Twitter",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
    }
  ];
  return renderTemplate`${maybeRenderHead()}<div class="flex items-center gap-2"> <span class="text-sm text-gray-500 dark:text-gray-400">Share:</span> ${links.map((link) => renderTemplate`<a${addAttribute(link.href, "href")} target="_blank" rel="noopener noreferrer"${addAttribute(`Share on ${link.label}`, "aria-label")} class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"> <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"> <path${addAttribute(link.icon, "d")}></path> </svg> </a>`)} </div>`;
}, "/Users/fradotech/Documents/Projects/@frado/blog/src/infrastructure/components/ui/ShareButtons.astro", void 0);

const $$Astro$3 = createAstro("https://example.com");
const $$TableOfContents = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$TableOfContents;
  const { items } = Astro2.props;
  return renderTemplate`${items.length > 0 && renderTemplate`${maybeRenderHead()}<nav aria-label="Table of contents" class="p-4 rounded-xl glass-card"><h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wider">On this page</h3><ul class="space-y-1.5">${items.map((item) => renderTemplate`<li${addAttribute(`padding-left: ${(item.level - 2) * 12}px`, "style")}><a${addAttribute(`#${item.id}`, "href")} class="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1">${item.text}</a></li>`)}</ul></nav>`}`;
}, "/Users/fradotech/Documents/Projects/@frado/blog/src/modules/post/components/TableOfContents.astro", void 0);

const $$Astro$2 = createAstro("https://example.com");
const $$PostContent = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$PostContent;
  const { html } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="prose prose-lg dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-lg">${unescapeHTML(html)}</div>`;
}, "/Users/fradotech/Documents/Projects/@frado/blog/src/modules/post/components/PostContent.astro", void 0);

const $$Astro$1 = createAstro("https://example.com");
const $$SuggestionReading = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$SuggestionReading;
  const { posts } = Astro2.props;
  return renderTemplate`${posts.length > 0 && renderTemplate`${maybeRenderHead()}<section class="mt-12">${renderComponent($$result, "SectionHeader", $$SectionHeader, { "title": "You might also like", "href": Path.blog.index, "linkText": "More articles" })}${renderComponent($$result, "PostGrid", $$PostGrid, { "posts": posts, "columns": 2 })}</section>`}`;
}, "/Users/fradotech/Documents/Projects/@frado/blog/src/modules/post/components/SuggestionReading.astro", void 0);

function slugifyHeading(text) {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
}
function extractToc(markdown) {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const items = [];
  let match;
  while ((match = headingRegex.exec(markdown)) !== null) {
    const text = match[2].replace(/\*\*|__|\*|_|`/g, "").trim();
    items.push({ id: slugifyHeading(text), text, level: match[1].length });
  }
  return items;
}
async function renderMarkdown(markdown) {
  const marked = new Marked();
  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const text = tokens.map((t) => "text" in t ? t.text : "").join("");
        const id = slugifyHeading(text);
        return `<h${depth} id="${id}">${this.parser.parseInline(tokens)}</h${depth}>`;
      },
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const isExternal = href.startsWith("http");
        const attrs = isExternal ? ` target="_blank" rel="noopener noreferrer"` : "";
        const titleAttr = title ? ` title="${title}"` : "";
        return `<a href="${href}"${titleAttr}${attrs}>${text}</a>`;
      },
      image({ href, title, text }) {
        const titleAttr = title ? ` title="${title}"` : "";
        return `<img src="${href}" alt="${text}"${titleAttr} loading="lazy" />`;
      },
      code({ text, lang }) {
        if (!lang) {
          return `<pre><code>${escapeHtml(text)}</code></pre>`;
        }
        return `<!--shiki:${lang}--><pre><code class="language-${lang}">${escapeHtml(text)}</code></pre>`;
      }
    }
  });
  let html = await marked.parse(markdown);
  const shikiRegex = /<!--shiki:(\w+)--><pre><code class="language-\w+">([\s\S]*?)<\/code><\/pre>/g;
  const replacements = [];
  let shikiMatch;
  while ((shikiMatch = shikiRegex.exec(html)) !== null) {
    try {
      const code = decodeHtmlEntities(shikiMatch[2]);
      const highlighted = await codeToHtml(code, {
        lang: shikiMatch[1],
        theme: "github-dark"
      });
      replacements.push({ original: shikiMatch[0], highlighted });
    } catch {
      replacements.push({
        original: shikiMatch[0],
        highlighted: shikiMatch[0].replace(/<!--shiki:\w+-->/, "")
      });
    }
  }
  for (const { original, highlighted } of replacements) {
    html = html.replace(original, highlighted);
  }
  return html;
}
function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function decodeHtmlEntities(text) {
  return text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://example.com");
const prerender = false;
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  if (!slug || isReservedSlug(slug)) {
    return Astro2.redirect("/404");
  }
  const post = await getPostBySlug(slug);
  if (!post) {
    return Astro2.redirect("/404");
  }
  const toc = extractToc(post.content);
  const tagSlugs = post.tags.map((t) => t.slug);
  const [html, related, trending, recent] = await Promise.all([
    renderMarkdown(post.content),
    getRelatedPosts(post.slug, tagSlugs),
    getTrendingPosts(5),
    getRecentPosts(4)
  ]);
  const pageUrl = new URL(Path.post.detail(post.slug), Astro2.site).href;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seo.metaDescription,
    image: post.heroImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    url: pageUrl,
    publisher: {
      "@type": "Organization",
      name: SiteConfig.name
    }
  };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": post.seo.metaTitle, "description": post.seo.metaDescription, "ogImage": post.seo.ogImage, "canonicalUrl": post.seo.canonicalUrl, "noIndex": post.seo.noIndex, "type": "article", "publishedAt": post.publishedAt, "updatedAt": post.updatedAt }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([' <script type="application/ld+json">', "<\/script> ", '<article class="max-w-6xl mx-auto px-4 py-8"> ', ' <header class="mb-8"> <div class="mb-4"> ', ' </div> <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight"> ', ' </h1> <div class="mt-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400"> <time', ">", '</time> </div> </header> <div class="aspect-[21/9] rounded-2xl overflow-hidden mb-8 bg-gray-100 dark:bg-gray-800"> <img', "", ' class="w-full h-full object-cover" loading="eager"> </div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-8"> <div class="lg:col-span-2"> ', ' <div class="mt-10 pt-6 border-t border-gray-200/60 dark:border-white/[0.08]"> <div class="flex flex-wrap items-center justify-between gap-4"> ', " ", ' </div> </div> <div class="mt-8"> ', " </div> ", ' </div> <aside class="hidden lg:block"> <div class="sticky top-20 space-y-6"> ', " ", " ", " ", " </div> </aside> </div> </article> "])), unescapeHTML(JSON.stringify(jsonLd)), maybeRenderHead(), renderComponent($$result2, "Breadcrumb", $$Breadcrumb, { "items": [
    { label: "Blog", href: Path.blog.index },
    { label: post.title }
  ] }), renderComponent($$result2, "TagList", $$TagList, { "tags": post.tags, "size": "md" }), post.title, addAttribute(post.publishedAt, "datetime"), formatDate(post.publishedAt), addAttribute(post.heroImage, "src"), addAttribute(post.title, "alt"), renderComponent($$result2, "PostContent", $$PostContent, { "html": html }), renderComponent($$result2, "TagList", $$TagList, { "tags": post.tags, "limit": 10, "size": "md" }), renderComponent($$result2, "ShareButtons", $$ShareButtons, { "url": pageUrl, "title": post.title }), renderComponent($$result2, "AdBanner", $$AdBanner, { "format": "horizontal" }), renderComponent($$result2, "SuggestionReading", $$SuggestionReading, { "posts": related }), renderComponent($$result2, "TableOfContents", $$TableOfContents, { "items": toc }), renderComponent($$result2, "AdBanner", $$AdBanner, { "format": "rectangle" }), renderComponent($$result2, "TrendingList", $$TrendingList, { "posts": trending }), renderComponent($$result2, "RecentPosts", $$RecentPosts, { "posts": recent })) })}`;
}, "/Users/fradotech/Documents/Projects/@frado/blog/src/pages/[slug].astro", void 0);

const $$file = "/Users/fradotech/Documents/Projects/@frado/blog/src/pages/[slug].astro";
const $$url = "/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
