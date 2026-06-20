# One Tenant's Long Prompt Starves Everyone Else

_By Framesta Fernando · Engineering Manager & Technical Architect · 11 min read · Published August 3, 2026_

> **TL;DR:** Multi-tenant LLM isolation breaks under the default FIFO scheduler. When tenants share GPUs, one customer's 8,000-token prompts sit ahead of everyone else's short interactive requests, and head-of-line blocking violates latency SLOs across the board. The fix is per-tenant queues and priority or shortest-job-first scheduling, not more hardware.

Your GPU is not slow. Your scheduler is being fair to the wrong request. That is the uncomfortable diagnosis behind most multi-tenant LLM latency incidents, and it surprises teams because they instinctively reach for more hardware when the real problem is the order in which work is served. When many tenants share a pool of GPUs, the default behavior treats every request as equal, and equality is exactly what wrecks the experience for the tenant who only wanted a fast answer.

The mechanics are unforgiving. Running LLMs as a multi-tenant SaaS platform means many organizations share the same GPUs with bursty, uneven traffic, and left unmanaged, one customer's spike becomes every other customer's latency problem ([Cohere on serving fairness](https://cohere.com/blog/serving-fairness)). The hardest problem in multi-tenant LLM serving is not throughput, it is preventing one tenant's long-running batch from starving another's interactive prompt while keeping billing accurate ([this multi-tenant architecture analysis](https://markaicode.com/architecture/tool-multi-tenant-architecture/)). Multi-tenant LLM isolation is a scheduling problem first, and a capacity problem almost never.

## The default scheduler is the bug

Most teams deploy vLLM or TGI with the default first-come-first-serve scheduler, add workloads over time, and only discover the priority inversion during an incident ([Tian Pan on scheduling fairness](https://tianpan.co/blog/2026-05-07-scheduling-fairness-multi-tenant-llm-workloads)). FCFS is a reasonable default for uniform work. It is a disaster for mixed traffic, because LLM request sizes vary by orders of magnitude and the scheduler does not know or care. A short chatbot query and an 8,000-token document analysis get the same priority, so the short one waits behind the long one simply because it arrived a moment later.

This is head-of-line blocking, the same pathology that plagues any FIFO queue with variable job sizes. In LLM inference the output length is typically not known in advance, so most serving systems employ a simple FCFS strategy, leading to HOL blocking and reduced throughput and service quality ([the learning-to-rank scheduling paper](https://ar5iv.labs.arxiv.org/html/2408.15792)). The documented failure is concrete: a batch job filled GPU memory with prefill work, the chatbot's short requests sat in queue behind a parade of 8,000-token prompts, and the chatbot's SLO was violated 4,000 times before someone killed the batch job manually ([Tian Pan](https://tianpan.co/blog/2026-05-07-scheduling-fairness-multi-tenant-llm-workloads)). The GPU was healthy the whole time. The queue order was the outage.

## What head-of-line blocking costs in latency

Put numbers on the starvation. Take an illustrative interactive request, a 200-token prompt with a 300ms time-to-first-token target, arriving just after a batch tenant submits a burst of 8,000-token prompts. Prefill time scales roughly with prompt length, so assume each large prefill occupies the engine for about 700ms.

```
Interactive TTFT target:           300 ms
Large prefills queued ahead:       6
Engine time per large prefill:     ~700 ms
FIFO wait before short request runs: 6 x 700 = 4,200 ms
Resulting TTFT:                     ~4,400 ms  (about 14x the SLO)
```

Fourteen times over the latency budget, not because the short request is expensive (it is trivial) but because it is polite enough to wait its turn behind work that should never have been ahead of it. Reorder the queue so the short, latency-sensitive request runs first, and its TTFT returns to near target. The research backs the size of the win: a learning-based scheduler in vLLM reduced average TTFT for short requests by up to 4x versus FCFS while improving throughput over 30% ([the adaptive scheduler paper](https://arxiv.org/html/2601.21758v1)), and a preemptive cluster scheduler cut the 99th-percentile queueing delay of short-input requests by up to 92% without significantly hurting the completion time of long requests ([the preemptive scheduling paper](https://arxiv.org/abs/2409.15104)). You do not trade the batch tenant's throughput for the chatbot's latency. You get both by scheduling correctly.

## The anchor: a shared pool has no concept of priority

The reframing is that a shared resource pool, by default, has no concept of priority, so workloads with completely different latency needs cannot coexist without guardrails ([Tacnode on workload isolation](https://tacnode.io/workload-isolation)). The GPU does not know that the chatbot has a 300ms SLO and the batch job has all night. To the engine, both are just requests. Isolation is the act of teaching the system which requests matter when, and FIFO is the absence of that teaching.

That is why throwing hardware at the problem fails. Adding GPUs raises total capacity but does nothing about ordering, so a long prompt still blocks a short one on whichever GPU they share, and you have simply bought more places for the same inversion to happen. The lever is the scheduler and the queue structure, not the node count, which is the same utilization-versus-capacity distinction I drew in [why AI cost explodes after scale](https://ravoid.com/blog/why-ai-cost-explodes-after-scale): the bottleneck is usually how work is organized, not how much hardware is under it. The throughput side of that same lesson, idle GPU cycles between requests, is [naive LLM serving wastes most of your GPU](https://ravoid.com/blog/continuous-batching-vllm).

| Scheduling approach | Short-request latency | Long-request impact | Fit |
| --- | --- | --- | --- |
| FCFS / FIFO (default) | Starved under load | None (it wins) | Uniform workloads only |
| Shortest-job-first | Greatly improved | Slightly delayed | Mixed request sizes |
| Per-tenant queues + round-robin | Fair across tenants | Bounded | Multi-tenant SaaS |
| Priority by SLO | Meets tight SLOs | Deprioritized batch | Mixed latency targets |

## Isolate with queues, not hardware

The fix is structural and lives above the engine. Instead of sending requests directly to vLLM in arrival order, route them through a layer that maintains separate queues per tenant and schedules across them rather than FIFO. A real production pattern: users send to an API server with separate queues for each user and model, and a scheduler that goes round-robin through the queues instead of first-in-first-out ([Hugging Face on request queueing](https://huggingface.co/blog/tngtech/llm-performance-request-queueing)). That single change converts a global FIFO into per-tenant fairness, so one tenant's burst fills only that tenant's queue.

```python
# Per-tenant queues + SLO-aware ordering instead of one global FIFO
queues = {tenant: deque() for tenant in tenants}

def next_request():
    # round-robin across tenants so no one tenant monopolizes the engine,
    # then prefer the shortest / tightest-SLO request within the turn
    for tenant in rotate(tenants):
        if queues[tenant]:
            return min(queues[tenant], key=lambda r: (r.slo_ms, r.est_tokens))
    return None
```

The two ideas stack: round-robin across tenants prevents any single customer from monopolizing the engine, and ordering within a turn by SLO and estimated size prevents a long request from blocking a short one. Middleware now exists specifically to give a quiet user predictable TTFT even when a noisy neighbor is hammering the same shared engine ([InferGrid on PyPI](https://pypi.org/project/infergrid/)), so you do not necessarily have to build it from scratch. This is the supply-side companion to the routing discipline I described in [smart routing for self-hosted AI cost savings](https://ravoid.com/blog/smart-routing-self-hosted-ai-cost-savings): match the handling to the request, do not treat all traffic identically.

## A post-mortem on a chatbot that went quiet

A composite from the documented pattern, with figures labeled illustrative: a company ran an interactive support chatbot and an internal document-analysis pipeline on the same vLLM cluster to save on GPUs. For weeks it was fine, because the pipeline ran overnight. Then someone scheduled the pipeline to run continuously, and it began submitting long 8,000-token prompts during business hours. The chatbot's p99 TTFT jumped from roughly 400ms to over 5 seconds, support conversations stalled, and users assumed the product was down. Nothing was down. The metric that broke was short-request queueing delay, which had exploded because the FIFO scheduler placed every chat message behind whatever long prefill happened to be in flight. The fix was not a second cluster, it was per-tenant queues with SLO-aware ordering, which restored the chatbot's latency while the pipeline kept its throughput on the same hardware.

## Framework: isolate by scheduling, scale by need

| Decision | What you gain | What you pay | When it breaks |
| --- | --- | --- | --- |
| Per-tenant queues | One burst stays contained | Queue management layer | Single-tenant systems |
| SLO-aware ordering | Tight SLOs met under load | Scheduler complexity | Truly uniform traffic |
| Preemption of long jobs | Short requests jump ahead | Some long-job delay | Hard real-time long jobs |
| Add GPUs | More total capacity | Full hardware cost | Ordering still unsolved |

The order: fix the scheduler first, because it is the actual cause and costs no hardware, add per-tenant queues to contain bursts, apply SLO-aware ordering or preemption so latency-sensitive work wins its turn, and only then consider more capacity if you are genuinely throughput-bound after the queue is fair. Adding GPUs before fixing ordering is paying to replicate the bug.

## Decision guidance

The mistake is reading a latency incident as a capacity shortage and scaling hardware, when the cause is a scheduler that treats unequal requests as equal.

**The rule: If interactive and batch workloads share an LLM engine on a FIFO scheduler, then add per-tenant queues with SLO-aware ordering before you add a single GPU, because the latency problem is ordering, not capacity.**

The honest exception is a genuinely single-tenant or uniform workload, where every request has similar size and the same latency target, so FIFO causes no inversion and the extra scheduling machinery adds complexity for no benefit. The moment you mix request sizes or tenants with different SLOs on shared hardware, FIFO becomes a liability, and the question is no longer whether to isolate but how finely.

## Fairness to the wrong request

Multi-tenant LLM serving fails in a way that hides its own cause. The GPU is busy and healthy, the throughput graphs look fine, and yet one tenant's experience falls apart, because the scheduler is impartially serving an 8,000-token prompt while a 200-token question waits politely behind it. The default that feels fair, first come first served, is precisely the unfairness, because it ignores that not all requests are the same size or the same urgency.

The cheapest latency improvement is the one you get by reordering a queue you already have. Teach the system which requests matter when, and the noisy neighbor stops being everyone else's problem, on the exact hardware that looked like it needed doubling.

## FAQ

### Q: What causes one tenant to slow down others in shared LLM serving?

Head-of-line blocking under a first-come-first-serve scheduler. When tenants share GPUs, the default scheduler treats every request equally, so a long 8,000-token prompt that arrived first blocks short interactive requests behind it. The short requests wait for the long prefill to finish, violating their latency SLOs, even though the GPU itself is healthy. It is a scheduling problem, not a capacity one.

### Q: What is head-of-line blocking in LLM inference?

It is when a short, fast request is stuck waiting behind a longer one in a FIFO queue, inheriting the long request's processing time as queueing delay. Because LLM request sizes vary enormously and output length is not known in advance, most serving systems default to FCFS, which produces HOL blocking, reduced throughput, and SLO violations for latency-sensitive traffic. Reordering the queue by size or priority fixes it.

### Q: Does adding more GPUs fix multi-tenant LLM latency?

Usually not. Adding GPUs raises total capacity but does nothing about request ordering, so a long prompt still blocks a short one on whatever GPU they share. You just buy more places for the same priority inversion to occur. The effective fix is per-tenant queues and SLO-aware or shortest-job-first scheduling, which reorders work so latency-sensitive requests are served promptly without more hardware.

### Q: How do I isolate tenants on a shared LLM engine?

Route requests through a layer that maintains separate queues per tenant and schedules across them with round-robin instead of one global FIFO, so a burst from one tenant fills only that tenant's queue. Within each turn, order requests by SLO and estimated size so short, latency-sensitive requests are not blocked by long ones. Middleware exists for this, or it can be built above vLLM or TGI.

### Q: How much does fixing the scheduler improve latency?

Substantially. A learning-based scheduler in vLLM reduced average time-to-first-token for short requests by up to 4x versus FCFS while improving throughput over 30%, and a preemptive cluster scheduler cut the 99th-percentile queueing delay of short-input requests by up to 92% without significantly hurting long-request completion time. You get better short-request latency and comparable batch throughput at once.

### Q: Should batch and interactive LLM workloads share the same cluster?

They can, but only with proper scheduling. Sharing saves hardware, yet on a FIFO scheduler a continuous batch workload will starve interactive traffic during overlap. With per-tenant queues, SLO-aware ordering, and optional preemption of long jobs, both can coexist on the same cluster: the interactive workload meets its latency target and the batch workload keeps its throughput. Without that, separate them or expect incidents.

### Q: What is the difference between throughput and fairness in LLM serving?

Throughput is how many tokens the system processes per second overall. Fairness is whether each tenant gets timely service regardless of what others are doing. A system can have high throughput while being deeply unfair, because a few large requests dominate the GPU and starve everyone else. Multi-tenant serving needs both, and fairness is the one the default FIFO scheduler ignores.

## Next Read

Scheduling is one half of getting the most from shared GPUs. For where serverless and shared architectures hit their structural limits, read [where serverless breaks at scale](https://ravoid.com/blog/where-serverless-breaks-vercel-cloudflare-real-experience).

---

### Sources & Further Reading

- [Cohere: LLM Serving Fairness](https://cohere.com/blog/serving-fairness)
- [Tian Pan: Scheduling Fairness in Multi-Tenant LLM Inference](https://tianpan.co/blog/2026-05-07-scheduling-fairness-multi-tenant-llm-workloads)
- [Efficient LLM Scheduling by Learning to Rank (arXiv)](https://ar5iv.labs.arxiv.org/html/2408.15792)
- [Preemptive and Efficient Cluster Scheduling for LLM Inference (arXiv)](https://arxiv.org/abs/2409.15104)

---

_Last updated: August 3, 2026_
