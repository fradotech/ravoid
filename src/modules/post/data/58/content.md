# The Day "Just Use Postgres" Stops Working

_By Framesta Fernando · Engineering Manager & Technical Architect · 11 min read · Published June 29, 2026_

> **TL;DR:** Postgres for everything is the right default until your queue, vector search, and analytics workloads start fighting your OLTP traffic for the same connections, buffer cache, and autovacuum. One engine serving rival workloads does not fail loudly, it degrades, and the checkout path pays for the report someone ran. Split the workload that does not share an access pattern.

It is 3 a.m. and the page says checkout latency is through the roof. You open the database and the culprit is not checkout. It is a marketing analytics query someone scheduled, scanning a year of orders, holding buffer cache and a connection, while the queue workers you also put in Postgres hammer the same instance with `SELECT ... FOR UPDATE SKIP LOCKED`. Three workloads, one engine, and the one that pays your salary is losing.

"Just use Postgres" is genuinely excellent advice, and I give it constantly. One database for your app, your queue, your cache, your vector search, and your reporting means no extra infrastructure, no sync, one thing to operate. It is the correct starting architecture. The trap is that it stays the official architecture long after one of those workloads has outgrown sharing.

## The advice that quietly expires

The reasoning behind one-database-for-everything is sound: every system you add is operational surface, sync logic, and a new failure mode, so collapsing them into Postgres is a real simplification. Teams internalize this, ship fast, and rightly resist premature splitting. The advice is correct, and that is exactly why it overstays.

What the advice omits is that those workloads have incompatible access patterns competing for shared, finite resources. OLTP wants many tiny, fast transactions. A queue wants high-churn row updates and constant locking. Analytics wants long sequential scans over huge ranges. Vector search wants to hold a large index in memory. Postgres can do all four, but not without them contending for the same connection slots, the same `shared_buffers`, and the same autovacuum workers. The instance does not refuse the work. It just gets slower for everyone, and the symptom shows up on whichever path is most latency-sensitive, usually the one that matters most.

## Running out of the resource nobody counts

The clearest place this breaks is connections, because they are a hard, countable limit. The following is illustrative. Say you set `max_connections = 200`, a reasonable ceiling before per-connection memory overhead hurts. Then you let every workload draw from it:

```
max_connections          = 200
  web app pool           = 120
  queue worker pool      =  40
  analytics / reporting  =  30   (long-running, holds connections)
  replication + admin    =  10
  -------------------------------
  consumed               = 200   (zero headroom)
```

The budget is fully spent, and it looked fine in the demo. Then a normal traffic spike needs 60 more web connections. There are none. New requests block or error, not because the database is out of CPU, but because three workloads you colocated ate the connection budget the web tier needed for its spike. You did not run out of database. You ran out of the resource nobody put on a dashboard.

The same contention plays out in memory. If your vector index is 20 GB and `shared_buffers` is 8 GB, the index cannot stay cached, so approximate-nearest-neighbor scans evict the OLTP working set on every search, and your fast queries start hitting disk. That specific failure is the one I detailed in [pgvector scaling issues](https://ravoid.com/blog/pgvector-scaling-issues). And autovacuum, already fighting the queue table's churn, falls behind, bloat grows, and everything degrades together. The pattern of one resource silently capping the system is the same one behind [why SaaS teams overpay for infrastructure](https://ravoid.com/blog/why-saas-overpay-infrastructure).

The post-mortem version: a team ran their job queue as a Postgres table because it was simple, and it was, for a year. Then volume grew, the queue table churned millions of rows a day, autovacuum could not keep up, and table bloat pushed a dequeue query from, illustratively, 3 ms to 800 ms. The slow dequeue backed up the workers, the backed-up workers held more connections, and the connection starvation took down the web tier. A queue table took out checkout. Nothing was misconfigured. The workloads simply never belonged on the same instance at that scale.

## One engine cannot tune for opposite jobs

The reframe that tells you when to split: a single Postgres instance can only be tuned for one access pattern at a time, and your workloads want opposite tunings. This is not a Postgres weakness, it is physics. The settings that make analytics fast (large `work_mem`, generous scan-friendly cache) are the settings that starve high-concurrency OLTP, and the churn that a queue generates is the enemy of the vacuum cadence everything else depends on.

So the question is never "can Postgres do this," because it can do all of it. The question is "do these workloads share an access pattern, or are they fighting for the same knobs." When two workloads want the database tuned in opposite directions, colocating them means neither gets tuned right, and the shared instance becomes a compromise that serves no workload well. That is the signal to split, and the first thing to move is whichever workload's access pattern is most alien to your core OLTP traffic. Splitting is itself an operational cost, the same kind of build-versus-buy tradeoff I worked through in [serverless vs traditional backend](https://ravoid.com/blog/serverless-vs-traditional-backend), so you split deliberately, not preemptively.

## What to split, and in what order

Move workloads off in the order they hurt the shared instance:

| Workload | Why it conflicts | Split to |
| --- | --- | --- |
| Analytics / reporting | Long scans evict OLTP cache, hold connections | A read replica or warehouse |
| High-churn queue | Bloat and lock contention starve vacuum | A dedicated queue or its own instance |
| Large vector index | Does not fit in cache, evicts working set | Dedicated vector store or bigger node |
| Cache / sessions | High write churn on ephemeral data | An in-memory store |

The cheapest, highest-impact first move is almost always pushing analytics to a read replica, because it removes the long scans from the primary entirely while changing no application logic. A connection pooler in front of Postgres buys headroom but does not resolve the underlying contention, it just delays the day. The decision of when each split pays for its operational cost is the same evaluation I framed in [how to compare SaaS tools objectively](https://ravoid.com/blog/how-to-compare-saas-tools-objectively).

## Decision guidance

The trap is treating "just use Postgres" as a permanent architecture instead of a starting one, and only revisiting it after the 3 a.m. page. The signal to split is access-pattern conflict, not raw size.

**The rule: If two workloads on the same Postgres instance want it tuned in opposite directions, like high-concurrency OLTP and long-scan analytics, then split the more alien one off before contention forces the decision during an outage.**

Start on one Postgres. Instrument connection usage, cache hit ratio, and autovacuum lag, not just CPU. The moment one workload's access pattern starts dictating tuning that hurts the others, move it. Splitting on your schedule is a migration; splitting during a connection-starvation incident is a fire drill.

## The default that earned its retirement

"Just use Postgres" is not wrong, and the teams mocking it usually over-engineered something simpler. The advice earns its retirement on a specific workload the day that workload's access pattern starts taxing every other query sharing the instance. That is not a failure of the advice. It is the advice working exactly long enough to get you to the scale where the next decision is obvious.

Watch the connection budget and the cache hit ratio, not the disk size. They tell you the truth before the pager does.

## FAQ

### Q: When should I stop using Postgres for everything?

When two workloads on the same instance want it tuned in opposite directions, or when one workload's access pattern degrades the others. The trigger is access-pattern conflict, not raw data size. Common signals are analytics scans evicting OLTP cache, a queue table's churn outpacing autovacuum, or a vector index too large to stay cached. Split the most alien workload first.

### Q: Is using Postgres as a job queue a bad idea?

It is an excellent idea at low to moderate volume and a liability at high churn. A queue table generates constant row updates and locking, which produces bloat and fights autovacuum. At scale that can push dequeue latency from milliseconds to hundreds of milliseconds and back up workers, which then hold connections and can starve your web tier. Move it to a dedicated queue once churn outpaces vacuum.

### Q: What breaks first when Postgres is overloaded by mixed workloads?

Usually connections, because they are a hard, countable limit. When the app pool, queue workers, and long-running analytics queries each draw from `max_connections`, a normal traffic spike can find zero free connections and start erroring, even though CPU looks fine. Memory contention in `shared_buffers` and autovacuum falling behind are the other early failure points.

### Q: Should I just add a connection pooler like PgBouncer?

A pooler buys real headroom by multiplexing many clients onto fewer backend connections, so it helps and is usually worth adding. It does not resolve the underlying contention between incompatible workloads, though. If analytics scans are evicting your OLTP cache or a queue is starving autovacuum, pooling delays the reckoning rather than fixing it. Treat it as headroom, not a substitute for splitting.

### Q: How do I know if my vector search is hurting my database?

Watch the cache hit ratio and OLTP latency when searches run. If your vector index is larger than `shared_buffers`, approximate-nearest-neighbor scans pull it from disk and evict the working set your transactional queries depend on, so unrelated fast queries slow down during search load. When the index outgrows cache, move it to a dedicated vector store or a node sized to hold it.

### Q: What should I split off Postgres first?

Analytics and reporting, almost always. Pushing long-running read queries to a read replica removes the biggest cache-evicting, connection-holding workload from your primary while requiring no application logic changes. After that, split a high-churn queue and an oversized vector index in whatever order they are hurting the shared instance most, based on connection and autovacuum metrics.

## Next Read

The vector-search side of this contention has its own detailed failure curve: see [pgvector scaling issues](https://ravoid.com/blog/pgvector-scaling-issues).

---

### Sources & Further Reading

- [PostgreSQL documentation: Connection settings and resource consumption](https://www.postgresql.org/docs/current/runtime-config-connection.html)
- [jusdb: Choosing a Vector Database in 2026](https://www.jusdb.com/blog/vector-databases-comparison-pgvector-pinecone-weaviate-2026)
- [Encore: Vector Databases Complete Comparison Guide](https://encore.dev/articles/best-vector-databases)

---

_Last updated: June 29, 2026_
