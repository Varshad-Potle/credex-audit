## Day 1 — 2026-05-07

**Hours worked:** 2

**What I did:** Initialized Next.js + TypeScript + Tailwind project. Built folder structure, TypeScript types, pricing data for 8 AI tools, audit engine core logic, Supabase schema and client, three API routes (audit, leads, summary), SpendForm component with localStorage persistence, and landing page. Deployed to Vercel.

**What I learned:** Vercel deployment was quick. Added supabase table using the sql editor. Took time to install next.js and other dependencies

**Blockers / what I'm stuck on:** File: /api/summary/route.ts - body could be undefined, so I initialized body to {} instead of leaving it as undefined. So in try block body.audit is safe; in catch block if req.json() threw before assignment body is still {} so body.audit returns undefined.

**Plan for tomorrow:** Build audit results page at /audit/[id], wire Anthropic summary API call, add shareable URL with OG tags.


## Day 2 — 2026-05-08

**Hours worked:** 2.5

**What I did:** Built audit results page, AuditResults component, LeadCapture modal, ShareButton component. Fixed Supabase URL misconfiguration, Next.js 15 params Promise issue, and leads API 400 error. Switched from Anthropic API to Groq free tier for AI summary after hitting credit limits. Fixed deprecated llama3-8b-8192 model. Full end-to-end flow working — form to results to lead capture to AI summary.

**What I learned:**  Next.js 15 made params a Promise, Supabase URL must be base URL only

**Blockers / what I'm stuck on:** Resend transactional email not configured yet.

**Plan for tomorrow:** Write audit engine tests, set up GitHub Actions CI, configure Resend email, write PRICING_DATA.md.

## Day 3 — 2026-05-09

**Hours worked:** 2

**What I did:** Added 7 Jest unit tests for audit engine, all passing. Set up GitHub Actions CI workflow — lint and tests run on every push to main, currently green. Configured Resend transactional email — users now receive audit report link after lead capture. Fixed all lint errors (Link component, escaped entities, unused vars, setState in effect). Created PRICING_DATA.md with verified vendor pricing and TESTS.md.

**What I learned:** Jest config must be .js not .ts in CI environments without ts-node. ESLint setState-in-effect rule requires inline disable comment not useEffect dependency comment.

**Blockers / what I'm stuck on:** 1 User interview remaining done 2/3.

**Plan for tomorrow:** Write all required markdown files — ARCHITECTURE.md, REFLECTION.md, GTM.md, ECONOMICS.md, LANDING_COPY.md, METRICS.md, PROMPTS.md, README.md.

## Day 4 — 2026-05-10

**Hours worked:** 5

**What I did:** Researched and verified pricing for all 8 AI tools against official vendor pages before writing PROMPTS.md, ARCHITECTURE.md, README.md, GTM.md, ECONOMICS.md, LANDING_COPY.md, METRICS.md. Researched distribution channels (specific subreddits, Discord servers, Slack groups) and unit economics benchmarks for B2B lead-gen tools at this stage. Added accordion FAQ section to landing page. Fixed Resend email HTML rendering. Conducted 2 of 3 required user interviews.

**What I learned:** Documentation is harder than coding. GTM and ECONOMICS require actual thinking about the business, not just filling a template. User interviews revealed that context window size matters more to users than cost — something the audit engine doesn't currently account for. Switching cost is a real objection to tool recommendations that needs to be addressed in how alternatives are presented.

**Blockers / what I'm stuck on:** One user interview pending. REFLECTION.md and USER_INTERVIEWS.md pending.

**Plan for tomorrow:** Complete third interview, write USER_INTERVIEWS.md and REFLECTION.md, final polish and Lighthouse audit.

## Day 5 — 2026-05-11

**Hours worked:** 4

**What I did:** Ran Lighthouse audit on Vercel URL — Performance 99 (incognito), Accessibility 100, Best Practices 100, SEO 100. Fixed performance issues by dynamically importing SpendForm and adding aria-labels to Select components. Completed third user interview (Bhargav K., remote dev at Australia-based startup). Updated USER_INTERVIEWS.md with all 3 interviews. Wrote REFLECTION.md.

**What I learned:** Chrome extensions skew Lighthouse scores significantly — always test in incognito. Real user interviews consistently reveal insights that contradict initial assumptions.

**Blockers / what I'm stuck on:** Final end-to-end tests and file verifcation.

**Plan for tomorrow:** Write Day 6 and Day 7 DEVLOG entries, final end-to-end test, submit Google Form.