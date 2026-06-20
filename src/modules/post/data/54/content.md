# The $0.09 That Quietly Doubles Your Cloud Bill

_By Framesta Fernando · Engineering Manager & Technical Architect · 11 min read · Published June 26, 2026_

> **TL;DR:** Cloud egress cost is the line item nobody budgets and everybody pays. At roughly $0.09 per GB for internet egress plus $0.01 per GB each way for cross-AZ traffic, a chatty architecture leaks money at every network boundary. The fix is topological: keep traffic inside the boundaries that are free, and stop crossing the ones that bill.

A staff engineer I worked with kept a screenshot pinned in a channel: a single AWS line item, "DataTransfer-Out-Bytes," sitting at $11,400 for the month, more than the compute it served. Nobody had provisioned it. Nobody had reviewed it. It had grown one cross-region replica and one chatty microservice at a time until it quietly became the second-largest line on the bill.

Egress is the cloud cost that hides in plain sight, because it is not attached to a resource you can see in a console. You provision EC2, you provision RDS, you watch those. Nobody provisions "bytes leaving," so nobody watches it until it doubles the invoice.

## The cost that has no dashboard

Most teams budget cloud spend by the things they launch: instances, databases, storage. Egress fits none of those categories, so it falls out of the mental model entirely. You can name every instance in your account. You cannot name a single byte of egress, which is exactly why it runs unmonitored.

The pricing is also deceptively tiered and directional, which hides the real exposure. AWS charges roughly $0.09 per GB for the first 10 TB of internet egress each month, $0.01 per GB in each direction for cross-AZ traffic, and $0.045 per GB for NAT Gateway processing, while inbound is free ([per Amnic's breakdown of AWS data transfer](https://amnic.com/blog/simplifying-data-transfer-costs-across-aws)). That "inbound is free" detail lulls teams into ignoring transfer cost entirely, right up until the outbound and cross-zone lines compound into real money.

The trap is that egress scales with usage, not with what you store. A bucket you keep is cheap. The same bucket served to users, replicated across zones, and pulled by a dozen services bills on every byte that moves, so the cost tracks traffic you cannot see in any resource view.

## Following the bytes on a real architecture

Put numbers on a typical setup. The following is illustrative at standard AWS rates. Say you serve 50 TB of media and API responses to the internet each month, run a three-AZ deployment that shuffles 30 TB of chatty service-to-service traffic across zones, and push 20 TB through a NAT Gateway for outbound calls.

```
Internet egress:  50,000 GB x $0.09   = $4,500
Cross-AZ (x2 way): 30,000 GB x $0.01 x 2 = $600
NAT processing:   20,000 GB x $0.045  = $900
Monthly transfer total                 = $6,000
```

Six thousand dollars a month, and not one line of it appears next to a server you can point at. The cross-AZ number is the sneakiest: teams spread services across availability zones for resilience, then let those services chat constantly, paying $0.01 per GB each direction for the privilege of a topology they thought was free. A workload moving 50 TB to the internet is roughly $2,100 a month in egress alone at standard rates before any optimization ([per Usage.ai's 2026 data transfer guide](https://www.usage.ai/blogs/aws/networking-cost/data-transfer-costs)). This is the same shape of hidden infrastructure spend I mapped in [why SaaS teams overpay for infrastructure](https://ravoid.com/blog/why-saas-overpay-infrastructure).

The post-mortem version: one team I know added a read replica in a second region for disaster recovery, then pointed analytics jobs at it "to offload the primary." Those jobs pulled full table scans cross-region nightly. The DR replica that was supposed to cost a few hundred dollars added an illustrative $7,000 a month in cross-region transfer, discovered only when finance flagged the transfer line, not the database line.

## Egress is a tax on topology, not on data

The reframe that fixes egress budgeting is that you are not paying for data, you are paying for boundaries crossed. Every byte that stays inside a single AZ is free. Every byte that crosses an AZ, a region, or the public internet gets metered, and the rate climbs with the distance of the boundary. Egress is a tax on your architecture's shape, not on its size.

That changes the optimization completely. You do not reduce egress by storing less. You reduce it by crossing fewer billed boundaries: colocating chatty services in the same AZ, putting a CDN in front of repeat-served content so the origin transfers each object once instead of once per request, and keeping replication within a region unless compliance forces otherwise. The providers price this way on purpose, because the boundary crossings are where their network costs live and where lock-in lives, which is why egress to the open internet is the most expensive direction of all.

This is also the lever behind the zero-egress providers. Cloudflare R2 charges for storage but bills no egress to the internet, so the same 10 TB of outbound that costs over a thousand dollars on a hyperscaler premium tier costs nothing on R2 ([per egresscost.com's independent comparison](https://egresscost.com/)). The catch is that moving to R2 is itself a one-time egress event out of your current provider, the classic exit cost, which connects to the broader lock-in math in [the hidden cost of multi-cloud versus a single vendor](https://ravoid.com/blog/multi-cloud-vs-single-vendor-hidden-cost).

## Where to cut, in order

Not every boundary is worth the same effort. Attack them by how much they leak versus how hard they are to fix:

| Boundary | Typical rate | First move |
| --- | --- | --- |
| Internet egress (repeat content) | ~$0.09/GB | Put a CDN in front of the origin |
| Cross-AZ service chatter | $0.01/GB each way | Colocate chatty services in one AZ |
| Cross-region replication | region-dependent | Replicate only what DR truly needs |
| Object storage egress | ~$0.09/GB | Move hot public assets to zero-egress storage |

CDN-fronting repeat-served content is usually the biggest single win, because it converts N transfers of the same object into one. Cross-AZ colocation is second and is pure topology, no product change. Treat cross-region as a deliberate DR decision with a price tag attached, not a default. When you do compare storage providers, weigh egress as heavily as the storage rate, using the lens from [how to compare SaaS tools objectively](https://ravoid.com/blog/how-to-compare-saas-tools-objectively).

## Decision guidance

The discipline is to make egress a visible, owned number instead of a surprise. If no one can tell you this month's transfer cost without opening the bill, it is already leaking.

**The rule: If a byte crosses an availability zone, a region, or the public internet on a hot path, then it must be a deliberate, reviewed decision, because every such crossing is metered and the meter has no dashboard until the invoice arrives.**

Put a CDN in front of anything served more than once. Colocate services that talk constantly. Tag and chart the transfer lines so they have an owner. For most teams under heavy media or replication load, egress is the cheapest large saving available, because the fix is topological and changes no product behavior.

## The bill that tracks what people use

Storage costs track what you keep. Egress costs track what people use, which is why it grows with success and surprises teams that only budgeted for what they store. The architecture that wins is not the one that stores less, it is the one that crosses fewer billed boundaries to serve the same bytes.

Watch the transfer line like you watch compute. It is already one of your biggest, you just have not been looking at it.

## FAQ

### Q: What is cloud egress cost and why is it so high?

Egress is the charge for data leaving a cloud boundary toward the internet, another region, or another availability zone. AWS bills roughly $0.09 per GB for internet egress and $0.01 per GB each way for cross-AZ traffic, while inbound is free. It is high relative to expectations because it scales with usage and has no resource dashboard, so it grows unmonitored until it dominates the bill.

### Q: How do I reduce AWS data transfer costs?

Cross fewer billed boundaries. Put a CDN in front of repeat-served content so the origin transfers each object once, colocate chatty services within a single availability zone to avoid cross-AZ charges, and replicate across regions only what disaster recovery genuinely requires. For hot public assets, zero-egress object storage can eliminate the internet egress line entirely. Storing less rarely helps; crossing fewer boundaries does.

### Q: Why is cross-AZ traffic charged when it is inside one region?

Availability zones are physically separate data centers, so traffic between them traverses provider network infrastructure, which AWS meters at $0.01 per GB in each direction. Teams spread services across AZs for resilience, then let those services communicate constantly, paying for every byte both ways. Colocating tightly-coupled, chatty services in a single AZ removes the charge without losing meaningful resilience for most workloads.

### Q: Does Cloudflare R2 really have zero egress fees?

Yes, R2 charges for stored data and operations but does not bill egress to the internet, which is the main differentiator from S3-style object storage. For workloads that serve large volumes of data out, that eliminates a significant line item. The tradeoff is a one-time egress cost to move your data out of the current provider, plus weighing R2's feature set against your existing storage integration.

### Q: How much can egress realistically cost?

A workload moving 50 TB to the internet monthly runs roughly $2,100 in internet egress alone at standard AWS rates, before cross-AZ and NAT charges. Add chatty cross-AZ service traffic and cross-region replication and the total can reach several times the compute cost it supports. The danger is that none of it appears beside a resource, so it stays invisible until the bill is audited.

### Q: Is egress cost a reason to avoid multi-region?

It is a reason to make multi-region a deliberate decision, not a default. Cross-region replication and traffic carry real per-GB charges, so a second region added casually for "safety" can add thousands monthly. Replicate only what disaster recovery requires, avoid pointing routine analytics or batch jobs across regions, and price the transfer explicitly when you design the topology.

## Next Read

Egress is one of several infrastructure lines that grow invisibly with usage. The broader pattern is in [why SaaS teams overpay for infrastructure](https://ravoid.com/blog/why-saas-overpay-infrastructure).

---

### Sources & Further Reading

- [Amnic: How Much Does AWS Data Transfer Cost](https://amnic.com/blog/simplifying-data-transfer-costs-across-aws)
- [Usage.ai: AWS Data Transfer Costs, The Complete 2026 Guide](https://www.usage.ai/blogs/aws/networking-cost/data-transfer-costs)
- [egresscost.com: Independent Cloud Data Transfer Pricing Reference](https://egresscost.com/)

---

_Last updated: June 26, 2026_
