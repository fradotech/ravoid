/* empty css                                  */
import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_e8a2OyHN.mjs';
import 'piccolore';
import { $ as $$StaticPageLayout } from '../chunks/StaticPageLayout_BQEbNzzB.mjs';
import { S as SiteConfig, P as Path } from '../chunks/path.config_Lcn3_rvK.mjs';
export { renderers } from '../renderers.mjs';

const $$About = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "StaticPageLayout", $$StaticPageLayout, { "title": "About", "description": `About ${SiteConfig.name}` }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<p>
Welcome to ${SiteConfig.name}, your trusted source for investment and cryptocurrency insights.
    We provide in-depth analysis, guides, and news to help you make informed financial decisions.
</p> <h2>Our Mission</h2> <p>
We believe that financial education should be accessible to everyone.
    Our team of experienced analysts and writers work to break down complex
    investment topics into clear, actionable content.
</p> <h2>What We Cover</h2> <ul> <li>Cryptocurrency markets and blockchain technology</li> <li>Real estate investment strategies</li> <li>Portfolio management and diversification</li> <li>DeFi protocols and yield strategies</li> <li>Market analysis and trend reports</li> </ul> <h2>Contact</h2> <p>
Have questions or feedback? We would love to hear from you.
    Reach out to us through our <a${addAttribute(Path.contact, "href")}>contact page</a>.
</p> ` })}`;
}, "/Users/fradotech/Documents/Projects/@frado/blog/src/pages/about.astro", void 0);

const $$file = "/Users/fradotech/Documents/Projects/@frado/blog/src/pages/about.astro";
const $$url = "/about";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$About,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
