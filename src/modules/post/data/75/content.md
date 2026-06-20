# Reasoning Models Think Themselves Into Your Budget

_By Framesta Fernando · Engineering Manager & Technical Architect · 11 min read · Published July 16, 2026_

> **TL;DR:** Reasoning model cost comes mostly from thinking tokens, the hidden chain-of-thought a model generates before its visible answer. Those tokens are billed at the output rate but never appear in your response, so a reply you read as 500 tokens can cost you 5,000. Gate reasoning to the tasks that actually need it.

You switched to a reasoning model because the per-token price looked competitive and the benchmark scores were better. Then the bill came in several times higher than your old model on the same traffic, and the strange part was that your logs showed roughly the same response sizes. Nothing in the visible output explained the increase. That is the whole trick of reasoning model cost: the expensive part is the part you never see.

Reasoning models work by running an internal search before they answer, a hidden chain-of-thought that explores and prunes solution paths, and that thinking happens outside the visible output ([Tian Pan's breakdown of how reasoning models differ](https://tianpan.co/blog/2026-04-16-prompting-reasoning-models-differently)). Here is the billing consequence that surprises people: that internal reasoning is billed identically to output tokens, and it is invisible. You see 500 tokens of analysis in the response, and you have been billed for 5,000 ([Tian Pan on thinking-budget economics](https://tianpan.co/blog/2026-05-05-thinking-budgets-extended-reasoning-models-economic-sense)). The cheaper-per-token model handed you the more expensive invoice, because it generated ten times the tokens to get there.

## The token you pay for and never read

Standard token math is simple: input is everything you send, output is everything the model writes back, and you pay per million of each ([DeepInfra's pricing primer](https://deepinfra.com/blog/pricing-101-token-math-cost-per-completion)). Reasoning models break that mental model by inserting a third bucket between input and output. Before the visible answer, the model emits a long stream of thinking tokens, and those tokens count as output for billing while being stripped from the response you receive.

That is why your logs lie to you about cost. Output and reasoning tokens already cost two to six times more than input tokens ([CodeAnt's token-cost guide](https://www.codeant.ai/blogs/input-vs-output-vs-reasoning-tokens-cost)), and reasoning models multiply the output count on top of that premium. A complex query on Claude Opus with extended thinking can legitimately spend 20,000 to 40,000 thinking tokens before emitting 500 visible tokens ([Tian Pan on the observability-billing gap](https://tianpan.co/blog/2026-05-14-thinking-tokens-observability-billing-gap)). Your monitoring dashboard, counting visible response length, sees a 500-token reply. Your invoice sees 40,500. The gap between those two numbers is the entire reason reasoning costs feel inexplicable.

## How big the multiplier really gets

The multiplier is not a rounding error, it is an order of magnitude, and it depends heavily on the task. The cleanest illustration comes from comparing models on an identical question: DeepSeek-R1 on a simple coding question generates 4,000 thinking tokens, while GPT-4o on the same question generates 150, a 26x difference that is exactly why reasoning inference costs look nothing like standard LLM costs ([Spheron's reasoning-cost guide](https://www.spheron.network/blog/reasoning-model-inference-cost-gpu-optimization/)). The reasoning model is not wrong, it is just doing far more work, billed as output, to answer a question that did not require it.

Work the budget impact on a routine workload. Take an illustrative 500,000 requests a month for a task that does not need deep reasoning, like classification or short extraction. The token counts below are drawn from the cited reasoning-vs-standard gap; the per-million rates are illustrative of current frontier and fast-model pricing tiers.

```
Reasoning model: 5,000 thinking + 500 visible = 5,500 billed output tokens
  500,000 req x 5,500 = 2,750,000,000 output tokens = 2,750 M
  2,750 M x $15/M (reasoning output rate) = $41,250 / month

Fast model: 500 output tokens
  500,000 req x 500 = 250,000,000 = 250 M
  250 M x $2/M (fast output rate) = $500 / month

Difference: $41,250 - $500 = $40,750 / month
```

Forty thousand dollars a month to think hard about questions that did not need thinking. The model did nothing wrong. It was configured to reason on every request, including the overwhelming majority that a fast model would have answered correctly in a fraction of the tokens. This is the same trap I documented specifically for one frontier model in [the Opus 4.7 extra-high effort trap](https://ravoid.com/blog/opus-4-7-xhigh-effort-trap): cranking the reasoning dial to maximum on undifferentiated traffic is how you turn a cheap-looking model into a budget fire.

## The anchor: you are billed for invisible labor

Most cost-control instincts are built around things you can see. You trim the prompt because you can count its tokens. You cap the response length because it shows up in the payload. Reasoning models defeat both instincts because the expensive tokens are neither in your prompt nor in your response. They exist only on the invoice. The lever that matters is not prompt size or output cap, it is the thinking budget, and most teams do not know it exists.

This reframes the whole optimization. With a standard model, cost tracks what you send and what you read. With a reasoning model, cost tracks how hard the model decided to think, a quantity that is invisible by default and, on adaptive models, chosen by the model itself rather than by you. Some models let the model decide how much to reason; others let you select low, medium, or high effort ([Cerebras on the economics of reasoning](https://www.cerebras.ai/blog/the-economics-of-ai-reasoning)). If you have not set that level explicitly, you have outsourced your single biggest cost lever to the model's discretion. That is the deeper version of the lesson in [why AI cost explodes after scale](https://ravoid.com/blog/why-ai-cost-explodes-after-scale): the blowup is rarely the price per token, it is a multiplier you did not know you had turned on.

## When reasoning actually earns its price

This is not an argument against reasoning models. It is an argument against using them indiscriminately. Extended thinking earns its cost on a specific class of problem: hard, multi-step tasks where a wrong answer is expensive and the reasoning genuinely improves accuracy. At max thinking budget on Opus, a single request generating 10,000 thinking tokens plus 500 visible tokens costs around $0.26, compared with about $0.013 without thinking enabled ([Tian Pan on when chain-of-thought earns its cost](https://tianpan.co/blog/2026-04-20-reasoning-model-economics-chain-of-thought-cost)). That 20x premium is worth paying when the task is a complex legal analysis, a tricky debugging session, or a multi-constraint planning problem. It is pure waste on a sentiment label.

| Task type | Reasoning value | Right model |
| --- | --- | --- |
| Classification, extraction | None | Fast model, no thinking |
| Routine code completion | Low | Fast model or low effort |
| Multi-step debugging | High | Reasoning, medium effort |
| Complex planning / proofs | Highest | Reasoning, high effort |

The discipline is to match the thinking budget to the task, which means routing. Cheap, high-volume traffic goes to a fast model. The rare hard problem gets escalated to a reasoning model with an appropriate effort level. Sending everything to the reasoning model is the configuration that produces the $40,000 surprise, and routing is the fix, the same architecture I argued for in [smart routing for self-hosted AI cost savings](https://ravoid.com/blog/smart-routing-self-hosted-ai-cost-savings), alongside the deferral lever in [the 50% AI discount hiding behind async](https://ravoid.com/blog/batch-inference-cost-savings).

## Take back the lever

The fix is to stop letting the model decide how hard to think on your dime. Set the effort explicitly per call, default it low, and escalate only when the task warrants it:

```ts
// Default cheap; escalate only hard tasks to extended thinking
function pickConfig(task: Task) {
  if (task.complexity === "high") {
    return { model: "reasoning", reasoning_effort: "high" }; // pay for it
  }
  if (task.complexity === "medium") {
    return { model: "reasoning", reasoning_effort: "low" };  // bounded budget
  }
  return { model: "fast", reasoning_effort: "none" };        // most traffic
}
```

The structural point is that `reasoning_effort` is a cost dial, not a quality switch you leave on. Most production traffic should land on the last branch. Pair that with caching the stable prefix so the input side stays cheap too, and the reasoning premium shrinks to the small slice of traffic that actually benefits from it.

## A post-mortem on a model swap

A composite from the pattern, figures labeled illustrative: a support-automation team migrated their ticket-triage pipeline from a fast model to a reasoning model because evals showed a few points of accuracy improvement on the hardest tickets. They shipped it across all traffic with default adaptive thinking. The visible responses stayed about the same length, so monitoring looked healthy. The bill did not: monthly inference spend went from roughly $6,000 to about $52,000, an 8x jump, with no change in ticket volume. The forensic answer was thinking tokens, which made up the overwhelming majority of billed output but appeared nowhere in their logs. The metric that broke was billed-output-to-visible-output ratio, which had silently gone from near 1:1 to roughly 11:1. The fix was routing: 90% of tickets back to the fast model, reasoning reserved for the small hard tail, which recovered most of the savings while keeping the accuracy gain where it mattered.

## Decision guidance

The default behavior of a reasoning model is to reason, on every request, as much as it decides to. That default is the expense.

**The rule: If a task does not require multi-step reasoning to get right, then route it to a fast model with thinking disabled, and reserve reasoning for the tail that actually benefits.**

The honest exception is a workload where almost every request is genuinely hard, complex code generation, deep analysis, agentic planning, in which case reasoning across the board is correct and the premium is earning its keep. But that is a minority of production traffic. For typical mixed workloads, the volume is routine and the hard problems are the tail, so paying reasoning prices on everything means subsidizing thinking the task never needed.

## The bill reads what your logs cannot

Reasoning models did not make tokens more expensive. They added a third category of token that does the expensive work and then deletes itself from the response, so your cost moved to a place your observability does not look. The fix is not a cheaper model or a shorter prompt. It is treating the thinking budget as the first-class cost control it actually is, and routing so you only pay for deep thought when the answer depends on it.

The cheapest thinking token is the one a fast model never needed to generate. Decide when reasoning is worth it, because if you do not, the model will decide for you, and it does not see your invoice.

## FAQ

### Q: What makes reasoning models more expensive?

Thinking tokens. Before the visible answer, a reasoning model generates a hidden chain-of-thought that is billed at the output token rate but stripped from the response. A reply you read as 500 tokens can carry thousands of billed thinking tokens behind it. Since output tokens already cost two to six times more than input, the reasoning multiplier stacks on top of an already premium rate.

### Q: Are reasoning tokens billed even though I can't see them?

Yes. Both OpenAI reasoning models and Anthropic extended thinking bill the full internal reasoning as output tokens, even when the thinking is summarized or omitted from what you receive. This is the core reason reasoning cost is hard to diagnose: the tokens occupy billing and context-window space but never appear in your response or, often, your logs.

### Q: How much more do reasoning models cost?

It varies by task, from roughly 5x to over 25x the token count of a standard model on the same question. DeepSeek-R1 generated 4,000 thinking tokens on a simple coding question where GPT-4o used 150, a 26x gap. At max thinking budget, a single Opus request can cost around $0.26 versus $0.013 without thinking, a 20x premium that is only worth paying on genuinely hard tasks.

### Q: When is a reasoning model worth the cost?

When the task is hard, multi-step, and a wrong answer is expensive: complex debugging, multi-constraint planning, legal or financial analysis, or proofs. There, the extra thinking measurably improves accuracy and the premium earns its keep. For classification, extraction, routine completion, and other shallow tasks, a fast model gets the same answer for a fraction of the tokens.

### Q: How do I control reasoning model cost?

Set the reasoning effort explicitly instead of letting the model decide. Default most traffic to a fast model with thinking disabled, use a low or bounded thinking budget for medium tasks, and reserve high effort for the hard tail. Route by task complexity rather than sending everything to the reasoning model, and cache stable prompt prefixes to keep input cost down too.

### Q: Why is my reasoning model bill high when responses look normal?

Because response length reflects only visible output, not the thinking tokens behind it. The metric to watch is the ratio of billed output tokens to visible output tokens. A healthy fast model runs near 1:1, while a reasoning model on default settings can run 10:1 or higher. A normal-looking response with a high bill almost always means a large hidden thinking budget.

### Q: Does adaptive reasoning save money automatically?

Not reliably. Adaptive reasoning lets the model decide how much to think, which means your largest cost lever is set by the model, not by you. It may under-think hard problems or over-think easy ones. Explicit per-task effort levels give you predictable cost, so treat adaptive mode as a starting point to measure, not a cost-control strategy.

## Next Read

Reasoning effort is one dial on a larger control panel of AI spend. For how the same per-token economics bend SaaS margins, read [token economics and how AI SaaS pricing bleeds money](https://ravoid.com/blog/token-economics-ai-saas-pricing-bleeding-money).

---

### Sources & Further Reading

- [Tian Pan: Thinking Tokens Are Invisible in Your Logs and Loud on Your Bill](https://tianpan.co/blog/2026-05-14-thinking-tokens-observability-billing-gap)
- [Spheron: Reduce Reasoning Model Inference Costs](https://www.spheron.network/blog/reasoning-model-inference-cost-gpu-optimization/)
- [CodeAnt: Why Output & Reasoning Tokens Inflate LLM Costs](https://www.codeant.ai/blogs/input-vs-output-vs-reasoning-tokens-cost)
- [Cerebras: The Economics of AI Reasoning](https://www.cerebras.ai/blog/the-economics-of-ai-reasoning)

---

_Last updated: July 16, 2026_
