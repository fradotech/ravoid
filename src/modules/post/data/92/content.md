# The Infrastructure Nobody Remembers Provisioning

_By Framesta Fernando · Engineering Manager & Technical Architect · 10 min read · Published August 2, 2026_

> **TL;DR:** Zombie infrastructure cost is the 30 to 40% of cloud spend that goes to idle resources nobody remembers creating: unattached volumes, orphaned snapshots, idle gateways, forgotten environments. They accumulate because deletion feels risky and nothing ties a resource's existence to whether it is still needed. Tag everything, scan for idle assets, and reclaim on a schedule.

Last quarter someone spun up a staging environment to test a migration. The migration shipped, the environment was forgotten, and its EBS volumes, Elastic IP, and load balancer are still on your bill this month, doing nothing. No one decided to keep them. No one decided anything. They simply outlived the reason they were created, because in the cloud, creating a resource is a deliberate act and deleting it is nobody's job.

This is zombie infrastructure, and it is not a rounding error. Tenable Research found that 49% of cloud infrastructure sits idle and untracked, with neglected resources going unpatched for six months or longer ([Tenable on zombie assets](https://it.tenable.com/blog/agentic-ai-cloud-security-zombie-assets)), and FinOps studies consistently show 30 to 40% of cloud spend wasted on idle resources, over-provisioned infrastructure, and zombie assets that nobody remembers creating ([SquareOps' 2026 AWS cost guide](https://squareops.com/blog/aws-cost-optimization-complete-2026-guide/)). The infrastructure nobody remembers provisioning is, for many companies, the single largest line of pure waste on the cloud bill.

## Why zombies accumulate and never leave

The mental model that creates the problem is that resources are temporary by default. They are not. A resource you create persists, billing every hour, until someone explicitly deletes it, and the cloud gives you no signal that its purpose has ended. The project finishes, the team moves on, the resource keeps running, and nothing in the system connects "this was for the migration" to "the migration is done, so delete it."

Deletion also feels risky, which is the second half of the trap. Zombie resources (unused disks, orphaned snapshots, unattached IP addresses, idle load balancers) accumulate silently because deleting them feels dangerous, and over time these small inefficiencies compound into significant recurring spend ([Symphony Solutions on cloud waste](https://symphony-solutions.com/insights/cloud-cost-optimization-2026)). Nobody is sure whether that volume is still needed, the snapshot might be the only backup, the IP might be referenced somewhere, so the safe-feeling choice is to leave it. Multiply that hesitation across hundreds of resources and years, and you get a graveyard that bills like a production environment.

## Each one is small. Together they are a salary.

The reason zombies escape attention is that no single one is alarming. An idle NAT gateway costs approximately $35 a month on AWS merely to exist, and at scale across accounts, regions, and environments this quietly becomes a five-figure annual waste with no runtime, no users, and no alerts ([Control Plane on undead infrastructure](https://controlplane.com/blog/post/the-invisible-tax-why-30-of-your-cloud-budget-is-spent-on-undead-infrastructure)). Unattached EBS volumes from terminated instances, snapshots of databases that no longer exist, and Elastic IPs from decommissioned staging environments individually cost a few dollars, but combined they routinely add up to $1,000 to $5,000 a month for mid-size companies ([SquareOps on unused EBS](https://squareops.com/blog/find-delete-unused-ebs-volumes-snapshots-elastic-ips-aws/)).

Work the aggregate, because the aggregate is the only level at which this looks serious. Take an illustrative $50,000 monthly cloud bill at the documented waste rate.

```
Monthly cloud bill:        $50,000
Zombie/idle share (cited 30-40%, use 35%): 0.35 x $50,000 = $17,500/month
Annual zombie cost:        $17,500 x 12 = $210,000/year
```

Two hundred thousand dollars a year on infrastructure with no users, no traffic, and no owner. That is a senior engineer's fully-loaded salary, spent on resources nobody would defend if asked about them individually, because nobody is ever asked. This is the distributed-waste pattern I keep returning to in [why SaaS teams overpay for infrastructure](https://ravoid.com/blog/why-saas-overpay-infrastructure), in its purest form: the cost that hurts is not one big mistake, it is thousands of small forgettings. The storage version of the same forgetting, cold data left in a hot tier, is [you're paying hot prices for cold data](https://ravoid.com/blog/s3-storage-class-cost).

## The anchor: nothing ties a resource to its reason for existing

The deepest issue is a missing link in cloud architecture: there is no built-in connection between a resource and the purpose it was created to serve. A resource knows its size, its region, its cost. It does not know it was for a migration that ended, an experiment that failed, or an environment that was decommissioned. So when the purpose dies, the resource does not, because the resource was never told the purpose existed.

That is why the fix is not a one-time cleanup, it is making purpose visible and expiry automatic. The four categories of waste (idle compute, orphaned storage, zombie jobs, and oversized reservations) each have a different growth rate, detection signal, and elimination path, and treating them as one problem with one fix is how cleanup falls behind and stays behind ([Sedai on cloud waste categories](https://sedai.io/blog/cloud-waste)). The durable answer is tagging every resource with an owner and a purpose at creation, so an untagged or expired resource becomes a question someone has to answer. Without that, you are doing manual archaeology forever, the same continuous-discipline lesson from [multi-cloud versus single-vendor hidden cost](https://ravoid.com/blog/multi-cloud-vs-single-vendor-hidden-cost): the waste regrows the moment the process stops.

| Zombie type | Example | Detection signal |
| --- | --- | --- |
| Orphaned storage | Unattached EBS, old snapshots | No attachment, no recent access |
| Idle compute | EC2 at near-zero CPU | Low CPU + network over weeks |
| Idle network | Unused EIPs, idle NAT/LBs | No associated traffic |
| Forgotten environments | Whole staging stacks | No deploys, no logins |

## Find them with tools you already have

The detection does not require a platform purchase. The cloud APIs expose exactly the orphan signals you need, and a few queries surface most of the waste:

```bash
# Unattached EBS volumes (billing, attached to nothing)
aws ec2 describe-volumes \
  --filters Name=status,Values=available \
  --query 'Volumes[].{ID:VolumeId,GB:Size,AZ:AvailabilityZone}'

# Elastic IPs allocated but not associated (AWS charges for idle EIPs)
aws ec2 describe-addresses \
  --query 'Addresses[?AssociationId==`null`].[PublicIp,AllocationId]'

# Then: snapshots of deleted volumes, idle NAT gateways, zero-traffic LBs
```

These three categories alone often cover the $1,000-to-$5,000-a-month band for a mid-size company. The harder part is acting on the results safely, which is where the deletion-feels-risky problem reasserts itself. The safe pattern is a quarantine, not a delete: detach and tag a suspected zombie, wait a defined period, and delete only if nothing broke and no one claimed it. That converts a scary irreversible action into a reversible one, which is what lets the cleanup actually happen instead of stalling on fear. The total-cost discipline is the same I argued in [open source versus SaaS total cost of ownership](https://ravoid.com/blog/open-source-vs-saas-total-cost-ownership): the cost you do not measure is the cost you keep paying.

## A post-mortem on a graveyard nobody visited

A composite from the documented pattern, with figures labeled illustrative: a company's cloud bill had grown steadily for two years while their active workload was roughly flat, and finance finally asked for an itemized review. The audit found the usual graveyard: unattached volumes from instances terminated long ago, dozens of orphaned snapshots, several Elastic IPs from staging environments deleted quarters earlier, and idle NAT gateways scattered across a dozen sub-accounts that each cost about $35 a month to exist. Individually trivial, collectively the zombie spend was roughly 38% of the bill. The metric that broke was the ratio of billed resources to resources with a known owner, which nobody had ever computed because tagging had never been enforced. A tagging policy at creation, a weekly idle-resource scan, and a quarantine-then-delete workflow cut the bill by over a third within two cycles, and the tagging kept it from regrowing.

## Framework: tag, detect, quarantine, reclaim

| Decision | What you gain | What you pay | When it breaks |
| --- | --- | --- | --- |
| Mandatory tags at creation | Owner + purpose visible | Policy enforcement | Legacy untagged resources |
| Scheduled idle scans | Continuous detection | Setup, false positives | Treating all types the same |
| Quarantine before delete | Safe, reversible cleanup | A waiting window | Genuinely urgent costs |
| Auto-expiry on temp resources | Zombies never form | Discipline to set TTLs | Long-lived shared assets |

The sequence: enforce owner and purpose tags at creation so new zombies cannot form anonymously, scan for idle resources on a schedule, quarantine suspects rather than deleting outright so the action is reversible, and set time-to-live expiry on anything created as temporary. The most powerful of these is the last, because a resource that expires on its own never becomes a zombie in the first place.

## Decision guidance

The mistake is treating cloud cleanup as a one-time project rather than a standing property of how resources are created and retired.

**The rule: If a resource cannot be traced to a current owner and purpose, then quarantine it on a schedule and delete it if nothing claims it, because an untraceable resource is a zombie until proven otherwise.**

The honest exception is genuinely shared, long-lived infrastructure (a core network component, a shared backup vault, a compliance archive) where idleness is expected and deletion would be harmful. Those should be tagged as deliberately persistent so the scan skips them, which is exactly why tagging is the foundation: it lets you distinguish a resource that is idle on purpose from one that is idle because everyone forgot it. Without that distinction, you either delete something important or keep everything forever, and most teams choose the expensive second option.

## The bill for forgetting

Cloud platforms made provisioning a single click and made deprovisioning nobody's responsibility. The result is a steadily growing line of infrastructure that serves no one, alerts no one, and survives because killing it feels riskier than paying for it. The waste is not a failure of engineering skill. It is a failure of memory, institutionalized, where the system that bills you for a resource has no idea the reason it existed ended months ago.

The cheapest resource is the one that expired itself when its purpose did. Tag what you create, scan for what you forgot, and quarantine before you kill, because the infrastructure nobody remembers provisioning is the infrastructure you will keep paying for until someone finally goes looking.

## FAQ

### Q: What is zombie infrastructure?

Zombie infrastructure is cloud resources that are running and billing but serving no purpose: unattached storage volumes, orphaned snapshots, unused IP addresses, idle load balancers and gateways, and whole environments left over from finished projects. They accumulate because creating a resource is deliberate while deleting it is nobody's job, and nothing ties a resource's existence to whether its original purpose still exists.

### Q: How much cloud spend is wasted on zombie resources?

FinOps studies consistently put it at 30 to 40% of cloud spend going to idle, over-provisioned, and zombie resources nobody remembers creating, and Tenable found 49% of cloud infrastructure sitting idle and untracked. On a $50,000 monthly bill, a 35% waste rate is $17,500 a month, or about $210,000 a year, spent on infrastructure with no users, no traffic, and no owner.

### Q: Why do zombie resources accumulate?

Two reasons. First, resources persist by default and the cloud gives no signal when their purpose ends, so a resource outlives the project that created it. Second, deletion feels risky: nobody is sure whether a volume is still needed or a snapshot is the only backup, so the safe-feeling choice is to leave it. Across hundreds of resources and years, that hesitation compounds into major recurring spend.

### Q: How do I find zombie resources in AWS?

Use the cloud APIs directly. Query for EBS volumes with status available (attached to nothing), Elastic IPs with no association, snapshots of deleted volumes, NAT gateways and load balancers with no traffic, and EC2 instances with near-zero CPU and network over weeks. These signals surface most orphaned storage, compute, and network waste without buying a dedicated tool, though platforms can automate the ongoing scan.

### Q: Is it safe to delete idle cloud resources?

Make it safe with a quarantine workflow rather than an immediate delete. Detach and tag a suspected zombie, wait a defined period, and delete only if nothing broke and no one claimed it. This converts a scary irreversible action into a reversible one, which is what lets cleanup actually happen instead of stalling on the fear that the resource might still matter. Always confirm backups and compliance retention first.

### Q: How do I stop zombie infrastructure from forming?

Make purpose visible and expiry automatic. Enforce tags for owner and purpose at creation so no resource exists anonymously, and set time-to-live expiry on anything created as temporary, like test environments. A resource that expires on its own when its purpose ends never becomes a zombie. Combine that with scheduled idle scans so the few that slip through get caught continuously rather than in a once-a-year cleanup.

### Q: Are zombie resources a security risk too?

Yes. Idle, untracked resources go unpatched, often for six months or longer, which makes them attractive targets for attackers. A forgotten instance or environment is both a budget leak and an expanded attack surface that no one is monitoring. Eliminating zombie infrastructure improves security posture as well as cost, since you cannot defend or patch resources you do not know you have.

## Next Read

Zombie resources are the forgotten end of a broader overspending pattern. For the full picture of where cloud budgets leak, read [why SaaS teams overpay for infrastructure](https://ravoid.com/blog/why-saas-overpay-infrastructure).

---

### Sources & Further Reading

- [Tenable: Hunting Zombie Assets](https://it.tenable.com/blog/agentic-ai-cloud-security-zombie-assets)
- [Control Plane: Why 30% of Your Cloud Budget Is Undead Infrastructure](https://controlplane.com/blog/post/the-invisible-tax-why-30-of-your-cloud-budget-is-spent-on-undead-infrastructure)
- [SquareOps: Find & Delete Unused EBS Volumes, Snapshots, Elastic IPs](https://squareops.com/blog/find-delete-unused-ebs-volumes-snapshots-elastic-ips-aws/)
- [Sedai: How to Detect & Eliminate Cloud Waste](https://sedai.io/blog/cloud-waste)

---

_Last updated: August 2, 2026_
