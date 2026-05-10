# Unit Economics

## What a Converted Lead is Worth to Credex

Credex sells discounted AI credits. Assume:
- Average credit purchase: $500 (conservative — teams buying Cursor/Claude/ChatGPT enterprise spend more)
- Credex margin: 20% on discounted credits = $100 gross profit per transaction
- Repeat purchases: a team that saves money through Credex credits likely repurchases every 3–6 months
- LTV estimate: 3 purchases over 18 months = $300 LTV per converted customer

**One converted customer = ~$300 LTV**

This is conservative. Enterprise customers buying $5,000+ in credits represent $1,000+ LTV.

---

## CAC at Each GTM Channel

| Channel | Effort | Est. Users | Email Capture Rate | Leads | Consult Bookings | CAC |
|---|---|---|---|---|---|---|
| Reddit posts | 2 hrs/week | 80 | 20% | 16 | 1–2 | $0 cash, ~$30 time |
| Hacker News Show HN | 1 post | 200 | 15% | 30 | 3–4 | $0 cash, ~$10 time |
| Discord/Slack DMs | 3 hrs/week | 40 | 25% | 10 | 1 | $0 cash, ~$45 time |
| Twitter thread | 1 hr/week | 60 | 10% | 6 | 0–1 | $0 cash, ~$15 time |
| Credex email list | 1 email | 500 | 30% | 150 | 15–20 | $0 (existing asset) |

**Blended CAC across all channels: effectively $0 cash.** Time cost per converted customer is approximately $10–$50 depending on channel, which at $300 LTV is a strong return.

---

## Conversion Funnel
Landing page visits       1,000
↓ Audit completed          400    (40% completion rate)
↓ Email captured           100    (25% of completions — value shown first)
↓ Consultation booked       10    (10% of emails — only high-savings cases prompted)
↓ Credit purchase            4    (40% close rate on consultations)

**Funnel math:**
- 1,000 visitors → 4 customers
- 0.4% visitor-to-customer conversion
- At $300 LTV: $1,200 revenue per 1,000 visitors

For the tool to be profitable it needs to drive consistent traffic. At 500 visitors/day (achievable post-HN spike with ongoing content), that is 2 customers/day or ~$600/day revenue.

---

## Conversion Rates Needed for Profitability

Credex's cost to run this tool:
- Vercel hosting: $0–$20/month
- Supabase: $0 (free tier)
- Resend: $0 (free tier up to 3,000 emails/month)
- Groq API: $0 (free tier)
- Developer time (maintenance): ~2 hrs/month

**Effective monthly cost: ~$20**

Break-even: 1 credit purchase per month ($100 gross profit) covers all costs.
The tool is profitable from the first customer. Every subsequent conversion is pure margin.

---

## Path to $1M ARR in 18 Months

**Target: $1,000,000 ARR = ~$83,333/month revenue**

At $300 LTV per customer:
- Need ~278 new customers per month
- At 40% close rate on consultations: need ~695 consultations/month
- At 10% consult booking rate: need ~6,950 email leads/month
- At 25% email capture rate: need ~27,800 audit completions/month
- At 40% completion rate: need ~69,500 landing page visits/month

**69,500 visits/month = ~2,300/day**

This is achievable if:
1. The Show HN post drives an initial spike of 5,000–10,000 visits
2. The shareable audit URL creates organic referral loops — each shared result brings 2–3 new visitors
3. The data blog post ("what teams overspend on most") ranks for long-tail SEO terms within 6 months
4. Credex sales team closes larger enterprise deals ($5,000+ purchases) which compress the customer count needed

**Sensitivity check:**
If average LTV is $600 (one enterprise customer per 10 SMB customers), the monthly customer target drops to ~139, requiring only ~35,000 visits/month — a much more achievable number within 18 months.

**What must be true for this to work:**
1. Shareable URL actually gets shared — audit results must be surprising enough to post
2. Credex consultation close rate holds at 40%+ — requires a strong sales motion
3. At least one high-traffic content piece (HN, viral tweet, or SEO article) drives sustained baseline traffic
4. Pricing data stays accurate — a wrong recommendation destroys trust instantly