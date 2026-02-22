import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, n as renderSlot } from './astro/server_e8a2OyHN.mjs';
import 'piccolore';
import { $ as $$BaseLayout } from './BaseLayout_CQoz6Qiq.mjs';

const $$Astro = createAstro("https://example.com");
const $$StaticPageLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$StaticPageLayout;
  const { title, description } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": title, "description": description }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-3xl mx-auto px-4 py-8"> <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">${title}</h1> <div class="prose prose-lg dark:prose-invert max-w-none"> ${renderSlot($$result2, $$slots["default"])} </div> </div> ` })}`;
}, "/Users/fradotech/Documents/Projects/@frado/blog/src/infrastructure/components/layout/StaticPageLayout.astro", void 0);

export { $$StaticPageLayout as $ };
