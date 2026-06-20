# 4-Bit Models Are Cheaper Until They're Wrong

_By Framesta Fernando · Engineering Manager & Technical Architect · 11 min read · Published July 21, 2026_

> **TL;DR:** LLM quantization in production cuts VRAM and cost by compressing model weights, but 4-bit precision can lose up to 59% accuracy on long-context tasks while passing a standard eval almost untouched. The damage hides in the long tail, so an averaged benchmark green-lights a model that fails your hardest customers.

The model passed every eval in the CI suite. Accuracy was within a couple of points of the full-precision baseline, throughput nearly doubled, and the VRAM bill dropped by half. The team shipped the 4-bit version and moved on. Three weeks later, support tickets started clustering around one pattern: the assistant gave confidently wrong answers, but only when customers pasted in long documents, eighty-page contracts, full log dumps, multi-file codebases. The eval never caught it because the eval almost never sent inputs that long. The savings were real. So was the failure, and it landed exactly where it hurt most.

This is the trap of LLM quantization in production. Quantization is genuinely the single biggest lever on open-weight inference economics ([Digital Applied's quantization data](https://www.digitalapplied.com/blog/quantization-tradeoffs-4bit-8bit-fp8-performance-data)), and most of the time it is close to free. The danger is not that 4-bit is bad on average. It is that "on average" is precisely the wrong frame, because the accuracy loss is not spread evenly across your traffic. It concentrates in a long tail that your benchmark dilutes into invisibility.

## What quantization actually trades

Quantization reduces the number of bits used to store each model weight, from 16-bit floating point down to 8-bit, 4-bit, or lower. Fewer bits means less memory, less data to move, and faster compute, at the cost of rounding error that may or may not degrade output ([Tomorrow Desk's quantization primer](http://tomorrowdesk.com/info/quantization)). The savings are not subtle: a 4-bit model uses roughly a quarter of the VRAM of its FP16 original and runs meaningfully faster. On a single RTX 4090, a model that needs FP16 weights might require 8-bit to fit comfortably and 4-bit to leave room for replicas or longer sequences, with 4-bit dropping VRAM to around 4.3 GB at an 87% throughput retention ([this Gemma memory benchmark](https://markaicode.com/benchmarks/hugging-face-gemma-4-rtx-4090-memory-benchmark/)).

The headline accuracy numbers look reassuring too. Across six frontier open-weight models, FP8 lands within 0.4 points of FP16 on MMLU-Pro and AWQ-4 within 1.6 points ([Digital Applied](https://www.digitalapplied.com/blog/quantization-tradeoffs-4bit-8bit-fp8-performance-data)). A large study running over 500,000 evaluations found FP8 effectively lossless across all model scales and well-tuned INT8 at only 1 to 3% degradation ([the "Give Me BF16 or Give Me Death" paper](https://arxiv.org/html/2411.02355v4)). Read those numbers and 4-bit looks like a small, sensible tradeoff. The numbers are correct. The conclusion is the trap.

## The cliff your eval cannot see

Here is the finding that should change how you test a quantized model. On long-context tasks, 8-bit quantization preserves accuracy with roughly a 0.8% drop, while 4-bit methods lose up to 59% on the same workload, and that degradation worsens when the input is not in English ([the long-context quantization study on arXiv](https://arxiv.org/abs/2505.20276)). Fifty-nine percent. Not two. The 1.6-point average and the 59% cliff describe the same model on different inputs, and the gap between them is the entire problem.

The reason a standard eval misses it is arithmetic. Most benchmarks sample inputs roughly uniformly, so long-context cases are a small slice of the test set. Work an illustrative example where 5% of your real traffic is long-context and the rest is short, using the cited drop figures:

```
Short inputs (95% of traffic): 0.8% accuracy drop
Long-context inputs (5%):      59% accuracy drop
Aggregate eval drop = 0.95 x 0.8% + 0.05 x 59%
                    = 0.76% + 2.95%
                    = 3.71%
```

Your dashboard reports a 3.7% drop and someone calls it acceptable. But that single averaged number is hiding a segment where the model fails more than half the time. For the customers whose entire use case is long documents, the experienced accuracy loss is not 3.7%, it is 59%. The average did not measure quality. It measured how rare your hardest inputs are in your test set, which is a completely different thing. This is the same long-tail blindness I described for retrieval in [why AI cost explodes after scale](https://ravoid.com/blog/why-ai-cost-explodes-after-scale): the system behaves fine in aggregate and breaks precisely where it matters.

## The anchor: precision degrades probabilistically, not uniformly

The mental model that fails is treating quantization loss as a flat tax, a small constant you pay on every request. It is not. The loss is conditional: it depends on input length, language, task type, and how close the model already was to the edge of correctness on that specific case. Quantization does not make every answer slightly worse. It makes most answers identical and a specific minority dramatically worse, and which minority depends on properties of the input that your eval distribution may not reflect.

That changes the unit of evaluation. You cannot ask "how accurate is the 4-bit model," because there is no single answer. You have to ask "how accurate is it on each segment of my traffic," and the segments that degrade are often the high-value ones: long documents, non-English content, complex multi-step reasoning. Architecture and bit-width interact too, decoder-only models, which is most of what you deploy, suffer a significant accuracy drop at aggressive 4-bit weight-and-activation quantization where encoder models barely notice ([the INT4 quantization study](https://ar5iv.labs.arxiv.org/html/2301.12017)). The right precision depends on the workload, not the model, which is why a blanket "we quantize everything to 4-bit" policy is how the cliff gets shipped.

| Precision | Typical accuracy vs FP16 | Memory | Where it breaks |
| --- | --- | --- | --- |
| FP8 | ~0.4 pt drop, near lossless | ~half | Almost nothing |
| INT8 | ~0.5-3% drop | ~half | Edge of hard tasks |
| INT4 (weight-only) | ~1.6-2.9% median | ~quarter | Long context, non-English |
| INT4 long-context | up to 59% drop | ~quarter | The high-value tail |

## Stratify the eval or ship the cliff

The fix is not to avoid 4-bit. It is to stop evaluating with an averaged number and start stratifying by the dimensions where quantization is known to fail. Test the quantized model separately on short inputs, long-context inputs, and any non-English traffic you serve, and look at the worst segment, not the mean:

```python
# Evaluate per segment; the mean lies, the worst segment tells the truth
segments = {
    "short":        load_eval(max_tokens=2_000),
    "long_context": load_eval(min_tokens=32_000),   # the danger zone
    "non_english":  load_eval(lang="non-en"),
}
for name, ds in segments.items():
    acc = evaluate(model_int4, ds)
    base = evaluate(model_fp16, ds)
    drop = base - acc
    print(f"{name}: {drop:.1%} drop")           # flag any segment > a few %
    assert drop < 0.05, f"{name} exceeds quantization tolerance"
```

The assertion is the point: a release gate that checks the worst segment, not the average, turns the invisible cliff into a failed build. If long-context drops 59%, the gate stops the deploy instead of letting an averaged 3.7% wave it through. This is the evaluation discipline that separates a real cost win from a silent quality regression, the same rigor I argued for in [the real cost of cheap AI models in production](https://ravoid.com/blog/cheap-ai-models-production-cost).

## Match precision to the workload

With stratified evals in hand, the strategy becomes obvious: quantize where it is safe, keep precision where the tail lives. FP8 is effectively lossless and should be the default for almost everything, capturing roughly half the memory savings at near-zero accuracy risk, the same FP8 lever that shrinks the [KV cache memory wall](https://ravoid.com/blog/kv-cache-cost) on long-context serving. INT8 is a small, well-understood step down. 4-bit is the aggressive option that belongs only on workloads you have specifically verified, short-context, English, tolerant-of-error tasks where the quarter-VRAM win is real and the cliff does not apply.

For mixed traffic, the better architecture is routing by input characteristics rather than committing the whole fleet to one precision. Route short, simple requests to the cheap 4-bit model and long-context or high-stakes requests to an 8-bit or full-precision model, so each request runs at the precision its quality requires. That is the same selective-spending logic I applied to model choice in [smart routing for self-hosted AI cost savings](https://ravoid.com/blog/smart-routing-self-hosted-ai-cost-savings): you do not pick one setting for all traffic, you match the setting to the request.

## A post-mortem on a passing eval

A composite from the documented pattern, figures labeled illustrative: a document-intelligence startup quantized their self-hosted 70B model to 4-bit to fit it on a single GPU and halve inference cost. Their eval suite, built from typical user queries, showed a 2.4% accuracy drop, comfortably inside their 5% tolerance, so they shipped. Within a month, their enterprise segment, the customers who upload long multi-document bundles, reported a sharp rise in wrong extractions and started escalating. A stratified re-test told the real story: short queries had dropped 1% as expected, but the long-context segment had dropped roughly 48%. The metric that broke was per-segment accuracy on inputs over 32K tokens, a number their averaged eval had never isolated. They moved long-context traffic back to 8-bit, kept 4-bit for short queries, and recovered both the savings and the enterprise accounts, but only after the churn had started.

## Framework: quantize by segment, gate on the worst case

| Decision | What you gain | What you pay | When it breaks |
| --- | --- | --- | --- |
| FP8 default | ~half memory, near lossless | Minimal | Almost never |
| INT8 for hard tasks | ~half memory, small drop | 1-3% accuracy | Edge cases |
| INT4 for short/simple | ~quarter memory, fast | Tail accuracy | Long context, non-English |
| Route by input length | Best cost per request | Routing complexity | Tiny, uniform workloads |

The sequence: default to FP8 because it is nearly free, reserve 4-bit for segments you have stratified and verified, gate every quantized release on the worst-performing segment, and route mixed traffic by input characteristics so the cliff never reaches the inputs that trigger it.

## Decision guidance

The mistake is trusting a single accuracy number to approve a precision level for all traffic.

**The rule: If you cannot show the worst traffic segment stays within tolerance, then do not ship 4-bit on that workload, no matter how good the average looks.**

The honest exception is a workload that is genuinely uniform and tolerant, short inputs, English, low stakes, error-resilient, where there is no high-value tail for the cliff to hit. There, 4-bit is often Pareto-optimal and you should take the savings. For anything with long documents, multilingual content, or high-stakes extraction, the averaged eval is a liability, and the only honest test is the one that oversamples the inputs you are most afraid of.

## Cheap is a distribution, not a number

Quantization did not get less useful. FP8 is close to free and 4-bit is a legitimate tool. What is dangerous is the habit of compressing a model's quality into one averaged number and treating that number as the truth. Accuracy under quantization is a distribution, and the part of the distribution that breaks is the part your customers care about most, hidden behind a mean that looks fine.

The cheapest model is not the one with the best average. It is the one whose worst segment you actually measured before you shipped it, because the segment you did not test is the one your hardest customer will find first.

## FAQ

### Q: Does quantizing an LLM to 4-bit hurt accuracy?

On average, only slightly, often 1.6 to 2.9% on standard benchmarks. But the loss is not uniform. On long-context tasks, 4-bit methods can lose up to 59% accuracy, and degradation worsens for non-English inputs. The average hides the cliff, so a 4-bit model can look acceptable in aggregate while failing badly on a specific high-value segment of your traffic.

### Q: Why does my quantized model pass evals but fail in production?

Because standard evals sample inputs roughly uniformly, so rare-but-hard cases like very long documents are a small slice of the test set. A 59% drop on 5% of traffic shows up as only about a 3.7% aggregate drop, which looks fine. Production users who only send those hard inputs experience the full 59% failure. The eval measured input rarity, not segment quality.

### Q: What is the safest LLM quantization level for production?

FP8 is effectively lossless across model scales and should be the default, capturing roughly half the memory savings at near-zero accuracy risk. INT8 is a small, predictable step down at 1 to 3% degradation. Reserve aggressive 4-bit for workloads you have specifically verified by segment, since it carries real risk on long-context, multilingual, and high-stakes tasks.

### Q: How do I test a quantized model properly?

Stratify the evaluation by the dimensions where quantization is known to fail: input length, language, and task difficulty. Measure accuracy on short inputs, long-context inputs, and non-English traffic separately, then gate the release on the worst segment rather than the mean. A release check that fails the build when any segment exceeds tolerance turns the invisible cliff into a caught regression.

### Q: How much memory and cost does 4-bit quantization save?

Roughly a quarter of the VRAM of FP16, versus about half for 8-bit, with throughput gains commonly in the 35 to 72% range and up to 3x on some hardware. That can mean fitting a model on a single GPU instead of two, which roughly halves inference cost. The savings are real, but they only count if the accuracy on your hardest segment stays acceptable.

### Q: Should I quantize all my traffic to the same precision?

Usually not. The right precision depends on the workload, not the model. For mixed traffic, route short and simple requests to a cheaper 4-bit model and long-context or high-stakes requests to 8-bit or full precision, so each request runs at the precision its quality requires. A blanket 4-bit policy is the most common way the long-context cliff gets shipped to production.

### Q: Why do long-context inputs suffer most under quantization?

Long sequences accumulate small per-token rounding errors across attention over many tokens, and they stress the parts of the model most sensitive to reduced precision. Decoder-only architectures, which dominate production, are especially vulnerable at aggressive 4-bit settings. The result is that accuracy holds on short inputs but degrades sharply as context length grows, which is exactly the segment averaged benchmarks under-sample.

## Next Read

Quantization is one lever on self-hosted inference economics. To weigh self-hosting against a managed API in the first place, read [OpenAI versus self-hosted LLM cost](https://ravoid.com/blog/openai-vs-self-hosted-llm-cost).

---

### Sources & Further Reading

- [arXiv: Does quantization affect performance on long-context tasks?](https://arxiv.org/abs/2505.20276)
- [arXiv: "Give Me BF16 or Give Me Death", quantization trade-offs](https://arxiv.org/html/2411.02355v4)
- [Digital Applied: 4-bit vs 8-bit vs FP8 performance data](https://www.digitalapplied.com/blog/quantization-tradeoffs-4bit-8bit-fp8-performance-data)
- [Gemma 4 RTX 4090 memory benchmark](https://markaicode.com/benchmarks/hugging-face-gemma-4-rtx-4090-memory-benchmark/)

---

_Last updated: July 21, 2026_
