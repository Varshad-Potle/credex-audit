# Round 2 Reflection

## 1. The Hardest Trade-off I Made

The hardest trade-off was skipping scheduled cron jobs. I knew exactly what I was giving up because I built StatusPulse before — I've seen cron jobs fail silently, miss windows, cause cascading bugs. The pain was real and fresh in my mind.

The alternative I chose was a manual `/api/detect-changes` endpoint. It works for MVP, but it's brittle. If nobody calls it, stale pricing changes go unnoticed. If someone calls it at 2 AM, data is fresh then but stale by noon. With StatusPulse, I learned that scheduled jobs are how you guarantee consistency.

I justified it: 36 hours is tight, Vercel Cron requires Pro tier, manual is "good enough" for submission. But knowing the weakness and accepting it anyway was uncomfortable. It felt like shipping code I knew would frustrate users if this shipped to production.

## 2. First Thing I'd Do in 24 More Hours

Implement cron job. I'd use GitHub Actions scheduled workflow calling `/api/detect-changes` at 2 AM UTC daily. Takes ~2 hours, costs zero, and transforms the feature from "manual trigger" to "actually live."

Second would be pagination on the detection logic. In Distributed Job Processing, I learned that fetching large number of rows into memory breaks under load. The detect-changes endpoint currently fetches all audits without pagination. A simple `offset` and `limit` would fix it another hour.

Both are architectural, not feature-adding. Both make the code production-ready instead of demo-ready.

## 3. What Round 1 Self Made Harder for Round 2 Self

Form structure. In Round 1, the tool input form mixed UI state (loading, error) with data state (which tools the user selected). Round 2 needed to persist the pricing snapshot alongside the audit, but the form had no awareness of pricing data.

I should have built the form to be pricing-aware from the start — knowing which tool pricing it was using, storing that data as the user entered it. Instead, I had to retrofit it in the SpendForm component with an extra API call to grab current pricing at submission time.

Lesson: In Round 1, I should have thought about "what data needs to follow this submission" before designing the form. Data structure shapes everything downstream.