# Ravoid Growth Plan v2 — April 16 to June 16, 2026

**Owner:** Framesta Fernando  
**Last updated:** 2026-04-16 (v2)  
**Changelog:** v2 marks completion of P0.1 (hero images) and P0.2 (broken links). Adds new items for article TTFB optimization and Articles schema warnings investigation. Regroups priorities to reflect remaining work.

**Goal:** Convert current momentum from 2 Opus 4.7 launch-day pieces into measurable traffic + subscriber growth through systematic SEO, content cadence, and distribution discipline.

**Success metrics after 60 days:**

- Organic impressions (GSC): 10x from baseline
- Organic clicks: 5x from baseline
- Newsletter subscribers: +400 net new
- External backlinks from DR30+ domains: 15+ net new
- Avg time-on-page: >3:30 on top 10 posts
- Article publish cadence: 2 per week, sustained
- Article LCP: <2.5s on mobile

---

## PRIORITY FRAMEWORK

- **P0** = Do this week. Blocking or nearly-free wins.
- **P1** = Do within 2 weeks. High-impact foundation.
- **P2** = Month 1. Content and authority building.
- **P3** = Month 2. Growth and distribution optimization.

Each task lists: `effort` (hours), `impact` (1-5), `owner`, `metric`.

---

## COMPLETED (Apr 16)

- ✅ **P0.1** — Hero images uploaded (both 64KB + 88KB WebP, HTTP 200)
- ✅ **P0.2** — Broken `/blog/25, 28, 30` links removed from all articles (0 numeric blog links remain in content bodies)

## P0 — Week 1 (Apr 16-23) — REMAINING

### P0.3 — Add `FAQPage` JSON-LD schema [STILL PENDING — HIGHEST PRIORITY]

- **Why:** Both Opus 4.7 articles already have 5-7 FAQ questions in content but schema still missing. Confirmed via curl grep: `"@type":"FAQPage"` absent on both articles. This is the single highest-ROI SEO win available right now. FAQ rich snippet in SERP can double CTR on comparison queries.
- **Action:**

  ```typescript
  // In article page component (Astro/Next.js)
  function extractFAQs(markdown: string) {
    const regex = /###\s+Q:\s+(.+?)\n+([^#]+?)(?=\n###|\n##|$)/gs;
    const faqs = [];
    let m;
    while ((m = regex.exec(markdown)) !== null) {
      faqs.push({ q: m[1].trim(), a: m[2].trim().replace(/\n+/g, " ") });
    }
    return faqs;
  }

  function buildFAQSchema(faqs) {
    if (!faqs.length) return null;
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    };
  }
  // Inject result into <script type="application/ld+json"> in <head>
  ```

- **Test:** Re-run [Rich Results Test](https://search.google.com/test/rich-results) after deploy. Expected: 3 valid items (Articles + Breadcrumbs + FAQs).
- **Effort:** 2-3 hours
- **Impact:** 5/5
- **Metric:** FAQ rich snippet appears in SERP within 7-14 days for `"claude opus 4.7 cost"` or `"opus 4.7 vision"` queries

### P0.4 — Expose `/tags` in main navigation [pending]

- **Why:** `/tags` returns 200 but not linked from header/footer. Tag pages are high-value entry points once Google indexes them.
- **Action:** Add "Topics" link in header nav between "Blog" and "About". Add tag cloud in footer with top 12 tags by post count.
- **Effort:** 30 min
- **Impact:** 3/5
- **Metric:** `/tags/ai`, `/tags/cost-analysis`, `/tags/vision` indexed in GSC within 14 days

### P0.5 — Submit sitemap to GSC + Bing + Request indexing [pending]

- **Why:** New articles from today need fast discovery for the launch-window search spike.
- **Action:**
  1. GSC → Sitemaps → Submit `https://ravoid.com/sitemap.xml`
  2. Bing Webmaster → Sitemaps → same URL
  3. URL Inspection tool in GSC for manual indexing:
     - `https://ravoid.com/blog/opus-4-7-tokenizer-tax`
     - `https://ravoid.com/blog/opus-4-7-vision-document-ai-collapse`
     - `https://ravoid.com` (homepage refresh)
- **Effort:** 15 min
- **Impact:** 4/5
- **Metric:** Both new articles appear in GSC "Discovered" status within 48 hours

### P0.6 — LinkedIn distribution for both new articles [pending]

- **Why:** SaaS and AI engineering audience lives on LinkedIn. 72-hour amplification window for launch-day pieces.
- **Action:** From Framesta's account, post 3 times:
  - Day 0 (Apr 16): Tokenizer Tax, native post with 3 data points + link
  - Day 1 (Apr 17): Vision Collapse, native post as follow-up angle
  - Day 3 (Apr 19): Carousel (10 slides) summarizing both pieces
- **Effort:** 2 hours
- **Impact:** 5/5
- **Metric:** 100+ reactions, 20+ comments combined across 3 posts

### P0.7 — X thread distribution [pending]

- **Why:** X thread format is already drafted. Post now for max algo boost on launch-day news cycle.
- **Action:**
  - Thread A (Tokenizer Tax) — post Apr 16 evening Jakarta
  - Thread B (Vision Collapse) — post Apr 17 morning Jakarta
  - Pin Thread A on profile for 7 days
  - Tag `@anthropicai` on final tweet of each
- **Effort:** 30 min
- **Impact:** 3/5
- **Metric:** 500+ impressions, 20+ engagements per thread

### P0.8 — Submit Tokenizer Tax to Hacker News [pending]

- **Why:** HN front page = 5-25K visitors. Ravoid's contrarian data-driven angle fits HN taste.
- **Action:**
  1. Create HN account, earn 5-10 karma from thoughtful comments on other threads first
  2. Submit Apr 19 Sunday 18:00 US Pacific = Apr 20 Mon 08:00 Jakarta
  3. Title: `Claude Opus 4.7 quietly raised your AI bill 35% despite "unchanged pricing"`
  4. URL: `https://ravoid.com/blog/opus-4-7-tokenizer-tax`
  5. Engage thoughtfully in comments if it gets traction (no defensive replies)
- **Etiquette:**
  - NO upvote begging in any channel
  - NO self-promotion in comments
  - Reply with "Author here" honestly if someone asks
- **Effort:** 5 min + engagement
- **Impact:** 4/5 (high variance)
- **Metric:** >30 upvotes = success, >100 = front page

### P0.9 — Investigate "Non-critical issues" on Articles schema [NEW]

- **Why:** Rich Results Test showed Articles schema valid but with non-critical warnings. Most likely missing `wordCount`, `image` array with multiple aspect ratios, or `author.url`. Fixing these unlocks full Top Stories carousel eligibility.
- **Action:**
  1. Click "Articles → 1 valid item detected" in Rich Results Test to see detailed warnings
  2. Most likely fixes:
     - Add `wordCount` field in BlogPosting schema
     - Change `image` to array with 3 variants (1:1, 4:3, 16:9)
     - Add `author.url: "https://ravoid.com/about/framesta-fernando"`
     - Add `publisher.logo.width` and `publisher.logo.height`
  3. Re-test after fix
- **Effort:** 1-2 hours
- **Impact:** 4/5
- **Metric:** All warnings cleared in Rich Results Test

### P0.10 — Optimize article TTFB from 1.1s to <600ms [NEW]

- **Why:** Article TTFB measured at 1.1s from Jakarta. Homepage is 400ms, so the difference is article-specific render cost. LCP will suffer, Core Web Vitals will fail on mobile.
- **Action:**
  1. Check if article pages use SSR vs SSG in Astro/Next config
  2. If SSR: move to SSG (static build) for blog posts
  3. If JSON-LD schema is computed per-request, precompute at build time
  4. Enable Vercel ISR with `revalidate: 3600` if dynamic data
  5. Check Lighthouse score on article pages (`lighthouse https://ravoid.com/blog/opus-4-7-tokenizer-tax --view`)
- **Effort:** 2-4 hours
- **Impact:** 4/5
- **Metric:** TTFB < 600ms, LCP < 2.5s on mobile (PageSpeed Insights)

---

## P1 — Week 2-3 (Apr 23 - May 7)

### P1.1 — Content cluster: 2 posts per week, sustained

- **Why:** Google rewards consistency. Current rhythm uneven (14 posts 29 Mar, 0 posts 7-11 Apr).
- **Action:** Lock calendar. Use v3.0 prompt. Suggested: Tuesday + Thursday 09:00 Jakarta.
- **Effort:** 6-8 hours per article
- **Impact:** 5/5
- **Metric:** 8 articles published by May 7, zero skipped slots

### P1.2 — Build Opus 4.7 pillar cluster (7 articles total)

- **Why:** Own the search territory before competitors catch up. Topical authority compounds.
- **Cluster plan:**
  | Slot | Title (working) | Primary KW | Publish |
  |---|---|---|---|
  | Pillar | The Opus 4.7 Tokenizer Tax | claude opus 4.7 cost | ✅ Apr 16 |
  | Supporting 1 | OCR Is Dead: Vision Collapse | claude opus 4.7 vision | ✅ Apr 16 |
  | Supporting 2 | xhigh Effort Trap | opus 4.7 xhigh effort | Apr 22 |
  | Supporting 3 | Opus 4.7 vs Sonnet 4.6 Real-World Math | opus 4.7 vs sonnet 4.6 | Apr 25 |
  | Supporting 4 | Migrating from Opus 4.5 to 4.7 | opus 4.5 to 4.7 migration | Apr 29 |
  | Supporting 5 | Computer-Use Agent Stack After 4.7 | opus 4.7 computer use | May 3 |
  | Supporting 6 | The Prompt Cache Rebuild Hole | opus 4.7 prompt caching | May 6 |
- **Effort:** ~6 hours/article × 5 = 30 hours
- **Impact:** 5/5
- **Metric:** Pillar ranks page 1 for `claude opus 4.7 cost` within 30 days

### P1.3 — Interactive cost calculator at `/tools/opus-4-7-cost-calculator`

- **Why:** Calculators are backlink magnets. Formula from Tokenizer Tax already modeled.
- **Action:** Client-side React calculator. Input: monthly requests, avg input tokens (4.6), avg output tokens (4.6). Output: projected 4.7 cost with breakdown by tokenizer, xhigh effort, cache rebuild. Embed on article + standalone page.
- **Effort:** 8-12 hours
- **Impact:** 4/5
- **Metric:** 500+ sessions/month on calculator; 5+ backlinks from tools listings

### P1.4 — Newsletter lead magnet: "AI Infrastructure Cost Cheatsheet 2026"

- **Why:** Current signup CR is likely <1% because CTA has no value prop.
- **Action:** 2-page PDF with 15 unit-cost benchmarks (Opus 4.7, GPT-5, Sonnet 4.6, Gemini, self-hosted Llama), tokenizer multipliers, cache hit economics. Embed "Get the Cheatsheet" CTA in every article.
- **Effort:** 6 hours
- **Impact:** 4/5
- **Metric:** Newsletter CR > 2.5% of article readers

### P1.5 — Table of Contents + Reading Progress Bar

- **Why:** Articles are 3,500-4,500 words. TOC improves dwell time. Progress bar is a known engagement booster.
- **Action:** Auto-generate TOC from H2s. Sticky sidebar on desktop, collapsible on mobile. Thin horizontal progress bar at top.
- **Effort:** 4 hours
- **Impact:** 3/5
- **Metric:** Avg time-on-page +30% on articles >2000 words

### P1.6 — Functional share buttons

- **Why:** Currently "Share:" label has no buttons. Free distribution lost.
- **Action:** X, LinkedIn, Hacker News, Reddit r/programming, Copy Link. Native share URLs, no third-party JS.
- **Effort:** 2 hours
- **Impact:** 3/5
- **Metric:** 50+ shares/week across top 10 articles

### P1.7 — Newsletter social proof (subscriber count)

- **Why:** "Subscribe" with no indication of audience size converts badly.
- **Action:** Display subscriber count dynamically or hardcode rounded number, update monthly. Format: "Join 1,247 engineering leaders getting this weekly."
- **Effort:** 1 hour
- **Impact:** 3/5
- **Metric:** Newsletter CR improvement week-over-week

### P1.8 — Redirect `/blog/25, 28, 30` to relevant articles instead of /404 [NEW]

- **Why:** Currently these URLs 302 to /404. If any external site still links to them (or if Google cached them), 301 to relevant article preserves any link equity.
- **Action:** Add redirect rules in Vercel config:
  ```json
  {
    "redirects": [
      {
        "source": "/blog/25",
        "destination": "/blog/smart-routing-self-hosted-ai-cost-savings",
        "permanent": true
      },
      {
        "source": "/blog/28",
        "destination": "/blog/why-ai-cost-explodes-after-scale",
        "permanent": true
      },
      {
        "source": "/blog/30",
        "destination": "/blog/openai-vs-self-hosted-llm-cost",
        "permanent": true
      }
    ]
  }
  ```
- **Effort:** 15 min
- **Impact:** 2/5
- **Metric:** 301 instead of 302 → /404 on all three URLs

---

## P2 — Month 1 (May 8 - Jun 8)

### P2.1 — Original benchmark: "Opus 4.7 vs Sonnet 4.6 vs GPT-5.2 Real-World Cost-Per-Decision"

- **Why:** Running own benchmark = defensible originality + magnet for citations.
- **Action:** 3 realistic workloads (ticket classification, doc extraction, agentic code-fix). Run each through 3 models with identical prompts. Publish cost, latency, accuracy tables with raw CSV download.
- **Effort:** 20-30 hours
- **Impact:** 5/5
- **Metric:** 30+ backlinks from tech media in 60 days; cited by at least one major newsletter (Ben's Bites, TLDR AI, Import AI)

### P2.2 — Guest contributor + byline diversification

- **Why:** Single-author blog reads like content farm. Two+ bylines fixes this.
- **Action:** Approach 2-3 engineering leaders for guest piece each over 60 days. Lived-experience topics. Pay $300-500 or link exchange.
- **Effort:** 5 hours recruiting + editing
- **Impact:** 4/5
- **Metric:** 2 published guest posts by Jun 8

### P2.3 — Consolidate weakest existing articles

- **Why:** Thin articles dilute topical authority. Helpful Content System penalizes site-wide average.
- **Action:** GSC analysis on all Jan-Feb 2026 posts. Posts with <50 impressions/month after 90 days: rewrite with real data OR 301 redirect to nearest relevant article and delete.
- **Effort:** 4 hours analysis + 10 hours rewriting
- **Impact:** 4/5
- **Metric:** Site-wide CTR improvement in GSC

### P2.4 — Rewrite `excerpt` field on every article for SEO

- **Why:** Current excerpts too long for meta description slot, no keyword, no hook.
- **Action:** Regenerate excerpt as 150-160 char meta description per article: primary keyword + value prop + friction hook. Update `post.ts`.
- **Effort:** 8 hours across 30+ articles
- **Impact:** 3/5
- **Metric:** SERP CTR improvement

### P2.5 — Internal linking audit + related posts algorithm

- **Why:** Current "You might also like" is hardcoded with same 4 articles everywhere. Topical dead weight.
- **Action:** Refactor related-posts to compute tag Jaccard similarity, return top 4. Audit internal anchor text for keyword relevance.
- **Effort:** 6 hours
- **Impact:** 4/5
- **Metric:** Avg pages per session +40%

### P2.6 — Add `updatedAt` field + quarterly review calendar

- **Why:** AI/infra topics age fast. Google freshness signal rewards `dateModified`.
- **Action:** Add `updatedAt` to PostSource type. Display "Last updated: [date]" top + bottom. Quarterly review for top 10 traffic posts.
- **Effort:** 2 hours structural + ongoing
- **Impact:** 3/5
- **Metric:** Retention rate on evergreen posts

### P2.7 — "About the Data" methodology page

- **Why:** Ravoid claims data-driven but never explains methodology. Single `/methodology` page boosts E-E-A-T for every data-heavy article.
- **Action:** 1200-word page: scenario construction, anonymization standard, estimate flagging, source hierarchy. Link from footer and from each article's data section.
- **Effort:** 3 hours
- **Impact:** 3/5
- **Metric:** Foundational, enables other wins

---

## P3 — Month 2 (Jun 9 - Jul 9)

### P3.1 — YouTube/short-form video

- **Why:** Every article can become 3-5 min video. Different audience, additive not substitutive.
- **Action:** Pick top 5 articles by June GSC impressions. Narrated video explainer each (Loom-style). Embed at top of respective article.
- **Effort:** 3 hours per video × 5 = 15 hours
- **Impact:** 3/5
- **Metric:** Embedded video lifts avg time-on-page 40-60%

### P3.2 — Paid distribution test: LinkedIn + X

- **Why:** After organic foundation is solid, paid test accelerates learning.
- **Action:** $500 split LinkedIn + X, promoting Tokenizer Tax (proven quality). Optimize for engagement + newsletter signup.
- **Effort:** 4 hours
- **Impact:** 2/5 (experiment)
- **Metric:** CAC per newsletter signup < $4

### P3.3 — Newsletter partnership / swap

- **Why:** Network effect. Adjacent newsletters share audience.
- **Action:** Approach 5 newsletters (~1K-10K subs): Pragmatic Engineer, Benn Stancil, Import AI, Last Week in AI, The Diff. Offer content swap.
- **Effort:** 8 hours outreach + content prep
- **Impact:** 3/5
- **Metric:** 3+ reciprocal features; +200 net subscribers

### P3.4 — Launch community (Slack or Discord)

- **Why:** Newsletter is one-way. Community compounds value + UGC indexable for SEO.
- **Action:** Invite-only Discord for first 100 newsletter subs. Weekly digest. Channels: #cost-models, #infrastructure-decisions, #ai-economics, #show-your-stack.
- **Effort:** 10 hours setup + moderation
- **Impact:** 3/5
- **Metric:** 200+ members by Jul 9; 3+ weekly active conversations

### P3.5 — Repackage Opus 4.7 cluster into downloadable report

- **Why:** By Jul, cluster will have 7+ articles on Opus 4.7 economics. Package as 40-page PDF.
- **Action:** Compile, edit for consistency, add exclusive data/charts, gate behind email signup. Announce on LinkedIn.
- **Effort:** 12 hours compilation + design
- **Impact:** 4/5
- **Metric:** 500+ downloads in first 30 days; paid consulting inquiries

### P3.6 — Q2 "State of AI Infrastructure Cost" report

- **Why:** Annual/quarterly reports become link magnets for years.
- **Action:** Survey 200-500 engineering leaders + scraped public data. Q2 2026 focus: Opus 4.7 migration economics, self-hosting adoption, routing patterns. Interactive dashboards.
- **Effort:** 30+ hours
- **Impact:** 5/5
- **Metric:** Cited by 2+ tier-1 publications; 100+ backlinks in 90 days

---

## WEEKLY OPERATIONAL RHYTHM

| Day       | Action                                                                                                                                 |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Monday    | 30-min analytics review. GSC impressions, top pages, new queries. Flag pages with rising impressions + low CTR for title/meta rewrite. |
| Tuesday   | Publish article #1. LinkedIn native post 09:00 Jakarta. Reddit selectively.                                                            |
| Wednesday | Engage with comments on Tue publication. Check backlink acquisitions. Identify reply opportunities.                                    |
| Thursday  | Publish article #2. LinkedIn carousel if applicable.                                                                                   |
| Friday    | Newsletter sends. Summary of week's 2 posts + one exclusive tidbit for subscribers.                                                    |
| Saturday  | Outreach day. 5-10 cold emails: guest posts, partnerships, benchmark participation.                                                    |
| Sunday    | Weekly retro. What moved metrics, what didn't. Adjust next week.                                                                       |

---

## RISKS & MITIGATIONS

| Risk                                                   | Likelihood | Impact | Mitigation                                                                                      |
| ------------------------------------------------------ | ---------- | ------ | ----------------------------------------------------------------------------------------------- |
| Google Helpful Content penalty on AI-generated content | Medium     | High   | Strict v3.0 prompt anti-template rules, add real data/quotes, vary structure, diversify authors |
| Opus 4.7 launch news cycle fatigue within 30 days      | High       | Medium | Cluster strategy captures tail traffic; pivot to evergreen topics in May                        |
| Single-author bottleneck on 2 posts/week               | High       | Medium | Recruit guest contributors by Jun; template discipline enables 4-hour drafts                    |
| HN + Reddit submissions flame out                      | Medium     | Low    | Multiple submissions across 8 weeks. LinkedIn primary channel.                                  |
| Calculator tool adoption below target                  | Medium     | Low    | If <100 sessions/week after 30 days, redirect effort to report lead magnet                      |
| Broken internal links reappear on new articles         | Low        | Medium | Pre-commit hook validates all `ravoid.com/blog/*` URLs against sitemap                          |
| Article TTFB stays high despite P0.10                  | Medium     | Medium | Consider moving to full SSG (removing SSR entirely for blog posts)                              |

---

## METRICS DASHBOARD (Review Weekly)

```
ORGANIC TRAFFIC
- Impressions (GSC)                 ████████░░  Target: 10x baseline
- Clicks (GSC)                      ████░░░░░░  Target: 5x baseline
- Average position                  ░░░░░░░░░░  Target: avg <20 for tracked keywords
- CTR                               ░░░░░░░░░░  Target: >4% on primary keywords

PERFORMANCE
- Article TTFB (Jakarta)            █████████░  Current: 1.1s | Target: <0.6s
- Mobile LCP                        ░░░░░░░░░░  Target: <2.5s
- CLS                               ░░░░░░░░░░  Target: <0.1

NEWSLETTER
- Subscribers (total)               ░░░░░░░░░░  Target: +400 in 60 days
- Signup rate (% of readers)        ░░░░░░░░░░  Target: >2.5%
- Open rate                         ░░░░░░░░░░  Target: >45%

CONTENT
- Articles published                ░░░░░░░░░░  Target: 16 in 60 days
- Articles with FAQPage schema      ░░░░░░░░░░  Target: 100% going forward
- Articles with hero image          ██████████  2/2 new articles ✅
- Avg time-on-page (top 10)         ░░░░░░░░░░  Target: >3:30

AUTHORITY
- Backlinks from DR30+              ░░░░░░░░░░  Target: +15 in 60 days
- Referring domains                 ░░░░░░░░░░  Target: +8 in 60 days
- Mentions in industry newsletters  ░░░░░░░░░░  Target: 3+ in 60 days

DISTRIBUTION
- LinkedIn impressions              ░░░░░░░░░░  Target: 100K+/month
- Shares per article (avg)          ░░░░░░░░░░  Target: >25
- HN submission score               ░░░░░░░░░░  Target: >30 on best post
```

Fill weekly. Monthly roll-up with trend analysis.

---

## TOOLING SHOPPING LIST

- ✅ Google Search Console (free, setup done)
- ⬜ Bing Webmaster (free, part of P0.5)
- ⬜ **Ahrefs** or **SEMrush** for backlink + keyword tracking ($99-199/mo)
- ✅ GA4 (installed, tracking confirmed: `G-PV5NVMJBH4`)
- ⬜ Newsletter platform with better analytics (**Beehiiv** recommended) if current is weak
- ⬜ Lighthouse / PageSpeed Insights (free, run as part of P0.10)
- ⬜ **lychee** or **Screaming Frog** for broken-link checking (free tier)
- ⬜ HN account creation (free, part of P0.8)

---

## NEXT ACTION — TODAY

Minimum viable execution in next 3 hours:

1. **[15 min]** Submit sitemap to GSC + Bing, Request Indexing for both Opus articles (P0.5)
2. **[30 min]** Post LinkedIn native for Tokenizer Tax (P0.6 Day 0)
3. **[30 min]** Post X Thread A for Tokenizer Tax (P0.7)
4. **[15 min]** Expose `/tags` in header navigation (P0.4)

Remaining P0 items can be scheduled across this week.

---

## SINGLE SENTENCE STRATEGIC FRAME

> Ravoid wins if it becomes the reference publication that engineering leaders forward to their CFO when defending AI infrastructure decisions. Everything in this plan ladders up to that.
