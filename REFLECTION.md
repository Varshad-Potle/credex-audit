# Reflection

## 1. The Hardest Bug I Hit This Week

The hardest bug was the Supabase 500 error on the audit submission. The error code was
PGRST125 — "Invalid path specified in request URL" — which gave no obvious indication
of what was wrong. The tables existed, the schema was correct, the code looked fine.

My first hypothesis was that Row Level Security was blocking the insert. I ran the RLS
policies in the SQL editor — no change. Still 500.

Second hypothesis was that the anon key was wrong. I checked it against the Supabase
dashboard — it matched exactly.

Third hypothesis was the URL itself. I added a console.log to print the Supabase URL
and immediately saw the problem: the URL in .env.local was
`https://project.supabase.co/rest/v1/` instead of `https://project.supabase.co`. The
Supabase client appends `/rest/v1/` automatically — I had doubled it up by copying the
wrong URL from the dashboard.

One character difference. Forty minutes of debugging. The lesson was to log environment
variables earlier — the moment something behaves unexpectedly with an external service,
verify the config first before assuming the code is wrong.

---

## 2. A Decision I Reversed Mid-Week

## 2. A Decision I Reversed Mid-Week

The first decision I reversed was switching from the Anthropic API to Groq for the
AI-generated audit summary. The original plan was to use the Anthropic API since the
assignment explicitly recommended it and I already had an API key set up. I built the
summary route around it, tested the integration, and it looked clean. Then I hit the
credit balance error, my account had no free credits and adding credits required a
payment. Given that this is a 7-day build, paying for an API I would use a handful of
times did not make sense. I switched to Groq which has a genuinely free tier and takes
fifteen minutes to set up. The output quality for a 100-word summary is sufficient
the difference between llama-3.1-8b-instant and Claude Sonnet for this specific task is
not meaningful enough to justify the cost. It was the right call. It also
exposed a dependency risk if I had shipped with Anthropic API, any credit exhaustion
would silently fall back to the template summary with no warning.

The second decision was adding an FAQ section to the landing page. The original plan was
to skip it the landing page had the form and that was enough. When I wrote
LANDING_COPY.md, the FAQ section was part of the required copy. I realized the landing
page had no FAQ despite the copy file describing one, which would be an obvious
inconsistency for any reviewer comparing the two. I added the FAQ section as an
accordion component so it did not clutter the page but was there when needed. This was also the right call the FAQ answers the most common trust objections
("is this actually free", "do you store my data") which a cold visitor landing from a
tweet would have immediately. Removing that friction likely improves email capture rate.

---

## 3. What I Would Build in Week 2

The user interviews revealed two clear gaps that week 2 would address.

First, context window comparison. Aryan's interview made it clear that developers care
about context window size at least as much as cost. Week 2 would add context window data
to every tool in the audit engine — so recommendations say not just "this is cheaper"
but "this gives you 3x the context window at the same price." That is a more useful
recommendation for a developer deciding between Claude and ChatGPT.

Second, per-developer spend view. Bhargav's interview revealed that in small startups,
AI tool spend is decentralized — individual developers buy their own tools and expense
them. Nobody has a consolidated view of total team spend. Week 2 would add a team mode
where multiple developers can input their individual tools and the audit produces a
combined team spend report. This is the feature a CTO at a 10-person startup would
actually want to share with their team.

Third, the shareable URL viral loop needs strengthening. Currently the shared page shows
tools and savings numbers but has no clear CTA for the viewer to run their own audit.
Week 2 would redesign the shared page to make "run your own audit" the dominant action,
with the sharer's results as social proof.

---

## 4. How I Used AI Tools

**Tools used:** Claude (claude.ai) for architecture planning, documentation writing, and
debugging assistance. Groq API (llama-3.1-8b-instant) inside the product for generating
audit summaries.

**What I used Claude for:**
- Scaffolding the initial Next.js project structure and TypeScript types
- Debugging the Supabase PGRST125 error — described the error and got the hypothesis
  about the URL doubling immediately
- Writing first drafts of GTM.md, ECONOMICS.md, and ARCHITECTURE.md which I then edited
  for accuracy and specificity
- Fixing the Next.js 15 params Promise error which I had not encountered before

**What I did not trust AI with:**
- The audit engine logic — every pricing rule and recommendation was written and verified
  by me against official vendor pricing pages. An LLM confidently giving wrong pricing
  data would silently break the core product.
- The user interview insights — AI cannot have real conversations with real people.
- The ECONOMICS.md numbers — the math was mine. Claude suggested a structure but every
  figure was researched and reasoned through independently.

**One specific time the AI was wrong:**
Claude suggested using `claude-sonnet-4-20250514` as the model string for the Anthropic
API call. When I ran it, the API returned a deprecation warning and then a credit balance
error. The model string was outdated and the suggestion to use Anthropic API without
checking free tier availability was wrong for my situation. I caught it because the
error was explicit in the terminal, switched to Groq, and the problem was solved. The
lesson: always verify AI-suggested API model names and service configurations against
current official documentation.

---

## 5. Self-Rating

| Dimension | Rating | Reason |
|---|---|---|
| Discipline | 8/10 | Committed every day across 5+ distinct days, wrote DEVLOG entries daily. Started outreach for user interviews earlier — completed 2 interviews on same day, and one on next day. |
| Code quality | 7/10 | TypeScript types are clean, audit engine is readable and defensible, API routes handle errors gracefully. Test coverage is minimal — only the audit engine is tested, no integration tests. |
| Design sense | 6/10 | The UI is functional and clean but not remarkable. Lighthouse scores pass the threshold. The results page is not yet the "screenshot-worthy" page the assignment describes. |
| Problem solving | 8/10 | Debugged Supabase URL issue, Next.js 15 params Promise error, Groq model deprecation, and ESLint lint failures systematically. Formed hypotheses before making changes. |
| Entrepreneurial thinking | 7/10 | GTM is specific with named channels. ECONOMICS shows real math. User interviews revealed genuine insights that changed the design. Could have gone deeper on the Credex business model and competitive positioning. |