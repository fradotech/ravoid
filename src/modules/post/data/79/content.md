# Your Savings Plan Is a Bet You Keep Losing

_By Framesta Fernando · Engineering Manager & Technical Architect · 11 min read · Published July 20, 2026_

> **TL;DR:** Reserved vs on-demand is not a discount decision, it is a wager on your future usage. A commitment is financial, not capacity, so an unused reservation still bills in full. The deepest discounts carry the tightest lock-in, so the right question is not "how much can I save" but "how confident am I that this workload stays put."

Be honest about how you bought your last Reserved Instance. Someone in finance pointed at the on-demand bill, someone in engineering said the workload was stable, and you locked a three-year all-upfront commitment for the biggest discount on the page. It felt like a win. It was a bet, and you may not know yet whether you won it.

Here is the part the discount table does not advertise: an AWS commitment is financial, not capacity, so an unused reservation still bills ([Atonement Licensing's RI analysis](https://atonementlicensing.com/blog/aws-reserved-instances/)). You are not buying cheaper compute. You are promising to pay for a defined amount of compute for one to three years, and AWS gives you a discount in exchange for taking the demand risk off their hands and putting it on yours. If your usage matches the promise, you win the bet and pocket up to 72%. If it does not, you keep paying for capacity you no longer use. Reserved versus on-demand is a question about confidence in a forecast, dressed up as a question about price.

## The discount is the premium on a risk transfer

On-demand pricing has one honest property: it charges you for exactly what you run, with zero commitment. Every discount mechanism above it is AWS buying down your flexibility. Reserved Instances and Savings Plans both require a one or three year commitment in exchange for up to roughly 72% off ([AWS's own re:Post guide](https://repost.aws/articles/ARw40KpfABSNaPUK65-KQmMQ/aws-reserved-instances-and-savings-plans-a-comprehensive-guide)). The discount is not generosity. It is the price AWS pays you to absorb the risk that your demand changes.

That reframes the entire decision. The discount scales with how much risk you take: a three-year all-upfront Standard RI reaches the maximum 72%, while a one-year no-upfront Convertible RI sits closer to 30% ([Atonement Licensing](https://atonementlicensing.com/blog/aws-reserved-instances/)). The deeper the discount, the longer and tighter the commitment, which means the biggest number on the page is also the biggest bet. Teams reflexively reach for the 72% because it looks like the smart financial move, without noticing they just made the least reversible decision available.

## The break-even is a utilization line

The bet has a precise break-even, and you can compute it. Take an illustrative on-demand rate of $1.00 per hour and a three-year all-upfront Standard RI at 72% off, an effective $0.28 per hour that you pay on every hour of the term whether you use the instance or not.

```
Committed cost (annualized): $0.28/hr x 8,760 hrs = $2,452.80 / year, paid regardless
Break-even usage vs on-demand: $2,452.80 / $1.00 = 2,453 hours
2,453 / 8,760 = ~28% utilization
```

Below roughly 28% utilization, that "savings plan" costs more than just paying on-demand for what you actually used. The discount only exists if you consume enough of the commitment to clear the line. A small function makes the logic explicit:

```ts
// Below this utilization, the commitment loses to on-demand
function breakEvenUtilization(discount: number): number {
  const committedRate = 1 - discount;        // e.g. 0.28 at 72% off
  return committedRate;                       // = break-even utilization fraction
}
breakEvenUtilization(0.72); // 0.28  -> need >28% usage to win the bet
breakEvenUtilization(0.30); // 0.70  -> a shallow discount needs 70% usage
```

The counterintuitive result: a deeper discount has a lower break-even, so it tolerates more idle. That sounds like the deep commitment is safer. It is not, because the deep commitment also has the tightest scope, and scope is where the bet is actually lost.

## How you actually lose: the workload moves

Utilization is the visible risk. The one that strands real money is scope. A Standard RI is locked to an instance family in a region, so the bet is not just "will I use this much compute," it is "will I still be running this exact instance family in this region in three years." In 2026, that is a genuinely hard thing to promise, because the migration to ARM-based instances and newer generations is exactly the kind of move that improves price-performance and instantly orphans a family-locked reservation.

Work the loss. Say you bought the three-year all-upfront Standard RI above, then eight months in your team migrates the workload to a cheaper Graviton instance family for better price-performance. The Standard RI does not follow you. It is locked to the old family, your new instances run at on-demand or under a different commitment, and the remaining 28 months of your prepayment sit stranded:

```
Prepaid 3-year term:        $2,452.80 x 3 = $7,358.40
Used before migration (8mo): ~$1,635
Stranded commitment:         ~$5,723  (paid for capacity you abandoned)
```

You can recover some of it by reselling on the RI Marketplace, where you set only the upfront price ([AWS's RI Marketplace page](https://aws.amazon.com/ec2/pricing/reserved-instances/marketplace/)), but you take a haircut and the sale is not guaranteed. The bet was never really about utilization. It was about whether your architecture would hold still for three years, and architectures that hold still for three years are the ones you should worry about for other reasons. This is the lock-in tax I traced across providers in [multi-cloud versus single-vendor hidden cost](https://ravoid.com/blog/multi-cloud-vs-single-vendor-hidden-cost): the cheapest-looking option often carries the highest switching cost, the same trap I described from the AI-platform angle in [Bedrock is easy to enter, expensive to leave](https://ravoid.com/blog/ai-platform-lock-in-cost).

## The anchor: you are short an option, and the market can move

The sharpest way to see a commitment is as a financial position. When you buy a deep reservation, you are effectively writing an option: you collect a discount today in exchange for giving up the right to change your mind. That position loses in two ways you do not control. First, your own usage shifts (you downsize, migrate, or sunset the workload), and the commitment strands. Second, AWS cuts prices or releases a cheaper instance generation, and your locked-in rate is suddenly above the new on-demand price, so you are paying a premium to be loyal to last year's hardware.

Both are bets against the direction the cloud market actually moves. Compute gets cheaper and instance families get more efficient over time, which means a long commitment is a wager that this stops happening to your specific workload. That is why a new category of tooling sells "insured commitments" with terms as short as 30 days ([Hanselminutes' interview with Archera](https://www.hanselminutes.com/)): the market is pricing the very flexibility that long reservations take away. The existence of insurance is a tell about where the risk lives.

| Option | Max discount | Flexibility | The bet you make |
| --- | --- | --- | --- |
| On-demand | 0% | Total | None, you pay retail |
| Compute Savings Plan | ~66% | Any family/region | Total spend stays roughly flat |
| Standard RI (3yr) | ~72% | Locked to family/region | This exact workload persists |
| Spot | ~90% | Interruptible | You tolerate 2-min eviction |

## Hedge with flexibility, and price the premium

The fix is not to avoid commitments, it is to buy the right amount of flexibility and treat the discount you give up as an insurance premium. A Compute Savings Plan tops out near 66% but applies across any instance family, region, and operating system, and even covers Lambda and Fargate, so the discount follows your usage as you migrate ([Redress Compliance's comparison](https://redresscompliance.com/aws-savings-plans-vs-reserved-instances)). You sacrifice roughly 6 to 9 percentage points versus a Standard RI ([DoiT's 2026 decision guide](https://www.doit.com/blog/aws-savings-plans-vs-reserved-instances-2026-the-decision-guide-engineers-actually-need)), and those points are the premium you pay to not get stranded when the workload moves.

The discipline is to match commitment depth to forecast confidence. A genuinely static, well-understood baseline (a database cluster that has not changed configuration in two years) can justify a Standard RI for the extra discount. Everything dynamic, anything you might re-architect, migrate, or scale unpredictably, belongs on the more flexible Compute Savings Plan or on-demand, the same overprovisioning lesson I keep returning to in [why SaaS teams overpay for infrastructure](https://ravoid.com/blog/why-saas-overpay-infrastructure).

## A post-mortem on a 72% win that lost

A composite from the common pattern, with figures labeled illustrative: a scaling startup ran a Reserved Instance coverage review and proudly raised commitment coverage from 40% to 95% with three-year all-upfront Standard RIs, booking a projected 70% discount and reporting it as a major cost win. Two quarters later, two things happened at once: their largest service was re-architected onto a newer Graviton family, and AWS released a cheaper generation that dropped the relevant on-demand price. Roughly a third of their committed capacity stranded against instance families they no longer ran, and another chunk was now locked above the new on-demand rate. The metric that broke was effective commitment utilization, which fell from a planned 95% to about 62%, turning a reported 70% discount into a real-world saving closer to 20% after the stranded spend. The win was real on the spreadsheet and lost in production, because the spreadsheet priced the discount and ignored the bet.

## Decision guidance

The error is optimizing for the discount instead of for the forecast that the discount is betting on.

**The rule: If you cannot confidently predict that a specific workload will run the same instance family and region for the full term, then take the flexible Compute Savings Plan or stay on-demand, even though the discount is smaller.**

The honest exception is a true, boring baseline: a stable database, a steady-state core service, a workload whose shape has been flat for years and has no migration on the roadmap. There a Standard RI's extra discount is earned, because the bet is nearly certain. For everything with a re-architecture, a scaling unknown, or a migration on the horizon, the flexible plan is not the expensive choice, it is the one that does not strand your money when the inevitable happens.

## The house edge is your own roadmap

A savings plan is sold as a discount and structured as a bet, and the counterparty you are really betting against is your own future roadmap. Every migration you are proud of, every instance generation that improves price-performance, every re-architecture that makes the product better is a way the deep commitment loses. The teams that win the bet are not the ones who maximized the discount. They are the ones who only committed to the parts of their infrastructure they were genuinely willing to promise would not change.

The cheapest commitment is the one that matches a forecast you actually believe. Buy the discount you can keep, not the one that looks best the day you sign.

## FAQ

### Q: What is the difference between reserved and on-demand pricing?

On-demand charges for exactly what you run with no commitment at the highest per-hour rate. Reserved Instances and Savings Plans give up to about 72% off in exchange for a one or three year commitment to a defined amount of usage or spend. The commitment is financial, not capacity, so you pay for the reserved amount whether or not you actually use it.

### Q: Does an unused Reserved Instance still cost money?

Yes. A Reserved Instance is a financial commitment, not a capacity hold, so an unused or underused RI still bills for its full committed amount. If your workload shrinks, migrates, or shuts down, you keep paying for the reservation until the term ends. You can try to recover some value by reselling on the RI Marketplace, but typically at a discount and with no guaranteed buyer.

### Q: How much discount do reserved instances and savings plans give?

Up to roughly 72% off on-demand for a three-year all-upfront Standard RI, scaling down with shorter terms and less upfront payment: a one-year no-upfront Convertible RI sits closer to 30%. Compute Savings Plans top out near 66% but apply flexibly across instance families, regions, and operating systems. Spot instances reach up to 90% but can be interrupted with a two-minute warning.

### Q: When should I choose a Compute Savings Plan over a Standard RI?

When your workload might change. A Compute Savings Plan's discount follows your usage across instance families, regions, and even Lambda and Fargate, so it survives migrations and re-architectures. You sacrifice roughly 6 to 9 percentage points of discount versus a Standard RI, which is the premium you pay for flexibility. Use Standard RIs only for genuinely static, well-understood baseline workloads.

### Q: What is the break-even utilization for a reserved instance?

Roughly equal to the committed rate. At a 72% discount, the effective rate is 28% of on-demand, so you need to use about 28% of the committed hours to break even versus paying on-demand for actual usage. Below that line, the commitment costs more than on-demand. Deeper discounts have lower break-even utilization but tighter scope lock-in.

### Q: How do reserved instances lose money?

Two ways. Utilization risk: if you use less than the break-even, the commitment costs more than on-demand. Scope risk, which is usually worse: a Standard RI is locked to an instance family and region, so migrating to a newer or cheaper family strands the reservation entirely. AWS price cuts can also leave your locked rate above the new on-demand price, so you pay a premium to stay on older hardware.

### Q: Are short-term cloud commitments worth it?

They can be, as a hedge. A new category of "insured commitments" offers terms as short as 30 days, pricing exactly the flexibility that long reservations remove. They give a smaller discount than three-year commitments but eliminate most stranding risk. For dynamic workloads where you cannot forecast a three-year shape, paying a bit more for short, flexible commitments is often the better expected outcome.

## Next Read

Commitments are one place the cloud quietly bills you for the wrong forecast. For the broader pattern of paying for capacity you do not use, read [why SaaS teams overpay for infrastructure](https://ravoid.com/blog/why-saas-overpay-infrastructure).

---

### Sources & Further Reading

- [AWS re:Post: Reserved Instances and Savings Plans guide](https://repost.aws/articles/ARw40KpfABSNaPUK65-KQmMQ/aws-reserved-instances-and-savings-plans-a-comprehensive-guide)
- [DoiT: AWS Savings Plans vs Reserved Instances 2026](https://www.doit.com/blog/aws-savings-plans-vs-reserved-instances-2026-the-decision-guide-engineers-actually-need)
- [Atonement Licensing: AWS Reserved Instances 2026](https://atonementlicensing.com/blog/aws-reserved-instances/)
- [Usage.ai: On-Demand vs Reserved vs Spot Instances 2026](https://www.usage.ai/blog/on-demand-vs-reserved-vs-spot-instances)

---

_Last updated: July 20, 2026_
