# ravoid.md

Context document for Ravoid website development and content generation.
Paste this as project context when starting a fresh AI session.

---

## 1. Site Overview

- **Domain:** ravoid.com
- **Brand:** Ravoid
- **Tagline:** "Infrastructure Economics for Serious SaaS Builders" (verify in `SiteConfig.tagline`)
- **Niche:** SaaS infrastructure economics, AI cost analysis, engineering decision-making
- **Positioning:** Premium engineering blog — not marketing, not academic, not a newsletter roundup
- **Content language:** English (conversations with author often in Indonesian/English mix)
- **Update cadence:** ~1-2 articles per week, 3000-5000 words each

---

## 2. Author

- **Name:** Framesta Fernando (single author)
- **Current role:** Engineering Manager at MrScraper
- **Former role:** Technical Architect at DOT Indonesia
- **Experience:** 5+ years designing scalable backend systems powering hundreds of microservices and workers handling hundreds of requests per second
- **Voice:** First-person sparingly, opinionated, writes from production experience
- **Profile photo:** LinkedIn CDN URL (currently hotlinked — consider localizing)

---

## 3. Target Audience

- Engineering leaders running production systems
- Technical founders shipping SaaS
- Senior developers making infrastructure decisions
- Readers who have made expensive mistakes and want lessons from others who have too

Assume reader is **smart but wrong**. Every article should feel like advice from someone who has personally made expensive mistakes and is sharing the lesson.

---

## 4. Editorial Voice

### Tone Rules

- Insight-driven, not tutorial
- Call out a mistake, don't explain a concept
- Slightly opinionated with clear point of view
- Prioritize clarity over fairness
- Rewrite anything that feels "safe" or "neutral"
- Premium engineering blog feel

### Hard Constraints

- **No em-dash (—).** Use comma, period, or colon.
- Paragraphs: 3-5 sentences (max 6)
- Avoid 1-2 sentence paragraphs except for emphasis
- No excessive line breaks or fragmentation

### Content Balance

- 65-80% narrative paragraphs
- 20-35% structured content (lists, tables)
- 2-4 meaningful tables per article
- 1-2 concise bullet sections (3-5 items each)
- 3-5 internal links to other `ravoid.com/blog/` articles
- 2-4 short quote-style lines for emphasis
- 1-2 contradiction insights per article

---

## 5. Article Structure (13-Section Template)

Every article follows this structure:

1. **Hook** — 1-2 sharp sentences, pattern break, create tension
2. **Context** — common belief or situation, grounded and relatable
3. **False assumption** — incorrect mental model, subtle but important
4. **Concrete example (early)** — realistic scenario with rough numbers
5. **Where the model breaks** — short intro + 3-5 bullets
6. **Deep scenario expansion** — early stage, growth stage, scale stage (with numbers)
7. **Hidden cost / system leak section** — include a breakdown table
8. **Anchor insight section** — longest, deepest section, strong title, one conceptual table
9. **Framework / mental model** — formula + interpretation table
10. **Trade-off section** — comparison table with columns: decision / what you gain / what you pay / when it breaks
11. **Decision guidance** — stage, scale, constraint based
12. **Common mistake section** — short, slightly uncomfortable
13. **Closing** — reflective, quotable, **rotate titles** (never reuse "The Real Question" / "What Actually Matters" / "The Part Nobody Wants to Hear")

Plus: **FAQ section** at end with `### Q:` format for FAQPage schema extraction.

---

## 6. Tech Stack

- **Framework:** Astro
- **Language:** TypeScript throughout
- **Styling:** Tailwind CSS
- **Hosting:** Vercel
- **Fonts:** Inter via `@fontsource/inter` (weights 400, 500, 600, 700, 800)
- **Analytics:** GTM
- **Dark mode:** Via `ThemeInit` component, `prefers-color-scheme`
- **Feeds:** RSS at `/rss.xml`, sitemap at `/sitemap.xml`
- **Images:** WebP, at `/public/images/posts/[slug].webp`

---

## 7. File Structure for Articles

Each article = a folder named after its slug, containing two files:

### `src/content/posts/[slug]/post.ts`

```typescript
import type { PostSource } from "../../post.source.type";

export const post: PostSource = {
  id: "[NEXT_ID]",
  title: "...",
  slug: "...",
  excerpt: "...", // ~160 chars, punchy
  tags: [
    { name: "AI", slug: "ai" },
    // etc
  ],
  imageId: "/images/posts/[slug].webp",
  publishedAt: "2026-04-18T10:00:00.000Z",
  featured: false,
  trendingScore: 0, // 0-30, manually curated
};
```
