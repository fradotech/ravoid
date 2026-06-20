# A Dashboard Refreshing Every Minute Costs $40k a Year

_By Framesta Fernando · Engineering Manager & Technical Architect · 10 min read · Published July 22, 2026_

> **TL;DR:** BI dashboard warehouse cost, not ETL, drives most cloud data bills. A dashboard set to refresh every minute re-scans the same tables thousands of times a day, often terabytes nobody is looking at. Match refresh cadence to how fast the data actually changes, partition the tables, and cache, and the bill drops by orders of magnitude.

When the finance team asks why the data warehouse bill doubled, the engineering instinct is to look at the pipelines. The nightly ETL, the big transforms, the ingestion jobs. That is almost always the wrong place to look. Most cloud data warehouse bills are not driven by ETL jobs, they are driven by dashboards, and a handful refreshing every minute with no caching and no owner can quietly add tens of thousands of dollars a year to a Snowflake or BigQuery bill ([Basedash's analysis of BI-driven warehouse cost](https://www.basedash.com/blog/how-to-cut-cloud-data-warehouse-costs-from-bi-dashboards)).

The reason is a default nobody thinks about: the refresh interval. Someone builds an executive dashboard, sets it to auto-refresh every minute because "real-time" sounds better than "hourly," and walks away. That single dropdown turns a cheap query into a standing order to re-scan your tables 1,440 times a day, whether anyone is watching or not. BI dashboard warehouse cost is not really a query problem. It is a cadence problem, and cadence is a setting you chose without pricing it.

## You pay for bytes scanned, not data shown

The mental model that produces the bill is that a dashboard query is small because it shows a small result. A tile displays one number or a hundred rows, so it feels cheap. The warehouse does not bill for what it returns, it bills for what it touches. On BigQuery on-demand pricing, you pay $6.25 per TiB of data scanned after the first free tier, and the cost is based on bytes scanned, not bytes returned, so a query that returns 100 rows can still scan 10 GiB if the table is not partitioned ([Dataslayer's BigQuery cost breakdown](https://www.dataslayer.ai/blog/bigquery-costs-marketing-teams-2026)).

Snowflake bills differently but lands in the same trap. It charges for warehouse uptime, not query count, and enforces a 60-second minimum charge each time a warehouse resumes, which creates an idle tax on exactly the frequent, short-running queries that dashboards generate ([MotherDuck on Snowflake's billing model](https://motherduck.com/learn/reduce-snowflake-costs-duckdb/)). Either way, the cost of a dashboard is set by how much data each refresh scans and how often it refreshes, two numbers that have nothing to do with how small the chart looks.

## The $40k dashboard, worked out

Put real numbers on the headline. Take an illustrative dashboard whose full refresh scans about 25 GiB across several tiles against unpartitioned tables, set to auto-refresh every minute during a 12-hour business day. The per-TiB rate is BigQuery's published $6.25; the scan size and cadence are illustrative.

```
Refreshes/day:   60/hr x 12 hrs        = 720 refreshes
Data scanned:    720 x 25 GiB          = 18,000 GiB/day = ~17.6 TiB/day
Daily cost:      17.6 TiB x $6.25/TiB  = ~$110/day
Annual cost:     $110 x 365            = ~$40,150 / year
```

Forty thousand dollars a year, for one dashboard, scanning tables nobody is staring at every sixty seconds. And it gets worse fast at warehouse scale: a single poorly written query scanning a 10 TB table costs $62.50, and if it runs every hour it costs $1,500 a day ([OneUptime's BigQuery cost analysis](https://oneuptime.com/blog/post/2026-02-17-how-to-optimize-bigquery-costs-by-identifying-and-fixing-expensive-repeated-queries/view)). The dashboard did not get more valuable as the refresh interval shrank. It just got more expensive, because each tick is a full re-scan billed in full.

## The anchor: freshness is a cost you set, not a free default

Here is the framing that reorders the problem. Teams treat data freshness as a quality dial with no price tag, always reaching for "more real-time" because staleness feels like a defect. But freshness is a cost you are choosing, and the cost scales linearly with cadence while the value usually does not. An executive looking at a revenue dashboard twice a day gets exactly zero benefit from a one-minute refresh, yet pays for 1,440 of them. The mismatch between how often the data is refreshed and how often it is actually read is pure waste.

The right question is not "how fresh can we make it" but "how fresh does this data need to be," and the honest answer is usually far less fresh than the default. A daily-reported KPI built on data that updates hourly does not need a sub-minute refresh, it needs an hourly one at most. This is the same overprovisioning instinct I keep returning to in [why SaaS teams overpay for infrastructure](https://ravoid.com/blog/why-saas-overpay-infrastructure): the default is tuned to feel good, not to match the actual requirement, and the gap is billed to you.

| Refresh cadence | Refreshes / 12h day | Relative cost | Fits |
| --- | --- | --- | --- |
| Every minute | 720 | 1x (baseline) | Live ops monitoring only |
| Every 15 minutes | 48 | ~1/15 | Most operational dashboards |
| Hourly | 12 | ~1/60 | KPI and exec dashboards |
| Daily | 1 | ~1/720 | Reporting, trends |

## Three levers, multiplied together

The savings compound because the cost is a product of cadence times scan size, and you can attack both, then cache the result. First, match cadence to data change rate: dropping a dashboard from every-minute to every-15-minutes is a 15x cut on its own, with no loss of value for data that does not change faster than that. Second, partition the tables so each scan touches only the relevant slice instead of the whole table:

```sql
-- Unpartitioned: scans the entire table every refresh (~25 GiB)
SELECT region, SUM(revenue) FROM sales GROUP BY region;

-- Partitioned + pruned: scans only today's partition (~2 GiB)
SELECT region, SUM(revenue) FROM sales
WHERE event_date = CURRENT_DATE()        -- partition prune
GROUP BY region;
```

That partition prune can cut bytes scanned by another order of magnitude on a large table. Third, cache: Snowflake gives a free 24-hour result cache if queries do not fragment it ([Astrato's Snowflake spend guide](https://www.astrato.io/blog/controlling-snowflake-spend-bi-tool)), and pre-aggregating into a materialized view replaces full scans with maintained results, which 2024 FinOps reports found cut monthly billing by 30 to 47% in repeated-access scenarios ([MoldStud's BigQuery optimization writeup](https://moldstud.com/articles/p-top-performance-optimization-techniques-for-cost-effective-bigquery-usage)). Stack a 15x cadence cut with a 10x partition cut and the $40k dashboard becomes a few hundred dollars a year, before caching takes another bite. The same superlinear-savings logic shows up in retrieval systems too, which I traced in [why RAG is not free at ten million records](https://ravoid.com/blog/rag-is-not-free-brutal-cost-curve-10-million-records). On the warehouse-compute side, the same idle-and-oversize waste is the subject of [80% of your Snowflake bill is one setting](https://ravoid.com/blog/snowflake-cost).

## A post-mortem on a five-figure tile

A composite from the documented pattern, with figures labeled illustrative: a growth team built a marketing-attribution dashboard and set it to live-query mode so filters felt instant. Every filter change and every page load issued a fresh query against an unpartitioned events table, and the dashboard was embedded on an internal page that several people left open in background tabs all day. Each open tab re-queried on a short interval. The warehouse saw thousands of full-table scans a day from a dashboard that, by usage logs, was actively read a few dozen times. The bill told the story: this one dashboard accounted for a five-figure annual charge. The metric that broke was query count per dashboard view, which had decoupled entirely from human attention, runaway automated refreshes against data that updated once an hour. Switching to a 15-minute scheduled refresh against a partitioned, pre-aggregated table cut the dashboard's cost by more than 95%.

## Framework: price the dashboard before you ship it

| Decision | What you gain | What you pay | When it breaks |
| --- | --- | --- | --- |
| Match cadence to data change | Linear cost cut | Slightly staler views | True real-time ops |
| Partition + prune | Order-of-magnitude scan cut | Schema/migration work | Tiny tables |
| Materialized view | Replaces full scans | Maintenance credits | Fast-changing base data |
| Result cache | Near-free repeat reads | None (free window) | Fragmented queries |

Apply in order of effort-to-savings: fix the refresh cadence first because it is a one-field change with a 15x or 60x payoff, partition the hot tables second, add materialized views for frequently hit aggregations over slow-changing data, and let result caching catch the rest. Each lever multiplies against the others.

## Decision guidance

The default refresh interval is the single most expensive decision in most BI setups, and it is made by whoever clicked the dropdown, usually without seeing a price.

**The rule: If a dashboard refreshes faster than its underlying data changes or faster than anyone actually reads it, then slow the refresh to match the slower of the two before optimizing anything else.**

The honest exception is a genuine real-time operations dashboard, a fraud monitor, a live incident board, a trading view, where sub-minute freshness is the entire point and a stale number is worse than an expensive one. Those are rare, and they should be the deliberate exception you can name, not the accidental default on every executive's KPI page. For everything else, freshness beyond the data's change rate is money spent on numbers nobody refreshed for.

## The tick nobody asked for

A dashboard does not cost money when someone looks at it. It costs money every time it refreshes, and the refresh keeps happening in empty rooms, in background tabs, and through weekends, billing a full scan for an audience of zero. The expensive part of business intelligence in 2026 is not the intelligence. It is the cadence you set once and never revisited, multiplied by tables you never partitioned.

The cheapest query is the one a cache answered, and the second cheapest is the one a too-frequent refresh never fired. Set the interval to match reality, and the dashboard that quietly cost $40,000 goes back to costing what it is worth.

## FAQ

### Q: Why are BI dashboards so expensive on cloud warehouses?

Because they re-scan tables on every refresh and the warehouse bills for bytes scanned or uptime, not for the small result shown. A dashboard set to refresh every minute issues hundreds or thousands of full scans a day, often against unpartitioned tables, whether or not anyone is watching. The cost is driven by refresh cadence and scan size, which is why dashboards, not ETL, dominate most data bills.

### Q: How much can a frequently refreshing dashboard cost?

A dashboard scanning roughly 25 GiB per refresh every minute over a 12-hour day scans about 17.6 TiB daily, which at BigQuery's $6.25 per TiB is around $110 a day or roughly $40,000 a year, for one dashboard. Larger scans scale worse: a 10 TB query costs $62.50 each run, so running it hourly costs about $1,500 a day. The cadence is the multiplier.

### Q: Does BigQuery charge for data returned or data scanned?

Data scanned. On-demand BigQuery charges $6.25 per TiB of bytes processed, regardless of how few rows the query returns. A query returning 100 rows can still scan 10 GiB if the table is not partitioned, because the engine reads every relevant byte to compute the result. This is why partitioning and column pruning matter far more than result size for cost.

### Q: How do I reduce dashboard warehouse cost?

Stack three levers. Match refresh cadence to how fast the data actually changes, which often cuts cost 15x or more with no loss of value. Partition tables so each scan touches only the relevant slice, often another order of magnitude. Then cache: use result caches and materialized views to replace repeated full scans. Together these routinely cut a dashboard's cost by well over 90%.

### Q: What refresh interval should a dashboard use?

Match it to the slower of two things: how often the underlying data changes and how often a human actually reads it. An executive KPI dashboard read twice a day gains nothing from a one-minute refresh and should run hourly or daily. Reserve sub-minute refresh for genuine real-time operations like fraud monitors or incident boards where stale data is worse than expensive data.

### Q: Are materialized views worth it for dashboards?

For frequently accessed aggregations over slowly changing data, yes. They replace full scans with maintained pre-computed results, and FinOps reports found scheduled materialization cut monthly billing by 30 to 47% in repeated-access scenarios. The caveat is maintenance cost: materialized views consume credits to refresh on every base-table change, so they only pay off when the query is hit often and the base data changes infrequently.

### Q: Why do background browser tabs increase warehouse cost?

Because a dashboard left open in a background tab keeps issuing automated refresh queries on its interval, even though no one is reading it. Several open tabs multiply the query volume against your warehouse with zero human attention behind it. This decouples query count from actual usage and is a common source of runaway BI cost, fixed by scheduled refresh instead of live per-tab querying.

## Next Read

Dashboard cadence is one warehouse cost driver. For the broader pattern of paying for compute and capacity nobody is using, read [why SaaS teams overpay for infrastructure](https://ravoid.com/blog/why-saas-overpay-infrastructure).

---

### Sources & Further Reading

- [Basedash: Cut warehouse costs from BI dashboards](https://www.basedash.com/blog/how-to-cut-cloud-data-warehouse-costs-from-bi-dashboards)
- [Dataslayer: BigQuery costs and bytes-scanned pricing](https://www.dataslayer.ai/blog/bigquery-costs-marketing-teams-2026)
- [MotherDuck: Snowflake's billing model and the idle tax](https://motherduck.com/learn/reduce-snowflake-costs-duckdb/)
- [Astrato: Controlling Snowflake spend with your BI tool](https://www.astrato.io/blog/controlling-snowflake-spend-bi-tool)

---

_Last updated: July 22, 2026_
