# A 1M-Token Window Is a Serving Bill, Not a Feature

_By Framesta Fernando · Engineering Manager & Technical Architect · 11 min read · Published August 10, 2026_

> **TL;DR:** Long-context inference cost scales quadratically in compute and linearly in memory, so a 1M-token window is a per-request serving bill, not a free capability. Attention prefill on a million tokens can take many minutes of GPU time before a single output token appears. Use the full window only when retrieval cannot do the job cheaper.

Model providers spent 2026 in a context-window arms race: 200K tokens on one frontier model, 2M-plus on another, 10M on a third ([FutureAGI on context windows](https://www.futureagi.com/glossary/context-window)). The marketing frames each jump as a free upgrade, a bigger box you can pour data into at no extra charge. The infrastructure tells a different story. A model supporting a million-token window and a model serving a million-token request economically are two different things, and conflating them will cost you at scale ([DigitalOcean on long-context cost](https://www.digitalocean.com/community/tutorials/long-context-inference-production-cost)). Support is a capability. Performance is a bill.

The bill is brutal because of how attention works. Attention prefill, the phase that processes your input before generating anything, scales roughly O(n²) with prompt length, which is why long-context requests are disproportionately expensive ([Spheron on inference SLOs](https://www.spheron.network/blog/llm-inference-slo-ttft-itl-latency-budget-guide-2026/)). Double the context and you roughly quadruple the attention compute. Push it to a million tokens and the numbers stop being a rounding error and start being the dominant cost of the request. The window you were told was free is metered, per request, in GPU-seconds you pay for whether the model needed all those tokens or not.

## The two costs the marketing hides

A long-context request carries two distinct costs, and the window arms race advertises neither. The first is prefill compute. Because full attention is quadratic, processing a million tokens requires roughly 250x the attention computation of a 4,000-token context ([Introl on long-context infrastructure](https://introl.com/blog/long-context-llm-infrastructure-million-token-windows-guide)), and the wall-clock reality is stark: it takes about 30 minutes for an 8B model to process a 1M-token prompt on a single A100 GPU ([the dynamic sparse attention paper](https://arxiv.org/html/2407.02490v1)). Thirty minutes of GPU time before the model emits its first token.

The second cost is memory, the KV cache that holds the processed context, which grows linearly with length and dominates GPU memory at long context. That is the memory wall I covered separately, and long context is where the compute wall and the memory wall hit the same request at once. Deploying long-context transformers, anywhere from 100K to 10M tokens, is prohibitively expensive compared to short-context 4K variants, which is why reducing that cost became a pressing engineering challenge ([the long-context deployment paper](https://arxiv.org/html/2405.08944)). You pay quadratically to compute the context and linearly to hold it, on every request that uses the window.

## What one max-context request actually costs

Put GPU time on the prefill. Using the cited figure of a 30-minute prefill for a 1M-token prompt on a single A100, at an illustrative A100 rate of $1.50 per hour:

```
Prefill time (1M tokens, 8B, 1x A100):  30 min = 0.5 hr
GPU cost of prefill alone:               0.5 x $1.50 = $0.75 per request
  (before a single output token is generated)

A 4K-token request prefill:              sub-second, ~$0.001
Ratio:                                    ~750x more expensive to prefill
```

Now scale it. If a feature serves 10,000 long-context requests a day, the prefill alone is 10,000 x $0.75 = $7,500/day, about $225,000/month, for the privilege of using the window the model "gave you for free." Larger models and longer contexts make this worse, not better. The point is not the exact figure, which depends on model size, hardware, and optimization, it is the shape: long-context cost is not a small premium, it is a different order of magnitude, and it lands on every request that fills the window. This is the per-request face of the scaling blowup I traced in [why AI cost explodes after scale](https://ravoid.com/blog/why-ai-cost-explodes-after-scale): the unit cost itself changes, it does not just multiply.

## The anchor: support is a capability, performance is a bill

The reframing that fixes long-context decisions is to stop treating the window size as a feature you should use because it exists. A 1M-token window is a capability the model has, like a car's top speed. Driving at top speed constantly is a fuel decision, not a feature you owe it to the car to use. Filling a million-token window on every request because the model allows it is the same mistake: you are paying maximum serving cost for capacity most requests do not need.

The latency side makes this concrete for product teams. Time-to-first-token is dominated by the prefill phase, and on a 128K-token context prefill can take seconds ([Tian Pan on context loading](https://tianpan.co/blog/2026-05-07-speculative-context-loading-ai-feature-latency)), which means a large context degrades responsiveness and cost simultaneously. The window is not free in dollars or in user experience. This is exactly the tradeoff I unpacked in [the real cost of a massive context window](https://ravoid.com/blog/massive-context-window-cost): the capability is real, and using it indiscriminately is how a feature becomes a liability. The memory wall that the same long context slams into is [the memory wall capping your AI margins](https://ravoid.com/blog/kv-cache-cost).

| Context size | Prefill cost | TTFT | Use when |
| --- | --- | --- | --- |
| 4K - 8K | Negligible | Sub-second | Most requests |
| 32K - 128K | Seconds of GPU | Seconds | Real documents, focused tasks |
| 256K - 1M | Minutes of GPU | Many seconds | Only when retrieval cannot |
| Full 1M+ | Disproportionate | Slow | Rare, justified cases |

## Retrieve before you stuff

The practical alternative is almost always retrieval. Instead of pouring an entire corpus into the context and paying quadratic prefill on all of it, retrieve the relevant slice and send only that. This is precisely why retrieval and summarization patterns exist: longer context windows increase compute and memory pressure dramatically ([Davies Meyer on quadratic attention](https://ai-solutions.daviesmeyer.com/en/glossary/quadratic-attention-cost)). A well-built retrieval step that finds the relevant 8K tokens out of a million is dramatically cheaper than prefilling the full million, and usually produces a better answer because the model is not diluting attention across irrelevant context.

The decision is a cost comparison you can make per request:

```ts
// Use the giant window only when retrieval genuinely cannot do the job
function chooseContextStrategy(task: Task) {
  if (task.needsGlobalReasoningOverWholeCorpus) {
    return { mode: "full-context", note: "pay quadratic prefill, it's required" };
  }
  // default: retrieve the relevant slice, prefill only that
  return { mode: "retrieve", topK: 12, budgetTokens: 8_000 };
}
```

The default branch is where most traffic belongs. The full-context branch is for the genuine minority of tasks that need global reasoning across an entire corpus and cannot be served by retrieving a slice, and those should be a deliberate, costed choice. Hardware optimizations help on the rare full-context path, sparse attention can cut per-token attention FLOPs by more than 20x at a million tokens ([NVIDIA on MiniMax sparse attention](https://developer.nvidia.com/blog/deploy-long-context-reasoning-and-agentic-workflows-with-minimax-m3-on-nvidia-accelerated-infrastructure/)), but the cheapest prefill is still the tokens you never sent. The same selective-spending logic runs through [why RAG is not free at ten million records](https://ravoid.com/blog/rag-is-not-free-brutal-cost-curve-10-million-records): retrieval has its own cost curve, but it is almost always below quadratic prefill on the full corpus.

## A post-mortem on a feature that used the whole window

A composite from the documented pattern, with figures labeled illustrative: a team built a document-analysis feature and, because the model supported a million-token window, designed it to load entire document sets into context on every query, reasoning that more context meant better answers. It worked in the demo with small documents. In production with large corpora, two things broke. TTFT climbed past 20 seconds as prefill processed hundreds of thousands of tokens per request, and the inference bill rose far faster than usage, because each query paid quadratic prefill on the full context. The metric that broke was cost-per-query, which had become dominated by prefill on tokens the answer rarely depended on. Replacing full-context stuffing with a retrieval step that fed the model the relevant 8K tokens cut both the latency and the per-query cost by more than 90%, with no drop in answer quality, because the model was now attending to signal instead of a haystack.

## Framework: treat the window as a budget, not a default

| Decision | What you gain | What you pay | When it breaks |
| --- | --- | --- | --- |
| Retrieve relevant slice | Cheap, fast, focused | Build retrieval | Needs whole-corpus reasoning |
| Cap context aggressively | Lower prefill, better TTFT | Risk missing context | Genuinely long inputs |
| Full window, sparse attn | Handles real long context | Still costly, needs support | Most requests do not need it |
| Full window, dense attn | Simplest to build | Quadratic prefill on all | Almost always wasteful at scale |

The order: retrieve by default so most requests prefill a few thousand tokens, cap context to what the task needs, and reserve the full window plus sparse-attention optimizations for the rare tasks that genuinely require global reasoning over a large corpus. The window is a budget line you spend deliberately, not a default you fill because it is there.

## Decision guidance

The mistake is treating a large context window as a free feature to use maximally, when every token you place in it is paid for in quadratic prefill compute and linear memory on every request.

**The rule: If a task can be served by retrieving the relevant slice of context, then retrieve it, and reserve the full window for tasks that genuinely require reasoning over the entire corpus.**

The honest exception is genuine whole-corpus reasoning, summarizing an entire long document, finding a needle whose location is unknown across the full context, or reasoning that depends on relationships spanning the whole input, where retrieval would miss the connections the task requires. Those tasks justify the full window and its cost. For the far larger category of question-answering and focused analysis, stuffing the whole corpus in is paying maximum serving cost to make the model's job harder.

## The feature that bills you per request

This is the last entry in a long series about costs that hide inside things sold as free or simple, and the million-token window is the purest example. It is advertised as a capability you unlock, and it behaves as a meter that runs quadratically on every request that uses it. The model supporting a giant context and your product affording to serve it are different facts, separated by a prefill bill that grows with the square of how much you put in.

The cheapest context token, like the cheapest log, the cheapest GPU cycle, and the cheapest reserved instance, is the one you decided not to use. A bigger window does not lower the cost of the tokens you send, it just raises the ceiling on how much you can spend per request. Treat it as the budget it is, retrieve before you stuff, and the feature you were sold stops quietly becoming the largest line on your inference bill.

## FAQ

### Q: Why is long-context inference so expensive?

Because attention prefill, the phase that processes the input before generating output, scales roughly quadratically with context length. Doubling the context roughly quadruples the attention compute, so a million-token prompt requires vastly more computation than a short one, with one cited figure putting 1M-token prefill at about 30 minutes on a single A100 for an 8B model. On top of that, the KV cache memory grows linearly, so long context hits compute and memory costs at once.

### Q: Is a bigger context window free to use?

No. Providers advertise large windows as capabilities, but using them is a per-request serving cost. Every token you place in the context is paid for in quadratic prefill compute and linear memory. A model supporting a million-token window and a product economically serving million-token requests are different things, and filling the window on requests that do not need it pays maximum cost for capacity you are not using.

### Q: How much does a 1M-token request cost?

It depends on model size, hardware, and optimization, but the prefill alone is significant: at a cited 30-minute prefill on a single A100 and an illustrative $1.50 per hour, that is about $0.75 of GPU time per request before any output, roughly 750x a short request's prefill. At 10,000 such requests a day, that is around $225,000 a month in prefill alone. The exact number varies, but the order-of-magnitude difference is the point.

### Q: What is prefill and why does it dominate cost and latency?

Prefill is the phase where the model processes the entire input context to build its internal representation before generating the first output token. Because full attention is quadratic in length, prefill on long contexts is expensive in GPU time and dominates time-to-first-token. On a 128K context, prefill can take seconds, and on a million tokens, minutes, which is why long-context requests feel slow and cost disproportionately.

### Q: Should I use a long context window or retrieval?

Retrieval, for most tasks. Instead of stuffing an entire corpus into context and paying quadratic prefill on all of it, retrieve the relevant slice, often a few thousand tokens, and send only that. It is dramatically cheaper, faster, and often produces better answers because the model attends to signal rather than a haystack. Reserve the full window for the minority of tasks that genuinely require reasoning across the entire input.

### Q: When is using the full context window justified?

When the task genuinely requires global reasoning over the entire corpus: summarizing a whole long document, finding information whose location is unknown across the full context, or reasoning about relationships spanning the complete input, where retrieving a slice would miss necessary connections. Those tasks justify the window and its cost. Most question-answering and focused analysis does not, and retrieval serves it far more cheaply.

### Q: Do sparse attention techniques make long context cheap?

They help substantially on the genuine long-context path. Sparse attention methods can cut per-token attention FLOPs by more than 20x at a million tokens by attending only to relevant blocks of the context, reducing the quadratic penalty. But they require model and serving support, and even with them the cheapest prefill is the tokens you never sent. Optimize the rare full-context requests, but default to sending less context in the first place.

## Next Read

This series has traced costs hidden inside features sold as free. For the context-window economics in depth, read [the real cost of a massive context window](https://ravoid.com/blog/massive-context-window-cost).

---

### Sources & Further Reading

- [DigitalOcean: Long-Context Inference at Scale, The Hidden Infrastructure Cost](https://www.digitalocean.com/community/tutorials/long-context-inference-production-cost)
- [Introl: Long-Context LLM Infrastructure for Million-Token Windows](https://introl.com/blog/long-context-llm-infrastructure-million-token-windows-guide)
- [Spheron: LLM Inference SLO Engineering, TTFT and Prefill](https://www.spheron.network/blog/llm-inference-slo-ttft-itl-latency-budget-guide-2026/)
- [NVIDIA: Deploy Long-Context Reasoning with MiniMax M3](https://developer.nvidia.com/blog/deploy-long-context-reasoning-and-agentic-workflows-with-minimax-m3-on-nvidia-accelerated-infrastructure/)

---

_Last updated: August 10, 2026_
