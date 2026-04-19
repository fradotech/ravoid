# MCP Server Sprawl: The Quiet Token Bill That's Eating Your AI Margin

_By Framesta Fernando · Engineering Manager & Technical Architect · 16 min read · Published April 19, 2026_

> **TL;DR:** Model Context Protocol is exploding in production. Six MCP servers can inject 90,000 tokens into every request before the model reasons about your user's query. That is roughly $8,100 per month in pure schema overhead on Sonnet, more on Opus. The cost is not the protocol. It is the architecture everyone copied from the docs.

MCP adoption went vertical in the last six months. The teams deploying it fastest are the ones about to hit the cost wall first.

## The Quiet Migration You Cannot See on a Dashboard

Cloudflare published their MCP reference architecture on April 14. Uber, Block, and Sourcegraph are running MCP in production. The protocol hit 110 million monthly SDK downloads and crossed 10,000 public servers. Every AI coding assistant ships native MCP support. This is no longer an experiment.

What is new is the invoice shape. Teams that deployed MCP in Q1 2026 are now getting their first full-month billing cycles. The numbers are shocking people who thought they understood token economics, including teams that have been running LLMs in production for two years. Schema overhead is turning into a line item larger than the inference cost for the actual user queries.

## What Everyone Believes About MCP

The mental model most teams inherit from the Anthropic docs and GitHub examples goes like this. MCP is a standard protocol that lets your AI agent connect to external tools. You spin up MCP servers, each exposing some set of capabilities. Your agent discovers them, picks the right one, and executes. The value is standardization. Write a tool once, use it from Claude, GPT, Gemini, and Cursor without rewriting.

That part is correct. The part people are quietly wrong about is what it costs to run it at scale, and how that cost behaves as you add more servers.

## The Assumption That Breaks Your Budget

The false mental model is that MCP servers are "connected" like microservices are connected to a service mesh. Agent sends a query, the protocol figures out which tool to invoke, tool runs, response returns. In this mental model, the cost should be roughly proportional to the tools you actually call.

It is not. Not even close.

Every MCP tool connected to your agent injects its full schema into the LLM's context window on every request. That includes name, description, parameter definitions, and examples. One tool definition runs 300 to 500 tokens. A typical MCP server exposes 20 to 30 tools. So before the model reads a single word of the user's question, it has already loaded the schema of every tool from every connected server into its prompt. Every. Single. Request.

This is not a bug. It is how the protocol works. And it is the single largest hidden cost in multi-tool agent systems today.

## The 6-Server Production Agent

Consider a realistic setup most teams land on in their first three months with MCP. An internal engineering agent connects to the following servers: GitHub, Postgres, Jira, Slack, AWS, and Datadog. These are not exotic. This is the default starter pack from the Cursor and Claude Code templates.

Each server exposes roughly 20 to 30 tools. GitHub MCP alone ships 93 tools as of its April 2026 release. Postgres exposes database introspection, query execution, schema diffs, and migration helpers. Jira ships issue CRUD, epic navigation, and sprint reporting. The raw token weight of these definitions sits in the range of 10,000 to 20,000 tokens per server.

Six servers. Roughly 150 tool definitions. Around 90,000 tokens injected into every request.

At Claude Sonnet input pricing of $3 per million tokens, that is $0.27 per request in pure schema overhead. Your agent handles 30,000 requests per month across your engineering team. You just wrote an $8,100 check before a single line of code was written, a single Slack message was posted, or a single bug was triaged. If you happen to be running Opus 4.7 at $15 per million input tokens, multiply that by five. You are now at $40,500 per month in schema overhead alone.

The real kicker: the user's query is usually under 100 tokens. The model's actual response is usually under 500 tokens. You are paying for 90,000 tokens of tool documentation to answer a 100-token question.

## Where the Naive MCP Model Breaks

Teams discover this failure pattern in a few distinct ways. Each one arrives as a separate surprise.

- **Monthly bill spike.** Engineering sees a 4-10x jump in Claude spend with no corresponding jump in usage. The user count is flat, the query count is flat, but token consumption exploded. The explanation is always a recent MCP server addition.
- **Latency regression.** Response times get noticeably slower as schemas grow. More input tokens means longer time to first token. A 90K-token prompt takes 3-5 seconds before the model starts generating anything. Users who saw instant responses now wait.
- **Context window saturation.** At 8-10 connected servers, schema overhead alone eats into the model's effective context. You get degraded reasoning quality not because the user's task is complex, but because the model is drowning in tool documentation.
- **Lost-in-the-middle effect.** When you do load 150+ tools, research shows the model reliably uses only the first 5-10 well. Tools buried in the middle of the schema block get ignored, even when they are the correct ones. More tools, worse tool selection.
- **Hidden per-turn multiplication.** Multi-step agent workflows re-send the full schema every turn. A 6-turn workflow with 90K schema tokens per turn burns 540,000 tokens before any real reasoning happens.

The brutal part is these failure modes compound. You do not hit one. You hit all five simultaneously, and your post-mortem ends up blaming "agent complexity" when the real culprit is architectural.

## The Sprawl Curve at Three Stages

The damage depends entirely on where you are in the adoption cycle. MCP gets dramatically more expensive as you scale.

**Early stage: 1-2 servers, prototype phase.** You connect GitHub and Postgres. Combined tool count is under 50, schema overhead around 15,000 tokens. Per-request cost on Sonnet is roughly $0.045. At 5,000 requests per month, you are looking at $225 in schema overhead. The bill is small enough to miss. You ship a demo, it works, you celebrate. You also do not yet understand what you signed up for.

**Growth stage: 4-6 servers, real production.** Your team ships internal tools, customer-facing agents, and dev infrastructure. You connect GitHub, Postgres, Jira, Slack, Datadog, and an internal API server. 150+ tools, 90K tokens per request. At 30,000 requests per month, schema overhead is $8,100 on Sonnet, $40,500 on Opus. Your CFO notices. Your VP of Engineering starts asking questions. This is where the cost conversation becomes real.

**Scale stage: 10+ servers, enterprise deployment.** Multiple agents across multiple teams, each with their own tool surface. Not unusual to see 250 to 400 tool definitions per agent, especially when teams add domain-specific servers for billing, HR, support, sales ops, analytics, and customer intelligence. Schema overhead clears 150,000 tokens per request. At 100,000 monthly requests, you are burning $45,000+ on Sonnet before the agent does anything useful.

The sprawl is the cost. Each new server feels cheap in isolation, like adding another microservice to a Kubernetes cluster. But unlike microservices, every MCP server you connect taxes every other request, whether that request uses the new server or not.

## Where the Money Actually Goes

Breaking down a single 90K-token request reveals how uneven the spending is. Most teams think they are paying for AI intelligence. They are mostly paying for schema transport.

| Component                               | Tokens       | % of Request | Cost (Sonnet $3/M input) |
| --------------------------------------- | ------------ | ------------ | ------------------------ |
| MCP tool schemas (6 servers, 150 tools) | 90,000       | 89%          | $0.270                   |
| System prompt + agent persona           | 2,500        | 2.5%         | $0.008                   |
| Conversation history (5 turns avg)      | 5,000        | 5%           | $0.015                   |
| User query                              | 150          | 0.1%         | $0.0005                  |
| Retrieved context (RAG)                 | 3,500        | 3.4%         | $0.011                   |
| **Total input per request**             | **~101,150** | **100%**     | **$0.304**               |

In this breakdown, the actual thing the model is supposed to act on, the user's query plus retrieved context, is 3.6% of the bill. The rest is documentation the model scans repeatedly, request after request, to maybe use 2 or 3 tools out of 150.

This is the token economics pattern I keep writing about, but sharper. We already covered how [token prices dropped 99% while AI bills went up 320%](/blog/ai-cost-explosion-token-prices-down-99-percent-bill-up-320-percent), and MCP sprawl is the latest mechanism. Cheaper tokens mask worse architecture. Your unit cost went down, your units per query exploded. The same dynamic showed up with [Opus 4.7's tokenizer tax](/blog/opus-4-7-tokenizer-tax), where a pricing change nobody announced raised real-world bills by 35%. MCP is the protocol-level version of the same problem.

## The Core Mechanism, Stated Honestly

Here is what is actually happening, and it deserves a section of its own because most explanations bury it.

**MCP was designed for discoverability. It was not designed for cost efficiency at scale.**

The protocol makes a deliberate architectural choice: push every tool definition to the model on every request so the model can reason about which tool to pick. This works beautifully when you have 5 to 10 tools. The model reads the list, picks the right one, calls it. Clean, deterministic, easy to debug. The protocol's elegance is that the agent does not need a separate orchestration layer. The model itself is the router.

But that elegance has a price that scales linearly with tool count and compounds with request volume. Every tool you add does not just cost its own tokens. It makes every future request more expensive, forever, whether or not that request needs the new tool.

This is the structural inverse of how REST APIs work. When you add a new REST endpoint, existing callers do not pay for it. They do not even know it exists until they need it. MCP inverted that model. Every MCP server you connect broadcasts its entire surface area to the model on every interaction. The cost of discovery became the cost of operation.

Anthropic's own engineers recognized this early. That is why Claude Code has been quietly moving toward tool bundling and progressive disclosure patterns, and why Cloudflare just published Code Mode, which collapses N tools behind 2 meta-tools and reduces schema overhead by 94%. These are not optimizations. They are admissions that the original MCP deployment pattern does not survive scale.

| Pattern                         | Token Cost Behavior                                | Insight                                                |
| ------------------------------- | -------------------------------------------------- | ------------------------------------------------------ |
| Naive MCP (all servers upfront) | Linear growth with tool count, charged per request | Every tool you add taxes every future request, forever |
| Progressive disclosure          | Small constant + on-demand tool loading            | Moves discovery to runtime, pay only for what you need |
| Code Mode / portals             | 94% reduction via meta-tools                       | Architecture becomes orthogonal to tool count          |
| CLI / direct invocation         | Flat cost, no schema injection                     | Highest efficiency, lowest flexibility                 |

The deeper truth: the right MCP architecture is the one that decouples tool availability from tool cost. Everything else is a negotiation with the sprawl tax.

## A Formula for the MCP Tax

If you want to predict your MCP bill before it happens, the math is not complicated. I use this formula to pressure-test any team's MCP plan before they commit.

**MCP Monthly Cost = R × (S + T × D) × P**

Where:

- **R** = monthly request count
- **S** = fixed system prompt tokens (usually 2,000-5,000)
- **T** = total tools connected across all servers
- **D** = average tokens per tool definition (300-500)
- **P** = input token price per token (Sonnet = $3/M, Opus 4.7 = $15/M)

Plug in a realistic mid-market setup: 30,000 requests, 3,000 system tokens, 150 tools, 400 tokens per tool, $3 per million Sonnet input.

**30,000 × (3,000 + 150 × 400) × $0.000003 = 30,000 × 63,000 × $0.000003 ≈ $5,670/month**

That is before any conversation history, any RAG context, any model output. That is just the cost of loading your tool surface into the model on every request.

Run the same formula with common adjustments to see the sensitivity:

| Scenario                            | T (tools) | R (requests) | Model    | Monthly Cost |
| ----------------------------------- | --------- | ------------ | -------- | ------------ |
| Early stage                         | 50        | 5,000        | Sonnet   | $345         |
| Growth (naive)                      | 150       | 30,000       | Sonnet   | $5,670       |
| Growth (naive)                      | 150       | 30,000       | Opus 4.7 | $28,350      |
| Scale (naive)                       | 300       | 100,000      | Sonnet   | $37,500      |
| Growth (Code Mode, 10 meta-tools)   | 10        | 30,000       | Sonnet   | $450         |
| Growth (CLI hybrid, 5 entry points) | 5         | 30,000       | Sonnet   | $285         |

Notice how the same workload can produce a 100x cost difference depending on architecture. That is the spread between teams who understand the MCP cost curve and teams who follow the docs literally.

## The Trade-off You Actually Face

Here is the honest matrix of deployment options. Each one gains something and pays for it somewhere else. There is no free architecture.

| Decision                                      | What You Gain                                    | What You Pay                                      | When It Breaks                           |
| --------------------------------------------- | ------------------------------------------------ | ------------------------------------------------- | ---------------------------------------- |
| Naive MCP (all servers upfront)               | Zero orchestration complexity, model picks tools | Linear token cost growth, context saturation      | 8+ servers or 200+ tools                 |
| Progressive disclosure                        | 90%+ token reduction, scales cleanly             | Requires router logic, adds latency per discovery | Tools need to be queryable by intent     |
| Code Mode / server portals                    | 94% reduction, stays flat as servers grow        | Operational complexity of running portals         | Low tool surface where direct beats meta |
| CLI / direct invocation                       | Near-zero schema overhead, fastest               | Loses MCP interop, you hand-wire tools            | Non-technical users or dynamic tool sets |
| Gateway (Bifrost / AI Gateway)                | 50% reduction, vendor-managed                    | Added infra, potential vendor lock-in             | When gateway becomes bottleneck          |
| Hybrid (MCP for discovery, CLI for execution) | Balances flexibility and cost                    | Two code paths, more moving parts                 | Teams without infra discipline           |

The common error is choosing whichever pattern the docs show first, then measuring cost six months later and rewriting. The expensive learning cycle most teams go through.

Multi-agent setups compound this further. We wrote about the [handoff problem that destroys multi-agent systems in production](/blog/multi-agent-orchestration-handoff-problem), and MCP sprawl is a related failure mode: every agent in your system may be independently paying its own schema tax, turning a 90K-token overhead per request into a 540K-token overhead across a 6-agent workflow.

## Deciding What Fits Your Stage

The right architecture depends entirely on where you are. Most "MCP is expensive" takes ignore this, which is why they sound like religious debates.

**If you are early stage (1-2 servers, <10K requests/month):** Naive MCP is fine. Your total monthly overhead is under $500. The operational simplicity is worth it. Do not over-architect. But watch your server count like a hawk. Every new server is an automatic future tax.

**If you are growth stage (3-6 servers, 10K-50K requests/month):** Start moving to progressive disclosure. This is the stage where naive MCP goes from invisible to painful. You are spending $3K-$10K per month on schema overhead. A 90% reduction pays back the engineering investment in under two months. Code Mode or a gateway both qualify as valid choices. Pick whichever your team will actually operate.

**If you are scale stage (6+ servers, 50K+ requests/month):** Naive MCP is organizational negligence. At this volume, you are spending $20K-$100K per month on schema transport. Code Mode plus a gateway plus CLI fallbacks for high-frequency operations is table stakes. Your infrastructure team should own this architecture end-to-end, not the agent team.

**If your workload is cost-sensitive regardless of stage:** CLI-first, add MCP only where human-readable tool discovery is a real user need. Coding agents often fall here. The best teams shipping Claude Code-style products have moved heavy toolchain execution to CLI and keep MCP for cross-team discoverability only.

This is the same decision pattern we walk through for [smart routing and self-hosted AI cost savings](/blog/smart-routing-self-hosted-ai-cost-savings). Architecture choices compound. Making the right one at the start is 10x cheaper than retrofitting.

## The Mistake That Almost Everyone Makes

One mistake dominates every cost post-mortem I have seen in the last six months. Teams connect every potentially useful MCP server to their agent at build time. The reasoning is always the same: "we might need it, why not just connect it now and let the model decide?"

That decision costs you on every single request forever. And worse, the more tools you connect, the worse the model gets at picking the right one. You are simultaneously spending more and getting less. The discipline needed is counterintuitive: connect fewer servers, not more. Route to the right server at runtime based on intent, and load tools on demand. This is where engineering discipline separates teams that ship sustainable AI from teams that burn down their margin.

The second mistake is ignoring the compounding effect of multi-turn agents. Every turn in an agent conversation loads the full schema again. A 6-turn agent workflow with 90K schema tokens burns 540K input tokens before reasoning. Teams measure their cost per request and miss that their real unit is cost per workflow. If your agent architecture involves any sort of iterative refinement, your schema tax is multiplied by turn count.

## The Answer Is Not in the Docs

Most MCP cost conversations end up pointing at Anthropic. The real problem is not the protocol. It is that everyone copied the reference architecture from the docs and treated it as the right answer instead of the simplest one.

MCP at scale is not the same engineering problem as MCP in a demo. The docs show you how to connect servers. They do not show you why you should not connect most of them. Every protocol that succeeds eventually produces a gap between what the getting-started guide tells you and what production economics demand. MCP is no exception. We went through this with microservices, with Kubernetes, with serverless, and with every orchestration framework before it. The same shift is now visible in the [quiet LangChain exit of 2026](/blog/langchain-exit-raw-sdk-migration-2026). The mature move in that story was leaving the scaffolding. The mature move in this story is pruning the sprawl.

The teams winning with MCP in 2026 are the ones who treat connected servers the way SRE teams treat database queries: every one is a cost center, every one is audited, every one earns its place. The teams losing are the ones still running `mcp add github && mcp add postgres && mcp add jira && mcp add slack` every time someone suggests a new workflow.

The sprawl is the tax. The architecture is the answer. And the answer will not be in the getting-started guide. It will be in your invoice next month, if you read it carefully.

---

## FAQ

### Q: What is MCP token sprawl in simple terms?

MCP token sprawl is the cumulative token cost created when you connect multiple MCP servers to an AI agent. Every tool on every connected server has its schema, including its name, description, and parameters, injected into the model's prompt on every request, regardless of whether that tool is used. With 6 typical MCP servers, this adds up to roughly 90,000 tokens per request. At 30,000 requests per month on Claude Sonnet, that is approximately $8,100 in schema overhead alone, before any real work is done.

### Q: Is MCP worth using despite the cost?

Yes, but architecturally, not naively. MCP's standardization value is real: tools written once work across Claude, GPT, Gemini, and Cursor. The cost problem is not inherent to the protocol. It is a byproduct of the default "connect every server, let the model decide" deployment pattern. Teams using progressive disclosure, Code Mode, or hybrid CLI approaches capture the benefits of MCP while avoiding the 90% schema waste. MCP is worth it if you architect around the token tax, not if you follow the getting-started guide literally.

### Q: How do I reduce MCP token costs in production?

Four strategies, ordered by impact. First, move to progressive disclosure: instead of loading all tool schemas upfront, expose a small router tool that fetches tool definitions on demand. This typically reduces schema overhead by 90%. Second, adopt Code Mode or server portals following Cloudflare's pattern, which collapse many tools behind a handful of meta-tools. Third, move high-frequency operations to CLI or direct API calls, reserving MCP for genuinely dynamic discovery. Fourth, use an AI gateway like Bifrost or Portkey that can cache and compress schemas. Combine at least two of these for production-grade cost control.

### Q: What is the difference between MCP and direct API calls cost-wise?

Direct API calls carry no schema overhead. The model does not need to see the entire tool surface to make one call. You pay for the user's query, the system prompt, and the tool invocation. That is it. MCP, in its naive deployment, injects the full schema of every connected server on every request. For a setup with 150 tools across 6 servers, MCP adds roughly 90,000 tokens per request versus direct API calls. At scale, this can mean a 10-50x cost multiplier for the same workload. The trade-off is that MCP gives you model-driven tool selection and cross-client standardization. Direct API calls require you to hardcode which tool gets called when.

### Q: How many MCP servers should a production agent connect to?

The defensible answer is "as few as possible to meet the use case, and always behind a router if you exceed 3." There is no magic number, but the pattern is clear: every additional server you connect linearly increases your per-request cost and non-linearly degrades model tool selection accuracy. High-functioning teams cap direct connections at 2-3 servers and use meta-tools or progressive disclosure for everything else. The threshold where naive MCP stops scaling is usually around 5-6 servers or 100 total tools. Beyond that point, architectural intervention is not optional.

### Q: Will MCP cost come down as the protocol matures?

Schema overhead will come down through architectural patterns, not protocol changes. The protocol itself is unlikely to fundamentally restructure tool definition loading. What is already happening is the ecosystem converging on progressive disclosure, Code Mode, and gateway patterns as default deployment topologies. Anthropic, Cloudflare, and multiple gateway vendors are all pushing this direction. Expect 2026-2027 to standardize these patterns the way caching and CDNs standardized around REST APIs in the 2010s. If you are deploying MCP today, design for that endpoint, not for the current reference architecture.
