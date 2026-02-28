import type { Post } from "./post.type";

function img(id: string, w = 1200, h = 630): string {
  return `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format`;
}

function post(
  id: string,
  title: string,
  slug: string,
  excerpt: string,
  content: string,
  tags: { name: string; slug: string }[],
  imageId: string,
  publishedAt: string,
): Post {
  return {
    id,
    title,
    slug,
    excerpt,
    content,
    tags,
    heroImage: img(imageId),
    thumbnail: img(imageId, 400, 300),
    seo: {
      metaTitle: title,
      metaDescription:
        excerpt.length > 155
          ? excerpt.slice(0, excerpt.lastIndexOf(" ", 155)) + "..."
          : excerpt,
      ogImage: img(imageId),
      canonicalUrl: null,
      noIndex: false,
    },
    publishedAt,
    updatedAt: publishedAt,
  };
}

const SAAS = { name: "SaaS", slug: "saas" };
const STARTUP = { name: "Startup", slug: "startup" };
const PRICING = { name: "Pricing", slug: "pricing" };
const COMPARISON = { name: "Comparison", slug: "comparison" };
const DECISION = { name: "Decision Making", slug: "decision-making" };
const ALTERNATIVE = { name: "Alternative", slug: "alternative" };
const PRODUCTIVITY = { name: "Productivity", slug: "productivity" };
const ENGINEERING = { name: "Engineering", slug: "engineering" };
const FINTECH = { name: "Fintech", slug: "fintech" };
const MARKETING = { name: "Marketing", slug: "marketing" };
const INFRA = { name: "Infrastructure", slug: "infrastructure" };
const BOOTSTRAP = { name: "Bootstrap", slug: "bootstrap" };
const STRATEGY = { name: "Strategy", slug: "strategy" };

export const DUMMY_POSTS: Post[] = [
  post(
    "1",
    "SaaS Pricing Models Explained: Subscription vs Usage-Based",
    "saas-pricing-models-subscription-vs-usage-based",
    "Understanding SaaS pricing models is critical for founders and buyers. This article breaks down subscription, usage-based, and hybrid pricing strategies.",
    `## Why Pricing Strategy Matters More Than You Think

Pricing is positioning.

Many founders think pricing is something you “optimize later”. That mindset is dangerous. Your pricing model defines:
- Target customer segment (SMB vs Enterprise)
- Sales motion (self-serve vs sales-led)
- Cash flow predictability
- Company valuation multiple

Investors often evaluate SaaS companies primarily through pricing mechanics and revenue quality.

---

## 1️⃣ Subscription Pricing (Fixed Recurring)

This is the most common SaaS model.

### Characteristics
- Monthly or annual recurring fee
- Tiered plans (Basic / Pro / Enterprise)
- Predictable MRR

### Advantages
- Strong revenue predictability
- Easier budgeting for customers
- Attractive for investors

### Weaknesses
- Misalignment between usage and value
- Heavy users are subsidized by light users
- Can create churn if perceived value drops

### Best Fit
- Productivity tools
- CRM
- Collaboration platforms
- Internal workflow SaaS

---

## 2️⃣ Usage-Based Pricing (Pay-As-You-Go)

This model aligns cost with value delivered.

Examples:
- API calls
- Data processed
- Storage used
- Transactions

### Advantages
- Lower barrier to entry
- Scales naturally with customer growth
- Fair value perception

### Weaknesses
- Revenue unpredictability
- Harder forecasting
- Customers fear “bill shock”

### Best Fit
- Developer tools
- Infrastructure
- AI APIs
- Fintech processing

---

## 3️⃣ Hybrid Model (The Modern Standard)

Most successful SaaS today combine:
- Base subscription
- + usage-based overage

This balances predictability + scalability.

---

## Strategic Decision Framework

Ask these:

1. Is value measurable per usage unit?
2. Do customers demand predictable invoices?
3. Is your ICP cost-sensitive or outcome-focused?
4. Are you enterprise-focused or self-serve SMB?

---

## Financial Modeling Impact

Subscription model improves:
- LTV predictability
- CAC recovery modeling
- ARR valuation multiple

Usage-based improves:
- Expansion revenue
- Net Revenue Retention (NRR)
- Customer stickiness

---

## Common Pricing Mistakes

- Underpricing early product
- Copying competitor pricing blindly
- Too many pricing tiers
- No annual discount strategy
- No expansion lever

---

## Final Thought

Pricing is product strategy.

The right pricing model can 2x your revenue without shipping new features.`,
    [SAAS, PRICING, STRATEGY, STARTUP],
    "1492724441997-5dc865305da7",
    "2026-02-10T08:00:00.000Z",
  ),

  post(
    "2",
    "Notion vs Obsidian vs Confluence: Which Tool Should Your Startup Choose?",
    "notion-vs-obsidian-vs-confluence-startup-choice",
    "We compare three popular knowledge management tools to help startups decide which platform fits their workflow and budget.",
    `## Knowledge Management Is a Strategic Asset

Startups underestimate documentation.

Poor documentation:
- Slows onboarding
- Creates knowledge silos
- Reduces execution velocity

Choosing the right tool impacts productivity long-term.

---

# 🔵 Notion

### Strengths
- All-in-one workspace
- Database flexibility
- Collaborative
- Great UX

### Weaknesses
- Can become messy without structure
- Performance issues at scale
- Limited offline-first philosophy

### Pricing Model
- Free tier for individuals
- Per-seat scaling

### Ideal For
- Early-stage startup
- Async team
- Product & marketing documentation

---

# 🟣 Obsidian

### Strengths
- Local-first markdown
- Data ownership
- Fast performance
- Plugin ecosystem

### Weaknesses
- Collaboration not native
- Requires technical mindset

### Pricing
- Core app free
- Paid sync & publish

### Ideal For
- Technical founder
- Personal knowledge management
- Research-heavy workflow

---

# 🟡 Confluence

### Strengths
- Enterprise-ready
- Permission control
- Deep integration with Jira

### Weaknesses
- Expensive at scale
- Clunky UI
- Overkill for early startups

### Ideal For
- Series B+ startup
- Compliance-heavy teams
- Large engineering org

---

# 💰 Cost Comparison (Strategic View)

Small Team (5 people):
- Notion → affordable
- Obsidian → cheapest (if async)
- Confluence → higher cost baseline

Team of 50:
- Notion cost compounds
- Confluence more reasonable per enterprise feature
- Obsidian still cheapest but lacks collaboration

---

# 🧠 Decision Framework

Choose based on:

1. Collaboration intensity
2. Technical maturity
3. Compliance requirement
4. Growth plan (5 → 50 people?)

---

## My Recommendation (As Senior Engineer)

- 0–15 people → Notion
- Technical founder solo → Obsidian
- 50+ people + Jira stack → Confluence

Optimize for speed first. Structure later.`,
    [SAAS, COMPARISON, PRODUCTIVITY, STARTUP],
    "1551434678-e076c223a692",
    "2026-02-09T08:00:00.000Z",
  ),

  post(
    "3",
    "Build vs Buy: When Should You Develop Your Own SaaS Tool?",
    "build-vs-buy-saas-decision-framework",
    "A practical framework to help engineering leaders decide whether to build internal tools or subscribe to SaaS solutions.",
    `## The Build vs Buy Question Every CTO Faces

At some point, every engineering leader asks:

Should we build this internally or pay for SaaS?

This decision impacts:
- Engineering focus
- Time to market
- Burn rate
- Long-term scalability

---

# When You Should Buy

Buy if:

- It is NOT your core differentiator
- Market-proven solution exists
- Time-to-market matters
- Your team is small

Examples:
- Auth (Auth0, Clerk)
- Analytics
- Email delivery
- Payments

Buying saves engineering bandwidth.

---

# When You Should Build

Build if:

- Feature defines your competitive moat
- Deep customization required
- SaaS cost scales aggressively
- Integration complexity high

Examples:
- Proprietary recommendation engine
- Internal matching algorithm
- Core AI workflow

---

# Hidden Costs of Buying

- Vendor lock-in
- API limitations
- Sudden price increases
- Roadmap dependency

---

# Hidden Costs of Building

- Maintenance burden
- Security responsibility
- DevOps cost
- Technical debt

---

# Quantitative Framework

Calculate:

Internal Build Cost:
(Engineer Salary × Time) + Maintenance

SaaS Cost:
Monthly Fee × Years + Integration Cost

Also evaluate:
- Opportunity cost
- Strategic control
- Switching cost

---

# Rule of Thumb

If it doesn’t directly increase revenue or defend moat → BUY.

If it defines product uniqueness → BUILD.

---

# Final Insight

Engineering time is your scarcest asset.

Protect it aggressively.`,
    [SAAS, ENGINEERING, DECISION, STARTUP],
    "1519389950473-47ba0277781c",
    "2026-02-08T08:00:00.000Z",
  ),

  post(
    "4",
    "Top 7 Stripe Alternatives for Startups in 2026",
    "top-stripe-alternatives-for-startups-2026",
    "Stripe dominates online payments, but these alternatives may offer better pricing or regional advantages.",
    `## Stripe Dominance — But At What Cost?

Stripe is developer-friendly and globally trusted. However, as volume scales, transaction fees compound aggressively.

Example:
If you process $1M/month at 2.9% + $0.30 → that’s ~$29,000+ monthly in fees.

At scale, optimization matters.

---

# Key Alternatives Breakdown

## 1️⃣ Paddle
- Merchant of Record model
- Handles global tax & compliance
- Great for SaaS subscription businesses

Best for:
- Global SaaS founders
- No in-house tax team

---

## 2️⃣ LemonSqueezy
- SaaS-focused
- Built-in subscription + digital product support
- Simpler UX than Stripe

Best for:
- Indie hackers
- Bootstrapped founders

---

## 3️⃣ Adyen
- Enterprise-grade infrastructure
- Better for high-volume global merchants
- Competitive rates at scale

Best for:
- Series B+ startups

---

## 4️⃣ Xendit
- Strong in Southeast Asia
- Local payment methods
- Better regional optimization

Best for:
- Indonesia / SEA-focused SaaS

---

# Decision Framework

Evaluate based on:

- Geography
- Transaction volume
- Subscription complexity
- Tax handling capability
- Settlement speed
- Chargeback management

---

# Cost Optimization Strategy

Early stage → prioritize simplicity
Scaling stage → negotiate volume discounts
Enterprise stage → multi-provider strategy

Payment infra is margin strategy.`,
    [SAAS, FINTECH, ALTERNATIVE, PRICING],
    "1507679799987-c73779587ccf",
    "2026-02-07T08:00:00.000Z",
  ),

  post(
    "5",
    "SaaS Burn Rate Calculator: How Long Is Your Runway?",
    "saas-burn-rate-and-runway-guide",
    "Understanding burn rate is essential for startup survival. Learn how to calculate runway and extend it strategically.",
    `## Why Burn Rate Determines Survival

Startups don't die because they fail.
They die because they run out of cash.

Burn Rate = Monthly Cash Outflow - Revenue

---

# Key Metrics

## 1️⃣ Gross Burn
Total monthly expenses.

## 2️⃣ Net Burn
Gross burn - revenue.

## 3️⃣ Runway
Cash ÷ Net Burn

---

# Example

Cash: $600,000  
Net Burn: $50,000  
Runway: 12 months

But growth-stage startups must factor:
- Hiring ramp
- Infra scaling
- Marketing experiments

---

# How to Extend Runway

## Increase Revenue
- Raise prices
- Add annual plans
- Upsell add-ons

## Reduce Cost
- Optimize infra
- Cut unused SaaS
- Delay non-critical hiring

## Improve Retention
Lower churn = higher LTV = better unit economics.

---

# Founder Discipline Rule

Always plan runway assuming:
- Fundraising takes 6–9 months
- Revenue growth slows

Run lean. Scale intentionally.`,
    [STARTUP, SAAS, STRATEGY, BOOTSTRAP],
    "1460925895917-afdab827c52f",
    "2026-02-06T08:00:00.000Z",
  ),

  post(
    "6",
    "Vercel vs Netlify vs Cloudflare Pages: Infra Cost Comparison",
    "vercel-vs-netlify-vs-cloudflare-pages",
    "Frontend infrastructure pricing comparison for modern startups building with Next.js or Astro.",
    `## Modern Frontend Infrastructure War

Frontend hosting now includes:
- Edge functions
- Global CDN
- Serverless compute
- Image optimization

Cost structure varies significantly.

---

# Vercel

Strengths:
- Best Next.js support
- Great DX
- Edge-first

Weakness:
- Expensive bandwidth at scale

---

# Netlify

Strengths:
- Stable ecosystem
- Good for static sites

Weakness:
- Less optimized for large SSR apps

---

# Cloudflare Pages

Strengths:
- Cheap bandwidth
- Strong edge network
- Integrated CDN

Weakness:
- Slightly more setup complexity

---

# Cost Comparison Considerations

Evaluate:
- Monthly bandwidth
- Function execution cost
- Image optimization cost
- Team seats

---

# Scaling Advice

Early stage:
Use free tier aggressively.

Growth stage:
Model bandwidth projections.

Large scale:
Cloudflare often cheaper long term.

Infra cost becomes margin control lever.`,
    [INFRA, SAAS, COMPARISON, ENGINEERING],
    "1492724441997-5dc865305da7",
    "2026-02-05T08:00:00.000Z",
  ),

  post(
    "7",
    "Open Source vs SaaS: Total Cost of Ownership Breakdown",
    "open-source-vs-saas-total-cost-ownership",
    "Is open-source really cheaper? We break down infrastructure, maintenance, and opportunity costs.",
    `## Open Source Is Not Free

Open source reduces license cost.
It does NOT remove operational cost.

---

# SaaS Cost Components

- Subscription fee
- Integration effort
- Vendor dependency

---

# Open Source Cost Components

- Hosting infrastructure
- DevOps maintenance
- Security patching
- Monitoring
- Downtime risk

---

# Hidden Opportunity Cost

Engineering time spent maintaining OSS
= time NOT spent building product.

---

# When OSS Makes Sense

- Strong DevOps team
- Customization critical
- High SaaS cost at scale
- Regulatory constraints

---

# TCO Formula

Total Cost = Direct Cost + Maintenance + Risk + Opportunity Cost

---

# Strategic Takeaway

Early-stage → SaaS wins
Late-stage scale + infra team → OSS viable

Never evaluate only by subscription price.`,
    [SAAS, ENGINEERING, DECISION, STRATEGY],
    "1521790361543-f645cf042ec4",
    "2026-02-04T08:00:00.000Z",
  ),

  post(
    "8",
    "How to Compare SaaS Tools Without Bias",
    "how-to-compare-saas-tools-objectively",
    "A structured framework to compare SaaS tools using weighted scoring and ROI metrics.",
    `## Avoid Emotional Tool Decisions

Brand hype influences SaaS decisions.

Use structured evaluation.

---

# Step 1: Define Criteria

Example:
- Cost (20%)
- Integration (25%)
- Scalability (20%)
- Security (15%)
- UX (20%)

---

# Step 2: Weighted Scoring

Score each tool 1–10.
Multiply by weight.
Compare total score.

---

# Step 3: ROI Estimation

Does tool:
- Increase revenue?
- Reduce cost?
- Improve speed?

If ROI unclear → reconsider adoption.

---

# Common Bias

- Choosing based on Twitter trends
- Overvaluing UI aesthetics
- Ignoring switching cost

---

# Executive Rule

No SaaS tool without measurable ROI hypothesis.`,
    [SAAS, COMPARISON, DECISION, STRATEGY],
    "1519389950473-47ba0277781c",
    "2026-02-03T08:00:00.000Z",
  ),

  post(
    "9",
    "Bootstrapping a SaaS Startup: Tools You Actually Need",
    "bootstrapping-saas-tools-stack",
    "A lean SaaS stack for founders who want to minimize cost while maximizing velocity.",
    `## Minimalist SaaS Stack Philosophy

Early founders overbuild.

Focus on:
Revenue > Tool sophistication

---

# Essential Stack Only

1️⃣ Hosting
2️⃣ Payment
3️⃣ Email
4️⃣ Analytics
5️⃣ Basic CRM

---

# Avoid Tool Sprawl

Each additional tool adds:
- Subscription cost
- Integration complexity
- Cognitive load

---

# Cost Discipline Strategy

- Annual billing discounts
- Remove unused seats monthly
- Audit SaaS stack quarterly

---

# Founder Rule

If tool doesn’t directly help acquire or retain customer → delay.

Revenue first. Optimization later.`,
    [BOOTSTRAP, STARTUP, SAAS, PRODUCTIVITY],
    "1460925895917-afdab827c52f",
    "2026-02-02T08:00:00.000Z",
  ),

  post(
    "10",
    "Churn Reduction Strategies for B2B SaaS",
    "churn-reduction-strategies-b2b-saas",
    "Reducing churn increases valuation and runway. Here are practical retention strategies for SaaS founders.",
    `## Churn Is Silent Killer

Even 5% monthly churn destroys compounding growth.

Retention drives valuation.

---

# Types of Churn

- Voluntary
- Involuntary (payment failure)
- Downgrade churn

---

# Strategies

## Improve Onboarding
First 7 days define retention curve.

## Usage Monitoring
Trigger alerts when usage drops.

## Customer Success Touchpoints
High-value accounts need proactive support.

## Annual Contracts
Reduces churn volatility.

---

# Metrics to Track

- Logo churn
- Revenue churn
- Net Revenue Retention
- Expansion revenue

---

# Retention Rule

Acquisition scales growth.
Retention compounds it.`,
    [SAAS, STARTUP, STRATEGY, MARKETING],
    "1500530855697-b586d89ba3ee",
    "2026-02-01T08:00:00.000Z",
  ),

  post(
    "11",
    "Best CRM Alternatives for Early-Stage Startups",
    "best-crm-alternatives-startups",
    "Salesforce may be overkill. Here are lightweight CRM tools for startups with limited budget.",
    `## Enterprise CRM Is Overkill Early

Salesforce too early = operational friction.

---

# Lightweight Alternatives

## HubSpot Free
- Easy onboarding
- Basic automation

## Pipedrive
- Pipeline-focused
- Sales-driven teams

## Close CRM
- Startup-focused
- Strong outbound support

---

# Decision Criteria

- Sales complexity
- Automation need
- Reporting requirement
- Budget

---

# Growth Advice

Early stage:
Simple pipeline tracking > automation.

Scale stage:
Move to structured CRM.

Complexity should follow revenue.`,
    [SAAS, ALTERNATIVE, STARTUP, PRICING],
    "1492724441997-5dc865305da7",
    "2026-01-31T08:00:00.000Z",
  ),

  post(
    "12",
    "AI SaaS Explosion: How to Evaluate New Tools from Product Hunt",
    "ai-saas-evaluation-framework-product-hunt",
    "New AI SaaS tools launch daily. Learn how to evaluate which ones are worth adopting.",
   `## AI SaaS Explosion

Every week new AI tools launch.

Most will disappear.

---

# Evaluation Framework

## 1️⃣ Problem Depth
Is it solving real pain?

## 2️⃣ Replacement Factor
Does it replace existing workflow?

## 3️⃣ Pricing Sustainability
Freemium trap common.

## 4️⃣ Defensibility
Data moat?
Switching cost?
Network effect?

---

# Warning Signals

- Pure wrapper over OpenAI API
- No distribution strategy
- No clear ICP
- No retention metric transparency

---

# Adoption Strategy

Test fast.
Adopt selectively.
Avoid tool addiction.

AI should increase revenue or reduce cost measurably.`,
    [SAAS, STARTUP, COMPARISON, DECISION],
    "1521790361543-f645cf042ec4",
    "2026-01-30T08:00:00.000Z",
  ),
];
