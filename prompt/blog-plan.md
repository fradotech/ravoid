# Ravoid Growth Plan — April 16 to June 16, 2026

**Owner:** Framesta Fernando  
**Last updated:** 2026-04-16  
**Goal:** Convert current momentum from 2 Opus 4.7 launch-day pieces into measurable traffic + subscriber growth through systematic SEO, content cadence, and distribution discipline.

**Success metrics after 60 days:**

- Organic impressions (GSC): 10x from baseline
- Organic clicks: 5x from baseline
- Newsletter subscribers: +400 net new
- External backlinks from DR30+ domains: 15+ net new
- Avg time-on-page: >3:30 on top 10 posts
- Article publish cadence: 2 per week, sustained

---

## PRIORITY FRAMEWORK

- **P0** = Do this week. Blocking traffic potential right now.
- **P1** = Do within 2 weeks. High-impact foundation.
- **P2** = Month 1. Content and authority building.
- **P3** = Month 2. Growth and distribution optimization.

Each task lists: `effort` (hours), `impact` (1-5), `owner`, `metric`.

---

## P0 — Week 1 (Apr 16-23)

### P0.1 — Upload 2 hero images for Opus 4.7 articles

- **Why:** OG meta tag references `/images/posts/opus-4-7-tokenizer-tax.webp` and `/images/posts/opus-4-7-vision-document-ai-collapse.webp`. If missing, LinkedIn/X/FB shares render as broken preview. Kills CTR on the highest-velocity distribution window (launch day + 7 days).
- **Action:** Generate both images using prompts already prepared. Upload to `/public/images/posts/`. Generate OG variant (1200×630) alongside hero (1920×1080).
- **Verify:** `curl -I https://ravoid.com/images/posts/opus-4-7-tokenizer-tax.webp` returns 200 with `content-type: image/webp`.
- **Effort:** 1 hour
- **Impact:** 5/5
- **Metric:** LinkedIn preview shows hero image (not generic OG default)

### P0.2 — Fix broken internal links `/blog/25`, `/blog/28`, `/blog/30`

- **Why:** These still 302 to `/404`. Likely AI-generated placeholders that got published. They hurt UX and bleed PageRank.
- **Action:**
  ```bash
  grep -rn "ravoid\.com/blog/[0-9]\+" src/content/posts/
  ```
  Replace each numeric link with a real slug or remove the sentence entirely.
- **Effort:** 30 min
- **Impact:** 4/5
- **Metric:** All blog URLs return 200 when crawled

### P0.3 — Add `FAQPage` JSON-LD schema to articles with FAQ sections

- **Why:** The 2 new Opus 4.7 articles already have 5-7 FAQ questions in markdown but no schema markup. This is the biggest SEO win per hour of effort available right now. FAQ rich snippet in SERP doubles CTR on comparison queries.
- **Action:** Modify the article rendering component to parse `### Q:` headings + following paragraphs and inject FAQPage JSON-LD in `<head>`. Or add FAQ data as separate field in `post.ts`.
- **Test:** [Google Rich Results Test](https://search.google.com/test/rich-results) for both Opus 4.7 articles.
- **Effort:** 2-3 hours
- **Impact:** 5/5
- **Metric:** FAQ rich snippet appears within 7 days on `"claude opus 4.7 cost"` query

### P0.4 — Expose `/tags` in main navigation

- **Why:** `/tags` already returns 200 but isn't linked from header or footer. Tag pages are high-value entry points once Google indexes them.
- **Action:** Add "Topics" link in header nav between "Blog" and "About". Add tag cloud in footer with top 12 tags by post count.
- **Effort:** 30 min
- **Impact:** 3/5
- **Metric:** `/tags/ai`, `/tags/cost-analysis`, `/tags/vision` indexed in GSC within 14 days

### P0.5 — Submit updated sitemap to Google Search Console + Bing Webmaster

- **Why:** New articles from today need to be discovered fast for the launch-window search spike.
- **Action:**
  1. GSC → Sitemaps → Add `https://ravoid.com/sitemap.xml`
  2. Bing WM → Sitemaps → same
  3. Use URL Inspection tool to manually request indexing for both Opus 4.7 articles
  4. Also request indexing for homepage (tag changes)
- **Effort:** 15 min
- **Impact:** 4/5
- **Metric:** Both new articles showing in GSC "Discovered" within 48 hours

### P0.6 — LinkedIn distribution for both new articles

- **Why:** SaaS and AI engineering audience lives on LinkedIn. Launch-day pieces have 72-hour amplification window.
- **Action:** Create 2 LinkedIn posts from Framesta's account:
  - Day 0: Tokenizer Tax piece, native post with 3 data points + link
  - Day 1: Vision Collapse piece, native post as "follow-up angle"
  - Day 3: Carousel summarizing both pieces (10 slides)
- **Effort:** 2 hours
- **Impact:** 5/5
- **Metric:** 100+ reactions, 20+ comments combined across 3 posts

### P0.7 — Submit Tokenizer Tax to Hacker News

- **Why:** HN Show HN / front page drives 5-20K visitors in 24h if it hits. Tokenizer Tax angle is exactly the shape HN rewards (contrarian technical take, data-driven, timely).
- **Action:** Submit Sunday evening US Pacific (roughly Monday morning Jakarta) as `"Claude Opus 4.7 quietly raised your AI bill 35% despite 'unchanged pricing'"`. Link directly to article, not homepage.
- **Effort:** 5 min + engagement if it hits
- **Impact:** 4/5 (high variance)
- **Metric:** >30 upvotes = success, >100 = front page

---

## P1 — Week 2-3 (Apr 23 - May 7)

### P1.1 — Content cluster: commit to 2 posts per week

- **Why:** Consistency > spikes. Google rewards freshness signal + topical depth. Current rhythm is uneven (14 posts on 29 Mar, 0 posts on 7-11 Apr).
- **Action:** Lock publication calendar for May. Use the v3.0 prompt for all new content. Suggested slots: Tuesday + Thursday morning Jakarta time.
- **Effort:** 6-8 hours per article (research + draft + edit + publish)
- **Impact:** 5/5
- **Metric:** 8 articles published by May 7, zero skipped slots

### P1.2 — Build content cluster around "Opus 4.7 cost" as pillar

- **Why:** Two launch-day pieces are already high-value. Cluster them with 5-6 supporting pieces to own the entire search territory before competitors catch up.
- **Planned cluster:**
  | Slot | Title (working) | Primary keyword | Status |
  |---|---|---|---|
  | Pillar | The Opus 4.7 Tokenizer Tax | `claude opus 4.7 cost` | ✅ Published |
  | Supporting 1 | OCR Is Dead: Opus 4.7 Vision Collapse | `claude opus 4.7 vision` | ✅ Published |
  | Supporting 2 | xhigh Effort Trap: The Default That Triples Agent Bills | `opus 4.7 xhigh effort` | Draft Apr 22 |
  | Supporting 3 | Opus 4.7 vs Sonnet 4.6: Real Cost-Per-Outcome Math | `opus 4.7 vs sonnet 4.6` | Draft Apr 25 |
  | Supporting 4 | Opus 4.7 Migration Guide for Teams on Opus 4.5 | `opus 4.5 to 4.7 migration` | Draft Apr 29 |
  | Supporting 5 | The Computer-Use Agent Stack After Opus 4.7 | `opus 4.7 computer use` | Draft May 3 |
  | Supporting 6 | Prompt Cache Rebuild: The 2-Week Cost Hole | `opus 4.7 prompt caching` | Draft May 6 |
- **Effort:** ~6 hours/article × 5 = 30 hours
- **Impact:** 5/5
- **Metric:** Pillar article ranks page 1 for `claude opus 4.7 cost` within 30 days

### P1.3 — Interactive cost calculator tool

- **Why:** Calculators are backlink magnets. Tokenizer Tax article has a formula already. Wrap it in a tool at `/tools/opus-4-7-cost-calculator`.
- **Action:** Build simple client-side React calculator: input monthly requests, avg input tokens, avg output tokens on Opus 4.6 → outputs projected Opus 4.7 cost delta with breakdown by tokenizer, xhigh, cache rebuild. Embed on Tokenizer Tax article + standalone page.
- **Effort:** 8-12 hours
- **Impact:** 4/5
- **Metric:** 500+ sessions/month on calculator page within 30 days; 5+ natural backlinks from tools listings

### P1.4 — Newsletter lead magnet: "AI Infrastructure Cost Cheatsheet 2026"

- **Why:** Current newsletter form has zero value prop beyond "weekly insights." Competitor blogs convert at 3-5% with a lead magnet; Ravoid likely under 1%.
- **Action:** 2-page PDF with 15 unit-cost benchmarks (Opus 4.7, GPT-5, Sonnet 4.6, Gemini, self-hosted Llama), tokenizer multipliers, cache hit economics. Embed CTA "Get the Cheatsheet" in every article.
- **Effort:** 6 hours (design + content)
- **Impact:** 4/5
- **Metric:** Newsletter signup rate >2.5% of article readers

### P1.5 — Add Table of Contents + Reading Progress Bar

- **Why:** Articles are 3,500-4,500 words. Without TOC, dwell time suffers. Progress bar is a known engagement booster.
- **Action:** Auto-generate TOC from H2s, sticky in sidebar on desktop, collapsible at top on mobile. Thin horizontal progress bar at top of viewport.
- **Effort:** 4 hours
- **Impact:** 3/5
- **Metric:** Avg time-on-page +30% on articles >2000 words

### P1.6 — Share buttons functional (currently `Share:` label has no buttons)

- **Why:** Each share is free distribution. Currently zero amplification mechanism on-page.
- **Action:** Add X (formerly Twitter), LinkedIn, Hacker News, Reddit r/programming, Copy Link. Use native URLs, no third-party JS.
- **Effort:** 2 hours
- **Impact:** 3/5
- **Metric:** 50+ shares/week across top 10 articles

### P1.7 — Add social proof to newsletter CTA (subscriber count)

- **Why:** "Subscribe" with no indication of audience size converts badly. Adding "Join 1,247 engineering leaders" lifts CR 20-40%.
- **Action:** Pull subscriber count from newsletter provider (Beehiiv / ConvertKit / etc) to display dynamically, or hardcode rounded number and update monthly.
- **Effort:** 1 hour
- **Impact:** 3/5
- **Metric:** Newsletter CR improvement measured week-over-week

---

## P2 — Month 1 (May 8 - Jun 8)

### P2.1 — Original benchmark: "Opus 4.7 vs Sonnet 4.6 vs GPT-5.2 Real-World Cost-Per-Decision"

- **Why:** Ravoid cites Anthropic's numbers. Running your own benchmark with published methodology gives defensible originality + attracts citations from other blogs and newsletters. This is the single highest-leverage authority move.
- **Action:** Pick 3 realistic workloads (ticket classification, doc extraction, agentic code-fix). Run each through 3 models with identical prompts. Publish cost, latency, accuracy tables with raw data as CSV download.
- **Effort:** 20-30 hours (infrastructure + running + analysis + write-up)
- **Impact:** 5/5
- **Metric:** 30+ backlinks from tech media within 60 days; cited by at least one major newsletter (Ben's Bites, TLDR AI, Import AI)

### P2.2 — Guest contributor + byline diversification

- **Why:** Single-author blog reads like content farm to Google's Helpful Content System. Two bylines fixes this and expands network effect.
- **Action:** Approach 2-3 engineering leaders in network for one guest piece each over 60 days. Topics they have lived experience on (not generic takes). Include their LinkedIn + company, pay $300-500 per piece or link exchange.
- **Effort:** 5 hours recruiting + editing
- **Impact:** 4/5
- **Metric:** 2 published guest posts by Jun 8

### P2.3 — Consolidate weakest existing articles

- **Why:** Articles like `best-crm-alternatives-startups`, `ai-saas-evaluation-framework-product-hunt`, and similar thin pieces dilute topical authority. Helpful Content System penalizes sites whose worst content pulls average quality down.
- **Action:** Run GSC analysis on all posts from Jan-Feb 2026. Any post with <50 impressions/month after 90 days: either rewrite with real data or 301 redirect to closest relevant article and delete. Target: cut 6-8 weakest posts.
- **Effort:** 4 hours analysis + 10 hours rewriting
- **Impact:** 4/5 (negative-impact removal, quality compounds)
- **Metric:** Overall site-wide CTR improvement in GSC

### P2.4 — Rewrite `excerpt` field on every article for SEO

- **Why:** Current excerpts are written for the site, not for SERP meta description. Most are too long, no keyword, no hook.
- **Action:** For each article, regenerate excerpt as 150-160 char meta description: primary keyword + value prop + friction hook. Update `post.ts` files.
- **Effort:** 8 hours across 30+ articles
- **Impact:** 3/5
- **Metric:** SERP CTR improvement, tracked in GSC

### P2.5 — Internal linking audit + optimization

- **Why:** Current "You might also like" section appears hardcoded with same 4 articles across all posts (SaaS Pricing Models, Notion vs Obsidian, Build vs Buy, Stripe Alternatives). This is topical dead weight.
- **Action:** Refactor related-posts to compute overlap by tag Jaccard similarity, return top 4. Also audit internal anchor text: replace generic phrases like "this article" with keyword-rich anchors.
- **Effort:** 6 hours
- **Impact:** 4/5
- **Metric:** Avg pages per session +40%; internal PageRank flow improved

### P2.6 — Add `Last updated` field + auto-refresh logic

- **Why:** AI / infrastructure topics age in 2-3 months. Google freshness signal rewards `dateModified`. Users trust pieces with visible update history.
- **Action:** Add `updatedAt` to PostSource type. Display "Last updated: [date]" at top and bottom of each article. Set a quarterly review calendar for top 10 traffic posts.
- **Effort:** 2 hours structural + ongoing
- **Impact:** 3/5
- **Metric:** Retention rate on evergreen posts

### P2.7 — Publish an "About the Data" methodology page

- **Why:** Ravoid claims data-driven content but never explains methodology. A single authoritative `/methodology` page boosts E-E-A-T for every data-heavy article that links to it.
- **Action:** 1200-word page explaining: how scenarios are constructed, anonymization standard, when estimates are flagged, source weighting hierarchy (vendor docs > independent benchmarks > expert quotes > anonymized case studies). Link from footer.
- **Effort:** 3 hours
- **Impact:** 3/5
- **Metric:** Foundational, hard to measure directly, enables other wins

---

## P3 — Month 2 (Jun 9 - Jul 9)

### P3.1 — YouTube / short-form video presence

- **Why:** Every existing article can become a 3-5 minute video. Retention audience is different from SERP audience, additive not substitutive. Low cost with AI-assisted editing.
- **Action:** Pick top 5 articles by GSC impressions in June. Create 3-5 min narrated video explainer each (Loom-style, screen + voice). Publish to YouTube + embed at top of respective article.
- **Effort:** 3 hours per video × 5 = 15 hours
- **Impact:** 3/5
- **Metric:** Embedded video on top articles lifts avg time-on-page 40-60%

### P3.2 — Paid distribution test: LinkedIn Sponsored + X Promoted Posts

- **Why:** After organic foundation is solid, paid test accelerates learning. Small budget exposes highest-converting articles and topics.
- **Action:** $500 budget across LinkedIn + X for Tokenizer Tax piece (proven high-quality). Optimize for engagement + newsletter signup. Track CAC per subscriber.
- **Effort:** 4 hours setup + monitoring
- **Impact:** 2/5 (experiment, not reliable channel yet)
- **Metric:** CAC per newsletter signup <$4

### P3.3 — Partnership: Newsletter swaps with adjacent publications

- **Why:** Network effect. Adjacent newsletters (engineering economics, SaaS metrics, AI infrastructure) have audience overlap without competing.
- **Action:** Approach 5 newsletters with similar audience (~1K-10K subscribers). Offer content swap: they feature Ravoid article, Ravoid features theirs. Start with: The Pragmatic Engineer, Benn Stancil, Import AI, Last Week in AI, The Diff.
- **Effort:** 8 hours outreach + content prep
- **Impact:** 3/5
- **Metric:** 3+ reciprocal features confirmed; +200 net subscribers

### P3.4 — Launch Ravoid Slack / Discord community

- **Why:** Newsletter is one-way. Community creates compounding value + UGC for SEO (public channels indexable).
- **Action:** Start with invite-only Discord for first 100 newsletter subscribers. Weekly digest. Channels: #cost-models, #infrastructure-decisions, #ai-economics, #show-your-stack.
- **Effort:** 10 hours setup + ongoing moderation
- **Impact:** 3/5
- **Metric:** 200+ members by Jul 9; 3+ weekly active conversations

### P3.5 — Repackage Opus 4.7 cluster into downloadable report

- **Why:** By Jul, cluster will have 7+ articles on Opus 4.7 economics. Package as 40-page PDF "The Opus 4.7 Production Handbook" → lead magnet + consulting funnel.
- **Action:** Compile, edit for consistency, add exclusive data/charts, gate behind email signup. Promote on LinkedIn as announcement.
- **Effort:** 12 hours compilation + design
- **Impact:** 4/5
- **Metric:** 500+ downloads in first 30 days; conversion to paid consulting inquiry

### P3.6 — Quarterly "State of AI Infrastructure Cost" report

- **Why:** Definitive annual/quarterly report becomes link-magnet for years. Tom Tunguz, a16z, and Menlo VC all use this playbook.
- **Action:** Survey 200-500 engineering leaders in network + scraped public data. Q2 2026 report focuses on Opus 4.7 migration economics, self-hosting adoption, routing patterns. Publish with interactive dashboards.
- **Effort:** 30+ hours
- **Impact:** 5/5
- **Metric:** Cited by at least 2 tier-1 publications (VentureBeat, TechCrunch, The Information); 100+ backlinks within 90 days

---

## WEEKLY OPERATIONAL RHYTHM

**Monday:** 30-min analytics review. Check GSC impressions, top pages, new queries. Identify any pages with rising impressions but low CTR — those need title/meta rewrites.

**Tuesday:** Publish article #1 of the week. LinkedIn native post at 9am Jakarta. Submit to relevant subreddits if fitting.

**Wednesday:** Engage with comments on Tuesday's publication. Check backlink acquisitions in Ahrefs/SEMrush. Identify reply opportunities.

**Thursday:** Publish article #2 of the week. LinkedIn carousel format if applicable.

**Friday:** Newsletter goes out. Summary of week's 2 posts + one extra tidbit (chart, quote, stat) exclusive to subscribers.

**Saturday:** Outreach day. 5-10 cold outreach emails for guest posts, partnerships, or benchmarking participation.

**Sunday:** Week's retrospective. What moved metrics, what didn't. Adjust next week's plan.

---

## RISKS & MITIGATIONS

| Risk                                                 | Likelihood | Impact | Mitigation                                                                                         |
| ---------------------------------------------------- | ---------- | ------ | -------------------------------------------------------------------------------------------------- |
| AI-generated content detection penalty from Google   | Medium     | High   | Strict adherence to v3.0 prompt anti-template rules; add real data and real quotes; vary structure |
| Opus 4.7 launch news cycle saturation within 30 days | High       | Medium | Cluster strategy captures tail traffic; pivot to evergreen topics in May                           |
| Single-author bottleneck on 2 posts/week             | High       | Medium | Recruit guest contributors by Jun; template discipline enables 4-hour drafts                       |
| Hacker News + Reddit submissions flame out           | Medium     | Low    | Multiple submissions across 8 weeks; LinkedIn is primary, HN is bonus                              |
| Calculator tool adoption below target                | Medium     | Low    | If <100 sessions/week after 30 days, redirect effort to report-style lead magnet                   |
| Broken internal links reappear on new articles       | Medium     | Medium | Pre-commit hook that validates all `ravoid.com/blog/*` URLs against sitemap                        |

---

## METRICS DASHBOARD (Review Weekly)

```
ORGANIC TRAFFIC
- Impressions (GSC)                 ████████░░  Target: 10x baseline
- Clicks (GSC)                      ████░░░░░░  Target: 5x baseline
- Average position                  ░░░░░░░░░░  Target: avg <20 for tracked keywords
- CTR                               ░░░░░░░░░░  Target: >4% on primary keywords

NEWSLETTER
- Subscribers (total)               ░░░░░░░░░░  Target: +400 in 60 days
- Signup rate (% of readers)        ░░░░░░░░░░  Target: >2.5%
- Open rate                         ░░░░░░░░░░  Target: >45%

CONTENT
- Articles published                ░░░░░░░░░░  Target: 16 in 60 days
- Articles with FAQPage schema      ░░░░░░░░░░  Target: 100% going forward
- Avg time-on-page (top 10)         ░░░░░░░░░░  Target: >3:30

AUTHORITY
- Backlinks from DR30+              ░░░░░░░░░░  Target: +15 in 60 days
- Referring domains                 ░░░░░░░░░░  Target: +8 in 60 days
- Mentions in industry newsletters  ░░░░░░░░░░  Target: 3+ in 60 days

DISTRIBUTION
- LinkedIn impressions              ░░░░░░░░░░  Target: 100K+/month
- Shares per article (avg)          ░░░░░░░░░░  Target: >25
```

Fill weekly. Monthly roll-up with trend analysis.

---

## TOOLING SHOPPING LIST

Stuff to buy/enable:

- Google Search Console (free, setup done)
- Bing Webmaster (free)
- **Ahrefs** or **SEMrush** for backlink + keyword tracking ($99-199/mo). Non-negotiable for P2.1 and P2.5.
- **Plausible** or keep **GA4** — already installed
- Newsletter platform with good analytics (**Beehiiv** recommended)
- Schema testing: [Google Rich Results Test](https://search.google.com/test/rich-results) (free)
- Broken link checker: **lychee** or **Screaming Frog** (free tier)

---

## SINGLE SENTENCE STRATEGIC FRAME

> Ravoid wins if it becomes the reference publication that engineering leaders forward to their CFO when defending AI infrastructure decisions. Everything in this plan ladders up to that.
