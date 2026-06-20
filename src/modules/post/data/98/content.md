# Stripe Paid $1B for Usage Billing. Don't Build It.

_By Framesta Fernando · Engineering Manager & Technical Architect · 11 min read · Published August 8, 2026_

> **TL;DR:** The usage-based billing build vs buy question was answered when Stripe paid roughly $1 billion for Metronome in January 2026 instead of building metering itself. Metering looks like counting events but is a hard exactly-once distributed-systems problem, where duplicate, late, and out-of-order events silently over- or under-bill customers. The failures are invisible until they have already leaked revenue or trust.

When the company with arguably the best payments engineering on the planet decides to spend a billion dollars buying usage metering rather than building it, that is not a footnote. It is the answer to your build-versus-buy debate. In January 2026, Stripe completed its reported $1 billion acquisition of Metronome, the usage-based billing platform behind OpenAI, Anthropic, Databricks, and NVIDIA ([BillingPlatform on the acquisition](https://billingplatform.com/de/blog/billingplatform-vs-stripe)). Stripe already had a billing product. It bought one anyway.

The reason is the part every team underestimates. Stripe Billing's 2018 architecture was designed for subscriptions with pre-aggregated usage data, not real-time event streaming at AI scale, so Stripe bought Metronome for $1B instead of building usage-based billing and metering itself ([Lago on why Stripe bought Metronome](https://getlago.com/blog/why-stripe-paid-1b-for-metronome-instead-of-fixing-billing)). If retrofitting metering onto an existing billing system was hard enough that Stripe chose acquisition, the odds that your team builds it correctly as a side project are not good. Usage metering looks like counting, and counting feels easy, which is exactly the trap.

## Metering is not one product, it is six layers

The first misconception is that usage-based billing is a feature you bolt on. It is not. Usage-based billing was never one product, it is six layers wired together, where decisions at the bottom quietly shape everything above ([Flexprice's technical deep dive](https://flexprice.io/blog/technical-deep-dive-usage-based-billing-for-ai-and-saas)). Event ingestion, deduplication, aggregation, rating, invoicing, and revenue recognition each have their own correctness requirements, and a mistake in the lowest layer propagates upward into wrong invoices that look perfectly valid.

Metering is also where the money is literally defined. Stripe buying Metronome turns usage billing into a control point where modern software companies decide what an API call, a token, or a GPU second costs, then turn those raw events into invoices, credits, and revenue records ([Sacra on the acquisition](https://sacra.com/chat/h/e4729aa2-fb31-4a24-9e6b-718940ac7713/)). That is not a logging system with a price attached. It is the financial system of record for a usage-priced business, and it has to be correct in ways a logging system never does.

## The hard part: count each event exactly once

Here is the requirement that separates metering from event logging, and the one teams discover too late. A usage meter that bills customers needs two properties ordinary event logging does not: it must count each billable event exactly once even when the pipeline delivers it twice, and it must still get the count right when events arrive late or out of order ([UsageBox on idempotent metering](https://usagebox.com/articles/idempotent-usage-metering-dedup-late-events)). Distributed pipelines guarantee at-least-once delivery, which means duplicates are not an edge case, they are normal traffic. Your meter has to deduplicate them or it overbills.

The exactly-once requirement is one of the genuinely hard problems in distributed systems, and getting it wrong is bidirectional and silent:

```ts
// The deceptively hard core: count each event once, handle late arrivals
async function recordUsage(event: UsageEvent) {
  // 1. Idempotency: same event id delivered twice must count once
  if (await seen(event.id)) return;          // dedup or you OVER-bill
  await markSeen(event.id, ttl = LATE_WINDOW);

  // 2. Late / out-of-order: attribute to the period it occurred in,
  //    not the period it arrived in, or you mis-bill across invoices
  const period = billingPeriodFor(event.occurred_at);  // not received_at
  if (period.closed) await reopenOrAccrue(period, event); // already invoiced?

  await aggregate(event.customer, period, event.units);
}
```

Every line in that function is a place a homegrown meter goes wrong. Skip the dedup and you overbill, triggering disputes and refunds. Attribute by arrival time instead of event time and a late event lands on the wrong invoice. Mishandle an event that arrives after the period closed and you either leak the revenue or reopen a finalized invoice. A fragile or poorly designed ingestion pipeline leads to billing errors, revenue leakage, and customer disputes that erode trust and profitability ([m3ter on usage ingestion](https://www.m3ter.com/blog/usage-data-ingestion)).

## The anchor: the bug has no error signal

The deepest reason to buy rather than build is not difficulty, it is observability. Most bugs announce themselves: an exception, a failed test, a 500. A metering bug does none of that. It produces a valid-looking invoice with a slightly wrong number, and metering done wrong produces revenue leakage, billing disputes, and audit exposure often without any visible signal until significant damage is already done ([BillingPlatform on metering and rating](https://billingplatform.com/metering-and-rating)). The system reports success while quietly mis-billing every customer.

That invisibility flips the normal build-versus-buy math. Usually you can ship a rough internal version, find the bugs in production, and harden it. With metering, the bugs are found by customers via disputes, or by auditors, or by a revenue number that was always a little wrong, and by then the cost is trust and restated revenue, not a patch. Miscount by even a fraction and you leak revenue or lose customer trust ([Kong on metered billing](https://konghq.com/blog/enterprise/guide-to-metered-billing-for-apis)). This is the build-versus-buy framework I laid out in [the build versus buy decision framework](https://ravoid.com/blog/build-vs-buy-saas-decision-framework), applied to a domain where the cost of build is paid in a currency you cannot easily refund.

## What a metering bug actually costs

Put numbers on the silence. Take an illustrative business with $12M in annual usage-based revenue and a homegrown meter that is 99% accurate, which sounds excellent until you price the 1%.

```
Annual usage revenue:        $12,000,000
Metering error rate:         1% (good for a homegrown meter)
Mis-billed per year:         0.01 x $12,000,000 = $120,000

Split, roughly:
  Under-billing (silent leak):  ~$60,000/year never invoiced
  Over-billing (disputes):      ~$60,000/year in refunds + churn risk
A mature bought meter at ~99.99%: ~$1,200/year mis-billed
```

A hundred and twenty thousand dollars a year, invisible, on a system everyone believes is working because it produces invoices and the invoices get paid. The under-billing half never even generates a complaint, it just quietly reduces revenue. As AI billing has gotten harder, with credits becoming the dominant mechanism and hybrid subscription-plus-usage models the norm ([Solvimon on AI billing](https://www.solvimon.com/blog/best-billing-systems-for-ai-startups-in-2026-what-actually-matters-beyond-metering)), the surface area for these silent errors has only grown. The pricing-model complexity I described in [subscription versus usage-based pricing](https://ravoid.com/blog/saas-pricing-models-subscription-vs-usage-based) is exactly the complexity the meter has to encode correctly. And the per-transaction fee layered on top of all this is its own scaling tax, which I covered in [Stripe's 2.9% is a tax that grows with you](https://ravoid.com/blog/stripe-fees-2026).

## When building is still defensible

Buy is the default, not an absolute. Building can make sense in narrow cases: a genuinely simple, single-dimension meter (flat per-API-call with no credits, tiers, or hybrid contracts) where the correctness surface is small, or a scale and specificity that no vendor serves, the situation Stripe's largest customers are in, ingesting millions of events per second. Even then, the bar is that metering is core to your differentiation, not just a thing you need.

For almost everyone else, the tooling has matured enough that building is hard to justify: Stripe, Orb, Lago, and Metronome all handle the complexity ([Vibe Coder on usage-based pricing](https://blog.vibecoder.me/usage-based-pricing-implementation)), including open-source options if vendor lock-in is the concern. The honest version of the build case is rare, and it is worth pressure-testing against the same question Stripe answered with a billion dollars: is this really cheaper to build than to buy, once you price the invisible bugs.

| Decision | What you gain | What you pay | When it breaks |
| --- | --- | --- | --- |
| Buy a metering platform | Correctness, speed | Per-event or platform fee | Extreme scale / specificity |
| Build, simple meter | Control, no fee | Hidden correctness bugs | Tiers, credits, hybrids appear |
| Build, complex meter | Full control | Multi-quarter eng + silent leak | Almost always |
| Open-source meter | Control + tested core | Self-host and operate | No ops capacity |

## A post-mortem on a meter that always worked

A composite from the documented pattern, with figures labeled illustrative: a developer-tools company built its own usage meter because the pricing was simple at launch, per-API-call with a monthly cap. It worked. Then the product added credits, volume tiers, and enterprise contracts with custom rates, and the meter quietly accumulated edge cases. A finance reconciliation eighteen months later found that the meter had been attributing late-arriving events to the arrival month rather than the usage month, so usage near month boundaries landed on the wrong invoice, and a retry bug double-counted a small fraction of events for one high-volume customer. The metric that broke was the gap between metered revenue and reconciled revenue, which had grown to over 1% and which no alert had ever flagged because every invoice looked valid. The company migrated to a billing platform and spent a quarter reconciling historical discrepancies. The build had never thrown a single error.

## Decision guidance

The mistake is treating metering as event counting you can obviously handle, when it is an exactly-once financial system whose bugs are invisible by construction.

**The rule: If your pricing has tiers, credits, or hybrid contracts, then buy your metering, because the exactly-once and late-event correctness it requires is where homegrown meters silently leak revenue.**

The honest exception is a genuinely flat, single-dimension meter that you are confident will stay flat, where the correctness surface is small enough to own, or a scale so extreme that no vendor fits. Those are rare and usually temporary, because pricing complexity grows with the business. The tell is when Stripe, which could build anything, chose to buy: if metering at scale was a tractable build for the best payments team in the world, they would have built it.

## The billion-dollar tell

Build-versus-buy decisions are usually judgment calls with reasonable arguments on both sides. This one came with an unusually clear signal: a company that prints money on payments software, with world-class engineering and every incentive to build in-house, looked at usage metering and wrote a billion-dollar check to acquire it instead. They were not buying a feature. They were buying their way out of a correctness problem they understood well enough to respect.

The cheapest meter is the one whose bugs you never had to discover through a customer dispute. Metering looks like counting, and that is precisely why teams build it and precisely why they regret it. When the experts buy instead of build, the burden of proof is on building.

## FAQ

### Q: Should I build or buy usage-based billing?

Buy, in almost all cases. Usage metering is a hard exactly-once distributed-systems problem where duplicate, late, and out-of-order events silently mis-bill customers, and the bugs produce valid-looking invoices with no error signal. The strongest evidence is that Stripe, with elite payments engineering, paid about $1 billion for Metronome rather than building metering itself. Build only for genuinely flat pricing or scale no vendor serves.

### Q: Why did Stripe pay $1 billion for Metronome?

Because Stripe Billing's 2018 architecture was built for subscriptions with pre-aggregated usage, not real-time event streaming at AI scale, and retrofitting it was harder than acquiring a purpose-built engine. Metronome already powered usage billing for OpenAI, Anthropic, Databricks, and NVIDIA. Stripe vertically integrated metering to own the billing stack for AI companies that ingest millions of usage events per second.

### Q: Why is usage metering harder than it looks?

Because it must count each billable event exactly once even when the pipeline delivers duplicates, and attribute late or out-of-order events to the period they occurred in, not when they arrived. Distributed pipelines guarantee at-least-once delivery, so duplicates are normal traffic, not edge cases. It is also six layers, ingestion, dedup, aggregation, rating, invoicing, and revenue recognition, where a low-level mistake propagates into wrong invoices.

### Q: What goes wrong with a homegrown metering system?

Bidirectional, silent errors. Without deduplication it overbills, triggering disputes and refunds. Attributing events by arrival time instead of event time puts usage on the wrong invoice. Mishandling events that arrive after a period closes either leaks revenue or reopens finalized invoices. None of these throw errors, so they surface through customer disputes, audits, or a revenue figure that was always slightly wrong, often after significant damage.

### Q: How much does a metering bug cost?

More than it appears, because it is invisible. On $12M of annual usage revenue, even a 1% metering error, which is good for a homegrown system, is $120,000 a year mis-billed, split between silent under-billing that never generates a complaint and over-billing that causes disputes and churn. A mature platform targeting around 99.99% accuracy reduces that to roughly $1,200, and the difference is pure, undetected leakage.

### Q: When is building usage metering justified?

In narrow cases: a genuinely simple, single-dimension meter like flat per-API-call with no credits, tiers, or hybrid contracts, where the correctness surface is small, or a scale and specificity that no vendor can serve, which is essentially the position of Stripe's largest customers. Even then, building is justified only if metering is core to your differentiation. Pricing complexity tends to grow, so simple meters rarely stay simple.

### Q: What usage-based billing platforms should I consider?

The mature options include Stripe Billing and Metronome (now Stripe-owned), Orb, and Lago, which is open-source if vendor lock-in is a concern. Stripe Billing is the cheapest entry point but shallower on complex usage models, while Metronome handles the most complex consumption models at the cost of a longer rollout. Choose based on your pricing complexity, event volume, and whether you need self-hosting.

## Next Read

Metering is one build-versus-buy decision where the cost of build is hidden. For the general framework behind the call, read [the build versus buy decision framework](https://ravoid.com/blog/build-vs-buy-saas-decision-framework).

---

### Sources & Further Reading

- [Lago: Why Stripe Paid $1B for Metronome Instead of Fixing Billing](https://getlago.com/blog/why-stripe-paid-1b-for-metronome-instead-of-fixing-billing)
- [UsageBox: Idempotent Usage Metering](https://usagebox.com/articles/idempotent-usage-metering-dedup-late-events)
- [Flexprice: A Technical Deep Dive Into Usage-Based Billing](https://flexprice.io/blog/technical-deep-dive-usage-based-billing-for-ai-and-saas)
- [Sacra: Why Stripe Bought Metronome](https://sacra.com/research/why-stripe-bought-metronome/)

---

_Last updated: August 8, 2026_
