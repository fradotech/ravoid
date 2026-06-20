# The 50% AI Discount Hiding Behind "Async"

_By Framesta Fernando · Engineering Manager & Technical Architect · 11 min read · Published July 2, 2026_

> **TL;DR:** Batch inference cost is half of real-time on both OpenAI and Anthropic, yet teams route everything through the synchronous endpoint. Most LLM work, embeddings, summarization, classification, enrichment, does not need to be instant. Paying the real-time price for work nobody is waiting on is a 50% tax you opted into by default.

Here is a dare for your next sprint: open your LLM usage breakdown and label every call as "a human is waiting on this right now" or "nobody is waiting." Be honest. The chat responses and the autocomplete are real-time. The nightly summarization, the embedding backfill, the classification of yesterday's tickets, the enrichment job, none of those have a human watching a spinner. Now notice that all of them hit the same synchronous endpoint at the same full price.

Both major providers sell that not-waiting work at half price through a batch API, and most teams never wire it up. They pay the real-time premium on work that is, by definition, not real-time, because synchronous is the default and nobody questioned it.

## The default that charges a premium

The unexamined assumption is that there is one way to call an LLM: send a request, block, get a response. That is the synchronous model every SDK shows in its quickstart, so it becomes the only pattern teams use, for chat and for batch jobs alike. The premium is invisible because there is nothing to compare it against in the code you wrote.

But the providers price latency explicitly. OpenAI's Batch API processes asynchronous jobs within a 24-hour window at 50% off standard rates, and Anthropic's Message Batches API does the same, also at a 50% discount for high-volume asynchronous workloads. The discount is not a negotiation or an enterprise tier, it is a published, self-serve rate for telling the provider "I do not need this back instantly." Synchronous pricing is, in effect, a real-time surcharge, and you pay it on every call whether or not anything is actually waiting for the result.

## Splitting the bill by who is waiting

Put numbers on it. The following is illustrative. Say you run 1,000,000 LLM calls a month at an average of $0.01 each, all synchronous, for a $10,000 monthly bill. Audit them and find 60% are background work nobody waits on.

```
All synchronous:
  1,000,000 x $0.01 = $10,000 / month

Split: 400k real-time + 600k batchable
  real-time: 400,000 x $0.01        = $4,000
  batch:     600,000 x $0.005 (-50%) = $3,000
  new total                          = $7,000 / month
```

Three thousand dollars a month, 30% of the bill, reclaimed by moving work that was never time-sensitive onto the endpoint that already exists for exactly that work. No model change, no quality change, no prompt change. The only thing that moved was the latency tolerance you were paying to ignore. And the more batchable your workload, the bigger the cut: a pipeline that is 80% background enrichment can take nearly the full 50% off its dominant cost. This stacks with the input-side savings from [the prompt caching bill cut most teams never turn on](https://ravoid.com/blog/prompt-caching-cost-savings), and both are the kind of structural saving that survives the usage growth I described in [why AI cost explodes after scale](https://ravoid.com/blog/why-ai-cost-explodes-after-scale).

The post-mortem version: a team ran a nightly job to summarize and tag the day's support tickets, firing tens of thousands of synchronous calls in a tight loop at 2 a.m. It worked, and it cost full price plus occasional rate-limit retries when the loop outran the quota. Moving the same job to the Batch API, illustratively, halved its line and eliminated the retry storms, because the provider scheduled the work instead of the team hammering the real-time endpoint. The job had a 24-hour deadline and was being run as if it had a 200-millisecond one.

## Latency is a feature you are paying for by accident

The reframe that unlocks the saving: real-time response is a feature with a price, and you should pay for it only where a human is actually waiting. Synchronous inference is not the natural way to call a model, it is the premium tier, and treating it as the default means buying the premium for every background job in your system.

This flips the design question. Instead of "should this be async," which sounds like extra engineering nobody wants, ask "is a human waiting on this result." If the answer is no, the work belongs in a batch, and the 50% is yours. The categories that almost always qualify are the unglamorous bulk of an AI pipeline: embedding generation and backfills, document and ticket classification, nightly summarization, data enrichment, evaluation runs, and synthetic data generation. None of those have a user staring at a loading state, and all of them are usually billed as if they did. The routing instinct here is a cousin of the model-selection logic in [smart routing for self-hosted AI cost savings](https://ravoid.com/blog/smart-routing-self-hosted-ai-cost-savings): match the request to the cheapest path that still meets its real requirement, and latency tolerance is just another dimension of that match.

## A framework for what to batch

Sort your LLM calls by who is waiting, then route accordingly:

| Workload | Waiting? | Endpoint |
| --- | --- | --- |
| Chat, autocomplete, live agent | Human, now | Synchronous |
| Embedding backfill, enrichment | No one | Batch (50% off) |
| Nightly summarization, tagging | No one | Batch (50% off) |
| Eval runs, synthetic data | No one | Batch (50% off) |

The routing is simple to express: classify by latency requirement, not by convenience.

```ts
// Route by who is actually waiting, not by which endpoint is the default.
const endpointFor = (job: { humanWaiting: boolean; deadlineHours: number }) =>
  job.humanWaiting || job.deadlineHours < 1 ? 'sync' : 'batch'; // batch = 50% off

// Most background jobs have deadlineHours of 12-24. They are paying
// the real-time surcharge for a deadline they do not have.
```

Batch APIs return within 24 hours, often far sooner, so anything with an overnight or end-of-day deadline fits cleanly. The one caveat is that batch is not for interactive paths, so keep the classification honest rather than batching something a user actually waits on. The failure mode to avoid is the reverse mistake: quietly batching a path that a user does wait on, which trades a real 50% saving for a support ticket about why the feature feels broken.

## Decision guidance

The trap is letting the synchronous default decide the bill for work that has no latency requirement. The discount is published and self-serve; the only thing standing between you and it is the habit of calling the real-time endpoint for everything.

**The rule: If no human is waiting on a result and it can tolerate a deadline measured in hours, then route it through the batch API, because paying the synchronous rate for asynchronous work is a 50% surcharge you are volunteering to pay.**

Audit your calls by latency requirement, move the background bulk to batch, and keep only genuinely interactive work synchronous. For most AI products the background work is the majority of volume, so this is one of the largest single-step savings available, and it changes nothing a user can perceive.

## The surcharge nobody decided to pay

There is no clever architecture here and no tradeoff to agonize over. There is a published 50% discount for work that is not time-sensitive, and a default that quietly opts you out of it. The teams paying full price for nightly batch jobs did not weigh latency against cost. They just never asked which of their calls had anyone waiting on the other end.

Ask the question once. Half of the answer is probably worth half its current price.

## FAQ

### Q: How much does the batch API actually save?

Both OpenAI and Anthropic discount asynchronous batch processing by 50% versus standard synchronous rates, in exchange for a turnaround window of up to 24 hours. The real saving on your bill depends on what fraction of your calls are background work that tolerates that window. A pipeline that is 60% batchable can cut roughly 30% off total spend; one that is mostly enrichment can approach the full 50% on its dominant cost.

### Q: What kinds of LLM work should use batch instead of real-time?

Anything no human is actively waiting on: embedding generation and backfills, document and ticket classification, nightly summarization, data enrichment, evaluation runs, and synthetic data generation. These typically have deadlines measured in hours, not milliseconds, yet are usually billed at the real-time rate. Keep chat, autocomplete, and live agent responses synchronous, since a user is waiting on those.

### Q: What is the catch with batch inference?

Latency. Batch jobs complete within a turnaround window of up to 24 hours rather than instantly, so they are unsuitable for anything interactive. There is no quality difference, since the same models process batch and synchronous requests, and no prompt changes are required. The only constraint is that you must be able to tolerate the asynchronous turnaround, which most background workloads easily can.

### Q: Does batch processing reduce output quality?

No. Batch and synchronous requests run on the same models and return the same quality of output. The discount reflects scheduling flexibility for the provider, not a lesser model or degraded results. You are paying less purely because you released the requirement that the result come back instantly, which lets the provider process the work when it has capacity.

### Q: Can I combine batch processing with prompt caching?

They target different parts of the bill and can be used together where applicable. Prompt caching cuts the input cost of a repeated prefix, while batch cuts the overall rate for non-interactive jobs by 50%. For a background job with a large stable prompt, structuring for cache hits and submitting via batch attacks both the input-token cost and the real-time surcharge at once.

### Q: How do I decide if a job is batchable?

Ask one question: is a human waiting on this result right now? If yes, or if the deadline is under an hour, keep it synchronous. If no human is waiting and the deadline is measured in hours, it is batchable. Classify by that latency requirement rather than by which endpoint your SDK showed first, and route the background majority to the discounted batch path.

## Next Read

Batch cuts the rate on non-interactive work; the other half-of-the-bill structural saving is on the input side: see [the prompt caching bill cut most teams never turn on](https://ravoid.com/blog/prompt-caching-cost-savings).

---

### Sources & Further Reading

- [OpenAI: Batch API documentation](https://platform.openai.com/docs/guides/batch)
- [Anthropic: Message Batches documentation](https://docs.anthropic.com/en/docs/build-with-claude/batch-processing)
- [CloudZero: LLM API Pricing Comparison 2026](https://www.cloudzero.com/blog/llm-api-pricing-comparison/)

---

_Last updated: July 2, 2026_
