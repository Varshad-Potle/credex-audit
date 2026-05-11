# User Interviews

Three conversations with potential users conducted during the week of May 7–12, 2026.
Each interview was 10–15 minutes, conducted over call.

---

## Interview 1 — Ayush U.

**Role:** Software Developer

**Company stage:** Early-stage startup (tool subscription provided by company)

**Date:** May 8, 2026

### Notes

Uses Cursor as primary AI coding tool. Subscription is company-provided. Satisfied with
current tool performance, particularly the context window. Uses it primarily for coding
and development tasks.

### Direct Quotes

> "I am satisfied with the performance of the current tool I am using but I would
> definitely give a shot to a tool that tells about downgrading my paid premium to free
> version for specific tasks with same performance."

> "The whole memory and response types are different for the tool you switch to 
> switching cost is high, once you get familiar with one tool for long even if you find a cheaper alternative it's hard to switch."

> "I would love a platform that can track usage and provide free alternatives to paid
> resources which provide same performance."

### Most Surprising Thing

Ayush is satisfied with his current tool and has no cost complaints — yet he would
still use SpendAudit if it told him which specific tasks could be done on a free tier.
The assumption going in was that pain around cost drives usage. His response revealed
the real driver is **task-level optimization**, not wholesale tool switching.

### What It Changed About the Design

The audit results page originally framed all recommendations as full plan switches.
Ayush's insight pushed toward surfacing "use free tier for X tasks" messaging alongside
plan downgrade recommendations — acknowledging that switching cost is a real objection
that the tool needs to address, not ignore.

---

## Interview 2 — Aryan B.

**Role:** Software Developer

**Company stage:** Startup (tool subscription provided by company, ~2,100 rupees/month total AI spend over him)

**Date:** May 8, 2026

### Notes

Uses Claude Opus 4.6. Company spends approximately 2,100 rupees/month on AI subscriptions
across the team. Feels Claude is the best tool available. Does not track spend personally.
Main frustration is context window limitations.

### Direct Quotes

> "I currently do not track expenses but the most annoying issue is context window of
> tool, some tools provide smaller context window as compared to other for same task."

> "If I could have a platform that helps me manage tokens I would definitely give it a
> shot."

> "A tool that tells me what AI tool to upgrade or downgrade to for larger context window
> that would be more useful than just cost savings."

### Most Surprising Thing

Aryan does not care about cost at all — his company pays 2,100 rupees/month and he has never
questioned it. What he cares about is **context window size and token efficiency**, not
price. He would switch tools for a larger context window even if it cost more. This
directly contradicts the assumption that spend optimization is the primary user motivation.

### What It Changed About the Design

The audit engine was purely cost-focused. Aryan's insight revealed a gap — users also
want to know which tool gives the best context window for their use case. This suggested
adding context window data to tool recommendations so users can make capability-vs-cost
tradeoffs, not just cost-vs-cost comparisons.

---

## Interview 3 — Bhargav K. 

**Role:** Backend Developer (Python)

**Company stage:** Early-stage startup (Australia based), 10-person team, decentralized tool purchasing

**Date:** May 11, 2026

### Notes

Works at a 10-person startup where all information including tool decisions is shared
openly across the team. Developers choose their own AI tools, purchase them personally,
then raise an invoice for reimbursement at the start of each month. The CTO sets no
mandatory tool list — individual output is what matters. Different team members use
different tools (Codex, Claude, others) based on personal preference.

### Direct Quotes

> "I don't track AI tool spend as long as I meet the monthly target of my chores 
> neither does it matter more, it is more dependent on how well the AI tool works. CTO
> is more focused towards work output than spending."

> "CTO doesn't provide a list to choose he just asks the dev to tell what tool they
> prefer and just tell them how much it would cost. Then I buy that AI tool myself,
> raise an invoice, and the company reimburses it at the beginning of the month. CTO
> allows devs to choose plans and tools as per requirement doesn't have to be a tool
> that the mass uses, can be a tool that is used less by devs but works well for that
> individual dev. Output of their tasks matter."

> "Tools bought from mobile devices usually have less tax associated so I buy on mobile
> and not on laptop."

### Most Surprising Thing

The mobile vs laptop taxation difference was completely unexpected. Individual developers
are already doing informal cost optimization just not in a structured way. Also
surprising: the CTO has no spreadsheet of total AI tool spend. In a 10-person team
spending across multiple tools and reimbursing individually, nobody actually knows the
total monthly AI bill. SpendAudit could serve as the first consolidated view of that
number.

### What It Changed About the Design

The assumption was that the primary user is a CTO or engineering manager trying to
optimize team spend top-down. Bhargav's interview revealed that in small startups, spend
is decentralized the individual developer is the real decision maker. This shifts the
positioning: SpendAudit is useful not just for CTOs auditing team spend, but for
individual developers who want to justify their tool choice or find personal optimizations
before raising an invoice.