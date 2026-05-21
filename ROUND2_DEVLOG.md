# Round 2 Devlog — Re-audit on Pricing Change

## 2026-05-20 23:30 – Start

Read assignment. Planning to:
1. Add email + pricing_snapshot columns to audits table
2. Build pricing detection engine
3. Email notifications with consolidation
4. Diff view for re-audits

Using Supabase for storage (already have it), manual /api/detect-changes endpoint (simpler than Vercel Cron for this deadline).

## 2026-05-21 00:15 – Database Schema

Added email and pricing_snapshot columns to audits table in Supabase. Created index on user_email for later queries.

## 2026-05-21 00:30 – Updated Audit Endpoint

Modified POST /api/audit to:
- Accept userEmail in request body
- Capture full PRICING_DATA snapshot at audit time
- Store both to database

Also updated SpendForm to prompt for email before submission.

## 2026-05-21 01:00 – Pricing Comparison Logic

Built lib/pricingComparison.ts:
- detectPricingChanges() compares current vs old pricing
- auditAffectedByChanges() checks if user's tools were affected

Created POST /api/detect-changes endpoint that:
- Fetches all audits
- Detects price changes
- Returns which audits are affected

(took a 15 min break...)

## 2026-05-21 01:45 – Tests for Phase 1 & 2

Added 3 new tests:
- Pricing snapshot serialization works
- Detects when user's tool pricing changed
- Ignores changes to tools user doesn't use

All 11 tests passing.

## 2026-05-21 02:10 – Email Notifications Phase

Building email template and sending logic:
- lib/emailNotifications.ts: email HTML template, consolidation by user email
- app/api/send-pricing-emails/route.ts: orchestrates detection + consolidation + sending

Key decision: consolidate multiple affected audits into one email per user to avoid spam.

## 2026-05-21 02:25 – Blocker
Trying to commit a file with typo lost 5 minutes figuring out.

## 2026-05-21 02:30 – Email Endpoint Complete

POST /api/send-pricing-emails now:
- Fetches all audits with emails
- Detects pricing changes
- Finds which audits are affected
- Consolidates notifications (1 per user)
- Sends via Resend

Tested flow locally — endpoint works, no actual emails sent yet (would need real email in Resend).

## 2026-05-21 12:00 – Diff View Implementation

Built the diff comparison flow:
- components/results/AuditDiff.tsx: side-by-side old vs new, highlights changes
- app/audit/[id]/diff/page.tsx: re-runs audit with current pricing, shows delta

Key design: savings delta is the hero metric. Shows users exactly what changed in dollars.

## 2026-05-20 12:35 – Diff Tests

Added 3 new tests:
- Savings delta calculation works
- Re-running same audit produces consistent results
- Diff correctly identifies which recommendations changed

All 14 tests passing.

## Next: Final polish and required markdown files