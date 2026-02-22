/* empty css                                  */
import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_e8a2OyHN.mjs';
import 'piccolore';
import { $ as $$StaticPageLayout } from '../chunks/StaticPageLayout_BQEbNzzB.mjs';
import { S as SiteConfig } from '../chunks/path.config_Lcn3_rvK.mjs';
export { renderers } from '../renderers.mjs';

const $$Terms = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "StaticPageLayout", $$StaticPageLayout, { "title": "Terms of Use", "description": `Terms of use for ${SiteConfig.name}` }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<p><strong>Last updated: February 2026</strong></p> <h2>Acceptance of Terms</h2> <p>
By accessing and using ${SiteConfig.name}, you accept and agree to be bound
    by these terms of use. If you do not agree to these terms, please do not use
    this website.
</p> <h2>Use of Content</h2> <p>
All content published on this website is protected by copyright and other
    intellectual property laws. You may read, download, and print content for
    personal, non-commercial use only. You may not reproduce, distribute, or
    create derivative works without prior written permission.
</p> <h2>User Conduct</h2> <p>
You agree not to use this website for any unlawful purpose or in any way
    that could damage, disable, or impair the website. You also agree not to
    attempt to gain unauthorized access to any part of the website.
</p> <h2>Limitation of Liability</h2> <p>
To the fullest extent permitted by law, ${SiteConfig.name} shall not be liable
    for any indirect, incidental, special, or consequential damages arising from
    your use of this website or any content published on it.
</p> <h2>Changes to Terms</h2> <p>
We reserve the right to modify these terms at any time. Changes will be
    effective immediately upon posting. Your continued use of the website after
    changes constitutes acceptance of the modified terms.
</p> <h2>Governing Law</h2> <p>
These terms shall be governed by and construed in accordance with applicable laws,
    without regard to conflict of law principles.
</p> ` })}`;
}, "/Users/fradotech/Documents/Projects/@frado/blog/src/pages/terms.astro", void 0);

const $$file = "/Users/fradotech/Documents/Projects/@frado/blog/src/pages/terms.astro";
const $$url = "/terms";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Terms,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
