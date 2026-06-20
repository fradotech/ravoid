# One Poisoned Agent Infects the Whole Chain

_By Framesta Fernando · Engineering Manager & Technical Architect · 12 min read · Published July 29, 2026_

> **TL;DR:** Multi-agent security fails because agents trust each other's outputs the way they trust a system prompt. A single compromised agent can relay malicious instructions through every collaborator it talks to, escalating privilege along the way. Defending only the user-facing boundary leaves every internal agent-to-agent boundary open, which is most of them.

You can secure every agent in your system and still have an insecure system. That is the uncomfortable finding from 2026's multi-agent research, and it breaks the mental model most teams brought over from single-agent deployments. You hardened the user-facing agent, added input filtering, scoped its tools. Then you wired it to a planner, which talks to a researcher, which calls a database agent, which has real credentials. Each link looked fine in isolation. The attack does not target a link. It targets the trust between them.

Researchers named the pattern bluntly: inject one agent, own them all, where one compromised agent cascades through every trusted collaborator ([CovertSwarm's analysis](https://www.covertswarm.com/post/multi-agent-ai-security-risks)). OWASP now tracks this as ASI08, cascading failures, in the Top 10 for Agentic Applications 2026 ([BeyondScale's blast-radius guide](https://beyondscale.tech/blog/agentic-ai-blast-radius-containment-guide)). The architecture is scaling fast and the security model is not, because the model teams apply to single agents simply does not extend to systems where agents communicate with, delegate to, and depend on each other ([WorkOS on multi-agent security](https://workos.com/blog/ai-agent-delegation-multi-agent-security)).

## Agents trust each other like system prompts

The root flaw is that an agent cannot tell the difference between an instruction from its operator and an instruction relayed by a peer agent. To the model, the message from the planner agent arrives as the same kind of text as its own system prompt, carrying the same authority. So when a compromised upstream agent passes along a poisoned instruction, the downstream agent treats it as legitimate direction and acts on it with whatever privileges it holds.

That is the confused-deputy problem, the classic access-control bug where a program with privileges is tricked into misusing them, scaled across an agent chain: an outer agent acting on a user's behalf can be manipulated into instructing a more privileged inner agent to perform actions neither the user nor the outer agent intended ([Augment Code's multi-agent security guide](https://www.augmentcode.com/guides/multi-agent-ai-security-risks-compliance-fixes)). The privileged agent never sees the attacker. It sees a trusted peer asking it to do something, and it complies. Prompt-level defenses at the privileged layer do not help, because the malicious instruction arrives through the legitimate inter-agent channel, not the user input the filter is watching.

## It propagates like a virus

The most alarming version is not a single relay but self-replication. Researchers demonstrated Prompt Infection, an attack where malicious prompts copy themselves across interconnected agents, behaving much like a computer virus and propagating silently through the system while enabling data theft and system-wide disruption ([the LLM-to-LLM injection paper](https://arxiv.org/html/2410.07283v1)). The injected instruction does not just execute once. It instructs each agent it reaches to pass the same payload to the next, turning a single point of compromise into a spreading infection.

Second-order injection makes this reachable by attackers with no direct access at all. The malicious instruction is stored somewhere a low-privilege agent will later read (a database record, a web page, a tool response) and when that agent relays its work to a higher-privilege agent, the payload escalates. The attacker controls a low-privilege agent's inputs and uses it as a relay to a high-privilege agent ([Aquilax on second-order injection](https://aquilax.ai/blog/second-order-prompt-injection-agents)). Standard input validation at the privileged layer is useless, because the privileged agent's input came from a trusted teammate, not the open internet.

## Count the boundaries you are not defending

The single-agent security model defends one boundary: the line between untrusted user input and the agent. Multi-agent systems have many more, and each one is a potential injection relay. Work the arithmetic on a modest six-agent system where agents can hand work to each other.

```
External boundaries (user -> system):        1
Internal agent-to-agent boundaries (fully connected):
  6 agents -> 6 x 5 / 2 = 15 trust boundaries
Total boundaries:                            16
Defended by single-agent thinking:           1  (the user-facing one)
Left unguarded:                              15
```

Fifteen internal boundaries, each a place where one agent accepts instruction from another with no verification that the instruction is in scope. And those boundaries are not theoretical weak points. Testing a six-agent production-representative system found 67% of agents vulnerable to at least one scope violation even with system-prompt-level guardrails, and indirect injection via tool outputs succeeded in 43% of attempts ([the multi-agent threat-model study](https://openreview.net/forum?id=2YLC2ciEar)). Four of six agents exploitable, and a better-than-coin-flip chance of relaying an injection through tool output, against a system whose individual agents all passed review. The single defended boundary is the wrong one to be proud of.

## The anchor: there is no internal trust boundary, and there should be

The deepest issue is architectural. Multi-agent systems are usually built on implicit trust: agents assume their collaborators are honest because they are part of the same system. That assumption is the vulnerability. In a network, you would never let internal services skip authentication just because they are inside the perimeter, that is exactly the flat-network mistake that lets one breached host own a data center. Multi-agent systems reproduce that mistake by default, granting every agent the standing trust of every other.

The fix is the same one networking learned: zero trust between components. Multi-agent security requires architectural controls at every inter-agent communication boundary, because prompt-level defenses alone fail to prevent the propagation of injections, data leakage, and privilege escalation across agent chains ([Augment Code](https://www.augmentcode.com/guides/multi-agent-ai-security-risks-compliance-fixes)). An agent receiving an instruction from a peer must verify that the instruction is within the scope the user actually authorized, not just that it came from a known teammate. This is the inter-agent version of the handoff fragility I described in [the multi-agent orchestration handoff problem](https://ravoid.com/blog/multi-agent-orchestration-handoff-problem): the seams between agents are where both correctness and security break. The single-agent version of the breach, untrusted text reaching a privileged tool, is [prompt injection becoming a remote shell](https://ravoid.com/blog/prompt-injection-rce).

| Layer | Single-agent defense | What multi-agent adds |
| --- | --- | --- |
| User input | Filter, sanitize | Still needed, not sufficient |
| Tool calls | Allowlist, sandbox | Per-agent, not system-wide |
| Inter-agent messages | (none) | Capability scoping, verification |
| Privilege | Per-agent grant | Must not propagate via delegation |

## Scope the capability, not the conversation

The control that actually contains this is capability scoping carried through delegation. Instead of an agent trusting any instruction from a peer, every delegated task carries a scoped authorization envelope that says what the user permitted, and the receiving agent enforces it regardless of who is asking:

```python
# A privileged agent verifies the SCOPE of a delegated task, not its sender
def handle_delegated_task(task, envelope):
    # envelope is signed, task-scoped, issued from the user's original grant
    if task.action not in envelope.allowed_actions:
        raise ScopeViolation(task.action)         # peer cannot exceed user grant
    if task.resource not in envelope.allowed_resources:
        raise ScopeViolation(task.resource)
    if envelope.depth > MAX_DELEGATION_DEPTH:
        raise PropagationLimit()                  # cap chain length
    return execute(task)                          # only within authorized scope
```

The point is that the database agent will not dump a table just because the planner asked, if dumping that table was never in the user's authorization envelope. The instruction's origin stops mattering, only its scope does, which is exactly what defeats the confused deputy. Add a delegation-depth cap to bound propagation chain length, and you turn a system-wide infection into a contained, blocked action. This is the permission-side complement to the spend controls I argued for in [budget enforcement for AI agents](https://ravoid.com/blog/ai-agent-budget-enforcement).

## A post-mortem on a chain that trusted itself

A composite from the documented pattern, with figures labeled illustrative: a company built a research-and-action assistant as four agents, a coordinator, a web-research agent, a summarizer, and a CRM agent with write access to customer records. The web-research agent fetched a page that contained a hidden instruction telling whoever read it to update the CRM owner field for a set of accounts. The research agent relayed the page content to the summarizer, which passed structured output to the coordinator, which delegated a CRM update to the privileged agent. No agent was individually broken, each did its job. The injection rode the trusted handoffs straight to the one agent with write access. The metric that broke was not an alert, it was an audit discovering roughly 200 customer records silently modified, traced back through the chain to a single fetched web page. The CRM agent had verified the request came from the coordinator, a trusted peer, and never checked whether modifying ownership was in the user's original scope. It was not.

## Framework: contain the cascade

| Control | What it stops | When it is not enough |
| --- | --- | --- |
| Input filter (entry agent) | Direct first-order injection | Second-order / relayed injection |
| Per-agent tool allowlist | Out-of-scope tool calls | Confused-deputy via peer |
| Scoped delegation envelopes | Privilege escalation across agents | Initially-poisoned envelopes |
| Delegation-depth limit | Runaway propagation chains | Short but high-impact chains |
| Inter-agent monitoring | Detecting cascade in progress | Prevention (it is reactive) |

Layer from the inside out: scope every delegated capability so privilege cannot propagate, cap delegation depth so an infection cannot spread far, monitor inter-agent traffic for cascade signatures, and keep the entry filter as the outermost, not the only, layer. No single control holds, but together they turn a self-replicating infection into a blocked, observable event at the first scope check.

## Decision guidance

The error is securing each agent and assuming the composition is secure, when the composition introduces the exact boundaries you did not defend.

**The rule: If a privileged agent accepts tasks delegated from other agents, then it must verify each task against the user's original authorization scope, not the identity of the agent that sent it.**

The honest exception is a fully isolated single-agent system with no delegation, where there are no inter-agent boundaries to defend and single-agent hardening genuinely suffices. The moment you add a second agent that can instruct the first, you have created a trust boundary that the system-prompt filter does not cover, and the question is no longer whether each agent is secure but whether a compromise of any one of them can reach the others. In almost every real multi-agent system, the honest answer today is yes.

## The perimeter is inside the system

Multi-agent architectures moved the attack surface to a place single-agent security never looked: the trust between agents. You can filter every user input, sandbox every tool, and scope every individual agent, and a single poisoned web page can still ride the trusted handoffs to the one agent that can do damage, because no agent was ever taught to distrust a teammate. The infection does not break in. It is invited, one trusted relay at a time.

The question for any multi-agent system is not how secure each agent is. It is what happens when one of them is compromised, because in a system built on implicit trust, the answer is that all of them are. Scope the capability, cap the chain, and distrust the peer, or build a perimeter that ends at the first agent and protects nothing behind it.

## FAQ

### Q: What makes multi-agent systems harder to secure than single agents?

Agents trust each other's outputs the way they trust their own system prompt, so a message from a peer agent carries implicit authority. This creates many internal trust boundaries that single-agent defenses never address. Securing each agent individually does not secure the composition, because the attack targets the trust between agents, relaying malicious instructions through legitimate channels that input filters do not watch.

### Q: What is agent cascading injection?

It is an attack where malicious input or a tool exploit injected at one agent leads to cascading compromises across other agents that trust its outputs. OWASP tracks it as ASI08, cascading failures, in the 2026 Top 10 for Agentic Applications. A single compromised agent propagates the attack downstream, amplifying its effect through every collaborator that accepts its instructions as legitimate.

### Q: What is the confused deputy problem in multi-agent AI?

It is a classic access-control bug, a privileged program tricked into misusing its privileges, scaled across agent chains. An outer agent acting for a user is manipulated into instructing a more privileged inner agent to take actions neither the user nor the outer agent intended. The privileged agent never sees the attacker, only a trusted peer's request, so it complies. Input validation at the privileged layer does not catch it.

### Q: Can a prompt injection spread between agents on its own?

Yes. Researchers demonstrated Prompt Infection, where a malicious prompt instructs each agent it reaches to pass the same payload onward, self-replicating across interconnected agents like a computer virus. It propagates silently, enabling data theft and system-wide disruption. This turns a single point of compromise into a spreading infection, which is why delegation-depth limits and inter-agent verification matter.

### Q: How do I secure communication between AI agents?

Apply zero trust between agents. Carry a signed, task-scoped authorization envelope with each delegated task that encodes what the user actually permitted, and have every receiving agent verify the task against that scope regardless of which peer sent it. Add a delegation-depth cap to bound propagation, and monitor inter-agent traffic. Prompt-level filters at the entry point are necessary but not sufficient on their own.

### Q: Does securing each agent individually make the system secure?

No. A six-agent test system found 67% of agents vulnerable to at least one scope violation even with system-prompt guardrails, and indirect injection via tool outputs succeeded 43% of the time, despite each agent passing individual review. The vulnerability lives in the trust between agents, not within them, so composition introduces risks that per-agent hardening does not address.

### Q: What is second-order prompt injection in agent systems?

It removes the attacker from the direct conversation. The malicious instruction is stored where a low-privilege agent will later read it, a database record, web page, or tool response, and executes when that agent relays its work to a higher-privilege agent. The attacker controls a low-privilege agent's inputs and uses it as a relay to escalate privilege, defeating input validation at the privileged layer entirely.

## Next Read

Inter-agent trust is where both security and correctness break. For how the same handoffs fail functionally, not just adversarially, read [the multi-agent orchestration handoff problem](https://ravoid.com/blog/multi-agent-orchestration-handoff-problem).

---

### Sources & Further Reading

- [CovertSwarm: Inject one agent, own them all](https://www.covertswarm.com/post/multi-agent-ai-security-risks)
- [Augment Code: Multi-Agent AI Security Risks and Fixes](https://www.augmentcode.com/guides/multi-agent-ai-security-risks-compliance-fixes)
- [Aquilax: Second-Order Prompt Injection in Agent Chains](https://aquilax.ai/blog/second-order-prompt-injection-agents)
- [LLM-to-LLM Prompt Injection / Prompt Infection (arXiv)](https://arxiv.org/html/2410.07283v1)

---

_Last updated: July 29, 2026_
