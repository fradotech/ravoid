# Your Data Pipeline Bill Doubled in a Year

_By Framesta Fernando · Engineering Manager & Technical Architect · 10 min read · Published August 7, 2026_

> **TL;DR:** Data pipeline cost is billed per row moved, not per row used, and managed ELT tools charge per connector by monthly active rows. A few high-churn log or event tables you never analyze can dominate the bill, and a 2025 shift to per-connector MAR pricing pushed many bills up 40 to 70%, some 2x or more. Sync only what you query.

The data team did not add sources, did not increase volume meaningfully, and did not change anything they could point to. The ELT bill still doubled over the year. When they finally traced it, the cause was two things they had not thought of as costs: a pricing-model change in how rows are counted, and a single high-churn table quietly generating most of the bill. The pipeline was moving more rows than ever, and almost none of the expensive ones were rows anyone actually queried.

This is the structural problem with managed data pipelines. Their billing unit is rows moved, not rows used. Fivetran and similar tools meter usage in monthly active rows, the distinct primary keys synced from a source to a destination each month ([Fivetran's usage-based pricing docs](https://fivetran.com/docs/usage-based-pricing)). That sounds reasonable until you notice the disconnect: the rows that cost the most are often the ones with the least analytical value, and nothing in the pricing distinguishes a customer record you analyze daily from an audit-log row you will never read.

## The pricing change that doubled bills on its own

Before the high-churn tables, there was a billing change that moved many bills with zero change in data. In March 2025, Fivetran switched MAR calculation from an account-wide total to a per-connector basis ([Definite on the Fivetran bill change](https://www.definite.app/blog/fivetran-bill-doubled)). Under the old model, a row synced was counted once across the account. Under the new one, each connector counts its rows separately, so overlapping rows and multi-destination syncs multiply.

The impact was not subtle. For teams running 10, 20, or 50 connectors, which is most teams, the change increased costs by 40 to 70%, some customers reported bills jumping 2x to 4x, and a few saw 4x to 8x ([Definite](https://www.definite.app/blog/fivetran-bill-doubled)). Each connector is billed separately at $500 per million MAR ([Definite on alternatives](https://www.definite.app/blog/cost-effective-fivetran-alternatives)). No new sources, no new volume, just a change in how the same rows are counted, and the bill doubled. This is the same repricing risk I described for AI tokens: the unit your budget assumes is a vendor decision, not a law of nature.

## The anchor: you pay per row moved, not per row used

Here is the framing that explains the rest of the bill. The pipeline's cost scales with how many rows your sources produce, not with how many rows your analysts touch. Those two numbers can differ by orders of magnitude, because the highest-volume sources are usually the lowest-value ones: event streams, activity logs, audit trails, and append-only tables that generate millions of new primary keys a month and get queried approximately never.

Work the split. At $500 per million MAR, compare a high-value source against a high-churn one.

```
Customers table:     200,000 active rows/month
  0.2M x $500 = $100/month        (queried constantly, high value)

Activity / event log: 40,000,000 new rows/month
  40M x $500 = $20,000/month      (rarely queried, low value)

Total: $20,100/month, of which 99.5% is the log table
```

Ninety-nine and a half percent of the bill comes from a table almost no one analyzes, and a half-percent comes from the table the business actually runs on. The pipeline is faithfully, expensively moving the data you care about least, because its billing unit is row creation in the source, and a Salesforce connector syncing activity logs alone can generate tens of millions of rows a month ([Definite](https://www.definite.app/blog/cost-effective-fivetran-alternatives)). The cost is not your analytics. It is the firehose you connected and forgot. This is the ingestion-layer version of the curve I traced for retrieval in [why RAG is not free at ten million records](https://ravoid.com/blog/rag-is-not-free-brutal-cost-curve-10-million-records): volume that has nothing to do with value drives the bill. The compute side of the same data bill is [your Databricks tier retires, the bill jumps 35%](https://ravoid.com/blog/databricks-cost).

| Source type | MAR volume | Analytical value | Cost efficiency |
| --- | --- | --- | --- |
| Core entities (customers, orders) | Low | High | Excellent |
| Transactional tables | Medium | High | Good |
| Event / activity logs | Very high | Low | Terrible |
| Audit / system tables | Very high | Near zero | Pure waste |

## Sync what you query, not what exists

The fix follows directly from the anchor: stop syncing rows nobody uses. Most managed connectors let you select tables and columns, and the single highest-impact change is excluding high-churn, low-value tables from replication entirely. If you need the log data occasionally, sync an aggregated or sampled version rather than every raw row, or route it through a cheaper path than per-row managed ELT.

```yaml
# Sync the entities you analyze; exclude the firehose you do not
connector: salesforce
sync:
  tables:
    accounts:        { enabled: true }
    opportunities:   { enabled: true }
    contacts:        { enabled: true }
    activity_log:    { enabled: false }   # tens of millions of MAR, ~never queried
    field_history:   { enabled: false }   # audit churn, no analytical use
  columns: selected_only                  # drop blob/unused columns to cut MAR width
```

Disabling two high-churn tables in that config is the difference between a $20,000 bill and a $100 one in the example above. The discipline is to treat every synced table as a line item with a cost and a justification, the same selective approach I argued for in build decisions in [the build versus buy decision framework](https://ravoid.com/blog/build-vs-buy-saas-decision-framework): the default is to ingest everything because it is easy, and the saving is in deliberately ingesting less.

## The reliability cost hiding behind the volume

There is a second cost dimension that the per-row bill obscures: failure. Fragile pipelines are not just a reliability problem, they are a budget one. A Fivetran benchmark of 500 senior data and technology leaders found that data pipeline failures cost enterprises $3 million per month, with reliability gaps tied to DIY and legacy integration diverting budget and focus from AI initiatives ([Fivetran's benchmark report](https://www.fivetran.com/press/data-pipeline-failures-cost-enterprises-3-million-per-month-fivetran-benchmark-finds)). A pipeline that fails triggers re-syncs and full refreshes, and a full refresh re-counts rows you already paid to move, so unreliability and cost compound.

This reframes the build-versus-buy question. The reason managed ELT exists is that DIY pipelines fail and consume engineering time, so the per-row premium buys reliability. But if you are paying that premium to move tens of millions of rows you never query, you are buying expensive reliability for worthless data. The right answer is usually buy for the high-value, reliability-critical sources and exclude or self-handle the high-churn low-value ones, the total-cost reasoning from [open source versus SaaS total cost of ownership](https://ravoid.com/blog/open-source-vs-saas-total-cost-ownership).

## A post-mortem on a bill nobody could explain

A composite from the documented pattern, with figures labeled illustrative: a 60-person company saw its managed ELT bill climb from roughly $4,000 to $9,000 a month over a year. The data team had not added meaningful new sources. Two causes surfaced in the audit. First, the vendor's shift to per-connector MAR billing had raised the effective rate across their 22 connectors. Second, and larger, a product-analytics connector was replicating a raw event table that generated tens of millions of new rows monthly into the warehouse, where it sat almost entirely unqueried because the team analyzed a pre-aggregated rollup instead. The metric that broke was MAR per queried row, a ratio nobody tracked, which had become absurd because the most expensive table was the least used. Excluding the raw event table and the audit tables, and syncing only the rollup, cut the bill back below its starting point.

## Framework: meter the sources, not just the warehouse

| Decision | What you gain | What you pay | When it breaks |
| --- | --- | --- | --- |
| Exclude high-churn low-value tables | Largest MAR cut | Lose raw granularity | You truly need raw events |
| Sync aggregates, not raw rows | Big MAR reduction | Pre-aggregation work | Need row-level detail |
| Column selection | Narrower, cheaper syncs | Config maintenance | All columns are used |
| Buy reliability for core only | Premium where it matters | Self-handle the rest | Tiny data team |

The sequence: audit which synced tables are actually queried, exclude or aggregate the high-churn tables that are not, narrow columns to what is used, and reserve the managed per-row premium for the sources where reliability genuinely matters. The biggest single win is almost always cutting one or two firehose tables you were paying to move and never reading.

## Decision guidance

The mistake is treating the pipeline as plumbing that should move everything, and discovering only at audit time that the most expensive thing it moves is the thing no one uses.

**The rule: If a synced table is not queried by an analyst, dashboard, or model, then stop syncing it, because on per-row pricing you are paying to move data purely to store it unused.**

The honest exception is data with a genuine compliance, audit, or future-modeling requirement to retain at row-level granularity, where the rows must be moved even if they are rarely queried. Even then, route that data through the cheapest viable path, batch loads, direct warehouse ingestion, or object storage, rather than premium per-row managed ELT. For everything else, syncing a table nobody queries is paying a movement tax on data that adds no value the moment it lands.

## The firehose you forgot you connected

A data pipeline bill that doubles without an obvious cause is almost never about the data the business cares about. It is about a billing-model change you did not notice and a high-churn table you connected once and never reconsidered, faithfully moving millions of rows a month into a warehouse where they are stored, paid for, and never read. The pricing meters rows moved, your value comes from rows used, and the gap between those two is the bill.

The cheapest row is the one you decided not to sync. Audit what you actually query, cut the firehoses you do not, and the pipeline bill that doubled goes back to tracking the data that earns its place in the warehouse.

## FAQ

### Q: Why did my data pipeline bill double?

Usually two compounding causes. First, managed ELT vendors have changed pricing, in particular Fivetran's 2025 shift from account-wide to per-connector MAR billing, which raised many bills 40 to 70% and some 2x or more with no change in data. Second, a high-churn source like an event or audit log generates millions of monthly active rows that dominate the bill, even though it is rarely queried. The combination doubles bills quietly.

### Q: What is MAR in data pipeline pricing?

MAR stands for monthly active rows, the count of distinct primary keys synced from a source to a destination in a calendar month. Managed ELT tools like Fivetran bill on it, around $500 per million MAR per connector. A row counts once per month regardless of how many times it is updated, so the cost driver is new unique rows, which is why high-volume append-only tables like logs are so expensive.

### Q: Why are some tables so much more expensive to sync?

Because cost scales with the number of new rows a source produces, not their value. Event streams, activity logs, audit trails, and append-only tables generate millions of new primary keys a month, so they rack up huge MAR while being rarely queried. Core business tables like customers or orders have far fewer rows but far more analytical value, so the bill is often dominated by the least useful data.

### Q: How do I reduce data pipeline cost?

Sync only what you query. Exclude high-churn, low-value tables like raw event and audit logs from replication, sync aggregated or sampled versions instead of raw rows where you can, and narrow column selection to what is actually used. Treat every synced table as a line item needing justification. The biggest single win is usually cutting one or two firehose tables you were paying to move and never reading.

### Q: What changed with Fivetran pricing in 2025?

Fivetran moved MAR calculation from an account-wide total to a per-connector basis. Previously a row counted once across the whole account, but now each connector counts its rows independently, so overlapping and multi-destination syncs multiply. For teams with many connectors this raised costs 40 to 70% on average, with some bills jumping 2x to 8x, entirely from the counting change rather than any increase in data volume.

### Q: Should I sync raw event data or aggregates?

Aggregates, unless you have a specific need for row-level detail. Raw event tables generate enormous MAR and usually get queried only as pre-aggregated rollups anyway, so paying to move every raw row is waste. Pre-aggregate or sample at the source and sync the rollup. Keep raw granularity only where compliance, audit, or future modeling genuinely requires it, and route that through a cheaper path than per-row managed ELT.

### Q: How do pipeline failures affect cost?

They compound it. A failed pipeline triggers re-syncs and full refreshes, and a full refresh re-counts rows you already paid to move, so unreliability directly inflates per-row bills. Beyond direct cost, a benchmark found pipeline failures cost enterprises around $3 million a month in diverted budget and delayed initiatives. This is part of why managed ELT charges a premium for reliability, which is worth paying only for data that is actually valuable.

## Next Read

Pipeline cost is one place a per-unit price quietly scales past its value. For the warehouse-compute side of the same data bill, the patterns in [why SaaS teams overpay for infrastructure](https://ravoid.com/blog/why-saas-overpay-infrastructure) apply directly.

---

### Sources & Further Reading

- [Definite: Why Your Fivetran Bill Just Doubled, the MAR Pricing Change Explained](https://www.definite.app/blog/fivetran-bill-doubled)
- [Fivetran: Usage-Based Pricing documentation](https://fivetran.com/docs/usage-based-pricing)
- [Definite: Fivetran Alternatives + Engineering Time Costs](https://www.definite.app/blog/cost-effective-fivetran-alternatives)
- [Fivetran: Data Pipeline Failures Cost Enterprises $3M per Month](https://www.fivetran.com/press/data-pipeline-failures-cost-enterprises-3-million-per-month-fivetran-benchmark-finds)

---

_Last updated: August 7, 2026_
