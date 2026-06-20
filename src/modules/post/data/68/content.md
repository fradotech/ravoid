# Bedrock Is Easy to Enter, Expensive to Leave

_By Framesta Fernando · Engineering Manager & Technical Architect · 11 min read · Published July 9, 2026_

> **TL;DR:** AI platform lock-in cost lives in the exit, not the entry. Managed platforms like Bedrock and Vertex make onboarding frictionless, then your prompts, fine-tunes, evaluation data, and use of proprietary features all become platform-specific. Leaving is a re-engineering project, not a config change. Buy portability with a thin abstraction up front, while it is cheap.

Try this dare with your AI platform: estimate, honestly, how many engineer-weeks it would take to move your production workload to a different provider next quarter. Not "could we," but how long and how much. If the number makes you wince, you are already locked in, and you did not sign anything to get there. You accreted it, one proprietary convenience at a time, because each one was the path of least resistance on the day you reached for it.

Managed AI platforms are designed to be effortless to enter. That is the product. The cost they do not put on the landing page is that the same conveniences that made entry frictionless make exit expensive, and you only discover the exit price the quarter you have a reason to leave.

## The price that is not on the entry path

The mental model that creates the trap is judging a platform by how easy it is to start, because that is what you experience first and what the marketing optimizes for. Bedrock or Vertex onboarding is genuinely smooth: managed models, built-in retrieval, guardrails, an SDK that works in an afternoon. Every signal on the way in says "this is easy," so you reasonably conclude the platform is low-commitment.

Low-commitment to enter is not the same as low-commitment to stay, and the asymmetry is the whole game. As you build, you accumulate platform-specific assets: prompts tuned to that provider's models, fine-tunes that exist only there, evaluation suites wired to its APIs, and dependencies on proprietary features like managed knowledge bases and guardrails that have no equivalent elsewhere. None of this is portable, and none of it announces itself as lock-in while you are building. It just looks like using the platform well. The same convenience-becomes-commitment pattern shows up in the gateway layer I covered in [the LLM gateway you built is now a liability](https://ravoid.com/blog/llm-gateway-build-vs-buy).

## Costing the exit nobody estimated

Put numbers on leaving. The following is illustrative. Say you want to move a mature workload off a managed platform, and you have accumulated the normal set of platform-specific assets.

```
Exit work (illustrative engineer-weeks):
  re-test + re-tune ~200 prompts on the new provider's models : 3-4 wk
  retrain 5 fine-tunes (weights do not transfer)              : 2-3 wk
  rebuild proprietary integrations (knowledge base, guardrails): 2-3 wk
  re-run full eval suite to confirm no regression            : 1-2 wk
  --------------------------------------------------------------------
  total                                                       : ~8-12 weeks
```

Eight to twelve engineer-weeks, not because the new platform is hard, but because every asset was shaped to the old one. Prompts are model-specific, so they must be re-tuned and re-evaluated against the new models. Fine-tune weights do not transfer between providers, so they are full rebuilds, the same perishable-asset problem I described in [your fine-tuned model expires in 90 days](https://ravoid.com/blog/fine-tuning-deprecation). And anything you built on a proprietary feature has no drop-in replacement, so it is a from-scratch reimplementation. That is the bill the entry experience never mentioned, and it is exactly the kind of hidden vendor cost I mapped in [the hidden cost of multi-cloud versus a single vendor](https://ravoid.com/blog/multi-cloud-vs-single-vendor-hidden-cost).

The post-mortem version: a team built deeply on one platform's managed retrieval and guardrail features because they shipped fast. A year later a pricing change and a capability gap made a competitor clearly better, but the migration estimate came back at, illustratively, a full quarter of an engineer's time, dominated by reimplementing the proprietary retrieval layer and re-tuning every prompt. They stayed on the worse platform, not because it was better, but because the exit cost exceeded the benefit of leaving. That is lock-in working exactly as designed.

## Portability is the asset you have to buy early

The reframe that protects you: the defensible position is not picking the right platform, it is keeping the ability to leave it, and that portability is an asset you buy cheaply at the start or expensively never. Lock-in is not a thing the vendor does to you, it is the default outcome of using the platform naturally, so staying portable requires deliberate effort against the path of least resistance.

The mechanism is a thin abstraction between your application and the provider, so your code depends on your interface, not theirs. Route through your own gateway or adapter rather than calling the provider SDK everywhere, keep prompts and eval data in a provider-neutral store you own, and be deliberate about adopting proprietary features, using them only where the value clearly exceeds the portability you give up. This is the genuinely valuable core of the gateway decision in [the LLM gateway you built is now a liability](https://ravoid.com/blog/llm-gateway-build-vs-buy): the abstraction is worth owning precisely because it preserves the exit. The same logic favors keeping an open-weight option viable, the sovereignty benefit in [OpenAI versus self-hosted LLM cost](https://ravoid.com/blog/openai-vs-self-hosted-llm-cost).

A thin adapter is the difference between a config change and a quarter-long project:

```ts
// Depend on your interface, not the provider's. Swapping providers becomes
// a new adapter, not a rewrite of every call site.
interface LLMProvider {
  complete(prompt: string, opts: CompletionOpts): Promise<string>;
}

class BedrockProvider implements LLMProvider { /* ... */ }
class VertexProvider implements LLMProvider { /* ... */ }

// Proprietary features (managed RAG, guardrails) used directly here are the
// parts that will NOT port. Adopt them only where the value beats the lock-in.
```

## A framework for staying portable

Weigh each platform dependency by how hard it is to leave behind:

| Dependency | Portability | Guidance |
| --- | --- | --- |
| Core model calls | High via adapter | Always route through your interface |
| Prompts and eval data | High if owned | Store provider-neutral, version them |
| Fine-tunes | Low (rebuild) | Keep the training pipeline, not the weights |
| Proprietary RAG / guardrails | Very low | Adopt only where value clearly wins |

The decision per proprietary feature is explicit: does the value it adds today exceed the exit cost it creates tomorrow. For commodity capability the answer is usually no, build portable. For genuinely differentiated capability the answer can be yes, but make it a decision, the same diligence as [how to compare SaaS tools objectively](https://ravoid.com/blog/how-to-compare-saas-tools-objectively).

## Decision guidance

The trap is letting frictionless onboarding lull you into accreting platform-specific assets, until the exit cost quietly exceeds your ability to act on a better option.

**The rule: If adopting a proprietary platform feature would make leaving the platform cost more than a few engineer-weeks, then put an abstraction in front of it or skip it, because lock-in you cannot afford to exit removes your negotiating power on price and capability.**

Buy portability early with a thin adapter, owned prompts and eval data, and a reproducible training pipeline. Reserve proprietary features for where they clearly out-earn their exit cost. The goal is not to avoid managed platforms, which are genuinely productive, it is to keep the door you walked in through unlocked.

## The door that only opens one way

Managed AI platforms are excellent products, and the ease of entry is real value, not a trick. The asymmetry is simply that nobody is incentivized to make leaving as easy as joining, so unless you build for the exit, you will not have one. The teams stuck on a worse platform did not choose it. They chose convenience repeatedly and discovered the accumulated bill only when they wanted out.

Keep the exit cheap while it is cheap to keep. The quarter you need to leave is the quarter it is too late to start.

## FAQ

### Q: What is AI platform lock-in and where does it hide?

It is the accumulated dependence on a provider's specific models, prompts, fine-tunes, evaluation setup, and proprietary features that makes switching expensive. It hides in the exit rather than the entry, because onboarding is frictionless by design while the platform-specific assets you build accumulate silently. You typically only discover the lock-in cost the quarter you have a concrete reason to consider leaving.

### Q: Why is leaving a managed AI platform so expensive?

Because almost nothing ports cleanly. Prompts are tuned to specific models and must be re-tested and re-tuned, fine-tune weights do not transfer between providers and require full rebuilds, and proprietary features like managed retrieval and guardrails have no drop-in equivalents, so they are reimplemented from scratch. The sum is commonly several engineer-weeks to a full quarter, dominated by re-engineering rather than the new platform's difficulty.

### Q: How do I avoid AI vendor lock-in?

Buy portability early. Route model calls through your own interface or gateway rather than the provider SDK directly, store prompts and evaluation data in a provider-neutral form you own, keep a reproducible training pipeline rather than depending on hosted fine-tune weights, and adopt proprietary features only where their value clearly exceeds the exit cost they create. The abstraction is cheap up front and expensive to retrofit.

### Q: Should I avoid proprietary features like managed RAG and guardrails?

Not entirely, but adopt them deliberately. They are productive and sometimes genuinely differentiated, but they are the least portable parts of a platform, so each one raises your exit cost. The test is whether the value a feature adds today exceeds the migration cost it creates tomorrow. For commodity capability, build it portably; for clearly superior capability, use it as a conscious tradeoff.

### Q: Do fine-tunes transfer between AI providers?

No. Fine-tuned weights are specific to a provider's base model and infrastructure and do not move to another provider. Migrating means retraining from your data on the new platform's models and re-evaluating the result. This is why the durable asset is your training data and pipeline, not the fine-tuned weights themselves, and why fine-tunes are one of the higher-cost items in any platform migration.

### Q: Is multi-provider redundancy worth the added complexity?

It depends on how much your negotiating power and resilience are worth to you. A portability abstraction that lets you switch providers, even if you normally run one, preserves pricing power and protects against a single provider's outage or capability gap. Full active multi-provider operation adds real complexity, so most teams build the abstraction for optionality rather than running every provider simultaneously.

## Next Read

The abstraction layer that preserves your exit is the genuinely valuable core of a gateway decision: see [the LLM gateway you built is now a liability](https://ravoid.com/blog/llm-gateway-build-vs-buy).

---

### Sources & Further Reading

- [AWS Bedrock documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html)
- [Zuplo: Best AI Gateways in 2026](https://zuplo.com/learning-center/best-ai-gateway-buyers-guide)
- [EdenAI: LiteLLM vs Hosted AI Gateway, the 2026 Build-or-Buy Guide](https://www.edenai.co/post/litellm-vs-hosted-ai-gateway-the-2026-build-or-buy-guide)

---

_Last updated: July 9, 2026_
