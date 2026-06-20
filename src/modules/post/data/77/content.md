# Real-Time Features Have a Memory Wall Too

_By Framesta Fernando · Engineering Manager & Technical Architect · 11 min read · Published July 18, 2026_

> **TL;DR:** WebSocket cost at scale is driven by two things request-based intuition ignores: held connections that consume memory and billing even while idle, and message fan-out that grows the cost of every message with the size of the audience. Plan capacity around concurrent connections and fan-out, not request rate.

The headline number for real-time infrastructure is a trap. Search "how many WebSocket connections can one server handle" and you get a confident answer: a properly tuned Linux box holds 500,000-plus idle connections ([WebSocket.org's connection-limits guide](https://websocket.org/guides/connection-limits/)). That number is correct and almost useless, because the same guide immediately calls it the wrong question. What breaks production is not how many connections you can hold at rest. It is what those connections cost while they sit there, and what happens to your bill when each message has to reach all of them.

Real-time features feel like a small addition: flip on a live cursor, a presence indicator, a chat feed. Under the hood you have signed up for a different cost model than the rest of your app. HTTP is request-response, so you pay per request and idle clients cost nothing. A WebSocket is a persistent, two-way connection that stays open whether anyone is talking or not, and that single property rewrites your capacity math. You are no longer paying for activity. You are paying for presence.

## The connection is a held resource, not a request

Every standard backend instinct is built around requests. You autoscale on request rate, you cache to cut request cost, you reason about traffic as a flow of discrete calls. Persistent connections break all of it because the connection itself is the unit of cost, and it persists. Each WebSocket consumes memory, a file descriptor, and other server resources for its entire lifetime, and as concurrent connections climb, the pressure lands on networking, CPU, and memory ([Ably on the challenge of scaling WebSockets](https://www-stats.ably.com/topic/the-challenge-of-scaling-websockets)).

That cost is real even when nothing happens. The practical per-connection memory figure, after the buffers and bookkeeping that real traffic forces, lands around 27 KB per idle connection ([this analysis of one million connections](https://medium.com/@guptaarman910/why-1-million-websocket-connections-is-harder-than-it-looks-1200c29ebe72)). Work the wall directly:

```
1,000,000 idle connections x 27 KB = 27,000,000 KB
27,000,000 KB / 1,024 / 1,024       = ~25.7 GB RAM
```

Roughly 26 GB of memory to hold a million connections that are doing nothing. The managed-service equivalent is even more explicit: Ably bills a connection-minute for every minute a client maintains an open connection regardless of activity, and clients that stay connected but idle still accrue connection-minutes ([Ably's pub/sub pricing](https://ably.com/docs/pub-sub/pricing)). AWS API Gateway prices WebSocket APIs at $0.25 per million connection-minutes on top of message charges ([CostGoat's API Gateway guide](https://costgoat.com/pricing/amazon-api-gateway)). Whether you self-host or buy, the meter runs on presence. This is the same [memory-wall logic that caps GPU serving](https://ravoid.com/blog/kv-cache-cost), just moved from the inference layer to the connection layer.

## The anchor: fan-out is the leak that scales superlinearly

The held-connection cost is linear and at least predictable. The part that surprises teams is fan-out, and it is where real-time economics turn nonlinear. In a pub/sub model, one published message is not one billable message. It is one publish plus one delivery for every subscriber. Ably counts it exactly this way: if a user publishes a message and 10 users receive it, that is 11 messages ([Ably's pricing definition](https://ably.com/docs/platform/pricing.md)). The cost of a single message is a function of how many people are listening.

That means message cost scales with the product of message rate and audience size, not with either alone. Double the room size and you double the cost of every message in it. Work a single chat room:

```
Room size:            1,000 subscribers
One message:          1 publish + 1,000 deliveries = 1,001 billable messages
Message rate:         10 messages/minute
Per minute:           10 x 1,001 = 10,010 billable messages
Per day:              10,010 x 60 x 24 = ~14.4M messages/day
At $1.00/million:     ~$14.40/day  ->  ~$432/month  (one room)
```

One room. Now scale the room to 5,000 subscribers and the per-message fan-out quintuples, so the same message rate costs roughly five times as much. The leak is not the number of messages your users send, it is the number of deliveries those messages trigger, and that number climbs with every user you add to a channel. This is the real-time version of the superlinear cost curve I traced for retrieval in [why AI cost explodes after scale](https://ravoid.com/blog/why-ai-cost-explodes-after-scale): the thing that grows is not the input, it is the multiplier on the input.

| Cost driver | Scales with | Hits you when |
| --- | --- | --- |
| Held connections | Concurrent users | Many idle clients stay connected |
| Connection-minutes | Users x time online | Long-lived sessions, always-on apps |
| Message fan-out | Messages x audience | Large channels, broadcast patterns |
| Connection churn | Reconnect rate | Mobile, flaky networks, deploys |

## Churn is the cost nobody budgets

There is a third driver that hides behind the idle-connection number: churn. A connection is cheap to hold but expensive to establish, because each new connection pays for a TCP and TLS handshake, and a storm of simultaneous reconnections (a deploy, a network blip, a mobile carrier handoff) creates handshake storms and thundering-herd failures that break systems long before the raw connection count does ([WebSocket.org](https://websocket.org/guides/connection-limits/)). A single server can hold 500K idle connections but only sustain a fraction of that in new connections per second. Mobile-heavy apps churn constantly, so their real cost is dominated by reconnection, not by the steady-state count. Capacity planning that only counts peak concurrent connections misses the spikes that actually cause outages.

## When you do not need a WebSocket at all

The contrarian move that saves the most is questioning whether you need bidirectional connections in the first place. A large share of "real-time" features are one-directional: a live feed, a notification stream, a status update. The client needs to receive, not send. For that pattern, Server-Sent Events do the job over plain HTTP, and at 100K concurrent connections SSE uses roughly 40% less memory than WebSocket ([this SSE-vs-WebSocket benchmark](https://rexai.top/en/tutorials/rust/sse-vs-websocket-guide/)). Choosing the heavier transport for a one-way feature is the real-time equivalent of provisioning a server you do not need, the broader pattern I described in [why SaaS teams overpay for infrastructure](https://ravoid.com/blog/why-saas-overpay-infrastructure).

The discipline is to match the transport to the direction of data. Bidirectional, low-latency, high-interactivity (collaborative editing, multiplayer, trading) earns a WebSocket. One-way streaming earns SSE or even long-polling. The default of "use WebSockets for anything real-time" is how memory and connection-minute costs balloon for features that never needed a persistent two-way pipe.

## A post-mortem on a presence feature

A composite from the common pattern, with figures labeled illustrative: a collaboration tool added a presence feature, the little avatars showing who is viewing a document, and shipped it over WebSockets to every open tab. Engagement looked great. The infrastructure did not. Each open document tab held a connection, and because users left tabs open all day, concurrent connections climbed to roughly 80,000 against a fleet sized for far fewer. Memory pressure pushed the WebSocket nodes past 90% utilization, and a routine deploy triggered a reconnection storm that took the real-time tier down for several minutes as 80,000 clients re-handshook at once. The bill told the same story from the managed side: connection-minutes dominated, because the feature billed for presence on tabs nobody was actively using. The metric that broke was concurrent idle connections, a number their request-based dashboards never tracked. The fix was an idle-reaping policy that closed connections after a period of inactivity and reopened on interaction, plus moving the one-way presence broadcast to SSE.

## Framework: size real-time on the right axes

| Decision | What you gain | What you pay | When it breaks |
| --- | --- | --- | --- |
| WebSocket everywhere | Simple mental model | Memory + connection-minutes on idle | Many always-open clients |
| SSE for one-way | ~40% less memory, HTTP-native | No client-to-server channel | Truly interactive features |
| Idle reaping | Cuts held-connection cost | Reconnect latency on return | Sub-second presence needs |
| Limit channel size / shard | Caps fan-out cost | More routing complexity | Genuinely global broadcasts |

The order that controls cost: pick the lightest transport the feature actually needs, reap idle connections so you stop paying for presence nobody is using, and cap or shard large channels so fan-out does not turn one message into a hundred thousand billable deliveries.

## Decision guidance

Real-time cost is not a throughput problem, so throughput-based reasoning will mislead you every time.

**The rule: If a real-time feature only pushes data one direction, then use Server-Sent Events, and reserve WebSockets for genuinely bidirectional interactivity.**

The honest exception is a feature that is unmistakably two-way and latency-sensitive, collaborative editing, multiplayer state, live trading, where the client must send as fast as it receives. There a WebSocket earns its memory and connection-minute cost. For the far larger category of live feeds, dashboards, notifications, and presence that are mostly broadcast, the persistent two-way connection is overhead you pay for on every idle client.

## The wall behind the live feature

Real-time features carry a memory wall of their own, built not from model weights but from held connections, and a cost curve built not from message volume but from message fan-out. Neither shows up in the request-rate dashboards that govern the rest of your stack, which is why the bill and the outage both arrive as surprises. The connection that sits open all day doing nothing is still consuming memory and accruing minutes, and the message sent into a big room is paying for every set of eyes in it.

The cheapest connection is the one you closed when it went idle, and the cheapest message is the one you did not fan out to people who were not looking. Size real-time on presence and fan-out, and the feature that felt free stops quietly setting your capacity.

## FAQ

### Q: What drives WebSocket cost at scale?

Two things request-based intuition misses: held connections and message fan-out. Each open connection consumes memory and a file descriptor and, on managed services, bills connection-minutes even while idle. Separately, every published message costs one publish plus one delivery per subscriber, so a message to a large channel is many billable messages. Neither scales with request rate, which is why standard capacity planning underestimates them.

### Q: How much memory does a WebSocket connection use?

After real-world buffers and bookkeeping, roughly 27 KB per idle connection is a practical figure, so a million connections need about 26 GB of RAM just to hold them open. Heavily optimized servers can do better in benchmarks, but production traffic with message buffers pushes the real number up. The key point is that the memory is consumed whether the connection is active or sitting idle.

### Q: Why does message fan-out make real-time expensive?

Because one published message becomes one delivery per subscriber for billing. A message to a 1,000-person channel is about 1,001 billable messages, and a 5,000-person channel quintuples that for the same message rate. Cost scales with message rate multiplied by audience size, so growing channels makes every message more expensive. Fan-out is the superlinear driver behind most surprising real-time bills.

### Q: Should I use Server-Sent Events instead of WebSockets?

For one-directional features, yes. If the client only needs to receive (live feeds, notifications, status updates, broadcast presence), SSE runs over plain HTTP and uses roughly 40% less memory than WebSocket at 100K connections. Reserve WebSockets for genuinely bidirectional, latency-sensitive features like collaborative editing or multiplayer, where the client must send as fast as it receives.

### Q: What is connection churn and why does it matter?

Churn is the rate of new connections being established, and it is far more expensive than holding existing ones because each new connection pays for a TCP and TLS handshake. A single server can hold 500K idle connections but only sustain a fraction of that in new connections per second. Deploys, network blips, and mobile handoffs cause reconnection storms that break systems before the raw connection count does.

### Q: How do I reduce WebSocket connection-minute costs?

Reap idle connections. Close connections after a period of inactivity and reopen them on the next interaction, so you stop paying memory and connection-minutes for presence nobody is using. Combine that with choosing SSE for one-way features and capping or sharding large channels to limit fan-out. The biggest savings usually come from not holding connections that contribute nothing.

### Q: How many WebSocket connections can one server handle?

A tuned Linux server can hold 500,000-plus idle connections, but that number is misleading. Practical limits for active connections with real message patterns are closer to 10,000 to 50,000 per server, and the true bottlenecks are connection churn, burst throughput, and memory under load, not the idle ceiling. Plan around active concurrency and reconnection rate rather than the headline idle figure.

## Next Read

Real-time is one place where persistent state quietly drives cost. For where serverless and edge architectures hit their own walls, read [where serverless breaks at scale](https://ravoid.com/blog/where-serverless-breaks-vercel-cloudflare-real-experience).

---

### Sources & Further Reading

- [WebSocket.org: Connection Limits, The Real Bottlenecks](https://websocket.org/guides/connection-limits/)
- [Ably: Pub/Sub Pricing and connection-minutes](https://ably.com/docs/pub-sub/pricing)
- [SSE vs WebSocket memory benchmark](https://rexai.top/en/tutorials/rust/sse-vs-websocket-guide/)
- [AWS API Gateway WebSocket pricing guide](https://costgoat.com/pricing/amazon-api-gateway)

---

_Last updated: July 18, 2026_
