# LLM Prompts

## AI Summary Prompt

Used in: `app/api/summary/route.ts`
Model: `llama-3.1-8b-instant` via Groq

### Final Prompt
You are a concise financial advisor for startup AI tool spend. Write a 100-word personalized audit summary for a {teamSize}-person team primarily using AI for {useCase}.
Their current tools:
{toolsSummary}
Total potential monthly savings: ${totalMonthlySavings}

Total potential annual savings: ${totalAnnualSavings}
Write a direct, specific summary. Lead with the most impactful finding. Use exact numbers. Do not use bullet points. Do not be generic. Sound like a CFO giving a quick verbal briefing, not a chatbot.

### Why I wrote it this way

The goal was a summary that sounds like a real financial advisor, not a chatbot. Early versions were too generic — they would say things like "consider optimizing your AI spend" without citing specific tools or numbers. Three things fixed this:

1. Injecting exact dollar figures forces the model to anchor on real numbers rather than vague language.
2. "Sound like a CFO giving a quick verbal briefing" consistently produced tighter, more authoritative output than "be concise" or "be professional."
3. Explicitly saying "do not use bullet points" was necessary — without it, the model defaulted to lists every time.

### What I tried that didn't work

**Version 1 — Too vague:**
Summarize this AI spend audit in 100 words.
Result: Generic summaries with no specific numbers, read like marketing copy.

**Version 2 — Too prescriptive:**
Write exactly 3 sentences. Sentence 1: total savings. Sentence 2: biggest opportunity. Sentence 3: next step.
Result: Robotic, formulaic output. Lost the advisory tone entirely.

**Version 3 — Wrong persona:**
You are a helpful assistant. Summarize the following audit results for a startup team.
Result: Overly friendly, hedged language ("you might want to consider"), not actionable.

### Fallback behavior

If the Groq API fails for any reason, the app falls back to a deterministic templated summary generated in `generateFallbackSummary()`. This ensures the results page never shows an empty summary section. The fallback uses the same audit data but constructs the sentence programmatically without an LLM call.

### Note on audit engine

The audit engine itself uses zero LLM calls. All plan-fit logic, savings calculations, and recommendations are hardcoded rules in `lib/auditEngine.ts`. This was a deliberate decision — LLMs are unreliable for financial math and would make the audit non-deterministic. A finance person should be able to read the rules and agree with them. AI is used only where it adds genuine value: natural language summarization.