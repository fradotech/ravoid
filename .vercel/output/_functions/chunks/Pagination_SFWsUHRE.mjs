import { e as createAstro, f as createComponent, m as maybeRenderHead, h as addAttribute, r as renderTemplate } from './astro/server_e8a2OyHN.mjs';
import 'piccolore';
import 'clsx';

const $$Astro = createAstro("https://example.com");
const $$Pagination = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Pagination;
  const { currentPage, totalPages, baseUrl, preserveParams = {} } = Astro2.props;
  function buildPageUrl(page) {
    const url = new URL(baseUrl, "http://localhost");
    Object.entries(preserveParams).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });
    if (page > 1) {
      url.searchParams.set("page", String(page));
    } else {
      url.searchParams.delete("page");
    }
    return `${url.pathname}${url.search}`;
  }
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || i >= currentPage - 1 && i <= currentPage + 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }
  return renderTemplate`${totalPages > 1 && renderTemplate`${maybeRenderHead()}<nav aria-label="Pagination" class="flex items-center justify-center gap-1 mt-8">${currentPage > 1 && renderTemplate`<a${addAttribute(buildPageUrl(currentPage - 1), "href")} class="px-3 py-2 text-sm rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
Prev
</a>`}${pages.map(
    (page) => page === "..." ? renderTemplate`<span class="px-2 py-2 text-sm text-gray-400 dark:text-gray-600">...</span>` : renderTemplate`<a${addAttribute(buildPageUrl(page), "href")}${addAttribute([
      "px-3 py-2 text-sm rounded-lg transition-colors",
      page === currentPage ? "bg-blue-600 text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
    ], "class:list")}${addAttribute(page === currentPage ? "page" : void 0, "aria-current")}>${page}</a>`
  )}${currentPage < totalPages && renderTemplate`<a${addAttribute(buildPageUrl(currentPage + 1), "href")} class="px-3 py-2 text-sm rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
Next
</a>`}</nav>`}`;
}, "/Users/fradotech/Documents/Projects/@frado/blog/src/infrastructure/components/ui/Pagination.astro", void 0);

export { $$Pagination as $ };
