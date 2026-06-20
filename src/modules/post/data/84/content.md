# Your NRR Is Two Numbers Pretending to Be One

_By Framesta Fernando · Engineering Manager & Technical Architect · 10 min read · Published July 25, 2026_

> **TL;DR:** Net revenue retention in 2026 blends two opposing forces, churn and expansion, into a single number that hides both. A healthy-looking 110% NRR can sit on top of a 15% leaky bucket carried by a handful of expanding accounts. Read gross retention and segment mix separately, or the metric will tell you you are growing while the base quietly drains.

A 110% net revenue retention number on a board slide looks like proof of health. Existing customers are paying more than they did a year ago, the base is compounding, the bucket is filling. Sometimes that is exactly what it means. Sometimes it means a company is quietly losing 15% of its revenue base every year and papering over it with expansion from three big accounts. The same 110% describes both, which is the problem. Net revenue retention is two numbers wearing one costume, and the costume is the part everyone reads.

NRR has earned its status, customer acquisition costs roughly doubled since 2020, expanding existing customers is 5 to 10x cheaper than acquiring new ones, and a 10-point NRR improvement can translate to a 20 to 30% valuation uplift ([Idea Plan's NRR analysis](https://www.ideaplan.io/blog/why-nrr-is-the-single-most-important-saas-metric-2026)). That importance is exactly why reading it as a single figure is dangerous. The more weight a metric carries in your valuation and your board's confidence, the more it matters that the metric is hiding its own composition.

## What NRR actually combines

NRR measures how much revenue you retained and expanded from existing customers over a period, including upsells, cross-sells, and price increases, minus churn and contraction ([Klipfolio's metric definition](https://www.klipfolio.com/metrics/difference/net-revenue-retention-rate-vs-gross-revenue-retention-rate)). That single sentence contains two forces pulling in opposite directions. Churn and contraction drag the number down. Expansion pushes it up. NRR reports only the net result, so it cannot tell you whether a 110% came from a stable base growing modestly or a hemorrhaging base rescued by a few whales.

The companion metric exists precisely to separate them. Gross revenue retention measures how much recurring revenue you kept excluding all expansion, so it captures only churn and downgrades and can never exceed 100% ([Corporate Finance Institute's GRR vs NRR guide](https://corporatefinanceinstitute.com/resources/valuation/grr-vs-nrr-saas-retention-metrics)). GRR is the floor: it tells you how leaky the bucket is before anyone pours expansion back in. NRR without GRR is half the picture, and it is the flattering half.

## Two companies, the same 110%, opposite futures

Work the decomposition on two companies that both report a 110% NRR, starting from $10M ARR. The movement figures are illustrative; the structure is the point.

```
Company A:  churn/contraction -$2.5M (GRR 75%) + expansion +$3.5M = $11.0M -> NRR 110%
Company B:  churn/contraction -$0.7M (GRR 93%) + expansion +$1.7M = $11.0M -> NRR 110%
```

Identical headline. Company B keeps 93 cents of every revenue dollar before expansion, a stable base it can grow on. Company A keeps only 75, which means it loses a quarter of its revenue base every year and only looks healthy because expansion, often concentrated in a few accounts, refilled the bucket faster than it drained. If Company A's expansion slows for one quarter, or one big expanding account leaves, the 110% collapses toward 75, and there is no acquisition rate that outruns a bucket leaking that fast. As the saying goes in retention circles, below-100 GRR with above-100 NRR is a leaky bucket no amount of new logos can fix ([Uplift GTM's NRR breakdown](https://www.upliftgtm.com/blog/net-revenue-retention)).

This is why GRR is the question a careful investor asks second, right after NRR: GRR shows how stable the base is, NRR shows whether it is expanding ([Maxio's gross vs net comparison](https://www.maxio.com/saaspedia/gross-retention-vs-net-retention)). A high NRR on a low GRR is not growth, it is a race between a leak and a pump.

## The second thing it hides: who is actually retaining

There is a second masking effect, and it is just as costly. A blended NRR averages across segments that behave nothing alike. Median private SaaS NRR slipped from roughly 105% in 2021 to about 101% in 2024, but the median hides the real story: enterprise accounts hold near 118% while SMB sits around 97% ([Digital Applied's NRR benchmarks](https://www.digitalapplied.com/blog/net-revenue-retention-benchmarks-2026-saas-expansion-data)). A company reporting a respectable blended 105% might be running a thriving 118% enterprise book and a 97% SMB book that is shrinking every quarter.

That blend changes what you should do. If your enterprise segment carries the number and SMB leaks, pouring acquisition spend into SMB is filling a bucket with a hole in it, the exact dynamic I covered in [churn reduction strategies for B2B SaaS](https://ravoid.com/blog/churn-reduction-strategies-b2b-saas). The expansion economics that separate cohorts are not about pricing, mid-market accounts on multi-product contracts post around 116% NRR while single-product SMB lands near 102% ([Digital Applied's LTV benchmarks](https://www.digitalapplied.com/blog/customer-lifetime-value-benchmarks-2026-industry-data)). The blended figure tells you none of this. It tells you the average of a healthy business and a dying one, which is a number that describes neither.

| Metric | What it reveals | Ceiling | Reading it alone |
| --- | --- | --- | --- |
| GRR | Base stability, the leak | 100% | The honest floor |
| NRR | Net base growth | none | Flattering, hides churn |
| NRR by segment | Where retention lives | none | Catches segment divergence |
| Expansion concentration | Whale dependence | none | Catches fragility |

## The anchor: a blended metric averages away the decision

The deeper lesson is about blended metrics in general. Any single number that nets two opposing forces will hide the forces, and the forces are where the decisions live. NRR nets churn against expansion, the blended company nets enterprise against SMB, and in both cases the average is a number you cannot act on because it does not tell you which lever moved. You cannot fix a 101% by "improving NRR." You fix it by knowing whether the problem is a GRR leak, a stalled expansion motion, or a specific segment draining, and those are three completely different projects.

This is the same averaging trap I described for model quality in quantization and for warehouse waste spread across many small instances: the mean looks fine while a specific segment fails. The fix is always the same, decompose before you act. NRR is a cohort metric, you pick a starting group of customers and track their revenue over time ([SaaS CEO's retention guide](https://www.saasceo.com/revenue-retention/)), so the data to split it by segment, by GRR versus expansion, and by account concentration is already in the same query you used to compute the headline.

## Decompose it in the query you already run

The components are mechanical to separate. Pull starting revenue, then churn, contraction, and expansion as distinct movements, and compute both retention numbers from the same baseline:

```sql
-- GRR and NRR from the same cohort baseline, split by segment
SELECT
  segment,
  SUM(start_arr)                                   AS base,
  SUM(churn_arr + contraction_arr)                 AS lost,
  SUM(expansion_arr)                               AS gained,
  1 - SUM(churn_arr + contraction_arr)/SUM(start_arr)              AS grr,  -- the floor
  1 + (SUM(expansion_arr) - SUM(churn_arr + contraction_arr))
        / SUM(start_arr)                                            AS nrr   -- net
FROM cohort_revenue_movements
GROUP BY segment;                                  -- never look at the blend alone
```

The `GROUP BY segment` is the entire point. The moment you split the number, the leaky SMB book and the thriving enterprise book stop hiding behind each other, and the GRR column tells you how much of your NRR is real stability versus expansion rescue. Pair this with an expansion-concentration check (what share of expansion came from your top five accounts) and you have replaced one flattering number with three you can act on, the same forecasting discipline I argued for in [the SaaS burn rate and runway guide](https://ravoid.com/blog/saas-burn-rate-and-runway-guide). It is the same single-number trap that turned [the Rule of 40 into the Rule of 28](https://ravoid.com/blog/rule-of-40-2026): a blended figure hiding its own composition.

## A post-mortem on a healthy-looking number

A composite from the pattern, figures labeled illustrative: a Series C company reported a steady 112% NRR for four straight quarters and used it to raise on a strong retention story. The decomposition told a different story the board had never seen. GRR was sitting at 82%, meaning nearly a fifth of the revenue base churned annually, and the 112% was carried by expansion concentrated in the top 8% of accounts, mostly enterprise seats and usage growth. When the macro environment tightened, two of those large accounts cut usage, expansion fell, and NRR dropped to 94% in a single quarter, exposing the 82% floor that had been there the whole time. The metric that broke was not NRR, it was GRR, which had been quietly signaling a leaky base for a year while the blended number reported health. The fix, a serious investment in onboarding and SMB retention, should have started four quarters earlier, when the GRR was already visible to anyone who split the number.

## Framework: read retention as a stack

| Question | Metric | Red flag |
| --- | --- | --- |
| How leaky is the base? | GRR | Below ~90% |
| Is the base net-growing? | NRR | Below 100% |
| Where does retention live? | NRR by segment | One segment carries it |
| How fragile is expansion? | Top-account share of expansion | Concentrated in a few |

Read bottom-up in importance: GRR first because it is the floor everything else sits on, then NRR for net direction, then the segment split and concentration check to find where the strength and the fragility actually live. A strong NRR on a weak GRR is a warning, not a win.

## Decision guidance

The mistake is treating NRR as a single health score and optimizing toward the number instead of toward the forces inside it.

**The rule: If your NRR is above 100% but your GRR is below 90%, then treat retention as your top priority regardless of how good the headline looks, because expansion is masking a base that is draining.**

The honest exception is a genuine land-and-expand model with deliberately low initial contracts and a proven, broad-based expansion motion, where a lower GRR is a designed feature of small initial deals that reliably grow. Even there, the test is breadth: expansion spread across many accounts is a strategy, expansion concentrated in a few is a single point of failure wearing a good NRR. Know which one you have before you call it healthy.

## The number that nets away the truth

Net revenue retention is the most-watched metric in SaaS for good reasons, and that is exactly why reading it alone is a mistake. It nets churn against expansion and averages across segments, and both of those operations destroy the information you actually need: how leaky the base is, and where the strength lives. A 110% can be a compounding machine or a leaky bucket with a good pump, and the headline will never tell you which.

The question is not what your NRR is. It is what your NRR is hiding, because in 2026 the companies that get surprised by a retention cliff are almost always the ones that read the blended number and never split it.

## FAQ

### Q: What is a good net revenue retention rate in 2026?

Above 100% means existing customers generate more revenue than a year ago before any new logos. Median private SaaS sits around 101%, top-tier companies run above 130%, and segment matters: enterprise often holds near 118% while SMB lands closer to 97%. But the headline alone is not enough, because a strong NRR can sit on a weak gross retention floor that the number hides.

### Q: What is the difference between NRR and GRR?

Gross revenue retention measures how much recurring revenue you keep after churn and downgrades, excluding all expansion, so it caps at 100% and shows base stability. Net revenue retention adds expansion from upsells, cross-sells, and price increases back in, so it can exceed 100%. GRR is the floor, NRR is the net result. NRR without GRR hides how leaky the base is.

### Q: Can a company have high NRR and still be in trouble?

Yes. A 110% NRR can sit on a 75% GRR, meaning the company loses a quarter of its revenue base annually and only looks healthy because expansion, often concentrated in a few large accounts, refills the bucket. If expansion slows or a big account leaves, NRR collapses toward the GRR floor. High NRR on low GRR is a leaky bucket, not durable growth.

### Q: Why should I split NRR by segment?

Because a blended NRR averages segments that behave nothing alike. A respectable 105% blend can hide a thriving 118% enterprise book and a shrinking 97% SMB book. The average describes neither and tells you nothing about where to act. Splitting NRR by segment reveals whether one cohort carries the number while another drains, which changes where you invest in retention versus acquisition.

### Q: How do I calculate GRR and NRR correctly?

Use the same cohort and starting baseline for both. GRR is one minus churn and contraction divided by starting revenue, capped at 100%. NRR is one plus expansion minus churn and contraction, divided by starting revenue. The common mistake is mixing baselines or counting new-logo revenue, which only belongs in acquisition metrics, not retention. Compute both from the same movement data, grouped by segment.

### Q: How much does NRR affect SaaS valuation?

Substantially. A 10-point NRR improvement translates to roughly a 20 to 30% valuation uplift, and high-NRR companies grow about 2.5x faster than low-NRR peers. That sensitivity is exactly why reading NRR without GRR is risky: a number this influential should not hide a draining base. Investors increasingly ask for GRR and segment splits precisely to see what the blended NRR conceals.

### Q: What is expansion concentration and why does it matter?

Expansion concentration is the share of your expansion revenue coming from a small number of accounts. If most of your NRR-boosting expansion comes from your top few customers, the metric is fragile: losing or shrinking one of them can drop NRR sharply. Broad expansion across many accounts is a durable strategy, while concentrated expansion is a single point of failure disguised as a healthy retention number.

## Next Read

Retention is one half of unit economics. For how it pairs with the cost of acquiring customers in the first place, read [LTV versus CAC for SaaS, explained](https://ravoid.com/blog/ltv-vs-cac-saas-explained).

---

### Sources & Further Reading

- [Digital Applied: Net Revenue Retention Benchmarks 2026](https://www.digitalapplied.com/blog/net-revenue-retention-benchmarks-2026-saas-expansion-data)
- [Corporate Finance Institute: GRR vs NRR](https://corporatefinanceinstitute.com/resources/valuation/grr-vs-nrr-saas-retention-metrics)
- [Maxio: Gross Retention vs Net Retention](https://www.maxio.com/saaspedia/gross-retention-vs-net-retention)
- [Uplift GTM: Net Revenue Retention, formula and benchmarks](https://www.upliftgtm.com/blog/net-revenue-retention)

---

_Last updated: July 25, 2026_
