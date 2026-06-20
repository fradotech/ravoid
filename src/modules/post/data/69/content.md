# Spot GPUs Are Cheap Until They Cost You More

_By Framesta Fernando · Engineering Manager & Technical Architect · 11 min read · Published July 10, 2026_

> **TL;DR:** Spot GPU cost is 60 to 90% below on-demand, but the discount is conditional on your work surviving interruption. For stateless, short, or checkpointable jobs, spot is close to free money. For long stateful runs, eviction wastes progress, forces checkpoint overhead, and triggers retries that quietly erode the savings. Match the discount to the workload, not the price tag.

The spot instance pitch is a real discount with an asterisk most people skip reading. A GPU that costs $4 an hour on-demand might run at $1.50 on spot, and at scale that looks like reclaiming most of your compute bill for free. The asterisk is that the provider can take the machine back with about two minutes notice whenever it wants the capacity, and what that interruption costs you depends entirely on what your job was doing when the lights went out.

For the right workload, the answer is "almost nothing, just restart." For the wrong one, the answer is "three hours of GPU time you already paid for, gone," and once that happens often enough, the cheap GPU is no longer cheap. The headline price is the same in both cases. The effective price is not.

## The discount that assumes you can be interrupted

The mental model that misleads is treating the spot price as the price, the way you treat an on-demand rate. On-demand is unconditional: you pay it, the machine is yours until you release it. Spot is conditional: you pay less in exchange for the provider's right to reclaim the machine, so the real cost includes whatever the interruption destroys.

That makes spot pricing meaningless without a second number: how much work you lose per eviction. A stateless inference server that gets evicted just drops a few in-flight requests and respawns elsewhere, so the loss is near zero and the discount is nearly pure. A multi-hour training run evicted at 80% completion loses everything since the last checkpoint, so the loss can dwarf the hourly savings. Same instance, same discount, wildly different effective cost, decided entirely by the workload's tolerance for being killed mid-flight. This is the same idle-and-waste dynamic that distorts the GPU economics I covered in [self-hosting your LLM is cheaper, on paper](https://ravoid.com/blog/self-hosted-llm-devops-tax).

## Costing the eviction

Put numbers on it. The following is illustrative. Say on-demand is $4 an hour and spot is $1.50, a 62% discount, and you run 4-hour training jobs with no checkpointing on a spot GPU that gets interrupted 20% of the time.

```
Naive view:
  spot $1.50/hr vs on-demand $4/hr -> 62% cheaper

With 20% interruption, no checkpoints:
  1 in 5 jobs is killed and restarted from zero
  wasted GPU-hours per failed job: up to 4
  effective work lost raises true cost-per-completed-job
  -> a chunk of the 62% discount is spent re-doing lost work
```

The discount that looked like 62% shrinks toward the interruption rate times the work lost, and if your jobs are long and uncheckpointed, the effective saving can collapse to a fraction of the headline, or in pathological cases go negative once you add retry orchestration and the engineer time to manage it. Checkpointing recovers most of this, but checkpointing itself costs: the time and I/O to write state periodically, plus the engineering to make jobs resumable. The serverless and self-hosted GPU crossover math behind all this is in [Kubernetes vs Replicate cost](https://ravoid.com/blog/openai-vs-self-hosted-llm-cost).

The post-mortem version: a team moved model training to spot GPUs for the headline savings and ran long fine-tuning jobs with no checkpointing, because adding it was "a later optimization." A capacity crunch spiked interruptions, and jobs kept dying at, illustratively, 70 to 90% complete and restarting from scratch. They burned more GPU-hours re-doing lost work than the spot discount saved, missed a delivery deadline waiting for jobs to finally complete uninterrupted, and ended up doing the checkpointing work anyway under pressure. The discount was real. They just had not earned the right to it.

## You are buying a discount on interruptible work, not on GPUs

The reframe that makes spot pay: spot pricing is a discount on interruptibility, not on GPUs, so the saving is only real to the extent your work is genuinely interruptible. The question is never "is spot cheaper," because the sticker always is. It is "what does my job lose when it dies at minute 119 of a 120-minute window," and the honest answer determines whether the discount is yours or an illusion.

That sorts workloads cleanly. Spot is excellent for anything stateless or naturally short: batch inference jobs, embedding generation, stateless serving behind a queue, and anything already built to checkpoint and resume. It is dangerous for long, stateful, uncheckpointed runs where eviction destroys hours of progress, and for latency-critical serving where respawn time violates an SLA. The work to make a job spot-friendly, checkpointing, idempotency, retry orchestration, is real engineering, and it only pays where interruptions are frequent enough to matter, the same kind of utilization-and-overhead calculus I described for clusters in [why your Kubernetes bill grew while traffic didn't](https://ravoid.com/blog/kubernetes-cost-2026).

## A framework for what belongs on spot

Match the instance type to the workload's interruption tolerance:

| Workload | Spot-friendly? | Why |
| --- | --- | --- |
| Stateless batch inference | Yes | Eviction loses one job, respawns |
| Embedding generation | Yes | Idempotent, resumable by chunk |
| Long training, no checkpoints | No | Eviction wastes hours of progress |
| Latency-critical serving | No | Respawn time breaks the SLA |

Make jobs earn the discount by being resumable before you run them on spot:

```yaml
# Only run on spot what can survive a 2-minute eviction notice.
job:
  type: training
  spot_eligible: true
  requirements:
    checkpoint_interval_min: 10   # bound the work any eviction can destroy
    resumable: true               # restart continues, not from zero
    on_interruption: save_and_requeue
# If checkpoint_interval is null or resumable is false, do NOT use spot.
```

For genuinely long, stateful, uncheckpointed work, on-demand or reserved capacity is cheaper once you price the wasted re-runs, even at the higher sticker.

## Decision guidance

The trap is reading the spot discount as the saving and running uncheckpointed, long, stateful jobs on it, then losing the discount to re-done work and retry overhead.

**The rule: If a job cannot checkpoint and resume within the spot interruption window, then do not run it on spot, because eviction will destroy enough progress to erase the discount and then some.**

Run stateless, short, and checkpointable work on spot, where the discount is nearly pure. Make long jobs resumable before they go on spot, and price the checkpointing overhead honestly. For work that cannot tolerate interruption at all, pay on-demand and treat the higher sticker as the real cheaper option once wasted re-runs are counted. A useful habit is to track your actual interruption rate per instance type and region, because it varies widely and a pool that was reliable last quarter can become eviction-prone the moment demand for that GPU class spikes.

## The asterisk on the discount

Spot GPUs are one of the largest discounts in cloud infrastructure, and for the workloads that fit, the saving is as good as it looks. The asterisk is that the discount is rented against your work's ability to die and restart cheaply, and a long uncheckpointed job has not earned it. The price tag is identical whether spot saves you money or costs you a deadline. Only the workload decides which.

Ask what dies at minute 119. If the answer is "everything," that GPU is not cheap, it is a gamble with a discount printed on it. If the answer is "one job I can simply rerun," take the discount and do not look back.

## FAQ

### Q: How much do spot GPUs actually save?

The sticker discount is typically 60 to 90% off on-demand, but the effective saving depends on your interruption rate and how much work each eviction destroys. For stateless or checkpointable jobs the effective saving is close to the headline. For long uncheckpointed runs, re-doing lost work plus retry overhead can shrink the real saving to a fraction of the sticker, or eliminate it.

### Q: What happens when a spot GPU is interrupted?

The provider reclaims the instance with around two minutes of notice. Any work not persisted is lost: a stateless server drops in-flight requests and respawns with negligible loss, while a long training run without checkpoints loses all progress since it started and must restart from zero. The cost of an interruption is entirely a function of how much state your job had accumulated when it was evicted.

### Q: Which workloads are safe to run on spot GPUs?

Stateless, short, idempotent, or checkpointable work: batch inference, embedding generation, stateless serving behind a queue, and training jobs that checkpoint and resume. These tolerate eviction cheaply, so the discount is nearly pure. Avoid spot for long stateful runs without checkpointing and for latency-critical serving where respawn time would breach an SLA.

### Q: Does checkpointing make spot GPUs worth it for training?

Often yes, because checkpointing bounds the work any single eviction can destroy to one checkpoint interval rather than the whole run. It introduces its own cost, the time and I/O to write state periodically and the engineering to make jobs resumable, but for frequently interrupted long jobs that overhead is far smaller than the wasted re-runs it prevents. Without checkpointing, long training on spot is a gamble.

### Q: How do I calculate the real cost of spot GPUs?

Start with the spot hourly rate, then add the expected cost of interruptions: interruption rate times the work lost per eviction times the GPU rate, plus any checkpointing overhead and retry-orchestration effort. For stateless jobs that addition is near zero and the sticker discount holds. For long uncheckpointed jobs it can be large enough that on-demand is cheaper per completed job despite the higher hourly rate.

### Q: Should latency-critical inference run on spot?

Generally no. Spot instances can be reclaimed at any time, and the respawn-and-warm-up delay after an eviction can violate a latency or availability SLA for real-time serving. Spot suits the asynchronous, interruption-tolerant side of inference, such as batch jobs, while latency-critical, user-facing serving belongs on on-demand or reserved capacity where the machine will not be pulled out from under it.

## Next Read

Spot economics are one piece of the larger self-hosting cost picture that per-token math tends to miss: see [self-hosting your LLM is cheaper, on paper](https://ravoid.com/blog/self-hosted-llm-devops-tax).

---

### Sources & Further Reading

- [AWS: Spot Instances documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances.html)
- [markaicode: RunPod vs Kubernetes GPU Cost](https://markaicode.com/vs/runpod-vs-kubernetes/)
- [markaicode: Amazon EC2 GPU Inference Cost in 2026](https://markaicode.com/pricing/amazon-ec2-self-hosted-llm-inference-cost-analysis/)

---

_Last updated: July 10, 2026_
