# feat: add re-audit on pricing change with email notifications

## What this PR does

This PR makes audits live instead of one-time. When AI tool pricing changes, affected users get an email with what changed and a link to re-run their audit. The new audit shows side-by-side comparison with the original, highlighting the savings delta.

## Why

Pricing for AI tools changes monthly — Cursor raised prices in 2024, Claude added new tiers in 2025, Copilot restructured plans. A static audit becomes old instantly. Users need to know when their recommendations change, not 6 months later.

## How it works

### Data flow
User submits audit
↓
We save: form input + pricing snapshot
↓
[Later] Pricing changes
↓
POST /api/detect-changes runs
↓
Compares current pricing vs stored snapshots
↓
Finds affected audits + users
↓
POST /api/send-pricing-emails sends consolidated emails
↓
User clicks "View Updated Audit" link
↓
GET /audit/[id]/diff re-runs audit with current pricing
↓
Shows old vs new side-by-side with delta

### New files

- `lib/pricingComparison.ts` — detects pricing changes, flags affected audits
- `lib/emailNotifications.ts` — builds email HTML, consolidates per user, sends via Resend
- `app/api/detect-changes/route.ts` — manual endpoint to trigger detection
- `app/api/send-pricing-emails/route.ts` — manual endpoint to send emails
- `components/results/AuditDiff.tsx` — diff comparison component
- `app/audit/[id]/diff/page.tsx` — diff view route

### Changes to existing

- `app/api/audit/route.ts` — now captures `userEmail` and `pricing_snapshot` on submit
- `components/form/SpendForm.tsx` — prompts user for email before submission
- `lib/auditEngine.test.ts` — added 7 new tests

## What I cut

- **Unsubscribe links in emails** — would add complexity with tracking. Value/effort ratio didn't justify 36h timeline. Users can ignore future emails if pricing stays stable.
- **Scheduled cron for auto-detection** — Vercel Cron requires Pro tier. Manual `/api/detect-changes` endpoint is sufficient for MVP. Can add scheduler later.
- **"What's new in AI tools" public page** — interesting growth surface but not core to the feature. Requires aggregating all detected changes. Deferred.
- **Admin dashboard for metrics** — would show total audits, emails sent, CTR. Not required for functionality. Added DEVLOG instead to show work.
- **Notification preferences UI** — allowing users to opt-in/out of emails. Manual endpoint users can control who gets notified.

## How to test it manually

**Step 1: Create an audit with email**
Go to / → fill form with 2+ tools → enter email when prompted → submit → see results page

**Step 2: Manually update pricing in PRICING_DATA**
Edit lib/pricingData.ts → change one tool's price (e.g., Cursor Pro from $20 to $25) → save

**Step 3: Trigger detection**
POST http://localhost:3000/api/send-pricing-emails
Check console logs or Resend dashboard → should show email sent to the user from Step 1

**Step 5: Click email link and see diff**
Email contains link like: http://localhost:3000/audit/[id]/diff
Click it → see original vs updated recommendations side-by-side
Hero metric shows savings delta: "$XX/mo"
## What's tested

- Pricing snapshot captures correctly on audit creation (test 8)
- Pricing changes are detected (tests 9–11)
- Email consolidation groups by user, avoiding spam (tests 15–17)
- Diff view shows consistent results (tests 12–14)
- All 17 tests passing, no integration tests (skipped due to time for preparation of college exams)

## Open questions / risks

- **Email deliverability in production** — using Resend free tier. May have rate limits or sandbox restrictions. Haven't tested with real Vercel deployment yet.
- **Scaling:** If 10,000+ audits stored, the `/api/detect-changes` endpoint fetches all of them. Should add pagination/filtering in week 2.
- **Stale pricing snapshots** — if users don't re-audit for 6 months, their old snapshot may be way out of date. Should consider timestamp-based invalidation.