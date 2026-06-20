# The Rule of 40 Quietly Became the Rule of 28

_By Framesta Fernando · Engineering Manager & Technical Architect · 10 min read · Published July 19, 2026_

> **TL;DR:** The Rule of 40 in 2026 has a median score around 28 for mid-stage private SaaS, down from 32 a few years earlier. The 40 threshold did not move, the companies did, so clearing it is now top-quartile rather than average. And a single score hides whether you got there through growth or profit, which changes everything about its risk.

The Rule of 40 has a quiet problem in 2026: most SaaS companies no longer pass it. The median score for private SaaS in the $5M to $30M ARR range sits around 28, down from 32 in 2022, which means the typical company is a full twelve points under the bar everyone still treats as the baseline ([the OpenView benchmark cited in StealthAgents' 2026 metrics roundup](https://stealthagents.com/research/saas-startup-metrics-statistics-2026)). The threshold did not get harder. The companies got worse at clearing it, all at once, because the conditions that fund growth changed underneath the entire category.

The reason this matters is not vanity. The Rule of 40, the idea that revenue growth rate plus profit margin should sum to at least 40, has become the first number investors and boards look at to decide whether a SaaS business is healthy or quietly burning ([Wall Street Prep's overview](https://www.wallstreetprep.com/knowledge/rule-of-40/)). When the median falls below the bar, "average" and "fundable" stop being the same thing. Hitting 40 used to put you in the middle of the pack. Now it puts you in the top quartile, and that shift reframes what you should be optimizing for.

## What the rule actually says, and how to read it

The formula is deliberately simple: add your year-over-year revenue growth rate to your profit margin, expressed as percentages, and the sum should clear 40 ([Kissmetrics' calculation guide](https://www.kissmetrics.io/glossary/rule-of-40)). Thirty percent growth plus a 15% margin is 45, a pass. The margin can be EBITDA or free cash flow depending on who is reading, but the structure is always growth plus profitability against a single bar.

Its appeal is that it captures a real tradeoff in one number: you can buy growth by spending profit, or harvest profit by slowing growth, and the rule says the combination has to stay above a line. The danger is the same simplicity. A single score collapses two very different businesses into the same grade, and that is where most readings of it go wrong.

## Two companies score 40. Only one is safe

Work the arithmetic on two companies that land on the identical score:

```
Company A:  growth 60%  +  margin -20%  =  40   (passes)
Company B:  growth 15%  +  margin  25%  =  40   (passes)
```

Both clear the bar. They are not remotely the same business. Company A is burning 20 cents of margin for every dollar of revenue to sustain 60% growth, and its score depends entirely on that growth rate holding. If growth decelerates to 30%, its score collapses to 10 unless it can cut burn fast, which growth-addicted cost structures rarely can. Company B is growing modestly but generating real cash, so its score is durable and it controls its own runway.

The contradiction the single number hides: a high Rule of 40 score built on negative margin is fragile, because it is a bet that growth never slows, and in 2026 growth slowed for almost everyone. This is the same trap I described from the acquisition side in [LTV versus CAC for SaaS](https://ravoid.com/blog/ltv-vs-cac-saas-explained): a metric that looks healthy can be one deceleration away from falling apart, depending on what is underneath it. The score is necessary, not sufficient. You have to read its composition.

| Score source | Growth | Margin | Durability |
| --- | --- | --- | --- |
| Growth-funded 40 | 60% | -20% | Fragile, bet on growth |
| Balanced 40 | 30% | 10% | Solid |
| Profit-funded 40 | 15% | 25% | Durable, self-funding |
| Below the bar | 20% | 8% | The new median (28) |

## The anchor: the goalposts moved while you were aiming

Here is the framing that reorders priorities. Most teams treat 40 as a fixed law of nature, set their plan against it, and feel fine landing at 35. But the meaning of any benchmark is relative to the distribution around it, and the distribution shifted. When the median is 28, a 35 is no longer "just short of average," it is comfortably above the pack. And a genuine 40 is no longer the baseline, it is a differentiator that markets pay for.

The valuation data makes the differentiator concrete. Efficient SaaS companies clearing the Rule of 40 with a burn multiple under 1x traded at roughly 2.3x the revenue multiple of inefficient peers ([Waveup's reading of the Bessemer Cloud 100](https://waveup.com/blog/capital-efficiency/)). That is not a rounding difference, it is more than double the valuation for the same revenue, awarded specifically for the efficiency that the median company lost. The rule stopped being a pass/fail gate and became a pricing function: the further above the moved median you sit, the more each dollar of ARR is worth.

## Why the whole category slid

The decline is not a failure of execution at individual companies, it is a structural reset. Cheap capital made negative-margin, growth-funded scores viable for a decade, because you could always raise the next round to cover the burn. When capital got expensive, the growth half of the equation got harder to fund and the market started demanding the profit half, so companies that optimized purely for growth found themselves scoring 28 against a bar built for a different era. The same forces that pushed [CAC payback past 18 months](https://ravoid.com/blog/cac-payback-2026) pushed Rule of 40 scores down, because they are two views of the same squeeze: acquisition got more expensive, so buying growth costs more margin, so the sum falls.

That linkage is the practical insight. You do not fix a Rule of 40 score by chasing the score directly. You fix it by fixing what feeds it: the unit economics that determine how much margin your growth consumes, and the burn efficiency that determines whether that growth is self-funding. The score is a readout, not a lever, which is why the runway discipline in [the SaaS burn rate and runway guide](https://ravoid.com/blog/saas-burn-rate-and-runway-guide) does more for your Rule of 40 than any amount of staring at the number.

## A post-mortem on a passing grade

A composite from the pattern, with figures labeled illustrative: a Series B vertical SaaS company reported a Rule of 40 score of 44 to its board and treated it as proof of health. The composition told a different story: 64% growth against a -20% free cash flow margin. The growth was funded by aggressive paid acquisition and a heavy sales team, and the margin reflected it. Two quarters later, a softening market pulled growth down to 38%, the burn structure could not be cut fast enough to compensate, and the score fell to 18. The metric that broke was not the score itself, it was the gross-margin-adjusted burn that the score had been masking: the company was spending so far ahead of its profitability that any deceleration was fatal to the number. A board that had read the composition, not just the sum, would have flagged the fragility two quarters earlier.

## Framework: read the score in three parts

| Question | Why it matters | Red flag |
| --- | --- | --- |
| What is the sum? | Baseline health vs the moved median | Below ~28 |
| How is it composed? | Growth-funded scores are fragile | Negative margin carrying it |
| Is it durable to a slowdown? | Score depends on growth holding | Collapses if growth halves |

Read top to bottom. The sum tells you where you sit against a median that is now 28, not 40. The composition tells you whether the score is a strength or a disguised risk. And the durability test, what happens to the score if growth halves, tells you whether you own your runway or are renting it from the next round.

## Decision guidance

The instinct when a score is low is to push growth, because growth is the bigger, faster-moving term. In 2026 that instinct is usually wrong, because growth bought with margin produces exactly the fragile score that markets now discount.

**The rule: If your Rule of 40 score depends on a negative margin to clear the bar, then fix unit economics before chasing more growth, because a growth-funded score collapses the moment growth slows.**

The honest exception is a true land-grab market with durable network effects, where speed to dominant share justifies temporary negative margin and the score is allowed to be growth-heavy on purpose. That exception is rare and getting rarer, and even there the market wants to see a credible path to the profit half. For everyone else, a durable 35 built on real margin beats a fragile 44 built on burn, regardless of which number is bigger.

## The bar that stayed still

Nobody changed the Rule of 40. The 40 is exactly where it was. What changed is the field around it: the median slid to 28, cheap capital stopped subsidizing growth-funded scores, and the market began paying a premium for the efficiency most companies lost. So the same number means something different now. Clearing 40 is no longer table stakes, it is a competitive advantage, and a high score that hides a negative margin is no longer impressive, it is a warning.

The question is not whether you pass the Rule of 40. It is whether your score would survive your growth rate getting cut in half, because in 2026, that is the test the market is quietly running on you.

## FAQ

### Q: What is the Rule of 40 in 2026?

It is the benchmark that a SaaS company's revenue growth rate plus its profit margin should sum to at least 40%. The threshold is unchanged, but the median score for mid-stage private SaaS has fallen to around 28, down from 32 in 2022. So clearing 40 is now top-quartile performance rather than the average it once represented.

### Q: How do you calculate the Rule of 40?

Add your year-over-year revenue growth rate to your profit margin, both as percentages. The margin can be EBITDA or free cash flow margin depending on the audience. For example, 30% growth plus a 15% margin equals 45, which passes. The simplicity is the point, but it also means the single number hides how the score was achieved.

### Q: Why did the median Rule of 40 score drop?

Because the cost of growth rose while cheap capital disappeared. For a decade, companies funded negative-margin growth with the next round. When capital got expensive and acquisition costs climbed, buying growth consumed more margin, so the growth-plus-margin sum fell across the category. The decline is structural, not a failure of individual execution.

### Q: Can two companies with the same Rule of 40 score be very different?

Yes, dramatically. A score of 40 from 60% growth and a -20% margin is fragile because it depends on growth never slowing. A score of 40 from 15% growth and a 25% margin is durable and self-funding. Same number, opposite risk profiles. Always read the composition, not just the sum, because a high growth-funded score can collapse on any deceleration.

### Q: How does the Rule of 40 affect SaaS valuation?

Significantly. Efficient companies clearing the Rule of 40 with a burn multiple under 1x traded at roughly 2.3x the revenue multiple of inefficient peers. As the median fell below 40, the rule shifted from a pass/fail gate to a pricing function: the further above the median you sit, the more each dollar of ARR is worth, and a durable score commands a clear premium.

### Q: Should I prioritize growth or margin to improve my score?

Fix the underlying unit economics first. If your score depends on a negative margin, pushing more growth usually makes it more fragile, not healthier, because growth bought with burn is exactly what the market now discounts. Improve the economics that determine how much margin your growth consumes, and the score follows. The score is a readout, not a lever you pull directly.

### Q: Is the Rule of 40 still useful if most companies fail it?

Yes, arguably more useful. A benchmark's value comes from the distribution around it, and a median of 28 makes the 40 line a sharper signal of relative quality. It separates durable, efficient businesses from fragile growth-funded ones precisely because clearing it is now hard. Pair it with composition and durability checks rather than treating the sum as a standalone grade.

## Next Read

The Rule of 40 is a readout of deeper unit economics. To see one of the biggest inputs feeding it, read [LTV versus CAC for SaaS, explained](https://ravoid.com/blog/ltv-vs-cac-saas-explained).

---

### Sources & Further Reading

- [Aventis Advisors: Rule of 40 in SaaS, 2026 Data and Benchmarks](https://aventis-advisors.com/rule-of-40-in-saas-2026/)
- [Wall Street Prep: The Rule of 40](https://www.wallstreetprep.com/knowledge/rule-of-40/)
- [Waveup: Capital Efficiency in 2026](https://waveup.com/blog/capital-efficiency/)
- [Corporate Finance Institute: The SaaS Rule of 40 Explained](https://corporatefinanceinstitute.com/resources/valuation/rule-of-40/)

---

_Last updated: July 19, 2026_
