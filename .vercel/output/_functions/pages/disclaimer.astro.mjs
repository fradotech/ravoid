/* empty css                                  */
import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_e8a2OyHN.mjs';
import 'piccolore';
import { $ as $$StaticPageLayout } from '../chunks/StaticPageLayout_BQEbNzzB.mjs';
import { S as SiteConfig } from '../chunks/path.config_Lcn3_rvK.mjs';
export { renderers } from '../renderers.mjs';

const $$Disclaimer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "StaticPageLayout", $$StaticPageLayout, { "title": "Disclaimer", "description": `Investment disclaimer for ${SiteConfig.name}` }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<p><strong>Last updated: February 2026</strong></p> <h2>General Information</h2> <p>
The information provided on ${SiteConfig.name} is for general informational and
    educational purposes only. It is not intended as, and should not be construed as,
    financial, investment, legal, or tax advice.
</p> <h2>Not Financial Advice</h2> <p>
The content published on this website does not constitute financial advice,
    investment advice, trading advice, or any other form of professional advice.
    You should not make any financial decision based solely on the information
    provided on this website.
</p> <h2>Risk Warning</h2> <p>
Investing in cryptocurrencies, real estate, and other financial instruments
    involves significant risk, including the potential loss of your entire investment.
    Past performance is not indicative of future results. Always do your own research
    and consult with a qualified financial advisor before making investment decisions.
</p> <h2>No Guarantees</h2> <p>
We make no representations or warranties of any kind, express or implied,
    about the completeness, accuracy, reliability, or suitability of the information
    contained on this website. Any reliance you place on such information is strictly
    at your own risk.
</p> <h2>Third-Party Links</h2> <p>
This website may contain links to third-party websites or services that are not
    owned or controlled by ${SiteConfig.name}. We have no control over, and assume no
    responsibility for, the content, privacy policies, or practices of any third-party
    websites or services.
</p> ` })}`;
}, "/Users/fradotech/Documents/Projects/@frado/blog/src/pages/disclaimer.astro", void 0);

const $$file = "/Users/fradotech/Documents/Projects/@frado/blog/src/pages/disclaimer.astro";
const $$url = "/disclaimer";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Disclaimer,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
