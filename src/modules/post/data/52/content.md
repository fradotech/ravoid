# Prompt Caching: The 90% Bill Cut You Never Turned On

_By Framesta Fernando · Engineering Manager & Technical Architect · 12 min read · Published June 22, 2026_

> **TL;DR:** Prompt caching cuts LLM input token cost by up to 90% on Anthropic and 50% on OpenAI by reusing the model's processed copy of a stable prompt prefix. Most teams ship without it. The catch is mechanical: a cache hit needs a byte-identical prefix, so stable content must come first and anything variable must come last.

Most LLM bills are a photocopier somebody left running overnight. The same 20,000-token system prompt, the same tool schemas, the same retrieved context, copied and paid for in full on every request, hundreds of thousands of times a month, to ask the model a 300-token question it has effectively seen already. The output is not the expensive part. The boilerplate you resend on loop is.

Prompt caching exists precisely to stop that, it has been generally available across the major providers since 2024, and a surprising number of production systems in 2026 still run with it off. With input prices barely moving year over year, that switch is the most expensive default left in most AI stacks.

## The 20,000 tokens you pay for twice

The mental model that keeps caching off is that an input token has one price. Cost equals tokens times rate, so the only levers are a cheaper model or fewer tokens, both of which cost you quality. Teams downgrade from a frontier model or aggressively trim context, then wonder why answer quality slipped.

That model ignores how a transformer actually processes input. Before the model generates a single output token, it computes an internal representation of the entire input prefix. If the prefix is identical to one it processed seconds ago, recomputing it is wasted work, and the providers know it. Caching lets them store that processed prefix and charge a fraction when you reuse it, because the expensive compute already happened on the first call.

So an input token does not have one price. It has two: the full rate the first time the model sees a prefix, and a steep discount every time after. Anthropic's docs are specific about the size of that discount: cache read tokens are billed at 0.1 times the base input rate, a 90% reduction, while writing to the cache costs 1.25 times base and the cache holds for a 5-minute sliding window by default ([Anthropic prompt caching docs](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)). OpenAI applies caching automatically and discounts cached input by 50%, with no write surcharge ([OpenAI prompt caching guide](https://platform.openai.com/docs/guides/prompt-caching)). Once you see input as cached-versus-fresh rather than one flat rate, the goal stops being "send fewer tokens" and becomes "send the same tokens in a shape the cache can match."

## A worked example: $18,000 becomes $2,450

Numbers make this concrete. The following is an illustrative workload priced at a real rate: a Sonnet-class model at $3 per million input tokens, a stable prefix (system prompt plus tool schemas) of 20,000 tokens, and 300,000 requests per month.

Uncached, every request pays full price for that prefix:

```
300,000 requests x 20,000 tokens = 6,000,000,000 input tokens
6,000,000,000 / 1,000,000 = 6,000 million-token units
6,000 x $3 = $18,000 / month   (prefix only)
```

Now enable Anthropic-style caching. After warmup, almost every call is a cache read at 0.1x, and the cache is rewritten only when it expires. With steady traffic the prefix stays warm, so rewrites happen roughly every 5 minutes, about 8,640 times a month:

```
Reads:  6,000 units x $3 x 0.1            = $1,800
Writes: 8,640 x 20,000 / 1,000,000 units  = 172.8 units
        172.8 x $3 x 1.25                 = $648
Total prefix cost                          = $2,448 / month
```

The prefix line drops from $18,000 to roughly $2,450, an 86% cut, with the model and the tokens completely unchanged. The output is byte-for-byte what it was before. The only thing that moved was how the input was billed. This is the same lesson I argued from the scaling angle in [why AI cost explodes after scale](https://ravoid.com/blog/why-ai-cost-explodes-after-scale): the blowup is almost never the model, it is how you feed it.

One anonymized case made this painfully literal. A support-automation team running roughly 400,000 requests a month had wired a dynamic timestamp into the second line of their system prompt for "freshness." That single moving value sat above 22,000 tokens of stable instructions, so the cache never matched and their hit rate sat near 0% despite caching being enabled. The numbers below are illustrative of the shape they saw: an input bill near $24,000 that should have been closer to $3,500. The fix was deleting one line and moving the timestamp to the end of the prompt.

## Why the cache is a prefix, not a key

Here is the mechanical detail that decides whether you get the 90% or get nothing: the cache matches on the longest identical prefix, not on a hash of the whole prompt. It walks your prompt from the first token and reuses the cached computation up to the first byte that differs. Everything after that divergence point is recomputed and billed fresh.

That turns prompt layout into a cost decision. Put a timestamp, a per-user greeting, or a request id near the top, and you have moved the divergence point to the beginning, so nothing downstream can be reused. Two teams can send identical token counts and pay wildly different bills purely based on ordering. The team that front-loads stable content (system instructions, tool definitions, durable context) and pushes the user's variable message to the very end gets cache hits on the expensive bulk. The team that interleaves anything dynamic up top caches nothing, because they broke the prefix on line one.

The discipline, then, is to design the prompt as stable-first, with an explicit cache boundary. On Anthropic this is literal: you mark where the cacheable prefix ends with `cache_control`. The shape looks like this:

```json
{
  "system": [
    {
      "type": "text",
      "text": "<20k tokens: instructions + tool schemas, identical every call>",
      "cache_control": { "type": "ephemeral" }
    }
  ],
  "messages": [
    { "role": "user", "content": "<the variable question, never cached, always last>" }
  ]
}
```

Everything above the breakpoint is the reusable asset. Everything below it is fresh per request. The mistake is putting anything that changes per call above that line. Context budgeting matters here too, because a bloated-but-stable prefix still caches well, while a lean-but-shuffled one does not, a tradeoff I unpacked in [the real cost of a massive context window](https://ravoid.com/blog/massive-context-window-cost).

## Where the breakpoint pays off most

Not every segment is worth caching. This is where the effort returns the most bill:

| Prompt segment | Cache value | Why |
| --- | --- | --- |
| System prompt + tools | Highest | Large and identical on every call |
| Few-shot examples | High | Stable and often large |
| Retrieved RAG chunks | Medium | Caches only if chunk order is deterministic |
| User message | None | Unique per request, must stay last |

The system prompt and tool definitions are the prize: large, perfectly stable, and reused on every call. Few-shot blocks are next. Retrieved context is a conditional win, it caches only when your retriever returns chunks in a deterministic order, so sorting chunks consistently before assembly can unlock caching on thousands of tokens that were being rebilled every call. For agent systems carrying many tool schemas, the stable prefix is enormous, which is exactly why the bloat I described in [MCP server sprawl and the hidden token tax](https://ravoid.com/blog/mcp-server-sprawl-hidden-token-tax) becomes affordable the moment it is cached instead of resent at full price.

The cost levers, ranked by what cutting them buys versus what it risks:

| Lever | What enabling it buys | When it does little |
| --- | --- | --- |
| Cache the system prefix | Up to 90% off the largest input block | Prefix changes every call |
| Sort RAG chunks deterministically | Caches the context block | Retrieval order is inherently random |
| Move variables to the end | Preserves the whole prefix | Prompt is already stable-first |

## Decision guidance

Treat caching as the first lever, not a later micro-optimization. On a high-volume workload with a large stable prefix it is frequently the single biggest line-item reduction available, and it costs a few hours of prompt restructuring rather than any quality tradeoff.

**The rule: If your workload sends the same system prompt or context on more than a few thousand requests a day, then enable prompt caching and reorder the prompt stable-first before you touch model selection or context trimming.**

Downgrading the model and trimming context both cost quality. Caching costs only layout discipline, so it comes first. The genuine exception is low-volume or highly variable traffic where every prompt is unique and there is no shared prefix to cache, in which case you are back to routing and model selection, which I covered in [smart routing for self-hosted AI cost savings](https://ravoid.com/blog/smart-routing-self-hosted-ai-cost-savings).

## The photocopier, switched off

Prompt caching is the rare optimization with no quality cost, no model change, and no real downside, just an upside gated behind one mechanical fact: the cache wants a long, identical prefix and an honest boundary. Teams leaving most of their input bill on the table are not making a hard architectural call. They simply put a moving value where a stable one belonged.

The cheapest token is the one the model already processed. Order your prompt so it can prove it has, and turn the photocopier off.

## FAQ

### Q: How much does prompt caching actually save?

Anthropic bills cache reads at 0.1 times the base input rate, a 90% discount on the cached portion, and OpenAI discounts cached input by 50%. The total bill reduction depends on what fraction of your prompt is a stable, reused prefix. For agent and RAG workloads dominated by a large repeated system prompt, the input bill can fall by 80% or more, often the single largest cost lever available.

### Q: Why isn't my prompt caching working even though I enabled it?

Almost always prefix invalidation. The cache matches the longest identical prefix from the first token, so anything dynamic placed early, a timestamp, a per-user value, a request id near the top of the system prompt, breaks the match and forces everything after it to be recomputed at full price. Move all variable content to the end and keep the stable prefix byte-identical across calls.

### Q: Does prompt caching reduce output quality?

No. Caching changes only how input tokens are billed, not what the model computes. The tokens, the model, and the generated output are identical to an uncached call. That zero-quality-cost property is exactly why caching should be the first optimization you reach for, ahead of downgrading the model or cutting context, both of which do trade away quality.

### Q: How should I structure a prompt to maximize cache hits?

Order from most stable to least stable: system instructions, tool definitions, and few-shot examples first, durable retrieved context next, and the user's message last. On Anthropic, mark the end of the stable block with cache_control. Keep retrieved chunks in a deterministic order so the context prefix stays identical. The goal is the longest possible byte-identical prefix the provider can match and reuse.

### Q: Does prompt caching work for RAG context, not just system prompts?

Partially. Retrieved context caches only when chunks appear in a stable, deterministic order across requests. If your retriever returns chunks in varying order, the prefix changes and that segment is rebilled fresh every call. Sorting retrieved chunks consistently before assembling the prompt can unlock caching on thousands of context tokens, though the user query itself must always stay uncached and last.

### Q: What is the difference between Anthropic and OpenAI prompt caching?

Anthropic caching is explicit: you mark the cacheable prefix with cache_control, pay 1.25x to write it, read at 0.1x, and the cache holds for a 5-minute sliding window by default with a 1-hour option. OpenAI caching is automatic for supported models with no write surcharge and a flat 50% discount on cached input. Anthropic offers a deeper discount but asks you to manage the boundary.

### Q: When is prompt caching not worth it?

When traffic is low volume or every prompt is genuinely unique with no shared prefix. Caching depends on reuse, so a system where each request carries a different system prompt and no stable context gains little. For those workloads, focus on model routing and selection instead. For anything sending a large repeated prefix at meaningful volume, caching is almost always the highest-ROI move available.

## Next Read

Caching fixes the input side of the bill. For the full picture of where AI margins bleed, including the output and retry costs caching does not touch, read [token economics and how AI SaaS pricing bleeds money](https://ravoid.com/blog/token-economics-ai-saas-pricing-bleeding-money).

---

### Sources & Further Reading

- [Anthropic: Prompt Caching documentation](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)
- [OpenAI: Prompt Caching guide](https://platform.openai.com/docs/guides/prompt-caching)
- [AImagicx: Prompt Caching for Claude, Cut Your API Bill 60% in Production](https://www.aimagicx.com/blog/prompt-caching-claude-api-cost-optimization-2026)

---

_Last updated: June 22, 2026_
