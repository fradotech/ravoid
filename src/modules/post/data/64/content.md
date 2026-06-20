# Your Fine-Tuned Model Expires in 90 Days

_By Framesta Fernando · Engineering Manager & Technical Architect · 11 min read · Published July 5, 2026_

> **TL;DR:** Fine-tuning deprecation is the cost teams never amortize. A fine-tune is welded to a base model snapshot, and when the provider retires that snapshot, your fine-tune dies and must be rebuilt and re-evaluated on the successor. Treat a fine-tune as a depreciating asset on a retraining schedule, not a one-time capital expense.

Picture the planning meeting where the fine-tune gets approved. Someone presents it as a one-time cost: spend the training budget, build the pipeline, ship the custom model, done. It goes on the roadmap as a project with an end date. That framing is the mistake, and it is invisible until, months later, an email arrives announcing that the base model your fine-tune was trained on is being deprecated, and your custom model goes with it.

A fine-tune is not a thing you build once. It is a thing you rent the foundation of, and the landlord changes the building on a schedule you do not control. The cost was never the first training run. It was every forced rebuild after.

## The cost that was filed under the wrong category

Teams book fine-tuning as capital expense: a one-time build that produces a lasting asset. That mental model is why the recurring cost is never budgeted, because capital expenses are not supposed to recur. The fine-tune ships, the project closes, and everyone moves on as if the custom model will sit there working indefinitely.

Two forces make that false. The first is base-model deprecation. Your fine-tune is a layer of weights on top of a specific provider snapshot, and providers retire snapshots on a cadence. The retirement is not hypothetical: Azure retired the DALL-E 3 image model in March 2026, with existing deployments rendered non-functional and customers directed to the successor ([per Microsoft's model retirement guidance](https://learn.microsoft.com/en-us/azure/ai-foundry/openai/how-to/dall-e)). When a base text model is deprecated the same way, every fine-tune built on it must be retrained on the successor or it stops working. The second force is staleness: even if the base never moved, the knowledge you baked in ages, which is the cost-per-update problem I laid out in [stop asking RAG vs fine-tuning](https://ravoid.com/blog/rag-vs-fine-tuning-cost).

## Putting a depreciation schedule on it

Capital assets depreciate, so let me schedule the fine-tune like one. The following is illustrative. Say a fine-tune costs $5,000 per training run including data prep and evaluation, and the base model has a useful life of roughly 12 months before deprecation forces a rebuild.

```
One-time framing (wrong):
  $5,000, then $0 forever

Depreciating-asset framing (real):
  initial build:                 $5,000
  forced rebuild on deprecation: $5,000 / ~12 months
  re-evaluation each rebuild:    engineering time, every cycle
  amortized:                     ~$5,000+/year, indefinitely
```

If you also retrain quarterly to fight staleness, the schedule is four runs a year, illustratively $20,000 plus eval time annually, not a one-time $5,000. The number that went on the roadmap was off by a recurring multiple, and the gap surfaces as an unplanned migration scramble the quarter a deprecation email lands. That scramble has a shape: re-prepare the training data, retrain on the new base, and re-run the full evaluation suite to confirm the new fine-tune did not regress, the exact harness cost I covered in [the agent eval budget nobody plans](https://ravoid.com/blog/ai-agent-evaluation-cost).

The post-mortem version: a team fine-tuned a model for structured extraction, shipped it, and closed the project. Eleven months later the base snapshot hit end-of-life with a 90-day migration window. The original training data had drifted from the current schema, the engineer who built the pipeline had moved teams, and the successor base behaved differently enough that the old hyperparameters underperformed. What was booked as a finished project became, illustratively, three engineer-weeks of unplanned migration under a deadline, plus a fresh evaluation cycle, to stand still.

## You rent the base, you own only the delta

The reframe that prices this correctly: when you fine-tune, you do not own a model, you own a delta on top of a model you rent, and the rental term ends on the provider's schedule, not yours. The valuable, durable part is your training data and your evaluation suite. The fine-tuned weights themselves are perishable, pinned to a snapshot with an expiry you cannot see.

That changes what you invest in. The weights are not the asset, the pipeline is: versioned training data, a reproducible training run, and an eval suite that can validate a rebuild on a new base in days instead of weeks. A team that treats the fine-tune as the asset is devastated by a deprecation email. A team that treats the reproducible pipeline as the asset treats deprecation as a routine rebuild, because they can regenerate the delta on the successor base on demand. This is also why fine-tuning's total cost of ownership so often loses to retrieval for volatile domains, and why the honest build-versus-rent comparison belongs alongside [OpenAI versus self-hosted LLM cost](https://ravoid.com/blog/openai-vs-self-hosted-llm-cost), where self-hosting an open-weight base removes the deprecation clock at the price of running the infrastructure yourself.

## A framework for surviving deprecation

Invest in the durable layer, not the perishable one:

| Asset | Durable or perishable | Investment |
| --- | --- | --- |
| Fine-tuned weights | Perishable (snapshot-pinned) | Minimal, expect to rebuild |
| Training dataset | Durable | Version it, keep it current |
| Evaluation suite | Durable | Build to validate any rebuild |
| Training pipeline | Durable | Make it one-command reproducible |

Pin and track the base model's lifecycle so deprecation is never a surprise:

```yaml
# model-registry.yaml: track the expiry you do not control
fine_tune:
  name: extraction-v3
  base_model: provider/base-snapshot-2026-01
  base_deprecation: 2026-12-31   # watch this date like a cert expiry
  training_data: s3://models/extraction/train-v3.jsonl  # versioned, durable
  eval_suite: eval/extraction/    # must pass before any rebuild ships
  rebuild_runbook: docs/refit-on-new-base.md
```

Treat the deprecation date like a TLS certificate expiry: a known future event with an owner and an alert, not a surprise. When the notice comes, you run the pipeline against the successor, pass the eval suite, and ship, the same disciplined migration posture I described in [the LangChain exit and raw SDK migration](https://ravoid.com/blog/langchain-exit-raw-sdk-migration-2026). The teams that get hurt are the ones who learn the base was deprecated from a production incident rather than from a calendar entry they set the day they shipped.

## Decision guidance

The trap is booking a fine-tune as a one-time project and discovering its recurring cost the quarter a deprecation email forces an unplanned rebuild under deadline.

**The rule: If you fine-tune on a hosted base model, then track its deprecation date as a scheduled rebuild and budget the retraining and re-evaluation annually, because the weights are perishable and the rebuild is not optional.**

Invest in the durable assets, versioned data, an eval suite, and a reproducible pipeline, so a rebuild is routine rather than a scramble. Amortize the fine-tune like the depreciating asset it is. And before committing, ask whether retrieval would meet the need without any of this lifecycle cost, because for volatile knowledge it usually does.

## The expiry date you did not read

A fine-tuned model ships with an expiration date written in the provider's deprecation policy, not on your roadmap. Teams that treat the custom weights as a permanent asset keep getting blindsided by an email they could have seen coming. Teams that treat the pipeline as the asset just rebuild and move on.

Put the base model's end-of-life on the calendar on the same day you ship the fine-tune. It is the most predictable cost you are currently ignoring, and the only one with a firm date already printed on it in the provider's own documentation.

## FAQ

### Q: Why does a fine-tuned model stop working?

Because it is a layer of custom weights trained on top of a specific base model snapshot, and providers retire snapshots on a lifecycle. When the base is deprecated, the fine-tune built on it can no longer run and must be retrained on the successor model. The custom weights are pinned to a foundation you rent, so their useful life ends when the provider ends the base model's life, not when you decide.

### Q: How often do base models get deprecated?

It varies by provider and model, but the cadence is frequent enough to plan around, often roughly annually for a given snapshot, sometimes faster. Providers publish deprecation schedules and migration windows, as when Azure retired DALL-E 3 in March 2026 and made existing deployments non-functional. The safe assumption is that any base you fine-tune on has a useful life measured in months, not years.

### Q: What is the real total cost of fine-tuning?

It is the initial training run plus a recurring rebuild whenever the base is deprecated, plus optional retraining for staleness, plus a full re-evaluation each cycle. Booked honestly it is an annual cost, not a one-time one. An illustrative $5,000 build becomes $5,000 or more per year just from deprecation rebuilds, and several times that if you retrain quarterly to keep knowledge fresh.

### Q: How do I protect a fine-tune against deprecation?

Invest in the durable assets rather than the perishable weights: version your training data, build an evaluation suite that can validate a rebuild, and make the training pipeline one-command reproducible. Track the base model's deprecation date like a certificate expiry with an owner and an alert. Then a deprecation notice triggers a routine rebuild on the successor base instead of a multi-week scramble.

### Q: Should I self-host an open-weight model to avoid deprecation?

It removes the provider's deprecation clock, since you control when the base changes, but it trades that for the cost and effort of running inference infrastructure yourself. For teams with the operational capacity and enough volume, self-hosting an open-weight base can make a fine-tune genuinely long-lived. For most teams the hosted convenience outweighs the deprecation tax, provided they budget the rebuilds rather than ignoring them.

### Q: Is fine-tuning worth it given the deprecation cost?

It depends on knowledge velocity and query volume. For stable behavior at high volume, fine-tuning can pay off even with rebuild costs, because it avoids the per-query context tax of retrieval. For volatile knowledge, the recurring rebuild plus staleness usually makes retrieval cheaper. The deprecation cost is a reason to run the full total-cost comparison rather than treating fine-tuning as a free permanent upgrade.

## Next Read

The decision of whether to fine-tune at all, given this lifecycle cost, comes down to one axis: see [stop asking RAG vs fine-tuning](https://ravoid.com/blog/rag-vs-fine-tuning-cost).

---

### Sources & Further Reading

- [Microsoft Learn: Azure OpenAI Model Retirements](https://learn.microsoft.com/en-us/azure/ai-foundry/openai/how-to/dall-e)
- [OpenAI: Model Deprecations](https://platform.openai.com/docs/deprecations)
- [DigitalApplied: RAG vs Fine-Tuning TCO Calculator 2026](https://www.digitalapplied.com/blog/rag-vs-fine-tuning-tco-calculator-comparison-2026)

---

_Last updated: July 5, 2026_
