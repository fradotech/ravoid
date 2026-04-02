## Nobody Budgets for Frontend Hosting Until It Becomes Expensive

Most teams pick their frontend hosting platform in under an hour. Someone on the team has used Vercel before, or the framework documentation recommends a specific platform, or a blog post made one option look obviously better. The decision feels low-stakes because the bill is almost nothing in the first months. A few dollars, maybe free tier. It barely registers.

What teams do not realize is that this decision shapes cost structure, deployment architecture, and scaling behavior for the entire frontend lifecycle. Frontend hosting is not just static file serving anymore. Modern platforms bundle serverless functions, edge compute, image optimization, analytics, and bandwidth into pricing models that behave very differently as traffic grows. The platform that costs nothing at 10,000 visitors per month can quietly become the largest line item in your infrastructure bill at 500,000.

> The cheapest platform at launch is rarely the cheapest platform at scale.
> And by the time you notice, migration is no longer trivial.

---

## The Mental Model That Fails

Most teams evaluate frontend hosting on three dimensions: developer experience, deployment speed, and framework compatibility. These are valid criteria, but they describe how the platform feels during setup, not how it behaves during operation.

The false assumption is that frontend hosting cost scales linearly with traffic. In reality, each platform has a different cost shape determined by how it charges for bandwidth, serverless invocations, image transformations, and edge execution. These components grow at different rates and interact in ways that are invisible at low traffic. A platform that charges generously for bandwidth but aggressively for serverless functions will behave very differently from one that offers unlimited bandwidth but meters compute time.

This is the same pattern that appears across all [SaaS pricing models](https://ravoid.com/blog/saas-pricing-models-subscription-vs-usage-based), where simplicity at the surface hides cost complexity underneath. The pricing page tells you what you pay per unit. It does not tell you how many units your system actually generates under real production conditions.

---

## What the Pricing Pages Actually Say

At a surface level, the three major platforms present pricing that looks comparable:

| Platform | Free Tier | Pro Plan | Bandwidth Included | Serverless | Key Metered Cost |
| --- | --- | --- | --- | --- | --- |
| Vercel | 100GB bandwidth | $20/user/month | 1TB | 1M invocations | Bandwidth overage $40/100GB, Edge Middleware, Image Optimization |
| Netlify | 100GB bandwidth | $19/user/month | 1TB | 125K serverless minutes | Bandwidth overage $55/100GB, Forms, Identity |
| Cloudflare Pages | Unlimited bandwidth | Free (Workers paid) | Unlimited | 100K Workers requests/day free | Workers beyond free tier, KV storage, Durable Objects |

At low traffic, all three are effectively free or near-free. The differences are negligible. This creates the false impression that the choice does not matter economically.

But these pricing structures have fundamentally different cost shapes:

- **Vercel** charges per-seat for teams, plus metered bandwidth, serverless, and image optimization. Cost grows with both team size and traffic.
- **Netlify** charges per-seat with bandwidth and serverless minutes as the primary overage triggers. Cost is predictable but jumps at tier boundaries.
- **Cloudflare Pages** offers unlimited bandwidth with zero hosting cost, but charges for Workers compute, KV storage, and advanced features. Cost grows only with compute complexity, not traffic volume.

---

## A Simple Scenario That Drifts

Consider a SaaS marketing site with a blog, built with Next.js or Astro. At launch, it receives 30,000 page views per month. The team has 3 developers. Deployment is simple: push to main, preview on PR, deploy automatically.

At this stage:
- Vercel: free tier, $0/month
- Netlify: free tier, $0/month
- Cloudflare Pages: free tier, $0/month

No difference. Everyone is happy.

Now fast forward 12 months. The product has grown. The site now serves 800,000 page views per month, includes dynamic routes with server-side rendering, uses image optimization for product screenshots, and the team has grown to 8 developers. This is where the platforms start diverging significantly.

---

## Where the Cost Model Breaks

As frontend applications grow beyond static sites, several cost drivers emerge that were invisible during setup:

- **Server-side rendering (SSR) invocations**
  Every dynamic page request triggers a serverless function, which is metered differently across platforms

- **Image optimization**
  Platforms that auto-optimize images charge per transformation, and high-traffic sites can generate millions of transformations monthly

- **Bandwidth at scale**
  Some platforms include generous bandwidth, others charge steep overage fees that grow linearly with traffic

- **Team seat costs**
  Per-seat pricing compounds with team growth, adding a fixed cost layer independent of traffic

- **Edge middleware and compute**
  Middleware that runs on every request (auth checks, redirects, A/B tests) adds compute cost that scales with total request volume, not just page views

Each of these is manageable individually. Together, they reshape the economics of what started as a "free" hosting decision.

---

### Scenario 1: Early Stage

A startup with a marketing site and blog.

- 50,000 page views/month
- 3 developers
- Static site with minimal SSR
- No image optimization pipeline

#### Vercel:
- Free tier covers everything
- Total: **$0/month**

#### Netlify:
- Free tier covers everything
- Total: **$0/month**

#### Cloudflare Pages:
- Free tier covers everything
- Total: **$0/month**

At this stage, there is zero cost difference. The right choice is whichever platform the team is most productive with. Developer experience is the only variable that matters.

---

### Scenario 2: Growth Stage

The same product after traction.

- 500,000 page views/month
- 8 developers
- SSR for dynamic pages (~30% of traffic)
- Image optimization enabled
- Preview deployments on every PR

#### Vercel:
- Pro plan: $20 x 8 seats = $160/month
- Bandwidth: ~300GB, within 1TB limit
- Serverless: ~150K invocations for SSR, within limit
- Image optimization: ~50K transformations, ~$50/month
- Total: **~$210/month**

#### Netlify:
- Pro plan: $19 x 8 seats = $152/month
- Bandwidth: ~300GB, within 1TB limit
- Serverless minutes: moderate usage, within limit
- Total: **~$152/month**

#### Cloudflare Pages:
- Hosting: $0 (unlimited bandwidth)
- Workers (SSR): ~$5/month for 150K requests beyond free tier
- Image resizing: ~$10/month via Cloudflare Images
- Total: **~$15/month**

The gap starts opening. Cloudflare's unlimited bandwidth and minimal per-seat cost create a 10x to 14x cost advantage at this stage. Vercel and Netlify's per-seat model becomes the dominant cost driver, not traffic.

---

### Scenario 3: Scale Stage

A mature SaaS with high-traffic frontend.

- 3,000,000 page views/month
- 15 developers
- Heavy SSR (~50% of traffic)
- Image optimization at volume
- Edge middleware on all routes (auth, geo-routing)
- Multiple preview environments active daily

#### Vercel:
- Pro plan: $20 x 15 seats = $300/month
- Bandwidth: ~2TB, overage ~$400/month
- Serverless: ~1.5M invocations, overage ~$150/month
- Image optimization: ~200K transformations, ~$200/month
- Edge Middleware: included but adds to function execution
- Total: **~$1,050–$1,400/month**

#### Netlify:
- Pro plan: $19 x 15 seats = $285/month
- Bandwidth: ~2TB, overage ~$550/month
- Serverless minutes: heavy usage, overage ~$100/month
- Total: **~$935–$1,100/month**

#### Cloudflare Pages:
- Hosting: $0
- Workers (SSR + middleware): ~$25–$50/month at Paid plan ($5/month base + $0.50/M requests)
- Image resizing at volume: ~$50/month
- KV for edge state: ~$5/month
- Total: **~$80–$110/month**

At scale, the difference is structural. Cloudflare costs 10x to 12x less than Vercel or Netlify for the same traffic level. The primary reason is that Cloudflare does not charge for bandwidth or per-seat, which are the two largest cost drivers on the other platforms.

---

## Where Cost Actually Leaks

Frontend hosting cost rarely appears as a single obvious expense. It leaks across multiple billing dimensions that teams do not monitor individually.

- **Preview deployment proliferation**
  Active teams generate dozens of preview environments daily, each consuming serverless compute and bandwidth

- **Image optimization at volume**
  Auto-optimized images are convenient but charged per transformation, and cache invalidation triggers re-optimization

- **SSR function cold starts**
  Cold starts increase execution duration, which increases metered cost on platforms that charge by execution time

- **Bandwidth from API routes**
  Next.js API routes served through the hosting platform count toward bandwidth, not just page traffic

- **Team growth as a cost multiplier**
  Per-seat pricing means every new hire increases the fixed cost floor regardless of traffic

---

### Hidden Cost Breakdown

| Component | Visibility | Cost Impact | What Teams Usually Miss |
| --- | --- | --- | --- |
| Per-seat pricing | High | Medium–High | Compounds with team growth, not traffic |
| Bandwidth overage | Medium | High | Spikes during launches and marketing campaigns |
| SSR invocations | Low | Medium–High | Every dynamic route is a metered function call |
| Image optimization | Low | Medium | Volume grows faster than page views |
| Preview environments | Very Low | Medium | Active PRs consume resources continuously |
| Edge middleware | Very Low | Medium | Runs on every request, not just page views |

> Most teams track their hosting bill.
> Few teams understand which dimension is actually driving it.

---

## The Cost Structure Nobody Compares

The fundamental difference between these platforms is not features or developer experience. It is the cost model architecture.

Vercel and Netlify operate on a **seat + usage hybrid** model. You pay a fixed base per team member, then additional metered costs for bandwidth, compute, and features. This means cost grows along two axes simultaneously: team size and traffic. In early-stage companies where teams are small and traffic is low, both axes are minimal. In growth-stage companies, both axes expand, and the compounding effect becomes significant.

Cloudflare operates on a **compute-only** model. There is no per-seat cost and no bandwidth charge. You only pay for compute operations (Workers, KV, Durable Objects) that exceed the free tier. This means cost grows along a single axis: compute complexity. Traffic alone does not increase cost. A site serving 10 million page views per month of static or cached content costs the same as one serving 100,000.

This architectural difference explains why the cost gap widens so dramatically at scale. It is not that Cloudflare is "cheaper." It is that the cost model responds to different variables.

| Cost Model | What Drives Cost | Scaling Behavior | Predictability |
| --- | --- | --- | --- |
| Vercel (seat + usage) | Team size + traffic + features | Multi-axis, compounds | Medium |
| Netlify (seat + usage) | Team size + bandwidth + minutes | Multi-axis, compounds | Medium |
| Cloudflare (compute-only) | Only compute beyond free tier | Single-axis, linear | High |

This connects directly to [how infrastructure platforms behave differently at scale](https://ravoid.com/blog/vercel-vs-cloudflare-vs-self-hosting-at-scale), where the early experience is nearly identical but the cost trajectory diverges fundamentally.

---

## The Real Cost Formula

A more useful way to model frontend hosting cost:

**total cost = (seats x seat price) + (bandwidth x overage rate) + (SSR invocations x compute price) + (image transforms x optimization price) + (edge compute x execution price)**

Where:

- **Seats** is the fixed cost floor that grows with team size
- **Bandwidth** is traffic-dependent and spikes during campaigns
- **SSR invocations** scales with the percentage of dynamic routes
- **Image transforms** scales with content volume and cache behavior
- **Edge compute** scales with middleware complexity and total request count

---

### Practical Interpretation

| Variable | Low Cost Indicator | High Cost Indicator |
| --- | --- | --- |
| Seats | Small team (< 5), free tier | Large team (10+), per-seat pricing |
| Bandwidth | Static site, CDN-heavy | SSR-heavy, large assets, API routes |
| SSR invocations | Mostly static pages | Heavy dynamic rendering |
| Image transforms | Few images, manual optimization | Large media libraries, auto-optimization |
| Edge compute | No middleware | Auth checks, geo-routing on every request |

Most teams only compare the seat price. The ones that control cost model all five variables.

---

## The Trade-Off Table

| Decision | What You Gain | What You Pay | When It Breaks |
| --- | --- | --- | --- |
| Vercel for everything | Best DX, fastest deployment | Per-seat + bandwidth + compute costs | Team grows past 10, traffic past 500K/month |
| Netlify for simplicity | Stable workflow, familiar model | Per-seat + bandwidth overage | Dynamic workloads beyond basic static |
| Cloudflare for cost | Unlimited bandwidth, minimal fixed cost | Requires more architectural awareness | Complex SSR patterns, less polished DX |
| Vercel to Cloudflare migration | Massive cost reduction at scale | Migration effort, DX adjustment period | Team unwilling to adapt to Workers model |
| Hybrid (static on Cloudflare, app on Vercel) | Balance of DX and cost | Operational complexity of two platforms | When integration between them becomes friction |

---

## When Each Platform Makes Sense

### Stay on Vercel when:

- Team is small (under 5 developers)
- Product is Next.js-heavy and iterating fast
- Developer experience directly impacts shipping speed
- Traffic is under 500K page views/month
- Cost is not yet a constraint

### Choose Netlify when:

- Site is primarily static or content-heavy
- Team values simplicity over flexibility
- Dynamic workloads are minimal
- Predictable workflow matters more than edge performance

### Move to Cloudflare Pages when:

- Traffic exceeds 500K page views/month and bandwidth cost becomes visible
- Team has more than 8 developers and per-seat pricing compounds
- Global distribution and latency matter
- Team is comfortable with a slightly different development model
- Cost efficiency is a priority alongside performance

The wrong decision is not choosing the wrong platform. It is choosing one without understanding how its cost model scales with your specific usage pattern. This is the same [build vs buy decision trap](https://ravoid.com/blog/build-vs-buy-saas-decision-framework) that appears throughout SaaS infrastructure, where the real cost is not the tool but the commitment to its economic model.

---

## The Mistake Most Teams Make

Most teams evaluate frontend hosting during a phase where all platforms are effectively free. They choose based on developer preference, framework compatibility, or a tutorial they followed. None of these criteria account for how cost behaves at scale.

The second mistake is treating frontend hosting as a fixed cost. It is not. It is a variable cost with multiple scaling dimensions, and the platform you choose determines which dimensions dominate. Teams that never model this end up surprised when their hosting bill becomes a meaningful line item, and by that point, migration means rebuilding deployment pipelines, updating CI/CD, and retraining the team on a new platform.

---

## What This Means in Practice

The question is not which frontend hosting platform is best.

The real question is:

> Which cost model aligns with how your product actually grows?

Because at 30,000 page views, it does not matter. At 3,000,000, it is the difference between $100/month and $1,400/month for the same application.

> Frontend hosting is not a developer experience decision.
> It is an infrastructure economics decision that most teams make too early to notice.
