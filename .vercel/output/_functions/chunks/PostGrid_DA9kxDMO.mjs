import { e as createAstro, f as createComponent, m as maybeRenderHead, h as addAttribute, r as renderTemplate, k as renderComponent } from './astro/server_e8a2OyHN.mjs';
import 'piccolore';
import { P as Path } from './path.config_Lcn3_rvK.mjs';
import { t as truncate } from './format.util_CfTDCMbb.mjs';
import 'clsx';

function formatDate(dateString) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

const $$Astro$3 = createAstro("https://example.com");
const $$TagBadge = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$TagBadge;
  const { name, slug, size = "sm" } = Astro2.props;
  const sizeClasses = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3.5 py-1 text-sm"
  };
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(Path.tags.detail(slug), "href")}${addAttribute(["tag-outline", sizeClasses[size]], "class:list")}> ${name} </a>`;
}, "/Users/fradotech/Documents/Projects/@frado/blog/src/infrastructure/components/blog/TagBadge.astro", void 0);

const $$Astro$2 = createAstro("https://example.com");
const $$TagList = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$TagList;
  const { tags, limit = 3, size = "sm" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="flex flex-wrap gap-1.5"> ${tags.slice(0, limit).map((tag) => renderTemplate`${renderComponent($$result, "TagBadge", $$TagBadge, { "name": tag.name, "slug": tag.slug, "size": size })}`)} </div>`;
}, "/Users/fradotech/Documents/Projects/@frado/blog/src/infrastructure/components/blog/TagList.astro", void 0);

const $$Astro$1 = createAstro("https://example.com");
const $$PostCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$PostCard;
  const { post } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<article class="group glass-card overflow-hidden"> <a${addAttribute(Path.post.detail(post.slug), "href")} class="block"> <div class="aspect-video overflow-hidden"> <img${addAttribute(post.thumbnail, "src")}${addAttribute(post.title, "alt")} class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" loading="lazy"> </div> </a> <div class="p-5"> <div class="mb-3"> ${renderComponent($$result, "TagList", $$TagList, { "tags": post.tags })} </div> <a${addAttribute(Path.post.detail(post.slug), "href")} class="block"> <h3 class="font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug tracking-tight"> ${post.title} </h3> </a> <p class="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed"> ${truncate(post.excerpt, 140)} </p> <time class="block mt-4 text-xs text-gray-400 dark:text-gray-500"${addAttribute(post.publishedAt, "datetime")}> ${formatDate(post.publishedAt)} </time> </div> </article>`;
}, "/Users/fradotech/Documents/Projects/@frado/blog/src/infrastructure/components/blog/PostCard.astro", void 0);

const $$Astro = createAstro("https://example.com");
const $$PostGrid = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PostGrid;
  const { posts, columns = 3 } = Astro2.props;
  const gridClasses = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
  };
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(["grid gap-6", gridClasses[columns]], "class:list")}> ${posts.map((post) => renderTemplate`${renderComponent($$result, "PostCard", $$PostCard, { "post": post })}`)} </div>`;
}, "/Users/fradotech/Documents/Projects/@frado/blog/src/infrastructure/components/blog/PostGrid.astro", void 0);

export { $$PostGrid as $, $$TagList as a, $$TagBadge as b, formatDate as f };
