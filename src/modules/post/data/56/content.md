# The LLM Gateway You Built Is Now a Liability

_By Framesta Fernando · Engineering Manager & Technical Architect · 11 min read · Published June 27, 2026_

> **TL;DR:** The LLM gateway build vs buy decision looks obvious early: a thin proxy you stand up in an afternoon. Then it accretes routing, caching, rate limits, key management, and audit logging until it is an unowned internal platform on someone's on-call rotation. Self-host below a few million tokens a month, but price the operational tax, not just the per-token fee.

Predict the arc of every self-built LLM gateway and you will be right almost every time. It starts as forty lines wrapping two providers so you can fail over when one rate-limits you. Within a year it owns routing logic, a Redis cache, per-team budgets, key rotation, and an audit log, and it is the single point of failure in front of every AI feature you ship. Nobody decided to build a platform. You built one byte at a time, and now it has an on-call rotation.

The build-versus-buy call feels trivial when the thing is forty lines. It stops being trivial the moment that proxy sits on the critical path of your entire product and the person who wrote it has changed teams.

## The decision everyone makes at the wrong size

The mental error is judging the gateway by what it does on day one rather than what it inevitably becomes. On day one it routes requests and maybe retries. Cheap, obvious, build it. So teams reason from the day-one scope and conclude self-hosting is a clear win, which it is, for the day-one scope.

The scope does not hold still. A production LLM gateway grows a predictable set of responsibilities: unified API across providers, cost tracking, rate limiting, provider failover, prompt caching, key management, and audit logs. That is the standard feature surface of the category now ([per markaicode's LiteLLM comparison](https://markaicode.com/vs/litellm-vs-openrouter/)). Every one of those features arrives as a reasonable ticket, and each one quietly converts your afternoon proxy into infrastructure you must operate, upgrade, and wake up for.

## The afternoon proxy, costed honestly

Run the real numbers and the per-token comparison is the part that misleads. The following is illustrative at observed market rates. A managed gateway might charge around $0.02 per 1,000 tokens of overhead, while a self-hosted proxy runs on roughly $80 a month of infrastructure ([per markaicode's LiteLLM stack analysis](https://markaicode.com/best/best-litellm-stacks/)).

```
At 4,000,000 tokens / month:
  Managed:    4,000 (1K-token units) x $0.02 = $80 / month
  Self-host:  ~$80 / month infrastructure
  -> per-token break-even sits near 4M tokens/month
```

On that math, self-hosting looks free above 4M tokens. But the per-token line is the decoy. The real cost of self-hosting is the operational tax the comparison leaves out: the engineer who patches the proxy, the on-call who gets paged when it falls over at 2 a.m., the Redis and Postgres it now depends on, the upgrades when a provider changes its API. Once you count engineering time, on-call, upgrades, Redis, Postgres, and monitoring, a hosted gateway often has the lower total cost for small and mid-sized teams ([per EdenAI's 2026 build-or-buy guide](https://www.edenai.co/post/litellm-vs-hosted-ai-gateway-the-2026-build-or-buy-guide)). The per-token fee is visible and small; the operational tax is invisible and large, which is exactly backwards from how teams weigh it. That same hidden-operational-cost pattern is the one I worked through in [the build vs buy SaaS decision framework](https://ravoid.com/blog/build-vs-buy-saas-decision-framework).

The post-mortem version: a team self-hosted a gateway to "save on per-request fees." It worked for a year. Then the original author left, a provider deprecated an API version, and the proxy started silently dropping failovers. Illustratively, a four-hour outage across every AI feature traced back to an unpatched dependency in a service no current engineer fully understood. The per-token savings were real. They were also a fraction of the cost of that one outage.

## The proxy that became a platform

The reframe that decides this correctly: a gateway is not a feature you build once, it is a platform you operate forever, and platforms have a carrying cost that does not show up in a per-token quote. The question is never "can we build a proxy," because you obviously can. It is "do we want to own a multi-provider routing platform as a permanent operational commitment," and most teams answer the first question while believing they answered the second.

What tips a thin proxy into a platform is the accretion of cross-cutting concerns, each individually small. Routing becomes routing-plus-failover. Failover needs health checks. Health checks need monitoring. Cost tracking needs a database. Budgets need auth. Auth needs an audit log. None of these is hard in isolation, and all of them together are a product your team now maintains instead of the product your team is supposed to be building. The opportunity cost is the real bill: every hour on the gateway is an hour not on the thing customers pay for. The routing intelligence itself, the part that genuinely creates value, is the smart model selection I covered in [smart routing for self-hosted AI cost savings](https://ravoid.com/blog/smart-routing-self-hosted-ai-cost-savings), and that logic is worth owning. The plumbing around it usually is not.

## A framework for the actual decision

Decide on operational commitment and data sovereignty, not on the per-token fee:

| Option | What you gain | What you pay |
| --- | --- | --- |
| Self-host (LiteLLM) | Full control, no per-token markup, data stays in-house | You operate, patch, and page for it |
| Managed gateway | Zero ops, dashboards, upgrades handled | Per-token markup, third-party in the path |
| Provider SDK direct | Simplest, no extra layer | No failover, no unified cost view |

A minimal self-hosted config is genuinely small, which is exactly what makes the trap seductive:

```yaml
# litellm config: looks trivial on day one
model_list:
  - model_name: primary
    litellm_params: { model: anthropic/claude-sonnet }
  - model_name: fallback
    litellm_params: { model: openai/gpt-4.1 }
router_settings:
  routing_strategy: latency-based
  fallbacks: [{ primary: [fallback] }]
# What is NOT in this file: the Redis, the Postgres, the dashboards,
# the upgrades, the on-call. That is the part you are actually buying.
```

If you self-host, own it deliberately: assign a maintainer, put it on monitoring, and budget the upgrade time. If you are an AWS-committed shop, the managed-versus-native tradeoff overlaps with the platform-lock-in question I covered in [AWS Bedrock vs Azure OpenAI](https://ravoid.com/blog/aws-bedrock-vs-azure-openai-2026). The honest test is whether you would staff this proxy as a named service with a runbook and an owner. If the answer is no, you are not really choosing to build, you are choosing to let it become nobody's job, which is the most expensive outcome in the table above.

## Decision guidance

The trap is letting the day-one simplicity decide a multi-year operational commitment. The forty-line proxy is real, and so is the platform it becomes.

**The rule: If your LLM gateway needs failover, cost tracking, rate limiting, and audit logging, then it is a platform, not a proxy, and you either staff it like one or buy it, because an unowned critical-path platform is the most expensive option of all.**

Below a few million tokens a month, and especially before you have a dedicated platform engineer, buy the managed gateway and spend your scarce engineering hours on the product. Self-host when you have genuine data-sovereignty needs or volume high enough that the markup exceeds a staffed maintainer, and when you do, give it an owner and a runbook on day one, not after the first outage.

## The cheapest layer to misjudge

The LLM gateway is the easiest piece of AI infrastructure to underestimate, precisely because the first version is so easy to build. The cost was never the code. It was the years of operating a critical-path platform that the code quietly turned into.

Build the proxy if you must. Just know you are signing up to run a platform, and price the rotation, not the tokens.

## FAQ

### Q: Should I build or buy an LLM gateway?

Buy it below a few million tokens a month or before you have a dedicated platform engineer, because the per-token markup is smaller than the cost of operating the proxy. Build it when you have real data-sovereignty requirements or volume high enough that the markup exceeds a staffed maintainer. The decision hinges on operational commitment and data control, not the per-token fee everyone compares first.

### Q: Is LiteLLM cheaper than a managed AI gateway?

On per-token cost, yes, since self-hosted LiteLLM has no markup and runs on modest infrastructure. On total cost, often no for small and mid-sized teams, once you include engineering time, on-call, upgrades, and the Redis, Postgres, and monitoring it depends on. The headline infrastructure cost of around $80 a month omits the recurring operational tax that usually dominates the real total.

### Q: What does an LLM gateway actually do?

It sits between your application and model providers, offering a unified API, request routing, provider failover, cost tracking, rate limiting, prompt caching, key management, and audit logging. Early on it may only route and retry, but production gateways accrete the full feature set. That accretion is what turns a thin proxy into an internal platform with real operational weight.

### Q: When does a self-hosted gateway become a liability?

When it lands on the critical path of every AI feature and no one owns it. The common failure is the original author leaving, a provider deprecating an API, and failovers silently breaking until an outage. A gateway with failover, budgets, and audit logging is infrastructure: without an assigned maintainer, monitoring, and an upgrade budget, it is an unowned single point of failure.

### Q: How do I calculate the break-even for a self-hosted gateway?

Start with the per-token comparison: managed markup times your monthly token volume versus self-hosted infrastructure cost, which crosses near a few million tokens a month. Then add the operational tax to the self-hosted side: a fraction of an engineer's time for maintenance and on-call, upgrades, and dependency operations. The true break-even is much higher than the per-token math alone suggests.

### Q: Can I just call provider SDKs directly and skip the gateway?

For a single provider and simple needs, yes, and it is the lowest-overhead option. You lose unified cost visibility, automatic failover across providers, and centralized rate limiting, so it stops being viable once you run multiple providers or need spend governance. Many teams start with direct SDK calls and adopt a gateway only when failover or cost tracking becomes a real requirement.

## Next Read

The part of a gateway genuinely worth owning is the routing intelligence, not the plumbing: see [smart routing for self-hosted AI cost savings](https://ravoid.com/blog/smart-routing-self-hosted-ai-cost-savings).

---

### Sources & Further Reading

- [EdenAI: LiteLLM vs Hosted AI Gateway, the 2026 Build-or-Buy Guide](https://www.edenai.co/post/litellm-vs-hosted-ai-gateway-the-2026-build-or-buy-guide)
- [markaicode: LiteLLM Production Stacks, Cost & Latency](https://markaicode.com/best/best-litellm-stacks/)
- [Zuplo: Best AI Gateways in 2026](https://zuplo.com/learning-center/best-ai-gateway-buyers-guide)

---

_Last updated: June 27, 2026_
