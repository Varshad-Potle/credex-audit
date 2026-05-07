import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { AuditResult } from "@/types";
import { PRICING_DATA } from "@/lib/pricingData";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function generateFallbackSummary(audit: AuditResult): string {
  const { totalMonthlySavings, recommendations, formData } = audit;
  const optimalCount = recommendations.filter((r) => r.isOptimal).length;
  const totalTools = recommendations.length;

  if (totalMonthlySavings === 0) {
    return `Your AI tool stack looks well-optimized for a ${formData.teamSize}-person team focused on ${formData.useCase}. All ${totalTools} tools are on plans that match your usage. Keep an eye on spend as your team grows — plan-fit changes quickly at scale.`;
  }

  const topSaving = [...recommendations].sort(
    (a, b) => b.monthlySavings - a.monthlySavings
  )[0];

  return `Your audit found $${totalMonthlySavings}/month in potential savings across your ${totalTools} AI tools. The biggest opportunity is ${PRICING_DATA[topSaving.tool].displayName}, where ${topSaving.recommendedAction} could save $${topSaving.monthlySavings}/month. ${optimalCount} of your ${totalTools} tools are already on optimal plans. Annualized, these changes represent $${audit.totalAnnualSavings} back in your budget.`;
}

export async function POST(req: NextRequest) {
  let body: { audit?: AuditResult } = {};
  try {
    body = await req.json();
    const audit = body.audit;

    if (!audit) {
      return NextResponse.json(
        { error: "Audit data required" },
        { status: 400 }
      );
    }

    const toolsSummary = audit.recommendations
      .map(
        (r) =>
          `${PRICING_DATA[r.tool].displayName}: ${r.currentPlan} plan, $${r.currentSpend}/mo, ${r.isOptimal ? "optimal" : `save $${r.monthlySavings}/mo by: ${r.recommendedAction}`}`
      )
      .join("\n");

    const prompt = `You are a concise financial advisor for startup AI tool spend. Write a 100-word personalized audit summary for a ${audit.formData.teamSize}-person team primarily using AI for ${audit.formData.useCase}.

Their current tools:
${toolsSummary}

Total potential monthly savings: $${audit.totalMonthlySavings}
Total potential annual savings: $${audit.totalAnnualSavings}

Write a direct, specific summary. Lead with the most impactful finding. Use exact numbers. Do not use bullet points. Do not be generic. Sound like a CFO giving a quick verbal briefing, not a chatbot.`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    });

    const summary =
      message.content[0].type === "text"
        ? message.content[0].text
        : generateFallbackSummary(audit);

    return NextResponse.json({ summary });
  } catch (err) {
    console.error("Summary API error:", err);
    // graceful fallback — never crash the results page
    const fallback = body?.audit
      ? generateFallbackSummary(body.audit)
      : "Unable to generate summary. Please try again.";
    return NextResponse.json({ summary: fallback });
  }
}