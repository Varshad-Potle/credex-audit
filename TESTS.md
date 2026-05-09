# Tests

## How to Run

```bash
npm test
```

## Test Suite — Audit Engine

File: `lib/auditEngine.test.ts`
Framework: Jest + ts-jest

| # | Test Name | What it Covers |
|---|-----------|---------------|
| 1 | returns zero savings for empty tool list | Edge case — no tools selected, expect zero savings and empty recommendations |
| 2 | marks windsurf free as optimal for single coding user | Optimal path — free plan with no cheaper alternative stays optimal |
| 3 | detects overpaying retail price | Billing audit — user paying more than vendor list price triggers audit recommendation |
| 4 | recommends downgrade when team plan used for too few seats | Plan fit — team plan used below minimum seat threshold triggers downgrade recommendation |
| 5 | total monthly savings equals sum of individual recommendation savings | Math integrity — total savings must equal sum of all per-tool savings |
| 6 | annual savings is exactly 12x monthly savings | Math integrity — annual figure must be exactly 12x monthly |
| 7 | returns one recommendation per tool | Coverage — every tool in input gets exactly one recommendation in output |

## CI

Tests run automatically on every push to `main` via GitHub Actions.
Workflow file: `.github/workflows/ci.yml`
Status: ✅ Green