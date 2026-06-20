# Your CI Bill Moved and Nobody Can Explain Why

_By Framesta Fernando · Engineering Manager & Technical Architect · 10 min read · Published July 24, 2026_

> **TL;DR:** GitHub Actions cost is driven by job count, per-minute rounding, runner type, and matrix size, not by how much real compute you use. Every job rounds up to a whole minute, every matrix axis multiplies that, and macOS runners cost roughly ten times Linux. Cut the bill by running fewer jobs, not by negotiating the per-minute rate.

Here is a finance question that stumps most engineering teams: the GitHub Actions bill went from $200 to $2,000 over eighteen months, the team did not grow much, and nobody can point to what changed ([Mergify's writeup of this exact pattern](https://mergify.com/blog/cut-your-github-actions-ci-bill)). No single decision caused it. Engineers shipped more PRs, the test suite grew, someone added a matrix axis, someone else switched a job to macOS, and the runner minutes piled up faster than any other line in the cloud spend. The bill moved because CI cost does not track the thing you think it tracks.

The intuition is that CI cost scales with compute, so a bigger bill means more real work. It does not. GitHub Actions cost is governed by how your workflows are configured, and the configuration multiplies in ways the YAML hides. Three mechanics do almost all the damage: every job rounds up to a whole minute, matrix builds multiply job count, and runner choice can swing the per-minute rate by an order of magnitude. None of them show up as a number anyone deliberately changed, which is exactly why the bill moves and nobody can explain it.

## Mechanic one: the rounding tax

Start with the one that surprises people most. GitHub rounds the minutes and partial minutes each job uses up to the nearest whole minute ([GitHub's runner pricing docs](https://docs.github.com/billing/reference/actions-runner-pricing)). A lint job that runs for 15 seconds bills a full minute. A job that runs 2 minutes 5 seconds bills 3. The rounding is per job, so the smaller and more numerous your jobs, the larger the overhead as a percentage of real compute.

This inverts a common optimization instinct. Splitting a workflow into many small parallel jobs feels efficient, but each fractional job pays the rounding tax. Ten 20-second jobs bill 10 minutes for 200 seconds of actual work, a 200% overhead. The rounding is invisible in the run logs, which show real durations, and visible only on the invoice, which shows rounded minutes. That gap between what you observe and what you pay is the first reason the bill drifts away from your mental model.

## Mechanic two: matrix builds multiply everything

The matrix is where the rounding tax compounds. A test matrix of 3 operating systems by 4 language versions is 12 jobs, and each one independently pays the per-job rounding. Add one more axis, say 2 architectures, and you are at 24 jobs from a single workflow file edit that looked harmless in review. Work an illustrative run with cited per-minute rates:

```
Matrix: 3 OS x 4 versions = 12 jobs
Each job runs ~75s -> rounds up to 2 billed minutes
Billed per run: 12 x 2 = 24 min   (actual compute ~15 min)
Runs/day: 200  ->  24 x 200 = 4,800 billed min/day
Monthly: 4,800 x 30 = 144,000 min
At $0.008/min (Linux): ~$1,152/month
```

Two things hide in that calculation. First, the rounding inflated 15 minutes of real compute into 24 billed minutes, a 60% overhead before anything else. Second, the whole number scales linearly with the matrix, so doubling an axis doubles the bill with no new product value. The published Linux rate sits around $0.006 to $0.008 per minute after GitHub cut hosted-runner prices up to 39% on January 1, 2026 ([GitHub's pricing-change announcement](https://github.com/resources/insights/2026-pricing-changes-for-github-actions)), so the rate is not the problem. The job count is.

## Mechanic three: the runner you picked costs 10x

The third multiplier is runner choice, and it is the most expensive single decision. Hosted runner pricing spans roughly $0.006 to $0.062 per minute across Linux, Windows, and macOS ([CICDcost's 2026 baseline](https://cicdcost.com/)). macOS runners cost on the order of ten times a Linux runner, so a matrix that includes a macOS leg pays roughly 10x for that leg's minutes. And larger runners have their own trap: included plan minutes cannot be used for larger runners, which are always charged even on public repositories ([GitHub's billing docs](https://docs.github.com/en/enterprise-cloud@latest/billing/managing-billing-for-github-actions)).

Run the same 144,000-minute workload above on macOS instead of Linux and the bill goes from about $1,152 to over $11,000 a month, for byte-identical test logic. The choice of runner OS is usually made once, by whoever wrote the workflow, often copied from another repo, and never revisited against its cost. That is the pattern across all three mechanics: the expensive decisions are config defaults nobody priced.

| Driver | What it multiplies | Typical surprise |
| --- | --- | --- |
| Per-minute rounding | Every job, fractional time | Small jobs cost a full minute |
| Matrix axes | Job count | One axis doubles the bill |
| Runner OS | Per-minute rate | macOS ~10x Linux |
| Larger runners | Rate, no free minutes | Always billed, even public repos |

## The anchor: you are billed for jobs and config, not compute

The reframing that fixes this is to stop thinking of CI cost as a compute meter and start thinking of it as a function of your workflow configuration. The bill is roughly job count times rounded minutes times runner rate, and all three terms are set in YAML, not by how hard your code is to build. That is why the biggest savings come from running fewer workflows, not from bargaining over runner prices ([Deepdocs' GitHub Actions cost guide](https://deepdocs.dev/github-actions-cost/)). You cannot meaningfully negotiate $0.008 a minute. You can absolutely stop running a 24-job matrix on every documentation typo.

This is the CI version of the overprovisioning pattern I keep returning to in [why SaaS teams overpay for infrastructure](https://ravoid.com/blog/why-saas-overpay-infrastructure): the default configuration is tuned for thoroughness and convenience, and thoroughness on every trivial change is where the money goes. A 50-person engineering team spends $3,000 to $8,000 a month on CI/CD compute alone, and that figure roughly doubles once you add storage, subscriptions, and the engineering time spent maintaining pipelines ([Sesame Disk's 2026 CI/CD analysis](https://sesamedisk.com/ci-cd-pipelines-2026-comparison/)). The compute is rarely the largest piece, but it is the most controllable, because it is the one written down in files you own.

## The fixes live in the workflow file

Because the cost lives in configuration, so does the fix. Three changes recover most of the waste. Skip workflows that do not need to run, cancel superseded runs, and stop full matrices on the first failure:

```yaml
on:
  pull_request:
    paths-ignore: ['**/*.md', 'docs/**']   # don't run CI on docs-only PRs

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true                  # kill superseded runs on new pushes

jobs:
  test:
    strategy:
      fail-fast: true                       # stop the matrix on first failure
      matrix:
        os: [ubuntu-latest]                 # drop macOS unless a leg truly needs it
        node: [20, 22]                      # trim versions to what you support
```

Each line targets a multiplier. The path filter removes entire runs that produce no value. `cancel-in-progress` stops paying for runs that a newer push already obsoleted, a common silent drain when developers push rapidly. `fail-fast` cuts a 12-job matrix short the moment one leg fails instead of running all twelve to completion. And trimming the matrix to the OS and versions you actually support attacks the job-count term directly. None of this compromises test coverage on the changes that matter, the lesson I drew about cheap-feeling automation in [the technical debt of vibe coding](https://ravoid.com/blog/vibe-coding-technical-debt): the default is to run everything always, and discipline is choosing when not to.

## A post-mortem on a quietly tripled bill

A composite from the documented pattern, with figures labeled illustrative: a platform team's CI bill drifted from roughly $600 to $2,400 a month over a year with no headcount change. The forensic trail had three threads. A test matrix had grown from 2 to 6 combinations as the team added Node versions nobody had pruned. A cross-platform check on macOS, added for one library, ran on every PR at roughly 10x Linux rates. And rapid pushes meant several full CI runs per PR executed to completion because no concurrency cancellation was configured. The metric that broke was billed minutes per merged PR, which had tripled while merged-PR count was flat. Adding path filters, `cancel-in-progress`, `fail-fast`, and trimming the matrix to supported versions cut the bill back below $800 within a month, with no loss of meaningful coverage. Nobody had made an expensive decision. The expense accumulated from defaults nobody revisited.

## Watch the self-hosted assumption too

One more shift worth flagging, because it breaks a common cost-avoidance plan. Self-hosted runners were historically free of GitHub charges, and many teams moved heavy jobs to them precisely for that reason. GitHub introduced a $0.002-per-minute platform charge for self-hosted runner usage in 2026 ([the GitHub changelog](https://github.blog/changelog/2025-12-16-coming-soon-simpler-pricing-and-a-better-experience-for-github-actions/)). It is small per minute, but on a high-volume self-hosted fleet it is a new line that did not exist before, so the "we self-host, CI is free" assumption needs re-checking against current pricing rather than last year's. The broader build-versus-buy math for CI infrastructure is the same calculation I laid out in [the build versus buy decision framework](https://ravoid.com/blog/build-vs-buy-saas-decision-framework), and the bill-grew-without-traffic pattern is the same one I traced in [your Kubernetes bill grew while traffic didn't](https://ravoid.com/blog/kubernetes-cost-2026).

## Decision guidance

The error is treating CI cost as a fixed cost of doing business and reacting only when the bill spikes, instead of treating it as a configuration you tune continuously.

**The rule: If a workflow runs on every push regardless of what changed, then add path filters and concurrency cancellation before you touch anything else.**

The honest exception is a release or security pipeline where running fully on every relevant change is the point, and skipping a run could ship a regression or miss a vulnerability. Those should be deliberate and named. For the routine lint, format, and test workflows that fire on every commit and every docs typo, running the full matrix every time is not rigor, it is the rounding tax multiplied by a matrix you never pruned.

## The bill is a config file

CI cost does not move because your code got harder to build. It moves because a matrix grew, a macOS leg snuck in, concurrency cancellation was never set, and every small job quietly rounded up to a full minute, all of it accumulating in YAML that passed review because no line looked expensive. The reason nobody can explain the bill is that everybody made a reasonable local choice and nobody priced the multiplication.

The cheapest CI minute is the one a path filter skipped. Read your workflow files as a cost model, because that is what they are, and the bill that moved on its own will move back the same way.

## FAQ

### Q: Why did my GitHub Actions bill increase without more developers?

Because CI cost scales with job count and configuration, not headcount. A growing test matrix, a macOS runner added for one check, more PRs each triggering full runs, and per-job minute rounding all compound over time. None of these is a single visible decision, so the bill drifts upward as defaults accumulate while your team size stays flat. The cost lives in your workflow files, not your org chart.

### Q: How does GitHub Actions per-minute rounding work?

GitHub rounds the minutes each job uses up to the nearest whole minute, per job. A 15-second lint job bills a full minute, and a 2-minute-5-second job bills 3. The smaller and more numerous your jobs, the higher the overhead: ten 20-second jobs bill 10 minutes for under 4 minutes of real compute. Run logs show real durations, but the invoice shows rounded minutes.

### Q: Do matrix builds increase CI cost a lot?

Yes, multiplicatively. A 3-OS by 4-version matrix is 12 separate jobs, each paying its own rounded minutes. Adding one axis can double the job count and the bill from a one-line workflow edit. Because each job rounds up independently, large matrices of short jobs are especially expensive. Trim the matrix to the operating systems and versions you actually support to cut the job-count term directly.

### Q: How much more do macOS runners cost than Linux?

Roughly ten times. Hosted runner rates span about $0.006 to $0.062 per minute, with macOS at the top end and Linux at the bottom. A workload that costs around $1,100 a month on Linux can exceed $11,000 on macOS for identical test logic. Reserve macOS runners for the specific legs that genuinely require Apple platforms, and keep everything else on Linux.

### Q: What is the fastest way to cut GitHub Actions cost?

Run fewer jobs, not cheaper minutes. Add path filters so workflows skip docs-only or irrelevant changes, set concurrency with cancel-in-progress to kill superseded runs, enable fail-fast to stop a matrix on the first failure, and trim the matrix to supported targets. These changes live in the workflow file and recover most waste without reducing coverage on the changes that matter.

### Q: Are self-hosted runners still free on GitHub Actions?

Not entirely as of 2026. GitHub introduced a $0.002-per-minute platform charge for self-hosted runner usage, where it was previously free of GitHub charges. The per-minute amount is small, but on a high-volume self-hosted fleet it adds a new cost line that did not exist before. Re-check the "self-hosting makes CI free" assumption against current pricing rather than older guidance.

### Q: Why is running many small parallel jobs sometimes more expensive?

Because each job pays the per-minute rounding independently. Splitting work into many short jobs feels efficient for speed, but ten 20-second jobs bill 10 minutes for under 4 minutes of actual compute, a 200% overhead. The rounding tax favors fewer, slightly longer jobs over many tiny ones. Balance parallelism for speed against the rounding overhead it creates on the bill.

## Next Read

CI is one place defaults quietly accumulate cost. For the broader pattern of paying for capacity and configuration nobody revisited, read [why SaaS teams overpay for infrastructure](https://ravoid.com/blog/why-saas-overpay-infrastructure).

---

### Sources & Further Reading

- [GitHub: Actions runner pricing and minute rounding](https://docs.github.com/billing/reference/actions-runner-pricing)
- [GitHub: 2026 pricing changes for GitHub Actions](https://github.com/resources/insights/2026-pricing-changes-for-github-actions)
- [Mergify: How to cut your GitHub Actions CI bill](https://mergify.com/blog/cut-your-github-actions-ci-bill)
- [CICDcost: 2026 CI/CD pricing baseline](https://cicdcost.com/)

---

_Last updated: July 24, 2026_
