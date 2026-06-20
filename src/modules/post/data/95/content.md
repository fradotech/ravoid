# Half Your LLM Calls Are Questions You Already Answered

_By Framesta Fernando · Engineering Manager & Technical Architect · 11 min read · Published August 5, 2026_

> **TL;DR:** A semantic cache for LLM calls reuses stored answers when a new query means the same thing as a past one, not just when the text matches exactly. Repeated queries are roughly a third of traffic, and caching them can cut cost up to 86% and latency 88%. The catch is the similarity threshold: set it too loose and the cache confidently returns wrong answers no dashboard will flag.

Watch the prompts hitting your LLM for an afternoon and a pattern jumps out: the same questions, over and over, in slightly different words. "Summarize this document," "give me a summary of this doc," "tldr this." Each paraphrase hits the model as a brand-new request and triggers a full inference cycle, so your cost scales with traffic volume rather than with the semantic diversity of what users actually want ([Tian Pan on request coalescing](https://tianpan.co/blog/2026-04-12-request-coalescing-real-time-llm-cost-optimization)). You are paying to answer the same question repeatedly because your system thinks rephrasing it makes it new.

It does not. Repeated queries constitute about 31% of total queries in typical LLM workloads ([the privacy-aware semantic cache paper](https://ar5iv.labs.arxiv.org/html/2403.02694)), and a semantic cache for LLM responses exists to stop paying for them twice. It intercepts repeated queries before they reach the model: when a new request is semantically similar to a past one above a configurable similarity threshold, the cache returns the stored response in 3 to 8ms instead of 500 to 2000ms ([Spheron on semantic caching](https://www.spheron.network/blog/semantic-cache-llm-inference-gpu-cloud/)). The savings are large and the latency win is dramatic, but the mechanism hides a sharp edge that turns the same feature into a silent correctness bug.

## Why exact-match caching misses the repeats

The reason teams do not already cache these is that ordinary caching keys on exact text. A traditional cache hashes the input and looks for a byte-identical match, so "summarize this" and "give me a summary" are two different keys and two different cache entries, each a miss. Since users almost never phrase the same intent identically, an exact-match cache catches a tiny fraction of the real repetition and declares the workload uncacheable.

Semantic caching changes the key from text to meaning. By encoding each query into an embedding and comparing it against cached embeddings, semantically similar requests are detected, letting the system return the previously computed answer and avoid redundant inference ([this semantic caching paper](https://arxiv.org/html/2603.03301v1)). The "summarize" variants now map to nearby points in embedding space, so they hit the same cached answer. That single change is what unlocks the 31% of traffic that exact matching leaves on the table, and it is why semantic caching, not prompt caching or HTTP caching, is the tool for repeated questions phrased differently.

## What the savings actually look like

The economics are direct: a cache hit is a call you do not pay the model for. Work an illustrative workload of 1,000,000 calls a month at $0.01 per call, on a high-repetition use case where semantic matching achieves a 45% hit rate.

```
Baseline:  1,000,000 calls x $0.01 = $10,000 / month
Hit rate:  45%  ->  450,000 served from cache
Cache cost: embedding lookup ~ negligible (3-8ms, ~$0.0006/call) -> ~$600
New cost:  550,000 x $0.01 + $600 = ~$6,100 / month

Monthly saving: $10,000 - $6,100 = ~$3,900 (~39%)
```

Roughly 39% off the bill, with the 450,000 cached requests returning in milliseconds instead of seconds. The real-world ceilings are higher: AWS found semantic caching reduced cost by up to 86% and improved latency by 88% ([Portkey on caching thresholds](https://portkey.ai/blog/semantic-caching-thresholds/)). The hit rate is workload-dependent, though, and that variance matters: high-repetition categories like code achieve 40 to 60% hit rates while low-repetition or volatile categories like open conversation land at 5 to 15% ([the category-aware caching paper](https://arxiv.org/html/2510.26835v1)). The cache pays off in proportion to how repetitive your traffic actually is, so 60% is a ceiling, not a promise ([Ace The Cloud on cache freshness](https://acethecloud.com/blog/reduce-llm-inference-cost-semantic-cache-freshness/)). This is the demand-side complement to the supply-side savings I described in [why AI cost explodes after scale](https://ravoid.com/blog/why-ai-cost-explodes-after-scale): cut the calls you never needed to make. It complements the input-side reuse of [prompt caching](https://ravoid.com/blog/prompt-caching-cost-savings), which cuts cost without the correctness risk semantic matching carries.

## The anchor: similarity is not equivalence

Here is the edge that makes semantic caching dangerous if you treat it as free. Embedding similarity measures whether two queries are about the same thing. It does not measure whether they have the same answer. "What is the refund policy for EU customers" and "what is the refund policy for US customers" are extremely similar in embedding space and have completely different correct answers. A threshold tuned for hit rate will treat them as a match and serve the wrong policy.

And the failure is invisible. When a semantic cache returns a wrong answer, the cache returns a 200, latency is great, and the cost dashboard shows a hit, which is the outcome everyone wanted, so the only signal that anything went wrong is a customer acting on policy that does not apply to them, arriving days later through a refund dispute rather than your monitoring ([Tian Pan on the confidently wrong cache](https://tianpan.co/blog/2026-05-17-semantic-cache-confidently-wrong-answer)). That is the worst kind of bug: it looks exactly like success on every metric you watch. The cache did its job, returned fast, saved money, and gave the user a confidently incorrect answer. Unlike prompt caching, which I treated as nearly risk-free because it never changes the output, semantic caching trades a correctness risk for its savings, and the threshold is where that trade is set.

| Threshold | Hit rate | False hits | Risk profile |
| --- | --- | --- | --- |
| Loose (e.g. 0.80) | High | High | Wrong answers, silent |
| Balanced (e.g. 0.90) | Moderate | Low | Needs verification layer |
| Tight (e.g. 0.97) | Low | Near zero | Safe, fewer savings |

## Tune the threshold, then verify the hit

The threshold is the single most important setting, and the right value depends on the cost of a wrong answer in your domain. For low-stakes content (general FAQs, suggestions) a looser threshold captures more savings and a rare false hit is tolerable. For high-stakes content (policy, pricing, medical, legal) the threshold must be tight, and even then a verification step is warranted. A research ensemble achieved a 92% hit ratio while maintaining 85% accuracy in correctly rejecting non-equivalent queries ([the ensemble embedding paper](https://arxiv.org/html/2507.07061v1)), which shows both that high hit rates are achievable and that rejection accuracy is a separate metric you must measure, not assume.

```python
def semantic_lookup(query, cache, threshold=0.93):
    emb = embed(query)
    hit, score = cache.nearest(emb)            # vector similarity search
    if score < threshold:
        return None                            # miss -> call the model
    # similarity is not equivalence: guard the high-stakes dimensions
    if hit.scope != current_scope(query):      # e.g. region, user tier, date
        return None                            # refuse the hit, do not serve wrong
    if hit.age > max_staleness(query.topic):
        return None                            # stale -> regenerate
    return hit.response
```

The two guards after the threshold are the point: a similarity score alone is not enough, you also check that the cached answer's scope (region, tenant, entitlement) matches the new query and that it is not stale. That scope check is exactly what prevents the EU-versus-US refund-policy false hit. Pairing caching with routing and budget controls is how teams reach the larger reductions, the cost-control-layer approach I touched on alongside [smart routing for self-hosted AI cost savings](https://ravoid.com/blog/smart-routing-self-hosted-ai-cost-savings).

## A post-mortem on a cache that saved money and lost a customer

A composite from the documented pattern, with figures labeled illustrative: a SaaS support assistant added a semantic cache and tuned the threshold aggressively for hit rate, hitting roughly 55% and cutting inference cost by more than half. The dashboards looked perfect: cost down, latency down, hit rate up. Three weeks later, account managers started fielding complaints from customers who had been given billing instructions for the wrong plan tier. The cache had been matching questions like "how do I cancel on the Pro plan" to a cached answer for the Business plan, because the queries were 0.88 similar and the threshold was 0.85. The metric that broke was not visible on any latency or cost graph, it was answer correctness, which the cache reported as success every time. The fix was raising the threshold and adding a plan-tier scope check, which dropped the hit rate to about 40% but eliminated the cross-tier false hits. The savings shrank and the product stopped lying to customers.

## Framework: cache by stakes, not just by similarity

| Decision | What you gain | What you pay | When it breaks |
| --- | --- | --- | --- |
| Semantic cache, loose threshold | Highest hit rate | Silent wrong answers | High-stakes domains |
| Tight threshold + scope guards | Safe savings | Lower hit rate | Very volatile queries |
| Cache low-stakes only | Savings with low risk | Less coverage | Everything is high-stakes |
| No semantic cache | Zero correctness risk | Pay for every repeat | Repetitive workloads |

Match the threshold and guards to the cost of being wrong. Low-stakes, repetitive content can run loose for maximum savings. High-stakes content needs a tight threshold, scope checks on every dimension that changes the answer, and a staleness bound. The mistake is one global threshold across content of wildly different stakes, which either leaves savings on low-stakes traffic or returns wrong answers on high-stakes traffic.

## Decision guidance

The mistake is treating a semantic cache hit as free the way a prompt-cache hit is free, when a semantic hit can be confidently wrong.

**The rule: If a cached answer depends on a dimension the query embedding ignores, like region, tenant, plan, or date, then verify that dimension explicitly before serving the hit, no matter how high the similarity score.**

The honest exception is genuinely stable, scope-free content, definitions, explanations, general how-tos, where the answer does not change by user, region, or time, and a high similarity score really does mean an equivalent answer. There, a looser threshold is safe and the savings are pure. For anything personalized, regulated, or time-sensitive, similarity is a starting filter, not a sufficient condition, and the scope check is what separates a cost win from a silent customer-facing error.

## The answer you already paid for

A third of your LLM traffic is questions you have already answered, asked again in different words, and an exact-match cache cannot see the resemblance. A semantic cache can, which is why it is one of the highest-ROI cost levers available on repetitive workloads. But it buys those savings with a new risk that prompt caching never carried: the cache can be confidently, invisibly wrong, because similarity in embedding space is not the same as equivalence in correct answers.

The cheapest call is the one you answered once and reused, as long as reuse actually means the same answer. Tune the threshold to the stakes, guard the dimensions the embedding cannot see, and the questions you already answered stop costing you twice, without quietly costing you a customer.

## FAQ

### Q: What is a semantic cache for LLMs?

A semantic cache stores LLM responses keyed by the meaning of the query rather than its exact text. When a new query is semantically similar to a past one above a configurable threshold, it returns the stored answer instead of calling the model, in milliseconds rather than seconds. This catches paraphrased repeats, like the many ways users phrase "summarize this," that an exact-match cache treats as distinct misses.

### Q: How much can semantic caching save on LLM costs?

It depends on how repetitive your traffic is. Repeated queries are roughly 31% of typical workloads, high-repetition categories like code reach 40 to 60% hit rates, and AWS reported cost reductions up to 86% with latency improvements up to 88%. A cache hit is a model call you do not pay for, so savings track the hit rate directly. Low-repetition or volatile workloads see only 5 to 15%.

### Q: How is semantic caching different from prompt caching?

Prompt caching reuses the model's processed copy of an identical prompt prefix and never changes the output, so it is essentially risk-free. Semantic caching reuses a whole previous answer for a different but similar query, which can save more but introduces a correctness risk: two similar queries may have different correct answers. They solve different problems and can be used together.

### Q: Why can a semantic cache return wrong answers?

Because embedding similarity measures whether two queries are about the same topic, not whether they have the same answer. "Refund policy for EU customers" and "refund policy for US customers" are highly similar but have different correct answers. A threshold tuned for hit rate will treat them as a match and serve the wrong one. Worse, the failure is invisible: the cache returns fast with a success status while giving an incorrect answer.

### Q: What similarity threshold should a semantic cache use?

It depends on the cost of being wrong. Loose thresholds around 0.80 maximize hit rate but raise false hits. Tight thresholds around 0.97 nearly eliminate false hits but reduce savings. For low-stakes content a looser threshold is fine, for high-stakes content like policy or pricing use a tight threshold plus explicit scope checks. There is no single right value, so set it per content type and measure rejection accuracy, not just hit rate.

### Q: How do I prevent false hits in a semantic cache?

Add guards after the similarity check. Verify that the cached answer's scope, such as region, tenant, plan tier, or date, matches the new query, and enforce a staleness bound so old answers regenerate. The similarity score finds candidates, but these explicit checks confirm the cached answer is actually valid for this query. The scope check is what prevents serving one segment's answer to another.

### Q: When should I not use a semantic cache?

When your traffic is highly diverse with little repetition, the hit rate will be too low to justify the added complexity and risk. And for content where the answer changes per user, region, or moment and you cannot reliably scope-check it, the false-hit risk may outweigh the savings. Semantic caching shines on repetitive, scopeable workloads and adds little value on one-off, highly personalized queries.

## Next Read

Caching cuts the calls you repeat. For the calls you should never have sent to an expensive model at all, read [smart routing for self-hosted AI cost savings](https://ravoid.com/blog/smart-routing-self-hosted-ai-cost-savings).

---

### Sources & Further Reading

- [Spheron: Semantic Caching for LLM Inference](https://www.spheron.network/blog/semantic-cache-llm-inference-gpu-cloud/)
- [Portkey: Semantic Caching Thresholds and Why They Matter](https://portkey.ai/blog/semantic-caching-thresholds/)
- [Tian Pan: The Semantic Cache That Confidently Returns the Wrong Answer](https://tianpan.co/blog/2026-05-17-semantic-cache-confidently-wrong-answer)
- [Category-Aware Semantic Caching for Heterogeneous LLM Workloads (arXiv)](https://arxiv.org/html/2510.26835v1)

---

_Last updated: August 5, 2026_
