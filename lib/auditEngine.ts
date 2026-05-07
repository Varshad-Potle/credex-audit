import { ToolName, ToolEntry, FormData, Recommendation, AuditResult, UseCase } from "@/types";
import { PRICING_DATA } from "./pricingData";

// ─── Plan fit rules ───────────────────────────────────────────────────────────

const TEAM_PLAN_MIN_SEATS: Partial<Record<ToolName, Record<string, number>>> = {
    claude: { team: 5, enterprise: 10 },
    chatgpt: { team: 2, enterprise: 10 },
    github_copilot: { enterprise: 10 },
};

// ─── Cross-tool alternatives by use case ─────────────────────────────────────

type Alternative = {
    tool: ToolName;
    plan: string;
    monthlyPricePerSeat: number;
    reason: string;
};

const ALTERNATIVES: Partial<Record<ToolName, Alternative[]>> = {
    cursor: [
        {
            tool: "windsurf",
            plan: "pro",
            monthlyPricePerSeat: 15,
            reason: "Windsurf Pro offers similar AI coding assistance at $15/seat vs Cursor Pro at $20/seat",
        },
        {
            tool: "github_copilot",
            plan: "individual",
            monthlyPricePerSeat: 10,
            reason: "GitHub Copilot Individual provides inline code completion at $10/seat, half the cost of Cursor Pro",
        },
    ],
    github_copilot: [
        {
            tool: "windsurf",
            plan: "pro",
            monthlyPricePerSeat: 15,
            reason: "Windsurf Pro provides a full AI IDE experience with better context awareness for $15/seat vs Copilot Business at $19/seat",
        },
    ],
    chatgpt: [
        {
            tool: "claude",
            plan: "pro",
            monthlyPricePerSeat: 20,
            reason: "Claude Pro offers comparable general-purpose AI at the same price point with stronger document/writing performance",
        },
    ],
    claude: [
        {
            tool: "chatgpt",
            plan: "plus",
            monthlyPricePerSeat: 20,
            reason: "ChatGPT Plus offers similar capability for writing and research at the same price point",
        },
    ],
};

// ─── Core audit logic per tool ────────────────────────────────────────────────

function auditSingleTool(
    entry: ToolEntry,
    teamSize: number,
    useCase: UseCase
): Recommendation {
    const { tool, plan, monthlySpend, seats } = entry;
    const toolInfo = PRICING_DATA[tool];
    const plans = toolInfo.plans;
    const currentPlanInfo = plans[plan];

    // fallback if plan not found in pricing data
    if (!currentPlanInfo) {
        return {
            tool,
            currentPlan: plan,
            currentSpend: monthlySpend,
            recommendedAction: "Verify your plan details",
            recommendedPlan: null,
            monthlySavings: 0,
            annualSavings: 0,
            reason: "We could not find pricing data for this plan. Please verify on the vendor site.",
            isOptimal: false,
        };
    }

    const currentSpendPerSeat = monthlySpend / seats;

    // ── Check 1: Are they paying retail price correctly?
    const expectedSpend = currentPlanInfo.monthlyPricePerSeat * seats;
    const isOverpayingRetail = monthlySpend > expectedSpend * 1.1; // 10% tolerance for taxes/fees

    if (isOverpayingRetail) {
        const savings = monthlySpend - expectedSpend;
        return {
            tool,
            currentPlan: plan,
            currentSpend: monthlySpend,
            recommendedAction: "Audit your billing",
            recommendedPlan: plan,
            monthlySavings: savings,
            annualSavings: savings * 12,
            reason: `You're paying $${monthlySpend}/mo but ${toolInfo.displayName} ${currentPlanInfo.name} for ${seats} seats should cost $${expectedSpend}/mo. Check your billing for extra charges.`,
            isOptimal: false,
        };
    }

    // ── Check 2: Overkill plan for team size
    const minSeats = TEAM_PLAN_MIN_SEATS[tool]?.[plan];
    if (minSeats && seats < minSeats) {
        // find a cheaper plan that fits
        const cheaperPlan = Object.entries(plans).find(([planKey, planVal]) => {
            return (
                planKey !== plan &&
                planVal.monthlyPricePerSeat < currentPlanInfo.monthlyPricePerSeat &&
                planVal.bestFor.includes(useCase) || planVal.bestFor.includes("mixed")
            );
        });

        if (cheaperPlan) {
            const [cheaperPlanKey, cheaperPlanVal] = cheaperPlan;
            const newSpend = cheaperPlanVal.monthlyPricePerSeat * seats;
            const savings = monthlySpend - newSpend;

            return {
                tool,
                currentPlan: plan,
                currentSpend: monthlySpend,
                recommendedAction: `Downgrade to ${cheaperPlanVal.name}`,
                recommendedPlan: cheaperPlanKey,
                monthlySavings: savings,
                annualSavings: savings * 12,
                reason: `${currentPlanInfo.name} plan is designed for teams of ${minSeats}+. With ${seats} seat(s), ${cheaperPlanVal.name} at $${cheaperPlanVal.monthlyPricePerSeat}/seat covers your needs and saves $${savings}/mo.`,
                isOptimal: false,
            };
        }
    }

    // ── Check 3: Is there a cheaper plan from same vendor for their use case?
    const cheaperSameVendor = Object.entries(plans).find(([planKey, planVal]) => {
        return (
            planKey !== plan &&
            planVal.monthlyPricePerSeat < currentPlanInfo.monthlyPricePerSeat &&
            (planVal.bestFor.includes(useCase) || planVal.bestFor.includes("mixed")) &&
            !planVal.isEnterprise
        );
    });

    if (cheaperSameVendor) {
        const [cheaperPlanKey, cheaperPlanVal] = cheaperSameVendor;
        const newSpend = cheaperPlanVal.monthlyPricePerSeat * seats;
        const savings = monthlySpend - newSpend;

        if (savings > 0) {
            return {
                tool,
                currentPlan: plan,
                currentSpend: monthlySpend,
                recommendedAction: `Downgrade to ${cheaperPlanVal.name}`,
                recommendedPlan: cheaperPlanKey,
                monthlySavings: savings,
                annualSavings: savings * 12,
                reason: `For ${useCase} workflows with ${seats} seat(s), ${toolInfo.displayName} ${cheaperPlanVal.name} at $${cheaperPlanVal.monthlyPricePerSeat}/seat provides sufficient capability and saves $${savings}/mo.`,
                isOptimal: false,
            };
        }
    }

    // ── Check 4: Is there a cheaper cross-tool alternative?
    const alternatives = ALTERNATIVES[tool];
    if (alternatives) {
        const bestAlternative = alternatives
            .filter((alt) => {
                const altPlanInfo = PRICING_DATA[alt.tool]?.plans[alt.plan];
                return altPlanInfo && alt.monthlyPricePerSeat * seats < monthlySpend;
            })
            .sort((a, b) => a.monthlyPricePerSeat - b.monthlyPricePerSeat)[0];

        if (bestAlternative) {
            const newSpend = bestAlternative.monthlyPricePerSeat * seats;
            const savings = monthlySpend - newSpend;

            return {
                tool,
                currentPlan: plan,
                currentSpend: monthlySpend,
                recommendedAction: `Switch to ${PRICING_DATA[bestAlternative.tool].displayName} ${bestAlternative.plan}`,
                recommendedPlan: bestAlternative.plan,
                monthlySavings: savings,
                annualSavings: savings * 12,
                reason: bestAlternative.reason,
                isOptimal: false,
            };
        }
    }

    // ── No savings found — already optimal
    return {
        tool,
        currentPlan: plan,
        currentSpend: monthlySpend,
        recommendedAction: "No change needed",
        recommendedPlan: plan,
        monthlySavings: 0,
        annualSavings: 0,
        reason: `${toolInfo.displayName} ${currentPlanInfo.name} is well-matched for your team size and ${useCase} use case.`,
        isOptimal: true,
    };
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function runAudit(formData: FormData): AuditResult {
    const { tools, teamSize, useCase } = formData;

    const recommendations = tools.map((entry) =>
        auditSingleTool(entry, teamSize, useCase)
    );

    const totalMonthlySavings = recommendations.reduce(
        (sum, r) => sum + r.monthlySavings,
        0
    );

    const totalAnnualSavings = totalMonthlySavings * 12;

    return {
        formData,
        recommendations,
        totalMonthlySavings,
        totalAnnualSavings,
    };
}