# Your Datadog Bill Is an Architecture Problem

_By Framesta Fernando · Engineering Manager & Technical Architect · 12 min read · Published June 20, 2026_

> **TL;DR:** Datadog cost rarely explodes from monitoring too much. It explodes from custom metric cardinality multiplying combinatorially and from high-watermark host billing. Both are architecture decisions wearing a billing-surprise costume. Fix the cardinality before you shop for a cheaper vendor, or you will just feed the same leak to a different invoice.

The Slack message that starts most observability post-mortems is four words long: "why is finance asking." Someone in finance has just seen the monthly Datadog invoice grow by a five-figure number that maps to no launch, no traffic spike, and no new service. The graphs look identical to last month. The product did nothing unusual. And yet the bill detonated.

The 2026 reflex is to blame the vendor and open a tab comparing alternatives. That reflex is premature. Datadog is genuinely expensive, but the thing that actually blew up the invoice is something an engineer shipped, and it will follow you to whatever you migrate to. The vendor did not betray you. A tag did.

## The line item nobody approved

Most teams reason about observability cost linearly: more services and more logs mean a bigger bill, so when it jumps, they monitor less. They cut retention, drop dashboards, sample harder. That instinct treats the symptom and misses the mechanism.

Observability platforms do not bill the volume of what you watch. They bill the number of distinct things you ask them to remember. A metric named `http.request.duration` is one cheap time series. The same metric tagged with a unique value becomes a separate billable series for every distinct value of that tag. The price of a metric is set by its cardinality, the count of unique tag combinations, not by how often you look at it.

That is why a one-line change can multiply a bill while every dashboard looks unchanged. You did not start monitoring more. You asked the system to remember vastly more distinct combinations, and "distinct" is exactly where the vendor's margin lives.

## How two tags become a million series

Cardinality is multiplicative, and that is the whole trap. Each tag does not add to the series count, it multiplies it. Here is the arithmetic, using an illustrative but typical shape: one latency metric on a checkout flow, tagged for "better drill-down."

```
endpoint tag:      25 values
status_code tag:   15 values
customer_id tag:   5,000 values   (unbounded, the mistake)
shipment_id tag:   200 values     (unbounded, the second mistake)

total time series = 25 x 15 x 5,000 x 200 = 375,000,000
```

That single metric, with two unbounded identifiers attached, expands to 375 million series. Datadog bills custom metrics per unique series beyond a per-host allotment, and even after the included quota that count is catastrophic. Using Datadog's published custom-metrics pricing of roughly $0.05 per 100 custom metrics per month as the unit ([Datadog pricing, via Middleware's breakdown](https://middleware.io/blog/datadog-pricing/)), the bound on that one metric is absurd by construction, which is the point: unbounded tags do not have a cost, they have a runaway. The realistic version is that the platform caps or the bill simply explodes into five figures from a metric that should have cost dollars.

Strip the two unbounded tags and the same metric collapses:

```
25 x 15 = 375 time series
```

From 375 million to 375. The information you actually query, latency by endpoint and status, is identical. The 374,999,625 series you deleted were never going to be read by a human. They were a tax you volunteered to pay.

An anonymized case shows the shape in dollars. A mid-size logistics SaaS sat steady around $9,000 a month on Datadog. An engineer tagged a new flow's latency metric with `customer_id` and `shipment_id`, both unbounded, and within one billing cycle the custom-metrics line dominated the invoice and total spend crossed into the mid-$40,000s. The illustrative breakdown:

| Cost driver | Before | After |
| --- | --- | --- |
| Hosts / infra | $5,200 | $5,400 |
| Custom metrics | $1,900 | $38,000 |
| Indexed logs | $1,900 | $3,600 |

Traffic was flat the entire time. High-watermark billing compounded it, because Datadog charges on the peak host count in a period, so a brief autoscale during a spike sets the host charge for the whole month even after the nodes scale back down. That broader pattern of spend outrunning value is the one I mapped in [why SaaS teams overpay for infrastructure](https://ravoid.com/blog/why-saas-overpay-infrastructure).

## The leak scales faster than the value

The framing that fixes how you budget observability is this: the value of monitoring grows roughly linearly with what you watch, but the cost of high-cardinality tags grows multiplicatively with how you tag it. Those two curves diverge fast, and the gap between them is pure waste, distinctions you pay to store and will never query.

Ask who reads a metric sliced by a unique `request_id`. Almost no one, almost never. That tag is not visibility, it is a lottery ticket bought on the chance one specific request needs forensic detail later, and traces already provide that detail at a fraction of the cost. The unbounded tag is waste in the costume of thoroughness. The same superlinear shape governs log indexing: indexing is worth its premium for the small fraction of logs you actually search and is dead weight on the rest, so the architectural move is to split the cheap path (ingest and archive) from the expensive path (index and retain) and route logs by intent rather than indexing everything because that is the default.

This is why switching to a 60%-cheaper vendor without fixing the tagging just relocates the leak. A lower per-series price applied to 375 million pointless series is still a catastrophe. The durable fix is not the tool, it is a cardinality and retention policy that any backend can enforce, which is also why the build-versus-buy question only makes sense after the cleanup, a tradeoff I worked through in [open source vs SaaS total cost of ownership](https://ravoid.com/blog/open-source-vs-saas-total-cost-ownership).

## Stopping it at the commit, not the invoice

The cheapest place to kill a cardinality explosion is in code review, not on next month's bill. The rule below catches the mistake before it ships, and you can encode it as a CI guard that fails any change adding an unbounded identifier as a metric tag:

```yaml
# .ci/metric-cardinality-guard
# Fail the build if a metric tag uses a known unbounded dimension.
forbidden_metric_tags:
  - user_id
  - customer_id
  - request_id
  - session_id
  - email
  - shipment_id
action_on_match: fail
message: >
  Unbounded value used as a metric tag. Put high-cardinality context on a
  trace or a log field, not a metric. See the cardinality policy.
```

Run the levers in order. Most teams find two or three rows below are doing 80% of the damage:

| Lever | What cutting it buys | When cutting hurts |
| --- | --- | --- |
| Unbounded metric tags | The biggest custom-metric savings | You lose per-entity metric drill-down |
| Index-everything logs | Lower log retention cost | Incident search slows down |
| Default host coverage | A smaller high-watermark peak | Blind spots on ephemeral nodes |
| Long metric retention | Lower storage line | Harder long-range capacity trends |

Kill unbounded tags first, because that is where the multiplicative blowups live and the lost value is near zero. Logs indexing is second. Retention and host coverage are tuning. Only after the workload is disciplined does a vendor comparison tell the truth, because now you are comparing your real footprint instead of your bloated one. When you do compare, OpenTelemetry-native backends changed the math: they let you switch without re-instrumenting, and open-source options report 60% to 98% lower cost at high ingest, excluding the engineering time to run them ([OpenObserve cost comparison](https://openobserve.ai/blog/opensource-datadog-alternative/)), an operational cost that behaves a lot like the hidden lines I covered in [the hidden cost of multi-cloud versus a single vendor](https://ravoid.com/blog/multi-cloud-vs-single-vendor-hidden-cost).

## Decision guidance

The trap is treating this as a procurement decision when it is an instrumentation discipline decision. Which vendor you pick matters far less than the policy you enforce on what earns a unique tag.

**The rule: If a metric tag can take an unbounded set of values, like a user id, request id, or email, then it must never be a metric tag. Put it on a trace or a log field, and fail the build that adds it.**

For teams under roughly $10,000 a month with stable cardinality, staying put and tuning is almost always right, because engineering time costs more than the bill. Above that, once spend is disciplined and still high, an OpenTelemetry-native or self-hosted backend becomes defensible, and the OTel layer lets you pilot one without ripping out instrumentation. Evaluate it with the framework from [how to compare SaaS tools objectively](https://ravoid.com/blog/how-to-compare-saas-tools-objectively).

## The invoice is a code review you skipped

Observability spend is one of the few line items that reports the truth about your engineering discipline. A bill that tracks traffic smoothly means your instrumentation is intentional. A bill that lurches after a routine deploy means someone multiplied your series count by an unbounded tag and no one caught it in review.

A cheaper tool does not cure an expensive habit. It just resets the surprise to a lower starting number and waits.

## FAQ

### Q: Why did my Datadog bill suddenly spike without adding services?

The usual cause is a new high-cardinality custom metric. Cardinality is multiplicative: adding an unbounded tag like customer_id or request_id multiplies one metric into thousands or millions of billable series, and Datadog bills per series. Traffic and service count can stay flat while the bill multiplies. Audit custom metric cardinality first, before assuming you are simply monitoring too much.

### Q: How does cardinality actually multiply the cost?

Each tag multiplies the series count rather than adding to it. A metric with a 25-value endpoint tag and a 15-value status tag is 375 series. Attach a customer_id with 5,000 values and a shipment_id with 200, and it becomes 25 x 15 x 5,000 x 200, which is 375 million series. The value you query is unchanged; the unbounded tags are pure cost.

### Q: What is high-watermark billing and why does it matter?

High-watermark billing charges on the peak resource count during a period, not the average. A brief autoscaling event during a traffic spike can set your host charge for the entire month even after the instances scale back down. It penalizes spiky, elastic infrastructure and is a frequent reason a bill feels disconnected from average usage. Smoothing autoscale or committing to a baseline can reduce the peak.

### Q: Should I switch from Datadog to a cheaper alternative?

Not before fixing cardinality and log-indexing discipline. A lower per-series price applied to millions of pointless series is still a huge bill, so a migration alone just relocates the leak. Clean up unbounded tags and default indexing first, then compare. OpenTelemetry-native tools let you switch backends without re-instrumenting, so a disciplined workload makes the comparison both cheaper and more honest.

### Q: How much can OpenTelemetry-based or self-hosted observability save?

Open-source and self-hosted platforms report 60% to 98% lower cost at high ingest volumes versus managed Datadog. That headline excludes the engineering time to operate the stack, which is real and recurring. Below roughly $10,000 a month, that operational cost usually outweighs the savings. Above it, with disciplined cardinality, the math starts to favor a switch, especially when an OTel layer removes re-instrumentation risk.

### Q: How do I stop cardinality from exploding again?

Enforce a policy that unbounded values never become metric tags, and back it with a CI check that fails any change adding a forbidden dimension like user_id or request_id to a metric. Put that high-cardinality context on traces and log fields, which are priced for it. The guard is cheaper and far more durable than any tool migration, because it stops the mistake at the commit.

### Q: Are logs or metrics usually the bigger cost driver?

Custom metrics cause the more dramatic spikes because cardinality multiplies superlinearly from a single code change. Logs tend to be a slower creep, driven by indexing everything by default instead of routing only searchable logs to the indexed tier. Audit both, but expect sudden shocks to come from metrics and gradual bloat to come from logs that are indexed when they only needed to be archived.

## Next Read

Observability is one symptom of a wider pattern where infrastructure spend quietly outpaces value. The full anatomy is in [why SaaS teams overpay for infrastructure](https://ravoid.com/blog/why-saas-overpay-infrastructure).

---

### Sources & Further Reading

- [Middleware: Datadog Pricing and Why Bills Surprise Teams](https://middleware.io/blog/datadog-pricing/)
- [OpenObserve: Open Source Datadog Alternative Cost Comparison](https://openobserve.ai/blog/opensource-datadog-alternative/)
- [Uptrace: Observability Tools Pricing Comparison 2026](https://uptrace.dev/comparisons/observability-tools-pricing)

---

_Last updated: June 20, 2026_
