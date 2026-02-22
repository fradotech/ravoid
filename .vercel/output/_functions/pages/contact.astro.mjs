/* empty css                                  */
import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_e8a2OyHN.mjs';
import 'piccolore';
import { $ as $$StaticPageLayout } from '../chunks/StaticPageLayout_BQEbNzzB.mjs';
import { S as SiteConfig } from '../chunks/path.config_Lcn3_rvK.mjs';
export { renderers } from '../renderers.mjs';

const $$Contact = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "StaticPageLayout", $$StaticPageLayout, { "title": "Contact", "description": `Get in touch with ${SiteConfig.name}` }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<p>
We value your feedback and are always happy to hear from our readers.
    Whether you have a question, suggestion, or business inquiry, feel free to reach out.
</p> <h2>Get in Touch</h2> <ul> <li>Email: <a href="mailto:hello@example.com">hello@example.com</a></li> </ul> <h2>Business Inquiries</h2> <p>
For advertising, partnerships, or other business-related inquiries,
    please email us at <a href="mailto:business@example.com">business@example.com</a>.
</p> <h2>Follow Us</h2> <p>
Stay connected and follow us on social media for the latest updates and insights.
</p> ` })}`;
}, "/Users/fradotech/Documents/Projects/@frado/blog/src/pages/contact.astro", void 0);

const $$file = "/Users/fradotech/Documents/Projects/@frado/blog/src/pages/contact.astro";
const $$url = "/contact";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Contact,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
