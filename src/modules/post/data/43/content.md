_By Framesta Fernando · Engineering Manager & Technical Architect · 16 min read · Published April 23, 2026_

> **TL;DR:** Consolidating RAG infrastructure into Postgres saves initial operational overhead but guarantees critical pgvector scaling issues. HNSW index traversals require massive random memory access, which starves the shared_buffers cache used by your primary OLTP workload. This dynamic inevitably forces catastrophic latency spikes and expensive RDS overprovisioning.

The engineering trend throughout 2025 and early 2026 has been ruthless consolidation. After the initial explosion of AI infrastructure complexity, teams started pulling their disparate data systems back into single, monolithic databases. The logic was highly seductive. If you are already paying for a massive AWS RDS instance, why pay for a dedicated vector database? Adding the pgvector extension to Postgres allowed teams to store embeddings right next to the relational data they belonged to. It simplified backups. It simplified transactions. It eliminated complex data synchronization pipelines.

On paper, this architecture looks strictly superior. You get Atomicity, Consistency, Isolation, and Durability guarantees for your Retrieval-Augmented Generation workflows. You can filter by tenant ID using standard SQL `WHERE` clauses while performing similarity searches. It feels like the ultimate victory for boring technology. Startups and enterprise teams alike adopted this pattern heavily, assuming that Postgres, the workhorse of the modern internet, could handle anything they threw at it.

### The False Assumption

The entire pgvector consolidation movement rests on a single, fundamentally incorrect mental model. Engineering teams assume that a vector search is just another index lookup.

We are conditioned to think about database indexes through the lens of B-trees. In a traditional relational workload, if you want to find a specific user by their email address, the database traverses a highly predictable, memory-efficient tree structure. A B-tree depth rarely exceeds four or five levels, meaning the database only needs to read a handful of 8-kilobyte pages from disk to find exactly what it needs. If those pages are hot, they stay in RAM. The memory footprint of a B-tree lookup is microscopic.

A Hierarchical Navigable Small World (HNSW) index is not a B-tree. It is a highly interconnected, multi-layered graph. To find the nearest neighbors for a given embedding, the database must traverse this graph, jumping erratically from node to node across the entire vector space. This traversal pattern requires reading hundreds, sometimes thousands, of random pages from the underlying storage. It is mathematically impossible to neatly pack an HNSW graph into contiguous memory blocks that map well to traditional caching algorithms. The assumption that your database treats a vector search like a primary key lookup is exactly what causes catastrophic failure when your data scales.

### Concrete Early Example

Consider a 50-engineer fintech startup operating in Southeast Asia, processing roughly 12 million transactions per month. In late 2025, they decided to build an AI support agent that could read past customer support tickets and transaction histories to draft responses.

To keep things simple, they added pgvector to their existing primary database, an AWS RDS `db.r6g.4xlarge` instance with 16 vCPUs and 128GB of RAM. Their initial rollout included about 500,000 vector embeddings, representing two years of support history. Each embedding used OpenAI's standard 1536-dimensional float format.

At this scale, the math is entirely forgiving. A single 1536-dimensional vector using 32-bit floats takes up roughly 6 kilobytes of raw data. A half-million vectors consume about 3 gigabytes. Even factoring in the overhead of the Postgres tuple structure and the HNSW graph metadata, the entire vector footprint easily fits inside 6 gigabytes. Out of a 128GB server, dedicating 6GB to the AI feature is barely noticeable.

The latency was spectacular. The AI agent retrieved relevant tickets in 15 milliseconds. The engineering team wrote internal blog posts celebrating their pragmatic architecture, explicitly mocking other companies that had deployed complex, distributed vector databases. The architecture was celebrated as a massive win for operational simplicity.

Then, six months later, they decided to vectorize every single user transaction description and log entry to power an anomaly detection feature. The vector count jumped from 500,000 to 45 million in a matter of weeks. Within three days of the migration, their core payment processing API, which had historically responded in 45 milliseconds, began randomly spiking to over 4,000 milliseconds. Transactions started timing out. The primary database was effectively dying, yet CPU utilization never exceeded 40 percent.

### Where the Model Breaks

The failure mode of co-located vector search is entirely memory-bound. Postgres relies on an intricate balance between its own `shared_buffers` and the operating system's page cache. When you introduce a massive HNSW index into this ecosystem, the model breaks down across several distinct vectors of degradation.

- **Cache Eviction Cascades:** HNSW queries force the database to pull thousands of random pages from disk into memory. Because RAM is finite, Postgres must evict older pages to make room. The pages being evicted are often the hot B-tree nodes that your core application relies on for fast user logins and payment routing.
- **Write-Ahead Log Amplification:** Inserting large, dense floating-point arrays generates an astonishing amount of Write-Ahead Log (WAL) volume. A batch insert of 100,000 vectors can generate gigabytes of WAL data.
- **Replication Lag:** Because of the massive WAL volume, read replicas struggle to keep up with the primary database. The network link between the primary and the replica becomes saturated, leading to stale data on the read nodes.
- **Autovacuum Stalling:** Postgres uses Multiversion Concurrency Control. When you update or delete a row, the old version remains until the autovacuum process cleans it up. Vector indexes are notoriously slow to vacuum, tying up background worker threads and causing database bloat.
- **CPU Cache Line Misses:** The random pointer-chasing nature of graph traversal wreaks havoc on modern CPU architectures. Processors cannot prefetch data effectively when traversing an HNSW graph, leading to severe memory latency at the silicon level.

### Deep Scenario Expansion

To truly understand why pgvector scaling issues are inevitable in monolithic architectures, we have to look at the math across the lifecycle of a growing product. The friction is not linear. It compounds, hiding itself until the exact moment it becomes a critical production outage.

#### The Early Stage (0 to 1 Million Vectors)

At the beginning, you are storing a trivial amount of data. One million vectors at 1536 dimensions (float32) require roughly 6.1GB of raw storage. The HNSW index overhead adds another 3GB to 4GB. Your total footprint is around 10GB.

Your application is likely running on a database instance with 32GB to 64GB of RAM. Postgres typically reserves 25 percent of system memory for `shared_buffers`, and the Linux kernel uses the rest for the OS page cache. When a vector query executes, the required HNSW graph nodes are read from disk. Because the entire index is only 10GB, the operating system happily caches the whole thing in memory over the course of a few hours.

During this stage, your latency is constrained entirely by CPU execution time, not disk I/O. Searches take 10 to 20 milliseconds. Your primary OLTP workload, the queries that handle user authentication and shopping cart updates, remain untouched. The vector data lives peacefully alongside the relational data. You feel incredibly smart for avoiding the complexity of a dedicated database. You might even write a confident technical post about [why SaaS companies chronically overpay for infrastructure](https://ravoid.com/blog/why-saas-overpay-infrastructure).

#### The Growth Stage (1 Million to 10 Million Vectors)

As your product gains traction, you start embedding more data. You vectorize user documents, product catalogs, and perhaps chat logs. Your vector count hits 10 million.

The raw data size is now 61GB. The HNSW index adds another 30GB to 40GB. Your total footprint approaches 100GB. Suddenly, the entire vector dataset no longer fits in the memory of your mid-tier RDS instance.

This is when the memory warfare begins. When a user executes a similarity search, the HNSW algorithm must traverse a graph that is partially on disk. To calculate the distance between vectors, it must read the target vectors into RAM. The operating system page cache desperately tries to accommodate these reads by evicting other data.

Your database administrator will notice that the Postgres cache hit ratio, which historically sat at a comfortable 99.5 percent, is slowly degrading to 95 percent, then 90 percent. A 10 percent drop in cache hit ratio does not mean your database is 10 percent slower. It means 10 percent of your queries are suddenly experiencing disk I/O latency, which is hundreds of times slower than RAM.

To mitigate this, engineering teams usually reach for their first technical compromise. They implement `halfvec`, a pgvector feature that truncates 32-bit floats down to 16-bit floats. This instantly cuts the memory requirement in half, dropping the total footprint back down to around 50GB. The crisis is temporarily averted. The cache hit ratio recovers. The team breathes a sigh of relief, assuming they have permanently solved the scaling problem.

#### The Scale Stage (10 Million to 100 Million Vectors)

The relief provided by `halfvec` is short-lived. By the time your application hits 100 million vectors, the mathematical reality of the architecture becomes inescapable. Even using 16-bit floats, 100 million vectors of 1536 dimensions require approximately 300GB of raw storage. The HNSW graph overhead adds another 150GB. Your total footprint is roughly 450GB.

To hold this in memory, you need an AWS RDS instance with at least 768GB of RAM, such as a `db.r6g.24xlarge`, which costs tens of thousands of dollars per month. If you refuse to upgrade the hardware, the system enters a death spiral.

When you cannot fit the HNSW index in RAM, every single similarity search triggers massive disk thrashing. A single query might require reading 2,000 different pages scattered randomly across your NVMe drives. Because Postgres is fighting to serve these vector reads, it begins evicting your most critical relational data from the `shared_buffers`.

A user attempts to log in. The `users` table index, which used to live permanently in RAM, has been evicted to make room for vector embeddings. The login request, which should take 5 milliseconds, now requires a disk read and takes 150 milliseconds. Concurrency spikes. Connection pools fill up. The database CPU spends all of its cycles waiting for disk I/O (iowait).

The team is eventually forced to spin up dedicated read replicas solely for the purpose of isolating the vector queries. They route all RAG traffic to these isolated nodes. However, because Postgres replication relies on WAL streaming, every time a new vector is inserted on the primary node, that massive chunk of data must be shipped across the network to the read replica. The read replicas fall out of sync by minutes or even hours. You have successfully recreated the complexity of a distributed system, but with all the inherent bottlenecks of a monolithic relational database.

### Hidden Cost and System Leak

The financial impact of this architectural choice extends far beyond the explicit AWS bill. The hidden cost lies in the systemic degradation of your engineering velocity and the forced over-allocation of resources.

When a primary database becomes memory-constrained, engineers are forced to spend cycles debugging phantom performance issues. A latency spike in the billing service might actually be caused by a burst of RAG queries from the marketing feature, simply because they share the same physical memory pool. This lack of isolation turns performance tuning into a dark art.

To compensate for the risk of cache eviction, platform teams will preemptively double or triple the size of their RDS instances. You end up paying for a massive server not because your CPU utilization is high, but entirely because you need to purchase enough RAM to keep the vector monster fed without starving your core business logic.

| Cost Category           | Traditional Postgres Scale                            | pgvector at Scale (100M+ vectors)                                              | Hidden Impact                                                                           |
| :---------------------- | :---------------------------------------------------- | :----------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------- |
| **Compute Sizing**      | Scaled to match CPU and concurrent connection needs.  | Scaled entirely to match the memory footprint of the HNSW index.               | Paying for massive vCPU counts you do not use just to acquire the attached RAM.         |
| **Storage I/O**         | Predictable B-tree updates and sequential WAL writes. | Massive random read IOPS during index traversal and heavy write amplification. | Rapidly exhausting AWS IOPS limits, requiring expensive Provisioned IOPS (io2) volumes. |
| **Replication Network** | Lightweight relational row changes.                   | Gigabytes of dense floating-point array data streaming constantly.             | Cross-AZ data transfer costs explode; read replicas experience chronic replication lag. |
| **Maintenance Burden**  | Standard autovacuum processes complete in minutes.    | Vector index vacuums stall, requiring manual DBA intervention and tuning.      | Engineering hours burned on database babysitting instead of feature development.        |

The realization that [why AI costs explode after scale](https://ravoid.com/blog/why-ai-cost-explodes-after-scale) is often not because of LLM API pricing, but because of the cascading infrastructure tax of supporting those features.

### Anchor Insight

The root cause of this entire failure pattern can be distilled into a single, uncomfortable truth.

**Vector search is an OLAP workload wearing an OLTP mask.**

Relational databases like Postgres are engineered specifically for Online Transaction Processing (OLTP). The entire architecture, from the buffer manager to the WAL writer to the MVCC implementation, is optimized for small, fast, highly concurrent reads and writes. OLTP workloads expect extreme cache locality. If you read a row, you are likely to read the row next to it.

Online Analytical Processing (OLAP) workloads, conversely, are designed to scan massive amounts of data. They care about throughput rather than individual query latency. They do not expect extreme cache locality.

HNSW vector search is fundamentally an analytical workload. It requires scanning across vast mathematical spaces. It touches thousands of disparate points of data to calculate distances. It completely breaks the assumptions that make Postgres fast. By forcing an OLAP workload into an OLTP engine, you are deliberately subverting thirty years of database engineering optimizations.

| Core Database Mechanism   | OLTP Expectation (Postgres Design)                                              | HNSW Vector Reality                                                                                   | The Resulting Insight                                                                                 |
| :------------------------ | :------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------- |
| **Memory Access Pattern** | Highly localized. B-tree nodes cluster related data tightly together.           | Completely random pointer chasing across a massive, multi-layered graph.                              | Pre-fetching fails at the CPU level. Cache lines are continually invalidated.                         |
| **Eviction Tolerance**    | High. Evicting cold relational rows rarely impacts primary application latency. | Zero. Evicting parts of the vector graph guarantees disk I/O penalties on the next similarity search. | The vector index acts as an aggressive parasite, constantly dominating the LRU cache.                 |
| **Update Mechanism**      | In-place updates or lightweight MVCC tuple creation.                            | Complex graph re-wiring. Adding a single vector might require updating multiple neighbor edges.       | Write amplification destroys disk longevity and saturates replication network bandwidth.              |
| **Storage Format**        | Row-oriented storage optimized for retrieving full records quickly.             | Requires rapid iteration over dense mathematical arrays, which favors columnar formats.               | Massive amounts of unnecessary tuple metadata are loaded into RAM just to read floating-point values. |

Understanding this mismatch is critical. You cannot tune your way out of a fundamental architectural conflict. No amount of tweaking `work_mem` or adjusting `random_page_cost` will change the fact that you are executing analytical graph traversals inside a transactional row store.

### Framework / Mental Model

To evaluate when your architecture will break, you need a deterministic way to calculate your eviction horizon. The eviction horizon is the exact moment when your vector data size forces your primary relational working set out of RAM.

You can model this using the **Vector Resource Depletion Formula**:

`Footprint = (Count * Dimensions * Precision) * Graph Overhead`

Once you calculate the absolute footprint, you must compare it to your available memory margin.

| Variable             | Definition                                                                               | Interpretation and Impact                                                                       |
| :------------------- | :--------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------- |
| **Count**            | Total number of embeddings.                                                              | Grows linearly with your data, but user-generated content often causes exponential spikes.      |
| **Dimensions**       | Size of the embedding model (e.g., 1536 for OpenAI, 768 for open source).                | Moving to smaller models reduces fidelity but drastically cuts infrastructure cost.             |
| **Precision**        | Byte size of the data type (4 bytes for float32, 2 bytes for halfvec, 1 bit for binary). | The easiest variable to change. Dropping to halfvec buys you 12-18 months of runway.            |
| **Graph Overhead**   | The extra memory required for HNSW pointers (typically 1.3x to 1.6x the raw data).       | A non-negotiable tax required for fast search. Without it, you are performing sequential scans. |
| **Available Margin** | Total RAM minus OS overhead, minus your relational working set size.                     | If your Footprint exceeds your Available Margin, your primary database will begin to thrash.    |

For example, if your relational working set (the data your application reads every day) is 40GB, and your server has 128GB of RAM, your Available Margin is roughly 80GB. The moment your calculated Vector Footprint crosses 80GB, you have crossed the eviction horizon. From that day forward, every RAG query degrades the performance of your core application.

### Trade-off Comparison

You must make architectural decisions based on hard limits, not philosophical preferences for consolidation. Here is exactly what you buy and what you pay for each path.

| Decision                                 | What You Gain                                                                          | What You Pay                                                                                           | When It Breaks                                                                                                       |
| :--------------------------------------- | :------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------- |
| **Monolithic pgvector (Default)**        | Zero operational overhead. Unified backups. Standard SQL filtering via JOINs.          | CPU cache starvation. Contaminated buffer pools. Expensive RDS overprovisioning.                       | Around 5 to 10 million vectors, depending on your baseline relational workload.                                      |
| **Quantization (halfvec / binary)**      | Instantly halves or quarters your memory footprint without migrating data.             | Slight reduction in recall accuracy. Does not solve the fundamental random access I/O problem.         | Around 20 to 30 million vectors. It merely delays the inevitable eviction horizon.                                   |
| **Isolated pgvector Replicas**           | Protects the primary OLTP workload from memory eviction.                               | Massive WAL replication lag. Application-level query routing complexity.                               | Around 50 million vectors. Replication network saturation becomes unmanageable.                                      |
| **Dedicated Vector DB (Milvus, Qdrant)** | Built specifically for mmap disk paging and graph traversals. Extreme scale tolerance. | High operational complexity. Dual-write synchronization problems. eventual consistency across systems. | Operates smoothly into the billions of vectors, but breaks if your engineering team cannot handle distributed state. |

### Decision Guidance

Knowing these trade-offs, engineering leadership must apply strict thresholds for infrastructure migration. The [brutal cost curve of 10 million records](https://ravoid.com/blog/rag-is-not-free-brutal-cost-curve-10-million-records) requires proactive planning, not reactive firefighting.

**Under 1 Million Vectors: Stay on pgvector.**
If you are building a proof of concept or operating a highly constrained domain specific tool, do not introduce a dedicated vector database. The operational overhead of managing a separate system like Qdrant or Pinecone is entirely unjustified at this scale. Use standard 32-bit floats. Enjoy the simplicity.

**1 Million to 10 Million Vectors: Migrate to halfvec.**
As you cross the million-vector mark, immediately cast your vectors to `halfvec`. The loss in recall accuracy for standard text embedding models like `text-embedding-3-small` is statistically negligible for almost all business use cases. This single change will drastically reduce your memory pressure and push your eviction horizon out by at least a year. Monitor your Postgres cache hit ratio weekly.

**10 Million to 50 Million Vectors: Split the Workload.**
If you are determined to stay within the Postgres ecosystem, this is the stage where you must physically separate the workloads. Provision a dedicated read replica and route all vector similarity searches to it. Accept that your RAG queries will be operating on slightly stale data due to replication lag. You are now treating Postgres as a distributed system, using the primary node purely as a write-ahead log sequencer for your vector data.

**Over 50 Million Vectors: Migrate to a Dedicated Engine.**
At this scale, Postgres is no longer the appropriate tool for the job. You are paying a massive premium for ACID guarantees that you likely do not need for your embedding data. Migrate to a purpose-built vector engine like Milvus or Qdrant. These systems are designed from the ground up to handle disk-paged graph traversals using custom memory mapping (mmap) strategies. They handle dense array storage far more efficiently than Postgres tuples. Yes, you will have to solve the dual-write problem to keep your relational data in sync with your vector data, but that is the necessary price of operating at scale.

### Common Mistakes

1.  **Over-indexing on filtering capabilities:** Teams often stay on pgvector because they want to execute SQL `JOIN`s against relational tables before filtering vectors. In reality, most vector databases now support complex metadata filtering that is more than capable of handling multi-tenant isolation without requiring a full relational engine.
2.  **Ignoring the cost of vacuuming:** Engineers calculate the cost of storing vectors but forget that deleting or updating vectors leaves dead tuples. At 50 million rows, an autovacuum run on a vector table can easily consume extensive I/O bandwidth and stall out, leading to massive table bloat that silently degrades search speed.

### The Inevitable Unbundling

The cycle of database consolidation always ends the same way. We push a generalized tool beyond its limits to save time, and eventually pay for that convenience with catastrophic system instability.

The real question is not whether pgvector is a good tool. It is an incredible piece of engineering. The question is whether you are willing to risk the stability of your core transaction processor to save the operational effort of running a second database. When your primary application goes down because an AI background job evicted your user table from memory, the elegance of a unified architecture will offer absolutely no comfort to your customers.

---

### FAQ

### Q: Why can't I just increase the `shared_buffers` in Postgres to fix the performance problems?

Increasing `shared_buffers` will temporarily mask the issue by providing more RAM for the HNSW index to consume. However, because vector indexes grow rapidly and require random access, they will eventually consume the new memory allocation as well. You end up in an expensive arms race, buying increasingly massive AWS RDS instances just to feed the vector graph, rather than addressing the underlying architectural mismatch.

### Q: Does using the IVFFlat index instead of HNSW solve the memory eviction issue?

IVFFlat uses significantly less memory than HNSW because it relies on clustering rather than a complex graph structure. However, it requires you to rebuild the index as your data distribution changes, and its recall accuracy drops off sharply at scale. While it reduces memory pressure, the trade-off in search quality and maintenance overhead makes it unviable for most serious production RAG systems.

### Q: How much does quantization actually degrade the quality of RAG results?

For modern embedding models like OpenAI's `text-embedding-3` family, dropping from 32-bit floats to 16-bit floats (`halfvec`) results in a recall degradation of less than 1 percent. For most enterprise search and support agent workloads, this difference is imperceptible to the end user. Moving to 8-bit or binary quantization, however, introduces significant fidelity loss that must be rigorously benchmarked against your specific dataset.

### Q: Can I put the vector table in a separate Postgres database on the same server to isolate it?

No. Different databases running on the same Postgres instance still share the exact same underlying hardware resources, including CPU caches, disk I/O bandwidth, and the operating system page cache. A heavy vector search in one database will still trigger physical disk reads that degrade the performance of the relational queries happening in the adjacent database.

### Q: If we migrate to a dedicated vector database, how do we handle data synchronization?

You must abandon the comfort of synchronous transactions. The standard pattern is to treat your primary Postgres database as the source of truth, and use a Change Data Capture (CDC) tool like Debezium to stream updates asynchronously to your dedicated vector database. This requires your application logic to gracefully handle eventual consistency between your relational state and your vector search results.

### Next Read

Before you scale your infrastructure further, make sure you understand the brutal math behind storing embeddings.

- [The Real Cost of RAG Vector Databases at Scale](https://ravoid.com/blog/rag-vector-database-real-cost-at-scale)

---

_Last updated: April 23, 2026_
