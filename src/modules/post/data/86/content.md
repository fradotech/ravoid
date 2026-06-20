# You're Paying Hot Prices for Cold Data

_By Framesta Fernando · Engineering Manager & Technical Architect · 10 min read · Published July 27, 2026_

> **TL;DR:** S3 storage class cost is set by data temperature, how often you actually access an object, but objects default to S3 Standard and stay there forever. Most stored data is cold, so most teams pay frequent-access prices for bytes nobody reads. Lifecycle policies and intelligent tiering move cold data to classes 40 to 95% cheaper.

Every object you put in S3 lands in the same place by default: S3 Standard, the priciest general-purpose class, built for data you read constantly. That default never expires. The log file you wrote two years ago and have not touched since is sitting in Standard right now, billing the same per-gigabyte rate as the asset your application reads a thousand times an hour. S3 does not know the difference between hot and cold data unless you tell it, and almost nobody tells it.

That is the entire shape of the problem. S3 storage class cost is a function of data temperature, how frequently you access an object, but the temperature of your data drifts toward cold over time while the storage class stays frozen at Standard. The gap between "data we still read" and "data we are still paying frequent-access prices to keep" widens every month, silently, because nothing in the default behavior ever moves an object to a cheaper class. You are paying hot prices for cold bytes, and the bill grows with every object that ages out of relevance but not out of Standard.

## The price gap between classes is enormous

This would be a minor issue if the storage classes were priced similarly. They are not. The spread is among the widest in all of cloud pricing. S3 Standard runs about $0.023 per GB-month ([this S3 cost breakdown](https://medium.com/@yashvikothari/why-your-s3-bill-just-hit-47-000-and-what-the-cheapest-storage-class-wont-tell-you-ee16cb7cc492)), while S3 Glacier Deep Archive is the cheapest cloud storage at any major provider at $0.00099 per GB-month, so a petabyte that costs $23,552 a month in Standard costs $1,013 in Deep Archive ([Usage.ai's Glacier pricing analysis](https://www.usage.ai/blogs/aws/storage-cost/glacier-deep-archive-pricing/)).

That is a 23x difference for the identical bytes. Between those extremes sit the classes that matter most for everyday data: Standard-Infrequent Access at roughly 40% cheaper than Standard, and the intelligent-tiering archive tiers that reach 68% cheaper ([CloudFix's intelligent-tiering guide](https://cloudfix.aurea.com/blog/aws-s3-intelligent-tiering/)). The contradiction worth naming is that the cheapest class is not the goal. The goal is matching each object's class to how you actually use it, because a deep-archive class is useless for data you read daily, and Standard is wasteful for data you never read. The mistake is leaving everything in one class, and the default makes that mistake for you.

## Most of your data is cold, and you can prove it

The reason this is worth fixing is that the cold fraction is usually the majority. Across typical workloads, a large share of stored objects have not been accessed in months: logs, backups, old user uploads, completed job artifacts, prior versions. Work an illustrative bucket of 500 TB where 80% has not been touched in 90-plus days, using the cited rates.

```
All 500 TB in S3 Standard:
  500,000 GB x $0.023 = $11,500 / month

Split by temperature:
  Hot   100,000 GB x $0.023            = $2,300 / month
  Cold  400,000 GB -> Archive Instant (68% off, ~$0.0074/GB)
        400,000 x 0.0074               = $2,944 / month
  New total                            = $5,244 / month

Monthly saving: $11,500 - $5,244 = $6,256  (~54%)
```

Push the genuinely never-read slice to Deep Archive instead and that 400 TB drops to about $396 a month, taking the bucket under $2,700 total. The savings are not a clever trick, they are the difference between paying for access you use and access you do not. Lifecycle policies paired with intelligent tiering and Glacier let most enterprises cut storage cost 30 to 40%, and aggressive class selection reaches 40 to 70% ([SudoConsultants' lifecycle guide](https://sudoconsultants.com/how-to-cut-aws-s3-storage-costs-by-40-using-lifecycle-policies-a-practical-guide/)). The exact number depends on your hot-to-cold ratio, which is exactly the thing you should measure before assuming your bill is unavoidable. This is the storage face of the overprovisioning pattern I keep returning to in [why SaaS teams overpay for infrastructure](https://ravoid.com/blog/why-saas-overpay-infrastructure). It sits alongside the per-byte AWS surprise of [the $0.045 NAT gateway tax](https://ravoid.com/blog/nat-gateway-cost), another default you never chose.

## The anchor: data has a temperature your pricing ignores

The reframing is to treat access frequency as a first-class property of every object, the way you already treat size. Hot data (read often, latency-sensitive) belongs in Standard. Warm data (read occasionally) belongs in Infrequent Access. Cold data (rarely or never read, kept for compliance or just-in-case) belongs in a Glacier class. The cost mistake is not choosing the wrong class once, it is never assigning a temperature at all, so everything inherits "hot" forever regardless of reality.

That temperature is not static, which is what makes a one-time cleanup insufficient. Data cools as it ages: today's hot upload is next quarter's cold archive. A system that assigns a class at write time and never revisits it will slowly accumulate cold data in Standard exactly as if you did nothing. The fix has to be a policy that moves data as it cools, not a manual sweep you do once and forget, the same continuous-discipline lesson from [multi-cloud versus single-vendor hidden cost](https://ravoid.com/blog/multi-cloud-vs-single-vendor-hidden-cost): the cost leaks back the moment the automation stops.

| Class | Rough price vs Standard | Access fit | Retrieval cost |
| --- | --- | --- | --- |
| S3 Standard | baseline ($0.023/GB) | Hot, frequent | None |
| Standard-IA | ~40% cheaper | Warm, occasional | Per-GB fee |
| Intelligent-Tiering | auto, up to ~68% off cold | Unknown / changing | None |
| Glacier Deep Archive | ~96% cheaper | Cold, rare | Fee + hours latency |

## Two ways to move the data, and when each wins

There are two mechanisms, and the right one depends on whether you know your access patterns. If you know them, use lifecycle policies: explicit rules that transition objects to cheaper classes after a set age. They are deterministic and free to define:

```json
{
  "Rules": [{
    "ID": "cool-aging-data",
    "Status": "Enabled",
    "Filter": { "Prefix": "logs/" },
    "Transitions": [
      { "Days": 30,  "StorageClass": "STANDARD_IA" },
      { "Days": 90,  "StorageClass": "GLACIER_IR" },
      { "Days": 365, "StorageClass": "DEEP_ARCHIVE" }
    ]
  }]
}
```

If you do not know your access patterns, or they change unpredictably, use S3 Intelligent-Tiering, which monitors access and moves objects automatically: frequent-access tier at Standard price, then Infrequent Access after 30 days without access, then Archive Instant Access after 90, with no retrieval charges and no tiering charges when objects move between tiers ([CloudFix](https://cloudfix.aurea.com/blog/aws-s3-intelligent-tiering/)). The no-retrieval-fee property is what makes it safe as a default: you are not penalized when cold data turns out to be needed. The one caveat is the Glacier retrieval trap, the low per-GB rate is real, but the total bill depends on how often and how fast you restore, plus request and egress charges ([TheLinuxCode's Glacier guide](https://thelinuxcode.com/how-much-does-aws-glacier-cost-a-practical-2026-guide-to-predictable-archival-bills/)). Archive classes are cheap to store and expensive to read, so they are wrong for anything you retrieve regularly.

## A post-mortem on a $47k bucket

A composite from the documented pattern, with figures labeled illustrative: a media company's S3 bill climbed past $40,000 a month and finance asked why. The bucket held roughly 1.5 PB, almost all of it in S3 Standard, accumulated over years of user uploads, rendered video variants, and processing artifacts. An access analysis showed that under 15% of objects had been read in the prior 90 days, the rest were cold originals and obsolete intermediate files kept "just in case." The metric that broke was the ratio of Standard-class bytes to recently-accessed bytes, which had drifted to roughly 7:1 with no lifecycle policy ever applied. Adding lifecycle transitions to Standard-IA at 30 days and Glacier Instant Retrieval at 90, plus deleting obsolete intermediates, cut the storage line by more than half within two billing cycles. Nothing about the workload changed. The data had simply been sitting in the wrong class because no one assigned it a temperature.

## Framework: assign a temperature, automate the move

| Decision | What you gain | What you pay | When it breaks |
| --- | --- | --- | --- |
| Lifecycle to IA/Glacier | 40-95% on cold data | Retrieval fees on archive | Frequently re-read data |
| Intelligent-Tiering | Auto, no retrieval fee | Small monitoring fee/object | Tiny objects at huge count |
| Delete obsolete objects | 100% on that data | Care to confirm safe | Compliance retention |
| Leave in Standard | Simplicity | Hot price on cold bytes | Data that actually cools |

The order: measure your hot-to-cold ratio first so you know the prize, apply lifecycle policies where access patterns are known, use Intelligent-Tiering where they are not, and delete what you do not need to keep at all. The monitoring fee on Intelligent-Tiering is trivial against the savings for normal object sizes, though a bucket of billions of tiny objects is the one case where the per-object fee can outweigh the benefit.

## Decision guidance

The error is treating storage class as a write-time decision and never revisiting it, which guarantees cold data accumulates at hot prices.

**The rule: If a bucket has no lifecycle policy and holds data that ages, then apply tiering before you negotiate anything else, because you are paying Standard rates on data nobody reads.**

The honest exception is data that is uniformly hot and stays hot, an active application's working set, a frequently served asset library, where Standard is the correct class and archiving would add retrieval cost and latency for no benefit. That is a minority of most storage footprints. For logs, backups, uploads, and artifacts that cool with age, leaving them in Standard is not a choice you made, it is a default you never overrode.

## The default that never cools

S3 will happily store your data in the most expensive class forever, because that is what the default does and S3 has no way to know your access patterns unless you express them. The bill that grows faster than your usage is rarely a sign you are storing more hot data. It is a sign that your cold data is wearing a hot price tag, and that no policy is moving it as it cools.

The cheapest gigabyte is the one in the class that matches how you actually use it. Give your data a temperature, automate the move, and the bucket that quietly drifted to $47,000 settles back to what the access actually warrants.

## FAQ

### Q: What determines S3 storage class cost?

Access frequency, or data temperature. S3 prices classes by how often you intend to read the data: Standard for frequent access, Infrequent Access for occasional, and Glacier classes for rarely read archival data. The spread is huge, Standard is about $0.023 per GB-month while Glacier Deep Archive is $0.00099, a 23x difference. The cost mistake is leaving everything in Standard regardless of actual access.

### Q: How much can I save by changing S3 storage classes?

Typically 30 to 40% with lifecycle policies and intelligent tiering, and 40 to 70% with aggressive class selection. The exact savings depend on your hot-to-cold ratio. Since most stored data is cold, moving the rarely accessed majority from Standard to Infrequent Access or Glacier classes often cuts the storage line by half or more, with archive classes reaching up to 95% cheaper than Standard.

### Q: What is S3 Intelligent-Tiering and when should I use it?

It is a storage class that automatically moves objects between access tiers based on observed access, with no retrieval charges and no fees for moving between tiers. Objects start at Standard price, drop to Infrequent Access after 30 days without access, and Archive Instant Access after 90. Use it when access patterns are unknown or changing, because the lack of retrieval fees makes it safe when cold data turns out to be needed.

### Q: Lifecycle policies or Intelligent-Tiering, which is better?

Use lifecycle policies when you know your access patterns: they deterministically transition objects to cheaper classes at set ages and are free to define. Use Intelligent-Tiering when patterns are unknown or unpredictable, since it adapts automatically and charges no retrieval fees. Many teams combine them: lifecycle rules for predictable data like logs, Intelligent-Tiering for buckets with mixed or uncertain access.

### Q: What is the catch with Glacier storage classes?

They are cheap to store and expensive to read. The low per-GB rate is real, but your total Glacier bill depends on how often and how fast you restore, plus request, listing, and egress charges. Restores can also take hours depending on the retrieval tier. Glacier is right for data you rarely retrieve, like compliance archives, and wrong for anything you read regularly.

### Q: Why does cold data end up in S3 Standard?

Because Standard is the default class for every uploaded object and nothing moves it automatically without a policy. Data also cools over time: today's hot upload becomes next quarter's cold archive, but its storage class never changes on its own. Without a lifecycle policy or Intelligent-Tiering, cold data steadily accumulates in Standard, paying frequent-access prices for bytes nobody reads.

### Q: Should I just delete old data instead of archiving it?

If you genuinely do not need it and have no compliance obligation to retain it, deleting is the cheapest option, saving 100% on those objects. Obsolete intermediate files and duplicate artifacts are common deletion candidates. For data you must keep but rarely read, archive it to a Glacier class instead. The key is to confirm retention requirements before deleting anything that compliance or recovery might need.

## Next Read

Storage class is one place defaults quietly bill you for capacity you do not use. For the broader pattern across your cloud footprint, read [why SaaS teams overpay for infrastructure](https://ravoid.com/blog/why-saas-overpay-infrastructure).

---

### Sources & Further Reading

- [Usage.ai: S3 Glacier Deep Archive pricing](https://www.usage.ai/blogs/aws/storage-cost/glacier-deep-archive-pricing/)
- [CloudFix: S3 Intelligent-Tiering pricing and savings](https://cloudfix.aurea.com/blog/aws-s3-intelligent-tiering/)
- [SudoConsultants: Cut S3 costs with lifecycle policies](https://sudoconsultants.com/how-to-cut-aws-s3-storage-costs-by-40-using-lifecycle-policies-a-practical-guide/)
- [AWS: Save on storage costs using Amazon S3](https://aws.amazon.com/s3/cost-optimization/)

---

_Last updated: July 27, 2026_
