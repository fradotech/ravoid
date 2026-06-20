# Stripe's 2.9% Is a Tax That Grows With You

_By Framesta Fernando · Engineering Manager & Technical Architect · 10 min read · Published July 28, 2026_

> **TL;DR:** Stripe fees in 2026 are a flat 2.9% plus 30 cents per transaction, a rate that never drops no matter how much you process. Flat-rate pricing bundles a fat, hidden markup on top of non-negotiable interchange. At scale, switching to interchange-plus exposes that markup and turns a six-figure tax into something you can actually negotiate.

At $40,000 in monthly revenue, nobody on the team thinks about payment fees. The 2.9% Stripe takes is a rounding error against the work of finding customers, and the convenience is worth every cent. At $8 million a year, that same 2.9% is a line item larger than a senior engineer's salary, paid silently every month, and still nobody negotiates it. The fee did not change. Your revenue did, and the fee rode it up dollar for dollar.

That is the nature of a percentage fee, and it is the thing flat-rate pricing is designed to make you stop noticing. Stripe fees in 2026 remain the famous 2.9% plus $0.30, a rate that is gloriously simple and completely flat: it does not fall as your volume rises, even though your volume is exactly the thing that earns negotiating power everywhere else in your business. Payment processing is a tax on every dollar you collect, and flat-rate pricing is the version of that tax that grows linearly with you and never offers a volume discount.

## Where the 2.9% actually goes

To understand why this is negotiable, you have to break the fee into its parts. Credit card processing has three components: interchange, which goes to the card-issuing banks and is non-negotiable, assessments, which go to the card networks and are also non-negotiable, and the processor markup, which is where the money can actually be saved through negotiation ([BAMS on processing fee structure](https://www.bams.com/blog/credit-card-processing-fees-explained/)). The weighted-average interchange across a typical card mix runs around 1.4% ([ConvesioPay's Q1 2026 platform data](https://convesio.com/knowledgebase/article/interchange-plus-plus-explained/)), and assessments add roughly another 0.13%.

So of Stripe's 2.9%, somewhere around 1.5 points is the true cost of moving the money, the part no processor can avoid, and the rest is markup. Flat-rate pricing bundles all three into one number so you never see the split, which is the entire point: you cannot negotiate a markup you cannot see. The alternative, interchange-plus pricing, separates them so you see exactly what goes to the networks versus your processor, and that visibility is what makes negotiation possible ([BAMS on cutting eCommerce fees](https://www.bams.com/blog/cut-ecommerce-credit-card-processing-fees/)). Flat-rate optimizes for simplicity. At scale, simplicity is the most expensive feature you are buying.

## The six-figure line nobody reads

Put real numbers on it. Take an illustrative business doing $10M a year in card revenue at an average transaction of $50, on Stripe's standard flat rate.

```
Transactions: $10,000,000 / $50 = 200,000
Percentage fee: 2.9% x $10,000,000      = $290,000
Per-transaction: 200,000 x $0.30        = $60,000
Total Stripe fees                        = $350,000 / year
```

Now price the same volume on a negotiated interchange-plus deal: interchange ~1.4%, assessments ~0.13%, a negotiated markup of ~0.5%, and a lower $0.10 per-transaction fee.

```
Effective rate: 1.4% + 0.13% + 0.5%      = 2.03%
Percentage fee: 2.03% x $10,000,000      = $203,000
Per-transaction: 200,000 x $0.10         = $20,000
Total                                     = $223,000 / year

Annual saving: $350,000 - $223,000 = $127,000
```

The same payments, the same customers, the same product, $127,000 cheaper, because the flat rate was hiding a markup roughly three times the negotiated one. The interchange floor of ~1.5% is real and unavoidable, but everything above it was a convenience premium you stopped questioning. Even a 0.1 to 0.2% difference translates to tens or hundreds of thousands of dollars annually at high volume ([Razorpay on payment pricing and margins](https://razorpay.com/blog/payment-gateway-pricing-impact-on-margins/)), and the gap here is over a full point. This is the payments version of the margin erosion I traced in [subscription versus usage-based pricing](https://ravoid.com/blog/saas-pricing-models-subscription-vs-usage-based): a per-unit cost that quietly scales with the thing you are trying to grow. It is the same scaling-with-growth dynamic that killed seat-based plans, which I argued in [per-seat pricing is dead](https://ravoid.com/blog/per-seat-pricing-is-dead).

## The anchor: a flat percentage is a tax, not a price

Here is the reframing. A price is something you pay for value received, and it should bear some relationship to the cost of providing that value. A tax is a fixed percentage of a base that grows regardless of marginal cost. Stripe's flat fee behaves like the second. The marginal cost to Stripe of processing your ten-millionth dollar is essentially identical to your first, but you pay the same 2.9% on both, so your fees scale linearly with revenue while the value delivered per dollar does not.

That is fine, even a bargain, when you are small, because the fixed engineering cost of building payments yourself would dwarf the fees. The relationship inverts at scale. As volume grows, the flat percentage extracts more and more absolute dollars for the same per-transaction service, and the convenience that justified it early becomes a premium you are paying out of habit. The lever is not abandoning your processor, it is recognizing that a flat percentage was a starter plan, not a forever plan, the same build-versus-buy inflection I laid out in [the build versus buy decision framework](https://ravoid.com/blog/build-vs-buy-saas-decision-framework).

| Pricing model | What you see | Negotiable? | Best for |
| --- | --- | --- | --- |
| Flat-rate (2.9% + 30c) | One bundled number | No | Early stage, low volume |
| Interchange-plus | Interchange + markup split | Yes, the markup | Scaling, high volume |
| Tiered | Buckets that hide cost | Barely | Almost no one |
| Negotiated enterprise | Custom markup + fees | Heavily | Large, steady volume |

## What you can and cannot move

The discipline is knowing which parts of the fee are real and which are habit. You cannot negotiate interchange or assessments, they are set by banks and networks and every processor pays them identically. You can negotiate the markup, eliminate junk fees, and optimize transactions to qualify for lower interchange categories. Concrete levers: switching to interchange-plus to expose the markup, annual renegotiation with competitive quotes that typically saves 0.1 to 0.5%, and transaction optimization like capturing complete card data and settling batches daily to hit lower interchange tiers ([BAMS on reducing processing fees](https://www.bams.com/blog/reduce-payment-processing-fees/)).

There is also the payment mix lever, which is structural. Steering customers toward lower-cost methods, debit over credit, bank transfers for large invoices, regional methods where they are cheaper, changes the blended interchange you pay. The right processor and method mix is genuinely regional, which is why a flat global rate is so often the wrong fit, the point I made comparing providers in [Stripe vs Xendit vs Midtrans real cost comparison](https://ravoid.com/blog/stripe-vs-xendit-vs-midtrans-real-cost-comparison). Before assuming Stripe's flat rate is the only option, the alternatives are worth pricing against your actual volume, which I covered in [top Stripe alternatives for startups in 2026](https://ravoid.com/blog/top-stripe-alternatives-for-startups-2026).

## A post-mortem on a fee nobody owned

A composite from the pattern, with figures labeled illustrative: a subscription company crossed $12M in annual card volume still on flat-rate pricing, because payments had been set up by an early engineer and never revisited as finance scaled. Their processing fees were running roughly $360,000 a year, sitting in the COGS line as "payment processing" with no owner and no benchmark. A finance hire finally requested an interchange-plus quote and a competitive bid, and discovered the effective markup was over a full percentage point above what their volume could command. The metric that broke was effective processing rate, which they had never calculated because the flat number hid it. Renegotiating to interchange-plus cut the rate from 2.9% to roughly 2.1% all-in, saving on the order of $96,000 a year, with no change to checkout, no migration risk, and no impact on customers. The savings had been available for two years. Nobody had looked because the fee was flat and therefore invisible.

## Decision guidance

The mistake is treating the payment processing fee as a fixed cost of doing business rather than a negotiable vendor contract that should be revisited as you scale.

**The rule: If you process more than roughly $1M a year and are still on flat-rate pricing, then request an interchange-plus quote, because the markup hidden in the flat rate is almost certainly above what your volume can negotiate.**

The honest exception is genuinely low volume or early stage, where the flat rate's simplicity is worth more than the markup, and the engineering and finance time to manage interchange-plus would exceed the savings. That threshold is lower than most teams assume. Once payments are a six-figure line, the flat rate is no longer buying you simplicity, it is buying you the right not to think about a number that deserves thought.

## The tax you opted into

Stripe's 2.9% is not a rip-off. It is a brilliantly priced starter plan: frictionless, instant, and worth every basis point when you are small and the alternative is building payments yourself. The trap is that it never tells you when you have outgrown it. The rate stays flat, the absolute dollars climb with every good quarter, and the markup you happily paid at $40k a month is still riding on every dollar at $40M a year.

The cheapest basis point is the one you negotiated off a markup you finally bothered to look at. A flat percentage is a tax that grows with you, and the only thing that stops it from growing forever is someone deciding the fee is finally big enough to read.

## FAQ

### Q: What are Stripe's fees in 2026?

Stripe's standard online rate remains 2.9% plus $0.30 per successful card transaction. It is flat-rate pricing, meaning one bundled number that covers interchange, network assessments, and Stripe's markup. The rate does not decrease as your volume grows, which makes it simple and predictable but increasingly expensive at scale, where the bundled markup exceeds what your volume could negotiate under interchange-plus.

### Q: Is Stripe's 2.9% negotiable?

The markup portion is, the rest is not. Of the 2.9%, roughly 1.5 points are interchange and assessments paid to banks and networks, which no processor can avoid. The remainder is Stripe's markup, which is negotiable at sufficient volume, especially by switching to interchange-plus pricing that exposes the split. High-volume merchants routinely negotiate effective rates well below the flat 2.9%.

### Q: What is interchange-plus pricing?

Interchange-plus separates your processing fee into its real components: the non-negotiable interchange and assessments passed straight through, plus a transparent processor markup shown separately. Unlike flat-rate, which bundles everything into one number, interchange-plus lets you see exactly what goes to the card networks versus your processor, which is what makes the markup negotiable. It typically saves money at scale and is standard for high-volume merchants.

### Q: How much can switching from flat-rate to interchange-plus save?

It depends on volume and card mix, but the savings are often substantial. On $10M of annual card revenue, moving from a 2.9% flat rate to a roughly 2.0% interchange-plus deal can save well over $100,000 a year. Even a 0.1 to 0.2% rate difference translates to tens or hundreds of thousands annually at high volume, because the fee scales directly with revenue.

### Q: Why do payment fees feel like they grow faster than expected?

Because a flat percentage scales linearly with revenue while delivering the same per-transaction service. The marginal cost to the processor of handling your ten-millionth dollar is essentially the same as your first, but you pay the identical percentage on both. So as you grow, the absolute dollars climb in lockstep with revenue even though the value per dollar does not, which is why it behaves like a tax rather than a price.

### Q: When should I stay on Stripe's flat rate?

When you are early stage or low volume, roughly under $1M a year in processing, where the flat rate's simplicity outweighs the bundled markup and the finance and engineering time to manage interchange-plus would exceed the savings. Below that threshold, Stripe's convenience is genuinely a bargain. Above it, the flat rate stops buying simplicity and starts charging a premium worth renegotiating.

### Q: What else reduces payment processing fees besides renegotiating?

Optimize the payment mix and transaction handling. Steering customers toward lower-cost methods like debit or bank transfers changes your blended interchange, since credit cards cost more than debit. Capturing complete card data, settling batches daily, and matching authorization amounts help qualify for lower interchange categories. Eliminating junk fees like statement and non-compliance charges also adds up, and annual competitive renegotiation typically trims another 0.1 to 0.5%.

## Next Read

Payment fees are one per-unit cost that scales with growth. For how to choose the right processor for your region and volume, read [top Stripe alternatives for startups in 2026](https://ravoid.com/blog/top-stripe-alternatives-for-startups-2026).

---

### Sources & Further Reading

- [BAMS: Credit Card Processing Fees Explained](https://www.bams.com/blog/credit-card-processing-fees-explained/)
- [Razorpay: How Payment Gateway Pricing Eats Into Your Margins](https://razorpay.com/blog/payment-gateway-pricing-impact-on-margins/)
- [Convesio: Interchange++ Explained](https://convesio.com/knowledgebase/article/interchange-plus-plus-explained/)
- [Payrails: Interchange Plus vs Flat Rate](https://www.payrails.com/blog/payment-processing-fees-interchange-plus-vs-flat-rate)

---

_Last updated: July 28, 2026_
