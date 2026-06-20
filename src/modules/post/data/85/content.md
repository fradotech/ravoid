# Naive LLM Serving Wastes Most of Your GPU

_By Framesta Fernando · Engineering Manager & Technical Architect · 11 min read · Published July 26, 2026_

> **TL;DR:** Continuous batching in vLLM is an architectural change to the serving loop, not a tuning flag. Naive static batching leaves around 60% of your GPU idle because the batch waits for its slowest request. Switching to iteration-level scheduling can deliver 4 to 8x more throughput on the same hardware, which directly shrinks the GPU fleet you pay for.

Here is a number that should bother anyone running self-hosted inference: naive static batching leaves about 60% of your GPU idle on average ([Spheron's LLM serving optimization guide](https://www.spheron.network/blog/llm-serving-optimization-continuous-batching-paged-attention/)). You rented an H100, you are paying for 100% of it every second, and more than half of those expensive cycles are doing nothing. The GPU is not slow. Your serving loop is wasting it, and the waste is structural, baked into how a naive batch is scheduled.

This matters because an idle GPU costs exactly the same as a busy one, so every second of underutilization is money left on the table ([Brenndoerfer's throughput analysis](http://mbrenndoerfer.com/writing/throughput-optimization-batch-size-gpu-utilization-concurrent)). The cost of self-hosted inference is not really the price of the GPU. It is the price of the GPU divided by how much useful work you extract from it, and the single biggest determinant of that ratio is whether you are using continuous batching. Get it wrong and you buy four GPUs to do the work of one.

## Why static batching idles the hardware

To see the waste, look at how a naive batch runs. You collect a handful of requests, run them through the model together, and wait for all of them to finish before starting the next batch. The problem is that requests finish at wildly different times: one user asked for a 20-token answer, another for a 2,000-token essay. The batch must wait for its slowest member, leaving GPU resources idle while fast requests sit completed but unable to exit ([Brenndoerfer's continuous batching writeup](http://mbrenndoerfer.com/writing/continuous-batching)).

So the short request finishes in a fraction of a second and then its slot in the batch does nothing, burning GPU time, until the long request completes. Multiply that across a batch where generation lengths vary by 100x and most of your compute is spent waiting. This is one of two failure modes that end most serving projects before production: KV cache fragmentation that wastes reserved memory, and static batching that idles the GPU while the slowest request finishes, and together they cap throughput far below what the hardware can deliver ([Runpod's serving guide](https://www.runpod.io/articles/guides/vllm-pagedattention-continuous-batching)). The memory side I covered in the KV cache piece; this is the compute side of the same waste.

## Continuous batching changes the loop, not a setting

The fix is not a bigger batch or a faster GPU. It is a different scheduling discipline. Continuous batching, also called iteration-level scheduling or in-flight batching, lets requests join and leave the in-flight batch on every decode step instead of every batch ([ZeroEntropy's explainer](https://zeroentropy.dev/concepts/continuous-batching/)). The moment a request finishes, its slot is freed and a waiting request takes its place on the next token step. No slot sits idle waiting for the slowest member, because there is no fixed batch to wait for. The batch is fluid, reformed every iteration.

The effect is not incremental. It is an architectural change to how the serving loop runs, and the difference between a system using it and one that is not can be 4 to 8x in throughput on the same hardware ([Tian Pan on the GPU utilization unlock](https://tianpan.co/blog/2026-04-09-continuous-batching-llm-inference)). Stacked with PagedAttention and chunked prefill, it is what lets vLLM serve 3 to 5x more traffic than a naive PyTorch inference loop on the same H100 ([Spheron](https://www.spheron.network/blog/llm-serving-optimization-continuous-batching-paged-attention/)), and some benchmarks show even larger gaps, vLLM reaching up to 24x higher throughput than alternatives under high-concurrency load ([this serving-systems comparison](https://arxiv.org/html/2511.17593)). The variance is real and workload-dependent, but the floor of the range still represents a multiple, not a percentage.

## What the wasted GPU costs you

Translate utilization into fleet size, because that is where the bill lives. Take an illustrative requirement to serve 2,000 tokens per second, with per-GPU throughput figures drawn from the cited ranges and an H100 at a mid-market $2.50 per hour.

```
Naive PyTorch loop:   ~600 tokens/sec per H100
  2,000 / 600 = 3.3  ->  4 H100s needed
  4 x $2.50/hr x 730 = $7,300 / month

vLLM continuous batching: ~3,000 tokens/sec per H100
  2,000 / 3,000 = 0.67  ->  1 H100 needed
  1 x $2.50/hr x 730 = $1,825 / month

Monthly saving: $7,300 - $1,825 = $5,475
```

Same model, same hardware, same answers. The only difference is the serving stack, and it cut the GPU fleet from four to one. The throughput numbers are illustrative of the cited 3 to 5x range, but the structural result holds: when most of your GPU is idle, you compensate by buying more GPUs, and continuous batching gives those cycles back instead. This is the same scaling lesson I made in [why AI cost explodes after scale](https://ravoid.com/blog/why-ai-cost-explodes-after-scale), seen from the supply side: the blowup is not the model, it is how poorly the hardware is utilized. The memory side of that same waste, the KV cache that fills the card, is [the memory wall capping your AI margins](https://ravoid.com/blog/kv-cache-cost).

## The anchor: you pay for the GPU, you earn from throughput

The reframing that fixes serving economics is to stop thinking about the GPU as the unit of cost and start thinking about throughput-per-GPU as the unit of value. The price of the card is fixed the moment you rent it. What varies, by a factor of several, is how many tokens per second you extract from it, and that number is set almost entirely by your scheduling discipline. Two teams renting identical H100s can have a 4x difference in cost-per-token purely because one batches continuously and one does not.

That is why "we need more GPUs" is so often the wrong conclusion. When throughput is the bottleneck, the instinct is to add hardware, but adding hardware to a 40%-utilized fleet just buys more idle cycles at the same low efficiency. The lever is utilization first, capacity second. Even within a continuous-batching stack, most vLLM deployments waste 30 to 50% of GPU cycles because engineers enable every feature flag without matching them to the workload ([this vLLM production-config analysis](https://markaicode.com/best/best-vllm-production-practices/)), so the discipline does not end at switching stacks. The same selective-tuning logic applies that I argued for in model selection in [smart routing for self-hosted AI cost savings](https://ravoid.com/blog/smart-routing-self-hosted-ai-cost-savings).

| Approach | Relative throughput | GPU efficiency | When it fits |
| --- | --- | --- | --- |
| Single-request | 1x (baseline) | Worst, weights reloaded | Never in production |
| Static batching | ~2-3x | ~40%, idles on slowest | Uniform, fixed-length jobs |
| Continuous batching | ~4-8x+ | High, slots free per step | Variable-length production |
| Continuous + PagedAttn + chunked prefill | Highest | Highest | High-concurrency serving |

## The switch is mostly a launch flag

The good news is that the architectural change is implemented by serving engines you can adopt, not something you have to build. Continuous batching is the default scheduling discipline behind vLLM, TGI, TensorRT-LLM, and SGLang, so the move is largely choosing the right server and configuring it for your workload:

```bash
# vLLM serves with continuous batching by default; tune for the workload
vllm serve meta-llama/Llama-3.1-8B-Instruct \
  --max-num-seqs 256 \                 # how many requests share the in-flight batch
  --gpu-memory-utilization 0.92 \      # leave headroom; too high triggers KV preemption
  --enable-chunked-prefill \           # interleave prefill so long prompts don't stall decode
  --max-num-batched-tokens 8192        # cap per-iteration tokens for steady tail latency
```

The naive alternative is a Hugging Face `model.generate()` loop iterating over requests, which is exactly the single-request or static pattern that idles the GPU. Switching to a continuous-batching server is the highest-ROI change available in self-hosted inference, and it is closer to a configuration migration than a rewrite. The flags then matter: `max-num-seqs` and `gpu-memory-utilization` trade throughput against tail latency and KV preemption, which is where the workload-specific tuning lives. This is the supply-side complement to the demand-side routing in [the real cost of cheap AI models in production](https://ravoid.com/blog/cheap-ai-models-production-cost).

## A post-mortem on a four-GPU bill

A composite from the documented pattern, with figures labeled illustrative: a team self-hosting an 8B model for an internal assistant ran it behind a FastAPI service that called `model.generate()` per request, batching a few together when load spiked. As usage grew, latency climbed and they scaled to four GPUs to keep up. GPU utilization, when they finally graphed it, hovered around 35%, with the cards mostly idle between bursts and stalling on long generations. The metric that broke was tokens-per-second-per-GPU, which sat far below the hardware's capability because the serving loop waited on the slowest request in every batch. Migrating to vLLM with continuous batching and chunked prefill roughly tripled per-GPU throughput, and they dropped from four GPUs to one with headroom to spare. The fix was not more hardware. It was the scheduling discipline they had been missing the whole time.

## Framework: utilization before capacity

| Decision | What you gain | What you pay | When it breaks |
| --- | --- | --- | --- |
| Adopt continuous-batching server | 4-8x throughput | Migration effort | Already on one |
| Tune max-num-seqs / mem util | Higher utilization | Tail-latency tuning | Over-aggressive = preemption |
| Enable chunked prefill | Long prompts stop stalling decode | Slight config complexity | Tiny prompts, low concurrency |
| Add GPUs | More raw capacity | Full hardware cost | Fleet still underutilized |

The order is the whole point: extract throughput from the GPUs you have before buying more, because adding capacity to an underutilized fleet multiplies the waste. Switch to a continuous-batching engine first, tune it to your workload second, and treat new hardware as the last resort once utilization is genuinely high.

## Decision guidance

The error is reading high latency or low throughput as a capacity shortage and reaching for more GPUs.

**The rule: If your inference service batches with a per-request loop or waits for the slowest request in a fixed batch, then migrate to a continuous-batching engine before you add a single GPU.**

The honest exception is a genuinely uniform, fixed-length batch workload, offline scoring where every input produces the same-length output, where static batching does not idle because requests finish together. That is rare in interactive serving, where generation lengths vary enormously. For any production traffic with mixed request sizes, static batching is leaving most of your hardware idle, and the fix is scheduling, not spending.

## The GPU was never the problem

A self-hosted inference bill that scales faster than your traffic is almost never a hardware problem. It is a utilization problem wearing a hardware costume. The GPU is fully capable, you are paying for all of it, and a naive serving loop is throwing most of it away waiting for the slowest request to finish. Continuous batching does not make the GPU faster. It stops you from wasting the speed you already bought.

The cheapest GPU is the one you did not have to add because the ones you have are finally busy. Fix the loop, and the fleet you thought you needed shrinks to the one you actually do.

## FAQ

### Q: What is continuous batching in vLLM?

Continuous batching, also called iteration-level or in-flight scheduling, lets requests join and leave the in-flight batch on every decode step rather than waiting for a whole batch to finish. When a request completes, its slot is immediately freed for a waiting request. This keeps the GPU busy instead of idling while a fixed batch waits for its slowest member, and it is the default in vLLM, TGI, TensorRT-LLM, and SGLang.

### Q: How much throughput does continuous batching add?

Typically 4 to 8x over static batching on the same hardware, with some high-concurrency benchmarks showing even larger gaps. The exact multiple depends on how much your request lengths vary, since the bigger the spread between short and long generations, the more a static batch idles. Either way the gain is a multiple, not a small percentage, because it fixes a structural waste rather than tuning a parameter.

### Q: Why does static batching waste GPU?

Because the batch must wait for its slowest member before starting the next one. Requests finish at very different times, so fast requests complete and then their slots sit idle, burning GPU cycles, until the longest generation in the batch finishes. With generation lengths varying by 100x, most compute is spent waiting. Naive static batching leaves roughly 60% of the GPU idle on average.

### Q: Does adding more GPUs fix low inference throughput?

Usually not. If your serving loop only uses 40% of each GPU, adding hardware just buys more idle cycles at the same low efficiency. The lever is utilization first, capacity second. Switching to continuous batching can triple or more your throughput per GPU, often shrinking the fleet rather than growing it. Add GPUs only after utilization is genuinely high.

### Q: How do I enable continuous batching?

Use a serving engine that implements it, since it is the default in vLLM, TGI, TensorRT-LLM, and SGLang. The migration is mostly replacing a per-request generate loop with the engine and tuning a few flags: max-num-seqs for how many requests share the in-flight batch, gpu-memory-utilization for headroom, and chunked prefill so long prompts do not stall decoding. It is closer to a configuration change than a rewrite.

### Q: What is chunked prefill and why does it matter?

Chunked prefill breaks the prompt-processing phase into smaller pieces and interleaves it with token generation, so a long incoming prompt does not stall the decoding of requests already in flight. Without it, a large prefill can monopolize the GPU and spike tail latency for everyone else. It compounds with continuous batching and PagedAttention to keep the GPU steadily utilized under mixed load.

### Q: Can I waste GPU even with vLLM?

Yes. Most vLLM deployments still waste 30 to 50% of GPU cycles because engineers enable every feature flag without matching them to the workload. Settings like max-num-seqs, gpu-memory-utilization, and max-num-batched-tokens trade throughput against tail latency and KV preemption. Adopting a continuous-batching engine removes the worst waste, but workload-specific tuning is needed to capture the rest.

## Next Read

Continuous batching is the compute side of serving efficiency. For the memory side, where held KV cache caps how many users fit on a card, read [OpenAI versus self-hosted LLM cost](https://ravoid.com/blog/openai-vs-self-hosted-llm-cost).

---

### Sources & Further Reading

- [Tian Pan: The Single Biggest GPU Utilization Unlock for LLM Serving](https://tianpan.co/blog/2026-04-09-continuous-batching-llm-inference)
- [Spheron: LLM Serving Optimization on H100](https://www.spheron.network/blog/llm-serving-optimization-continuous-batching-paged-attention/)
- [Runpod: PagedAttention and Continuous Batching](https://www.runpod.io/articles/guides/vllm-pagedattention-continuous-batching)
- [ZeroEntropy: vLLM's in-flight scheduling trick](https://zeroentropy.dev/concepts/continuous-batching/)

---

_Last updated: July 26, 2026_
