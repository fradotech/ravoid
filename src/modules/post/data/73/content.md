# The $0.045 NAT Gateway Tax on Every Byte

_By Framesta Fernando · Engineering Manager & Technical Architect · 10 min read · Published July 14, 2026_

> **TL;DR:** NAT gateway cost has two parts: a small hourly charge and a $0.045-per-GB data processing fee that applies to every byte, including traffic that never leaves AWS. Routing S3, DynamoDB, and ECR traffic through free VPC endpoints instead of the gateway erases most of the bill.

Open any AWS bill that has grown past a few thousand dollars a month and look for the line called "NAT Gateway." Nobody on the team chose it as a feature. It appeared because a private subnet needed to reach the internet, someone clicked the obvious button, and the gateway has been quietly metering traffic ever since. It is the most boring line on the invoice, and for data-heavy workloads it is often among the largest networking charges on it.

The reason it surprises people is that NAT gateway cost is not really a connectivity charge. It is a per-byte toll. AWS bills $0.045 per GB for all data processed through the gateway in us-east-1, on top of an hourly charge, and that toll applies even when the bytes are headed to another AWS service and never touch the public internet ([Hykell's NAT cost breakdown](https://hykell.com/kb/platform-specific-guides/aws-nat-gateway-cost-optimization/)). You set up plumbing you assumed was free infrastructure, and instead you installed a meter on every packet.

## The two charges, and which one hurts

NAT gateway pricing has two components, and teams almost always notice the wrong one first. There is the hourly charge, $0.045 per hour in us-east-1, which works out to roughly $32 to $33 per month just to keep one gateway running before any traffic flows ([Linuxbeast's analysis](https://linuxbeast.com/blog/how-to-reduce-aws-nat-gateway-costs-with-vpc-flow-logs-and-athena/)). Run one per availability zone for high availability, the standard production pattern, and a three-AZ design costs roughly $100 per month at zero traffic ([Project Helena's AWS pricing guide](https://projecthelena.com/aws-pricing)).

That fixed cost is annoying but bounded. The component that actually scales out of control is the data processing fee: $0.045 for every gigabyte that passes through, with no volume discount and no exemption for internal destinations. AWS's own pricing page lists both charges plainly ([Amazon VPC pricing](https://aws.amazon.com/vpc/pricing/)). The false assumption that lets this grow is thinking of NAT as "the thing that lets private instances reach the internet." It is really "the thing that charges four and a half cents per gigabyte for any traffic you route through it," and a startling share of that traffic is going to S3, ECR, or DynamoDB, destinations that have a free path you are not using.

## Watch the meter run

Here is the worked calculation, using only AWS's published rates. Take a containerized service on a three-AZ setup pulling images from ECR, reading and writing S3, and emitting logs. Say it processes 20 TB per month through NAT.

```
Hourly (HA, 3 AZ):  3 x $0.045/hr x 730 hrs  = $98.55 / month
Data processing:    20,000 GB x $0.045/GB    = $900.00 / month
NAT total                                      = $998.55 / month
```

Now the part that should sting. Suppose 70% of that 20 TB is traffic to S3 and ECR, both of which can be reached through a free gateway or a cheaper interface endpoint that bypasses NAT entirely.

```
Avoidable traffic:  14,000 GB x $0.045/GB    = $630.00 / month
Bill after endpoints: $998.55 - $630.00      = $368.55 / month
```

You cut the largest networking line by roughly 63% by changing routes, not architecture. The application does not know or care. The traffic still reaches S3, it just stops paying a toll to do it. [Usage.ai confirms](https://www.usage.ai/blogs/aws/networking-cost/egress-cost-reduction/) that a gateway endpoint carries no hourly and no per-GB charge, so traffic that previously paid $0.045/GB through NAT now costs nothing.

## Why the toll is on traffic that should be free

This is the contradiction at the center of the bill. NAT exists to bridge a private subnet to the public internet. But a service in that private subnet talking to S3 is not going to the public internet, it is talking to another AWS service over Amazon's own backbone. The packets still get routed through NAT by default, though, because that is where the subnet's default route points. So you pay an internet-egress-style processing fee on traffic that never leaves the building.

AWS already solved this, which is the maddening part. Gateway endpoints for S3 and DynamoDB are completely free, no hourly and no per-GB charge, and they create a private route over the backbone that skips NAT entirely ([Usage.ai's networking guide](https://www.usage.ai/blogs/aws-network-costs/)). Interface endpoints for other services do carry a small hourly and per-GB charge, but they are still far cheaper than NAT for the traffic they carry, and the break-even math is simple: because the hourly cost of about 4.5 interface endpoints equals one NAT gateway, fewer than five interface endpoints is always cheaper than routing the same service traffic through NAT ([Zac Fukuda's break-even analysis](https://zacfukuda.com/blog/aws-nat-gateway-vs-vpc-endpoint)). The default route is the expensive one, and the cheap route requires an explicit decision most teams never make.

| Destination | Default path | Cheaper path | Per-GB saving |
| --- | --- | --- | --- |
| S3 / DynamoDB | NAT, $0.045/GB | Gateway endpoint | $0.045 (to free) |
| ECR, SQS, Secrets Mgr | NAT, $0.045/GB | Interface endpoint | Most of $0.045 |
| Public internet | NAT, $0.045/GB | NAT (unavoidable) | None |
| Cross-AZ internal | $0.01/GB each way | Same-AZ placement | $0.02 round trip |

## The anchor: a cost that scales with bytes, not value

The reason NAT cost sneaks up on teams is that it scales on a dimension nobody watches. Compute scales with requests, storage scales with data retained, and both show up in capacity planning. NAT scales with bytes in flight, a quantity that grows silently as you add log shipping, container pulls, telemetry, backups, and chatty microservices. None of those feel like "internet traffic," so none of them get budgeted as NAT cost, yet every one of them is metered at $0.045/GB. Data transfer broadly runs 10 to 15% of a typical AWS bill and up to 40% for data-intensive workloads ([Economize's 2026 guide](https://www.economize.cloud/blog/aws-data-transfer-costs-2026/)), and NAT processing is one of the quietest contributors inside that slice.

This is the same structural blindness I described in [why SaaS teams overpay for infrastructure](https://ravoid.com/blog/why-saas-overpay-infrastructure): the costs that hurt are the ones that scale on a metric your dashboards do not feature. It is a close cousin of the egress trap I covered in [the $0.09 that quietly doubles your cloud bill](https://ravoid.com/blog/cloud-egress-cost-trap), another per-byte fee that grows with traffic you never think about. A NAT gateway never throws an alert. It just bills more next month because your fleet got chattier, and chattiness is the default trajectory of every growing system.

## A post-mortem on a bill nobody could explain

A composite drawn from the common pattern, figures labeled illustrative: a data platform team scaled their Kubernetes fleet from 12 to 60 nodes over a quarter to handle ingestion growth. Compute cost rose roughly as expected. The surprise was networking: their NAT processing charge climbed from about $400 to roughly $4,000 a month, a 10x jump that tracked node count, not user traffic. The forensic answer came from VPC flow logs: every new node pulled multi-gigabyte container images from ECR through NAT on each deploy, and the ingestion pipeline read and wrote terabytes to S3 through the same gateway. None of it was internet traffic. Adding an S3 gateway endpoint and an ECR interface endpoint cut the processing charge by more than half within a billing cycle, with zero application changes. The metric that broke was bytes-through-NAT, a number that had never been on a single dashboard.

## The fix is a route table, not a rebuild

What makes this worth fixing first is the effort-to-savings ratio. You are not refactoring services or moving regions. You are adding endpoints and pointing routes at them. A gateway endpoint for S3 is a few lines:

```hcl
resource "aws_vpc_endpoint" "s3" {
  vpc_id            = aws_vpc.main.id
  service_name      = "com.amazonaws.us-east-1.s3"
  vpc_endpoint_type = "Gateway"                  # free, no per-GB charge
  route_table_ids   = [aws_route_table.private.id]
}
```

That single resource reroutes all S3 traffic off NAT and onto a free private path. The route table change is the entire fix for the largest avoidable slice. For the rest, audit what your private subnets actually talk to (VPC flow logs into Athena make this a one-query job) and add interface endpoints for the high-volume AWS services. This is the cloud-cost equivalent of the lesson from [where serverless breaks at scale](https://ravoid.com/blog/where-serverless-breaks-vercel-cloudflare-real-experience): the default configuration is tuned for ease of setup, not for your bill.

## Framework: decide the route before you provision

| Decision | What you gain | What you pay | When it breaks |
| --- | --- | --- | --- |
| S3/DynamoDB gateway endpoint | Free path, NAT bypass | Minor config | Never, use it always |
| Interface endpoint (high-volume svc) | Cheaper than NAT under ~5 | Small hourly + per-GB | 5+ endpoints, costs add up |
| Keep traffic on NAT | Simplicity | $0.045/GB on everything | Bytes scale, bill scales |
| Same-AZ placement | Avoid cross-AZ $0.01/GB x2 | Reduced AZ spread | True HA needs multi-AZ |

The sequence is: gateway endpoints first because they are free and always win, interface endpoints next for high-volume internal services, and only genuine public-internet traffic stays on NAT, because that is the one job NAT actually has to do.

## Decision guidance

The mistake is treating NAT as the universal egress path. It should be the exception, used only for traffic that truly has nowhere cheaper to go.

**The rule: If a private subnet sends meaningful volume to S3, DynamoDB, or ECR, then add the VPC endpoint before that traffic ever touches a NAT gateway.**

There is no real exception for S3 and DynamoDB, because their gateway endpoints are free, so routing that traffic through NAT is pure waste. The only judgment call is interface endpoints: below roughly five of them the math favors endpoints, and well above that you weigh the stacked hourly charges against NAT processing volume. Run the break-even with your actual byte counts rather than guessing.

## The meter you forgot to read

NAT gateway cost is not a pricing trap so much as a default that quietly bills you for not knowing a cheaper route exists. The gateway does exactly what it promised, it just charges a toll on bytes that had a free road the whole time. The savings are not hiding in a complex re-architecture. They are sitting in a route table, waiting for someone to point the traffic at the door marked "no charge."

The cheapest gigabyte through a NAT gateway is the one that never went through it.

## FAQ

### Q: What is NAT gateway cost made of?

Two charges. An hourly fee of $0.045 per hour in us-east-1, roughly $32 to $33 per month per gateway before any traffic, and a data processing fee of $0.045 per GB for every byte routed through it. High-availability designs run one gateway per availability zone, so a three-AZ setup is about $100 per month at zero traffic, and the per-GB fee scales with how chatty your fleet is.

### Q: Why is my NAT gateway bill so high?

Almost always the data processing fee on traffic that never leaves AWS. Container image pulls from ECR, reads and writes to S3, and log shipping all route through NAT by default at $0.045 per GB, even though those destinations have free or cheaper private paths. The bill tracks bytes in flight, which grows as you add nodes and services, not internet usage specifically.

### Q: How do I reduce NAT gateway costs?

Add VPC endpoints. Gateway endpoints for S3 and DynamoDB are free and bypass NAT entirely, so they should always be used. Interface endpoints for other high-volume AWS services are cheaper than NAT below roughly five endpoints. Use VPC flow logs to find what your private subnets talk to most, then reroute that traffic off NAT. The change is configuration, not re-architecture.

### Q: Are VPC gateway endpoints really free?

Yes. Gateway endpoints for S3 and DynamoDB carry no hourly charge and no per-GB charge. They create a private route from your VPC to the service over the AWS backbone, bypassing the NAT gateway. Traffic that previously cost $0.045 per GB through NAT costs nothing through a gateway endpoint, which is why routing S3 traffic through NAT is pure waste.

### Q: When should I use an interface endpoint instead of NAT?

When fewer than about five interface endpoints would cover your high-volume internal traffic. The hourly cost of roughly 4.5 interface endpoints equals one NAT gateway, so below that threshold endpoints are always cheaper for the service traffic they carry. Above five, the stacked hourly charges can exceed NAT, so run the break-even using your real per-service byte counts.

### Q: Does NAT charge for traffic staying inside AWS?

Yes, and that is the core surprise. The $0.045 per GB processing fee applies regardless of destination, including traffic to AWS services like S3 and ECR that never reaches the public internet. NAT routes those packets because the subnet's default route points at it, so you pay an egress-style fee on internal traffic that had a free private path available.

### Q: How much of an AWS bill is data transfer?

Industry research puts data transfer at 10 to 15% of a typical AWS bill, rising to as much as 40% for data-intensive workloads like media, analytics, and globally distributed SaaS. NAT processing is one of the quieter contributors inside that slice, which is why it is easy to miss until a fleet scales and the per-GB fee compounds with node count.

## Next Read

NAT is one slice of a larger pattern of paying for defaults you never chose. For the full picture of where cloud spend leaks, read [why SaaS teams overpay for infrastructure](https://ravoid.com/blog/why-saas-overpay-infrastructure).

---

### Sources & Further Reading

- [Amazon VPC Pricing (official)](https://aws.amazon.com/vpc/pricing/)
- [Usage.ai: VPC, NAT Gateway, and CloudFront Pricing Explained](https://www.usage.ai/blogs/aws-network-costs/)
- [Zac Fukuda: NAT Gateway vs VPC Endpoint break-even](https://zacfukuda.com/blog/aws-nat-gateway-vs-vpc-endpoint)
- [Economize: Complete Guide to AWS Data Transfer Costs 2026](https://www.economize.cloud/blog/aws-data-transfer-costs-2026/)

---

_Last updated: July 14, 2026_
