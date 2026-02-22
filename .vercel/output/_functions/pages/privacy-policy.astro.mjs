/* empty css                                  */
import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_e8a2OyHN.mjs';
import 'piccolore';
import { $ as $$StaticPageLayout } from '../chunks/StaticPageLayout_BQEbNzzB.mjs';
import { S as SiteConfig, P as Path } from '../chunks/path.config_Lcn3_rvK.mjs';
export { renderers } from '../renderers.mjs';

const $$PrivacyPolicy = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "StaticPageLayout", $$StaticPageLayout, { "title": "Privacy Policy", "description": `Privacy policy for ${SiteConfig.name}` }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<p><strong>Last updated: February 2026</strong></p> <h2>Information We Collect</h2> <p>
When you visit ${SiteConfig.name}, we may collect certain information automatically,
    including your IP address, browser type, referring URLs, and pages visited.
    This information is used to analyze trends and improve our website.
</p> <h2>Cookies</h2> <p>
We use cookies and similar technologies to enhance your browsing experience,
    remember your preferences (such as dark mode settings), and serve relevant
    advertisements. You can control cookie settings through your browser.
</p> <h2>Third-Party Advertising</h2> <p>
We use third-party advertising companies to serve ads when you visit our website.
    These companies may use information about your visits to this and other websites
    to provide relevant advertisements. This may include the use of cookies and
    similar technologies.
</p> <h2>Analytics</h2> <p>
We may use third-party analytics services to help us understand how visitors
    use our website. These services collect information sent by your browser,
    including your IP address and the pages you visit.
</p> <h2>Data Security</h2> <p>
We take reasonable measures to protect your information. However, no method of
    transmission over the Internet or electronic storage is 100% secure.
</p> <h2>Changes to This Policy</h2> <p>
We may update this privacy policy from time to time. We will notify you of any
    changes by posting the new policy on this page and updating the "Last updated" date.
</p> <h2>Contact</h2> <p>
If you have any questions about this privacy policy, please contact us
    through our <a${addAttribute(Path.contact, "href")}>contact page</a>.
</p> ` })}`;
}, "/Users/fradotech/Documents/Projects/@frado/blog/src/pages/privacy-policy.astro", void 0);

const $$file = "/Users/fradotech/Documents/Projects/@frado/blog/src/pages/privacy-policy.astro";
const $$url = "/privacy-policy";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$PrivacyPolicy,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
