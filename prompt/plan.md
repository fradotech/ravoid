# Ravoid 30-Day Plan — Apr 16 to May 16, 2026

**Philosophy:** 5 high-impact items. Skip everything else until these land.

**One goal:** Own the "Claude Opus 4.7" SERP territory + establish 2x/week publishing rhythm that Google trusts.

---

## THE 5 THINGS THAT MATTER

1. **FAQPage schema live on all articles** — unlocks rich snippet CTR gain
2. **Fix article TTFB** — currently 1.1s, CWV will hurt ranking
3. **Distribute both Opus 4.7 articles in first 72 hours** — one-shot launch window
4. **Ship 7-article Opus 4.7 cluster** — 5 more articles in 30 days
5. **Newsletter lead magnet** — fixes signup conversion rate

Everything else waits until Month 2.

---

## WEEK 1 (Apr 16-23)

### Must do (in this order)

| #   | Action                                                                                                                           | Time              |
| --- | -------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| 1   | Deploy FAQPage schema (code already provided for `markdown.util.ts` + `[slug].astro`). Verify 3 valid items in Rich Results Test | 2-3h              |
| 2   | Submit sitemap to GSC + Bing. URL Inspection → Request Indexing for both Opus 4.7 articles + homepage                            | 15min             |
| 3   | LinkedIn native post for Tokenizer Tax (today). X Thread A (tonight Jakarta time)                                                | 1h                |
| 4   | LinkedIn native post for Vision Collapse (tomorrow). X Thread B (tomorrow morning Jakarta)                                       | 1h                |
| 5   | Hacker News submission: Tokenizer Tax, Sunday Apr 19 evening US Pacific = Monday Apr 20 morning Jakarta                          | 5min + engagement |
| 6   | Fix article TTFB: investigate SSR vs SSG in Astro config for blog posts. Move to static build if currently dynamic               | 2-4h              |

**End of week 1 checkpoint:**

- Rich Results Test shows FAQPage ✅
- Article TTFB < 600ms
- Combined ≥300 LinkedIn reactions across 3 posts
- HN submission made (regardless of score)

---

## WEEK 2 (Apr 24-30)

### Publish 2 articles

| #   | Article                                                                    | Primary Keyword          | Publish    |
| --- | -------------------------------------------------------------------------- | ------------------------ | ---------- |
| 1   | **xhigh Effort Trap: Anthropic's New Default Will Triple Your Agent Bill** | `opus 4.7 xhigh effort`  | Tue Apr 28 |
| 2   | **Opus 4.7 vs Sonnet 4.6: The Real Cost-Per-Outcome Math**                 | `opus 4.7 vs sonnet 4.6` | Thu Apr 30 |

Both follow v3.0 prompt. Both include FAQ section (now rendered as FAQPage schema automatically).

### Also do

- **Newsletter lead magnet**: Draft "AI Infrastructure Cost Cheatsheet 2026" (2-page PDF, 15 benchmarks). Deploy by end of week with signup gate.
- **LinkedIn distribute** both articles day of publish.

---

## WEEK 3 (May 1-7)

### Publish 2 articles

| #   | Article                                                           | Primary Keyword             | Publish   |
| --- | ----------------------------------------------------------------- | --------------------------- | --------- |
| 1   | **Migrating from Opus 4.5 to 4.7: The Checklist Most Teams Skip** | `opus 4.5 to 4.7 migration` | Tue May 5 |
| 2   | **The Computer-Use Agent Stack After Opus 4.7**                   | `opus 4.7 computer use`     | Thu May 7 |

### Also do

- **GSC analytics review**: pull top 10 queries by impressions. If any query has high impressions + low CTR (<2%), rewrite the meta description + title.
- **LinkedIn distribute** both articles.

---

## WEEK 4 (May 8-15)

### Publish 2 articles

| #   | Article                                                              | Primary Keyword           | Publish    |
| --- | -------------------------------------------------------------------- | ------------------------- | ---------- |
| 1   | **The Prompt Cache Rebuild: Why Week 1 on Opus 4.7 Costs 15% Extra** | `opus 4.7 prompt caching` | Tue May 12 |
| 2   | **One non-Opus evergreen piece** (topic TBD from GSC rising queries) | tbd                       | Thu May 14 |

### Month-end review (Fri May 15)

- GSC: impressions delta vs Apr 16 baseline
- Newsletter: signups delta, lead magnet downloads
- HN + LinkedIn: which posts performed, what to repeat
- Identify 2-3 winning article formats for Month 2

---

## WEEKLY OPERATIONAL RHYTHM

| Day     | What to do                                            |
| ------- | ----------------------------------------------------- |
| Mon     | 30min GSC review. Pick 1 query to optimize.           |
| Tue     | Publish article #1. LinkedIn native post 9am Jakarta. |
| Wed     | Engage with yesterday's comments. Check backlinks.    |
| Thu     | Publish article #2. LinkedIn native post 9am Jakarta. |
| Fri     | Newsletter sends. Week retro (15min).                 |
| Sat-Sun | Research + draft next week's articles.                |

---

## METRICS TO TRACK (WEEKLY)

Only these 6 numbers. Ignore the rest until Month 2.

```
GSC impressions (weekly)       ░░░░░░░░░░  Target: 10x by May 15
GSC clicks (weekly)            ░░░░░░░░░░  Target: 5x by May 15
Newsletter subscribers (total) ░░░░░░░░░░  Target: +300 net by May 15
Articles published             ░░░░░░░░░░  Target: 8 (2+2+2+2) by May 15
Article TTFB (p75)             █████████░  Current: 1.1s | Target: <0.6s
FAQ rich snippets appearing    ░░░░░░░░░░  Target: ≥3 queries show FAQ box
```

---

## WHAT TO EXPLICITLY NOT DO THIS MONTH

- ❌ **Calculator tool** — 8-12 hours = 2 articles. Postpone to Month 2.
- ❌ **Interactive demos** — same tradeoff.
- ❌ **YouTube/video** — different audience, Month 2+.
- ❌ **Guest contributors** — recruiting cost too high for 30 days.
- ❌ **Original benchmark** — 30+ hours, worth it only after foundation is solid.
- ❌ **Community (Discord/Slack)** — premature.
- ❌ **Paid distribution** — wait for organic baseline.
- ❌ **Newsletter partnerships** — Month 2.
- ❌ **Rewriting weak old articles** — Month 2. Focus is new cluster.

If you have extra time, reinvest in article quality or distribution, not in new initiatives.

---

## RISK MITIGATIONS (ONLY 2 THAT MATTER)

| Risk                                             | Mitigation                                             |
| ------------------------------------------------ | ------------------------------------------------------ |
| Single-author bottleneck slowing publish cadence | Use v3.0 prompt rigorously. Target 4h/article, not 8h. |
| Opus 4.7 news cycle cools before cluster is done | Don't stretch. 4 weeks, 5 Opus articles, then pivot.   |

---

## SINGLE STRATEGIC FRAME

> 30 days to prove the flywheel: consistent publishing + proper SEO foundation + launch-day distribution. If that works, Month 2 scales it. If not, diagnose before adding anything new.
