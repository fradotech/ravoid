# The One Metric VCs Gate On Now: Burn Multiple

_By Framesta Fernando · Engineering Manager & Technical Architect · 10 min read · Published August 1, 2026_

> **TL;DR:** Burn multiple is net burn divided by net new ARR, the dollars of cash you consume to add one dollar of recurring revenue. In 2026 it is the first number growth-stage VCs check, and above 2.0x most top-tier investors pass before they finish your deck. It measures whether your cash is buying growth worth having, which burn rate alone cannot tell you.

If you are raising in 2026 and your burn multiple is above 2.0x, most top-tier VCs will pass before they finish your deck ([CFO Advisors' burn multiple benchmarks](https://cfoadvisors.com/blog/2026-burn-multiple-benchmarks-series-a-saas)). Not after diligence, not after the partner meeting. Before. The number has become the gate, the single figure that decides whether the rest of your pitch gets read, and a startling number of founders walk into a raise without knowing theirs or knowing why it matters more than their growth rate.

The reason is a shift in what investors are buying. Burn rate tells you how fast cash is leaving the building. The burn multiple tells you whether that cash is buying anything worth having, and those are completely different questions that most founders conflate ([SaaS CEO's burn multiple guide](https://www.saasceo.com/burn-multiple/)). A company can raise a round, watch a healthy bank balance for eighteen months, and be quietly destroying value the entire time, because a comfortable runway says nothing about whether the spending is productive. The burn multiple is the number that exposes the difference.

## What it measures that burn rate cannot

The formula is simple: burn multiple equals net burn divided by net new ARR, where net new ARR is the change in recurring revenue over a period including new logos and expansion, minus churn and contraction ([Capitaly's breakdown](https://www.capitaly.vc/blog/david-sacks-capital-efficiency-burn-multiple-benchmarks)). It answers one question every acquirer and investor asks before anything else: how many dollars of cash did you consume to create one dollar of new recurring revenue.

That question is invisible to burn rate. Two companies can burn the identical $2 million a year and be opposite businesses. One adds $4 million in new ARR for that burn, a 0.5x multiple, an efficient growth machine. The other adds $1 million, a 2.0x multiple, lighting money on fire and calling it growth ([SaaS CEO](https://www.saasceo.com/burn-multiple/)). Their burn rates are the same, their bank statements look similar, and one is roughly four times as good at converting cash into durable revenue. Burn rate measures the speed of the leak. The burn multiple measures whether the leak is buying you anything.

## The thresholds that gate a raise

The benchmarks are unusually crisp, which is part of why the metric became a gate. Below 1x is elite, 1x to 1.5x is good, and above 2x is a red flag post-Series A ([IdeaPlan's burn multiple definition](https://www.ideaplan.io/metrics/burn-multiple)). The 2026 median for a Series A SaaS company is around 1.6x, while the top quartile is hitting 1.0 to 1.2x, and that gap is widening ([CFO Advisors](https://cfoadvisors.com/blog/2026-burn-multiple-benchmarks-series-a-saas)). A sub-1.5x multiple in 2026 proves you run a tight ship and value resourcefulness ([Runway's benchmarks](https://runway.com/blog/burn-multiple-benchmarks-for-2026-what-good-looks-like-at-seed-to-scale)).

| Burn multiple | Reading | Fundraising signal |
| --- | --- | --- |
| Below 1.0x | Elite efficiency | Strong, premium terms |
| 1.0x - 1.5x | Good, tight ship | Fundable |
| 1.5x - 2.0x | Median to weak | Questions, pressure |
| Above 2.0x | Red flag post-A | VCs pass early |

The crucial part is how the metric interacts with growth. A company growing 200% year over year with a burn multiple of 3.0 gets harder questions than a company growing 100% with a 1.2 ([CFO Advisors' board KPI benchmarks](https://cfoadvisors.com/blog/2026-series-a-board-deck-kpi-benchmarks)). That inverts the old playbook, where a bigger growth number always won. Now the efficiency of the growth is weighed against the growth itself, and inefficient hypergrowth scores worse than disciplined moderate growth.

## The anchor: cash has a productivity, not just a speed

The reframing that makes the burn multiple click is to treat cash like any other input with a productivity measure. You would never evaluate a factory by how fast it consumes raw materials, you would measure output per unit of input. Burn rate is the consumption speed. The burn multiple is the output per dollar, and it is the only one of the two that tells you whether the business is creating or destroying value as it spends.

This is why a long runway can be dangerous rather than reassuring. A company with twenty-four months of runway and a 3.0x burn multiple is not safe, it is spending efficiently-raised capital inefficiently, and it will reach the next raise with weak unit economics and a worse story. The runway bought time, not progress. That is the same trap I described from the cash-flow side in [the SaaS burn rate and runway guide](https://ravoid.com/blog/saas-burn-rate-and-runway-guide): the bank balance answers "how long" but never "how well," and the burn multiple is the "how well." It is one of the efficiency gates that replaced pure growth, alongside [the Rule of 40 that quietly became the Rule of 28](https://ravoid.com/blog/rule-of-40-2026).

## How much capital your inefficiency actually costs

The burn multiple is not just a grade, it is a multiplier on how much you must raise and how much you dilute to reach a target. Work it directly. Say you need to add $10 million in ARR to reach your next milestone.

```ts
function capitalToTarget(arrTarget: number, burnMultiple: number) {
  return arrTarget * burnMultiple;   // cash you must burn to get there
}
capitalToTarget(10_000_000, 0.5); //  $5,000,000  (elite)
capitalToTarget(10_000_000, 1.5); // $15,000,000  (good)
capitalToTarget(10_000_000, 3.0); // $30,000,000  (red flag)
```

To add the same $10 million of ARR, the elite company burns $5 million and the inefficient one burns $30 million, six times the capital for the identical revenue outcome. That difference is raised at a valuation, so it is also six times the dilution, which is why founders feel the burn multiple in their ownership stake even when the round closes. Improving the multiple is not an accounting nicety, it is the difference between owning your company and renting it from your cap table. The levers that move it are the same unit-economics levers I keep returning to: retention, so churn does not erode net new ARR, covered in [churn reduction strategies for B2B SaaS](https://ravoid.com/blog/churn-reduction-strategies-b2b-saas), and acquisition efficiency, covered in [LTV versus CAC for SaaS](https://ravoid.com/blog/ltv-vs-cac-saas-explained).

## A post-mortem on a healthy bank balance

A composite from the documented pattern, with figures labeled illustrative: a Series A company raised $15 million, grew ARR 150% year over year, and reported a comfortable two years of runway to its board. The story looked strong until a prospective Series B investor computed the burn multiple: roughly $9 million of net burn against $3.5 million of net new ARR, a 2.6x multiple. The growth was real but expensive, funded by a large sales team and heavy paid acquisition that produced revenue at well below the efficiency the market now required. The metric that broke was not runway, which looked fine, it was the burn multiple, which signaled that every dollar of growth cost more than two dollars of cash. The round came in flat and gated explicitly on improving capital efficiency before the next conversation. The company had spent eighteen months building a growth story that the one gating number quietly disqualified.

## Framework: read the three numbers together

| Question | Metric | What it misses alone |
| --- | --- | --- |
| How fast is cash leaving? | Burn rate | Whether spend is productive |
| How efficient is the growth? | Burn multiple | Absolute scale and timing |
| How long until empty? | Runway | Whether time is buying progress |

Read all three. Burn rate sizes the spend, runway sizes the clock, and the burn multiple is the one that tells you whether the spend and the clock are producing anything. A founder who steers by runway alone can feel safe while the burn multiple is quietly disqualifying the next raise.

## Decision guidance

The mistake is optimizing for growth rate or watching runway while ignoring the efficiency number that now gates the round.

**The rule: If your burn multiple is above 2.0x and you plan to raise, then fix capital efficiency before you grow faster, because more inefficient growth makes the gating number worse, not better.**

The honest exception is the earliest stage, pre-revenue or seed, where there is little or no net new ARR to divide by and the burn multiple is noisy or undefined. There, the metric is not yet meaningful and you steer by milestones and runway. From Series A onward, once you are between roughly $2M and $25M ARR and burning cash to grow, the burn multiple is the efficiency number to steer by, and ignoring it is how a good growth story meets a flat term sheet.

## The number behind the number

Growth rate is the number founders love to show. Runway is the number that makes a board feel safe. The burn multiple is the number that decides whether either of those matters, because it is the one that answers whether the cash you are spending is building a business or just buying revenue you cannot sustain. In 2026 it moved to the front of the diligence process, which means it should move to the front of how you run the company.

The question is no longer how fast you are growing or how long your cash lasts. It is how many dollars you burn to earn the next dollar of recurring revenue, because that single number is what an investor decides on before they decide to keep reading.

## FAQ

### Q: What is a burn multiple?

It is net burn divided by net new ARR, measuring how many dollars of cash a company consumes to generate one dollar of new recurring revenue. Net new ARR includes new logos and expansion minus churn and contraction. A lower number means more capital-efficient growth. It answers whether your spending is productive, which burn rate alone cannot tell you, and it has become the primary capital-efficiency metric investors check.

### Q: What is a good burn multiple in 2026?

Below 1.0x is elite, 1.0x to 1.5x is good, and above 2.0x is a red flag for a post-Series A company. The 2026 Series A median is around 1.6x, with the top quartile at 1.0 to 1.2x. A sub-1.5x multiple signals a tight, resourceful operation. Above 2.0x, most top-tier VCs pass early in the process, often before finishing the deck.

### Q: How is burn multiple different from burn rate?

Burn rate measures how fast cash leaves, in dollars per month or year. Burn multiple measures whether that cash is buying anything, by dividing it by the new ARR it produced. Two companies with identical burn rates can have very different burn multiples: one adding $4M of ARR per $2M burned is efficient, one adding $1M is not. Burn rate is speed, burn multiple is productivity.

### Q: How do I calculate burn multiple?

Divide net burn over a period by net new ARR over the same period. Net burn is cash out minus cash in. Net new ARR is the change in annual recurring revenue, counting new customers and expansion, minus churn and contraction. For example, $2M of net burn producing $4M of net new ARR is a 0.5x burn multiple. Use the same period for both numbers.

### Q: Why do VCs care so much about burn multiple now?

Because capital got expensive and efficient growth now commands a premium. Efficient companies with a burn multiple under 1x and a strong Rule of 40 traded at about 2.3x the revenue multiple of inefficient peers. The burn multiple is the cleanest single signal of whether growth is capital-efficient, so investors use it as an early gate: above 2.0x, the rest of the pitch rarely gets a fair reading.

### Q: Does a high growth rate offset a bad burn multiple?

Less than it used to. A company growing 200% with a 3.0 burn multiple gets harder questions than one growing 100% with a 1.2, because the market now weighs the efficiency of growth against its size. Inefficient hypergrowth is no longer automatically rewarded. You can still raise on growth, but a poor burn multiple invites scrutiny that strong growth alone no longer waves away.

### Q: How does burn multiple affect how much I have to raise?

Directly, as a multiplier. To add a given amount of ARR, you burn that amount times your burn multiple. Adding $10M of ARR costs $5M of cash at 0.5x but $30M at 3.0x, six times the capital for the same revenue, raised at the cost of six times the dilution. Improving the multiple reduces both the cash you need and the ownership you give up.

## Next Read

The burn multiple measures whether spend is productive. To manage the cash side it divides into, read [the SaaS burn rate and runway guide](https://ravoid.com/blog/saas-burn-rate-and-runway-guide).

---

### Sources & Further Reading

- [CFO Advisors: 2026 Burn Multiple Benchmarks for Series A SaaS](https://cfoadvisors.com/blog/2026-burn-multiple-benchmarks-series-a-saas)
- [SaaS CEO: Burn Multiple, the Capital Efficiency Metric Acquirers Check](https://www.saasceo.com/burn-multiple/)
- [IdeaPlan: Burn Multiple Definition, Formula & Benchmarks](https://www.ideaplan.io/metrics/burn-multiple)
- [Waveup: Capital Efficiency in 2026](https://waveup.com/blog/capital-efficiency/)

---

_Last updated: August 1, 2026_
