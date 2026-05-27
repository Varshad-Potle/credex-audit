# Round 2 Tests

All tests are in `lib/auditEngine.test.ts`. Run with `npm test`.

## Test Summary

**Total: 17 tests, all passing**

### Existing Tests (10)
- Audit engine outputs recommendations
- Team size cost calculation
- Plan recommendations (overpaying, team overkill, alternatives)
- Audit structure is valid
- Pricing snapshot serialization

### New Tests Added in Round 2 (7)

**Pricing Detection (3 tests)**
- Detect price increases in tools
- Identify which audits are affected by pricing changes
- Correctly skip audits for tools that didn't change pricing

**Email Consolidation (3 tests)**
- Group multiple audits by email address
- Consolidate to 1 email per user (avoid spam)
- Pass pricing changes through unchanged to email

**Diff View (1 test)**
- Re-running same audit produces consistent results (verifies diff view reliability)

## How to Run Tests

```bash
npm test
```

Output:
Test Suites: 1 passed, 1 total
Tests:       17 passed, 17 total
Snapshots:   0 total

## What's NOT Tested

- **Integration tests** — no tests for full email flow (detect → consolidate → send)
- **API route tests** — routes are tested manually, not with Jest
- **Resend email sending** — mocked in sendPricingChangeNotifications(), not actually sent
- **Database operations** — Supabase calls are tested manually on Vercel

With 24 more hours, first priority would be integration tests using jest mocks for Supabase and Resend.

## Manual Testing Checklist

- [x] Create audit with email → captures pricing snapshot
- [x] Update PRICING_DATA → pricing change detected
- [x] POST /api/detect-changes → finds affected audits
- [x] POST /api/send-pricing-emails → sends to correct emails
- [x] Click email link → /audit/[id]/diff loads
- [x] Diff page shows old vs new side-by-side
- [x] Savings delta displays correctly