# The xhigh Effort Trap: Why Opus 4.7's Recommended Default Is Quietly Inflating Your Agentic Bill 40%

_By Framesta Fernando · Engineering Manager & Technical Architect · 13 min read · Published April 17, 2026_

> **TL;DR:** Opus 4.7 introduced xhigh as a new effort level between high and max, recommended as the starting point for coding and agentic workloads. xhigh produces roughly 1.5-1.7x more output tokens than medium on the same task. This is the single most expensive default decision Anthropic has ever shipped, and most teams haven't noticed.

Opus 4.7's xhigh effort level produces roughly 1.7x more output tokens than medium on the same task. It is the new recommended default for coding and agentic use cases. Nobody explicitly opted in.

## The One Line in the Migration Guide Everyone Skimmed Past

Hidden in Anthropic's Opus 4.7 release notes is a line most engineering teams will read once and forget. When testing Opus 4.7 for coding and agentic use cases, the company "raised the default effort level to xhigh for all plans." That sentence carries more production cost implications than almost anything else in the release. It is also the single line that will cause most teams to miss their Q2 cost projections by 30 to 50 percent.

The phrasing feels innocuous. "Raised the default" sounds like a quality improvement, the kind of thing a responsible vendor does when a new model becomes capable of more careful reasoning. On a capability level, it is exactly that. xhigh genuinely makes Opus 4.7 better at hard tasks. The model thinks longer. It self-verifies more. It catches edge cases that lower effort levels miss. Anthropic's own benchmarks show 3-5 percentage point gains on difficult coding problems when comparing xhigh against high, and larger gains against medium.

Quality gains in AI are never free. They are paid in output tokens. When a vendor silently shifts the default effort level up, the cost shift moves from an explicit opt-in to a silent opt-out. Most teams will not opt out until their invoice tells them they should have.

## The Effort Parameter Most Teams Have Never Configured

The false assumption embedded in how teams use frontier models is that effort is a knob you tune when you need to, not a cost lever you have to explicitly manage from day one. For three years, the industry framing around effort-style parameters has been quality-first. Use higher effort when the task is hard, lower effort when it is not. That framing is correct in principle but dangerously incomplete in practice.

The missing half is that effort levels are also cost levels. Each step up the effort ladder (low, medium, high, xhigh, max) approximately increases output token count by 1.3-1.5x on the same task. That compounds across millions of requests per month. It compounds differently across workload types. And it compounds even harder when combined with the tokenizer changes we covered in [the Opus 4.7 tokenizer tax](https://ravoid.com/blog/opus-4-7-tokenizer-tax).

> The effort parameter is the most expensive parameter your API client accepts. Nobody treats it that way.

Most teams set effort once during prototyping and never revisit it. In a world where medium was the default and teams explicitly opted into higher tiers for known-hard workloads, this was fine. Accidental underspend happens, but accidental overspend was bounded. Opus 4.7's default shift inverts that boundary. Now the default is expensive, and the optimization work is in downgrading.

## A Concrete Example: One Agent Loop, $62K per Month Surprise

Take a team running a production coding agent that handles pull-request-scale refactoring. Before the 4.7 migration, the agent used `effort: "high"` explicitly. Per successful resolution, the agent produces roughly 4,200 output tokens across its reasoning and final code generation. At 2 million agent invocations per month, that is 8.4 billion output tokens.

On Opus 4.6 at `effort: "high"`:

- 8,400 × $25/M = $210,000/month output spend

Migrate the model ID to `claude-opus-4-7` without touching anything else. Because the team relied on the default effort (original code did not pass an explicit `effort` parameter, which many production codebases do not), the agent now inherits xhigh. Internal testing from several early-access teams pins xhigh at roughly 1.3x the output tokens of high on the same workloads.

On Opus 4.7 at xhigh (new default):

- 4,200 × 1.3 = 5,460 output tokens per request
- 2M × 5,460 = 10.9B output tokens
- Output cost: $272,500/month

Monthly delta: +$62,500. Over a year that is $750,000 of agent budget quietly reallocated to thinking tokens that nobody budgeted for. No code change. No config change. Just a model ID swap and a default nobody opted into.

The quality trade-off is real. xhigh resolves roughly 4% more tasks correctly on this workload type. If that 4% resolution gain offsets the 30% cost increase on your economics, great. For most teams it does not, but they will not run the math because they do not know the default shifted.

## Where the Cost Impact Concentrates

The xhigh default does not hit all workloads equally. The breakdown happens in five places, and they compound.

- **Agent loops with self-verification** suffer the most because each step in the loop spends additional output tokens on internal reasoning before committing to the next action.
- **Long-running tasks** (multi-file refactors, extended research, multi-step planning) amplify the effect because the extra thinking cost accrues at every decision point in the chain.
- **Streaming UIs** show the cost twice: users see longer thinking pauses before output starts, and the full output stream costs more tokens than before.
- **Low-complexity paths** like classification, extraction, and light summarization are where the waste is highest, because the task did not need xhigh-level thinking in the first place.
- **High-throughput endpoints** multiply the base cost penalty across load spikes that can hit your monthly budget in a single bad morning.

Each of these looks manageable in isolation. Together they define why "migration is free" is the most expensive sentence any engineering lead can say out loud this quarter.

## How the Default Hurts at Each Stage

The xhigh default affects different stages of company maturity in different ways, and the right response is not the same for all of them.

### Early stage (under 200K Opus requests/month)

A small team using Opus for a single AI feature. Monthly spend before migration: typically $800-$3,000. The xhigh default pushes this to $1,100-$4,000. Annoying but not material. The real risk at this stage is silent habit formation. Teams get used to the new baseline and never question it. Six months later when they scale, they discover they were paying 30% more than necessary from day one.

Right move: explicitly set `effort: "medium"` for everything that is not coding or multi-step reasoning. Save the xhigh budget for paths where you can prove it is delivering quality.

### Growth stage ($20K-$80K/month on Opus)

This is where the xhigh default starts hurting. A $50K Opus workload becomes a $65K-$67K workload without any product change. Combined with the tokenizer tax from [the 4.7 migration cost piece](https://ravoid.com/blog/opus-4-7-tokenizer-tax), total bill inflation can hit 40-55%. CFO will ask questions. The engineering lead who pitched "free quality upgrade" will have to explain.

Right move: instrument effort level usage per endpoint. Audit which endpoints genuinely need xhigh. Downgrade 60-70% to medium or high. Reserve xhigh for the critical 20-30% where the quality gain pays for itself.

### Scale stage ($150K+/month on Opus)

At enterprise volume, the xhigh default costs $45K-$80K/month extra across a typical fleet. Annual run rate delta: $540K-$960K. This is no longer a configuration issue. It is a procurement conversation. Most enterprise agreements include effort level defaults in the SLA. Renegotiate.

Right move: treat effort levels as a first-class infrastructure decision, not a model parameter. Build routing logic that assigns effort per workload type, similar to the pattern we covered in [smart routing and self-hosted AI cost savings](https://ravoid.com/blog/smart-routing-self-hosted-ai-cost-savings). The routing cost is trivial compared to the savings from correct effort assignment.

## The Hidden Costs xhigh Creates

The token count is the visible cost. The invisible ones matter more over time.

| Cost Component                   | medium baseline | xhigh (new default)        | What Teams Miss                    |
| -------------------------------- | --------------- | -------------------------- | ---------------------------------- |
| Output tokens per request        | 1.0x            | 1.5-1.7x                   | Direct per-call cost               |
| Self-verification overhead       | Low             | High                       | Doubles thinking on hard problems  |
| Streaming latency (TTFT)         | Fast            | Slower (400-2000ms longer) | Perceived UX degradation           |
| Multi-turn session tokens        | Baseline        | +30-50%                    | Conversations compound             |
| Rate limit consumption           | Baseline        | +50%                       | Hit limits earlier on same traffic |
| Eng time on "why is latency up?" | $0              | $2K-$5K/month              | Investigation cost                 |

The rate limit consumption line is the sleeper. Anthropic enforces per-minute token limits. xhigh effectively cuts your throughput ceiling by 30-50% at the same dollar budget. Teams that were comfortably under their rate limit on 4.6 will hit it mid-spike on 4.7, triggering retries, fallbacks, and eventually the kind of cascading failure pattern we broke down in [why most AI agent pilots never reach scale](https://ravoid.com/blog/ai-agents-in-production-why-78-percent-pilots-never-reach-scale).

> Effort levels are the least discussed, most expensive infrastructure decision in the LLM stack today.

## Effort Levels Are the New Instance Types

Here is the reframe that makes the rest of this easier to reason about. Effort levels should be treated the same way cloud engineers treat AWS instance types or Kubernetes resource requests. You do not pick the largest available one by default because it feels safer. You pick the smallest one that meets your actual SLO, and you upgrade explicitly when evidence demands it.

The industry has not yet internalized this framing for LLM effort levels because the parameter is newer, the cost impact is less visible, and until Opus 4.7 the defaults were cheap enough that casual usage did not hurt. The xhigh default changes all of that. From today forward, treating effort as a routine parameter is an accidental budget decision.

| Infrastructure Parallel           | Cloud Computing Analog                 | LLM Effort Analog                  |
| --------------------------------- | -------------------------------------- | ---------------------------------- |
| Default selection                 | t3.large (general purpose)             | medium                             |
| Explicit upgrade for hard work    | m6i.4xlarge (compute optimized)        | high or xhigh                      |
| Vendor recommendation to question | "Start with the recommended instance"  | "Start with xhigh effort"          |
| Cost blindness mechanism          | Reserved Instance underutilization     | Effort level overprovisioning      |
| Optimization discipline           | Right-sizing reviews                   | Effort audit by endpoint           |
| Breaking pattern at scale         | One oversized instance × 1000 replicas | One overeffort level × 2M requests |

In cloud infrastructure, paying for unused compute capacity is treated as a cardinal sin. FinOps teams exist specifically to prevent it. In LLM infrastructure, the exact same sin is happening invisibly because there is no corresponding discipline yet. The teams that import FinOps rigor into their LLM effort decisions will save 30-50% over the teams that do not.

## The Effort Economics Formula

To make effort decisions defensible instead of reflexive, use this formula whenever a new endpoint is added or an existing one is reviewed.

```
Justified Effort = min(E where Delta_quality * Value_per_resolution >= Delta_tokens * P_out * Volume)
```

Where:

- **E** = the effort level under consideration (medium, high, xhigh, max)
- **Delta_quality** = measured resolution rate improvement versus the next lower effort level
- **Value_per_resolution** = dollar value to the business of one additional successfully resolved request
- **Delta_tokens** = measured output token increase versus the next lower effort level
- **P_out** = vendor output price per token
- **Volume** = monthly request volume for this endpoint

This reduces to: only choose a higher effort level when the business value of the extra quality exceeds the marginal token cost at your volume. Most endpoints do not clear that bar. A classification endpoint processing low-value user actions almost never needs xhigh. A payment routing agent handling high-dollar decisions probably does.

| Workload Type                  | Typical Delta_quality (high to xhigh) | Typical Delta_tokens | Justified?     |
| ------------------------------ | ------------------------------------- | -------------------- | -------------- |
| Classification / tagging       | <1 percentage point                   | ~1.3x                | Almost never   |
| Light summarization            | <2 percentage points                  | ~1.3x                | Rarely         |
| Code completion (inline)       | 2-3 percentage points                 | ~1.3x                | Sometimes      |
| Multi-file refactoring         | 4-6 percentage points                 | ~1.3x                | Often          |
| Agentic orchestration          | 5-8 percentage points                 | ~1.4x                | Usually        |
| Payment / compliance reasoning | 3-5 percentage points                 | ~1.3x                | Yes, by policy |

The business value column is what makes or breaks the economics. A 5 percentage point resolution gain on $0.10/decision support tickets does not pay for xhigh. The same gain on $5,000/decision fraud checks absolutely does. Your effort level map should reflect your business, not your vendor's recommendation.

## Three Architectures, One Right Answer

Three patterns are emerging right now. The right choice depends on workload diversity and team size.

| Architecture                                          | What You Gain                                     | What You Pay                                                      | When It Breaks                                                                         |
| ----------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Accept xhigh default everywhere                       | Zero migration effort, best quality on hard paths | 30-50% output token inflation on workloads that do not need xhigh | First invoice after migration                                                          |
| Explicitly set medium/high at every call site         | 20-40% cost savings vs default                    | Code change on every endpoint, ongoing effort decision discipline | New endpoints ship without effort review, silently inheriting xhigh                    |
| Build effort routing layer with per-workload defaults | Optimal cost-per-outcome across all workloads     | 2-4 weeks engineering plus ongoing maintenance                    | The routing layer becomes stale when effort economics change on the next model version |

The honest answer for most growth-stage and scale-stage teams is option 3, build the routing layer. Anthropic will keep introducing new effort levels and adjusting defaults, just as cloud vendors keep introducing new instance types. Hard-coding effort at every call site is the LLM equivalent of hard-coding instance types in Terraform, which every cloud engineer has learned is a bad idea.

Option 2 is the right transitional step. Do it this week for your top 10 endpoints by volume. Then invest in option 3 over the next 60 days.

## Decision Guidance by Usage Pattern

Generic advice fails here because effort level optimization is workload-specific. The right next step depends on what you are actually running.

### High-volume, low-complexity endpoints

Classification, extraction, light summarization, structured output with fixed schemas. Set `effort: "medium"` explicitly in your client. Measure resolution rate. In most cases it is indistinguishable from xhigh. Save 40-60% on these endpoints immediately.

### Agentic workflows with multi-step tool use

The xhigh default is probably correct for these. Run a controlled A/B test between high and xhigh for two weeks. Measure resolution rate, average tool calls per successful completion, and total cost per successful completion. If xhigh wins by more than 20% on cost-per-completion, keep it. Otherwise downgrade to high.

### User-facing code completion or chat

Stream-of-output latency matters. xhigh adds 400-2000ms to time-to-first-token because the model thinks longer before streaming. For real-time user interfaces this is often a regression. Downgrade to high or medium unless you can prove the quality improvement pays for the UX cost.

### Enterprise-grade reasoning (compliance, finance, medical)

xhigh or max is probably the right call. The cost of a mistake dominates the cost of the extra tokens. Document your effort policy so new engineers do not downgrade in a code review to "save money" without understanding the risk surface.

## The Two Mistakes Teams Are Making This Week

First, treating effort levels as a model implementation detail instead of an infrastructure decision. The engineers shipping Opus 4.7 integrations are often not the same people owning the AI cost budget. When effort defaults to xhigh silently, the implementation engineer does not see the cost change, and the budget owner does not see the implementation change. The gap is where the money leaks. As we noted in [the Opus 4.7 tokenizer tax piece](https://ravoid.com/blog/opus-4-7-tokenizer-tax), the same structural blindness made the tokenizer change invisible. This is the second surface where it repeats.

Second, assuming xhigh is "better" in the general sense. xhigh is better at hard tasks with diminishing returns. On easy tasks it is identical in output quality to high or medium, just with more tokens consumed getting there. Paying 1.5x tokens for identical output is not better. It is more expensive. Teams treating effort as "higher equals smarter" without workload context are paying for thinking that produced no additional insight.

## The Defaults You Did Not Choose

Frontier model pricing has always had a hidden dimension. For three years it was tokenizer behavior, as we covered last week. This week Anthropic added a second hidden dimension: effort level defaults. Next quarter there will be a third. The industry pattern is clear. Vendors will keep introducing knobs that let them ship quality improvements and let customers pay for them silently.

Teams that survive this pattern do two things at once. They treat every effort parameter the way cloud engineers treat instance types: pick the smallest that meets the SLO, upgrade explicitly, audit regularly. And they build the routing infrastructure to make correct effort assignment a property of the system, not a property of the developer who wrote the last line of code.

Teams that do not survive will keep seeing their invoices drift up by 15-30% every model release, convince themselves it is a traffic phenomenon, and eventually conclude that frontier models are "just expensive now." The expense is not the model. It is the defaults nobody questioned.

> You did not choose xhigh. Anthropic chose it for you. You still pay for it.

If you are deploying Opus 4.7 this week, audit your effort levels before you deploy. If you already deployed, audit them this weekend. The invoice is not going to wait for your next sprint.

## FAQ

### Q: What is the xhigh effort level in Claude Opus 4.7?

xhigh is a new effort parameter value introduced with Claude Opus 4.7, positioned between the existing `high` and `max` levels. Anthropic recommends it as the starting point for coding and agentic use cases, and it became the default effort level for all plans on the 4.7 release. It increases the model's internal thinking budget, which improves task resolution rates but also produces roughly 1.3-1.5x more output tokens per request compared to the `high` level.

### Q: Does Opus 4.7 really default to xhigh automatically?

Yes. Anthropic's release documentation explicitly states the default effort was raised to xhigh for coding and agentic use cases on Opus 4.7, across all plans. Client code that does not pass an explicit `effort` parameter inherits xhigh. Code that previously relied on the default without passing effort will produce more output tokens on 4.7 than it did on 4.6 for the same input.

### Q: How much does xhigh cost compared to medium or high effort?

On the same task, xhigh produces approximately 1.5-1.7x more output tokens than medium and 1.3x more than high. Since output tokens cost $25 per million, this typically translates to a 30-50% output spend increase versus medium and a 25-30% increase versus high. Exact numbers vary by workload, with agentic and multi-step reasoning tasks seeing the larger end of the range.

### Q: How do I explicitly set effort level in the Anthropic API?

Pass `effort: "medium"` (or `"low"`, `"high"`, `"xhigh"`, `"max"`) in your API request's thinking configuration block. In the Messages API, this sits inside the `thinking` parameter object, replacing the deprecated `budget_tokens` field with the new `task_budget` mechanism introduced in Opus 4.7. Teams currently passing `budget_tokens` should migrate to `task_budget` and explicit effort levels before the deprecation period ends.

### Q: When is xhigh actually worth using?

xhigh is worth the cost premium on workloads where a 3-8 percentage point resolution improvement justifies a 30-50% output token increase. This is typically true for multi-file code refactoring, long-running agentic workflows, complex document reasoning, payment or compliance decisions, and any workload where the cost of a mistake exceeds the cost of additional inference. For classification, light summarization, and low-complexity Q&A, xhigh is almost always overkill and medium or high performs identically at lower cost.

### Q: What is the difference between xhigh and max effort levels?

max is Anthropic's highest effort tier and produces the most thinking tokens per task. It is intended for extreme edge cases where resolution rate must be maximized at any cost. xhigh is positioned as the new recommended default for production coding and agentic workloads because it captures most of max's quality gains at 60-70% of max's token cost. Practically, max is reserved for specialized deep-reasoning paths, while xhigh covers the bulk of production needs where cost control still matters.

### Q: Should I build an effort routing layer or just set effort explicitly at call sites?

For small teams with fewer than 10 distinct Opus endpoints, explicit setting at each call site is fine. For larger teams with diverse workloads across many features, a routing layer that assigns effort per workload type is the more maintainable pattern. This matches the architectural approach we recommend for general model routing in [smart routing and self-hosted AI cost savings](https://ravoid.com/blog/smart-routing-self-hosted-ai-cost-savings), applied to effort levels specifically.

## Next Read

If your Opus 4.7 invoice is going up despite unchanged pricing, the xhigh effort default is one of three compounding causes. Our deeper breakdown in [the Opus 4.7 tokenizer tax](https://ravoid.com/blog/opus-4-7-tokenizer-tax) covers the other two: the new tokenizer that inflates input tokens by up to 35%, and the cache invalidation cost that hits every team in their first month of migration.

---

### Sources & Further Reading

- [Anthropic: Introducing Claude Opus 4.7](https://www.anthropic.com/news/claude-opus-4-7)
- [Claude Docs: What's new in Opus 4.7](https://platform.claude.com/docs/en/about-claude/models/whats-new-claude-4-7)
- [Claude API Pricing Reference](https://platform.claude.com/docs/en/about-claude/pricing)
- [Dev.to: Opus 4.7 migration, budget_tokens to task_budget](https://dev.to/ji_ai/opus-47-killed-budgettokens-what-changed-and-how-to-migrate-3ian)
- [Help Net Security: Claude Opus 4.7 release analysis](https://www.helpnetsecurity.com/2026/04/16/claude-opus-4-7-released/)

---

_Last updated: April 17, 2026_
