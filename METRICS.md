# Metrics

## North Star Metric

**Audits completed per week**

This is the single number that captures whether the tool is working. An audit completed means a user arrived, understood the value, filled the form, and got a result. It is the moment value is delivered. Everything upstream (traffic, form completion rate) and downstream (email capture, consultation bookings) flows from this number.

Why not email captures? Email captures measure our ability to convert, not our ability to deliver value. A tool that delivers value to 1,000 people but captures 50 emails is more useful to Credex than a tool that captures 200 emails from 200 confused users.

Why not consultation bookings? Too far down the funnel to be a leading indicator. By the time a booking happens, three other things had to go right first.

---

## 3 Input Metrics That Drive the North Star

**1. Landing page to form submission rate**
If users land and immediately leave, the hero copy or form UX is broken. Target: 40%+ of visitors start filling the form. Below 25% triggers a copy or UX review.

**2. Form started to audit completed rate**
Users who start the form but don't submit are dropping off mid-funnel. This could mean the form is too long, plan dropdowns are confusing, or the monthly spend input feels invasive. Target: 70%+ completion rate among users who add at least one tool.

**3. Shareable URL click-through rate**
How often does a shared audit URL result in a new visitor starting their own audit. This measures the viral coefficient of the product. Target: 15%+ of shared URL views result in a new audit started. Below 5% means the shared page is not compelling enough to drive action.

---

## What to Instrument First

In order of priority:

1. **Audit completions** — fire an event every time `/api/audit` returns 200. This is the North Star, instrument it first.
2. **Form drop-off point** — track which step users abandon (no tools added, form started but not submitted). Identifies the biggest leak in the funnel.
3. **Email capture rate** — what percentage of audit completions result in an email submission. Measures post-value conversion.
4. **Shared URL views vs new audits started** — measures viral coefficient.
5. **Consultation bookings** — track clicks on the Credex consultation CTA on high-savings result pages.

Implementation: Plausible Analytics or Posthog (both have free tiers). Avoid Google Analytics — privacy-conscious founders will notice and distrust the tool.

---

## What Number Triggers a Pivot Decision

**If audit completion rate drops below 20% of landing page visitors for 2 consecutive weeks**, the core value proposition is not landing. At that point the right move is not to optimize the form — it is to go back to user interviews and understand why people are not completing audits.

**If email capture rate drops below 10% of audit completions**, the results page is not delivering enough perceived value to motivate action. The audit logic or results UI needs a rethink.

**If zero consultation bookings occur in the first 30 days despite audits showing >$500/mo savings**, the Credex CTA placement or copy is broken, or the savings numbers are not credible to users. Either fix the CTA or revisit the audit logic defensibility.

The metric that should never trigger a pivot: raw traffic numbers in week 1. Traffic is a distribution problem, not a product problem. Low traffic in week 1 is expected and fixable. Low completion rates are a product problem and require immediate attention.