import { PlanInfo, PRICING_DATA } from "./pricingData";
import { AuditResult } from "@/types";

export type PricingChange = {
  tool: string;
  changeType: "price_changed" | "plan_added" | "plan_removed";
  details: string;
};

type PricingSnapshot = Record<
  string,
  {
    displayName: string;
    plans: Record<string, Partial<PlanInfo>>;
  }
>;

export function detectPricingChanges(
  oldSnapshot: PricingSnapshot
): PricingChange[] {
  const changes: PricingChange[] = [];

  // Check if any tool pricing has changed
  Object.entries(PRICING_DATA).forEach(([toolKey, currentTool]) => {
    const oldTool = oldSnapshot[toolKey];

    if (!oldTool) {
      changes.push({
        tool: toolKey,
        changeType: "plan_added",
        details: `${currentTool.displayName} added new tool or plans`,
      });
      return;
    }

    // Check for price changes in each plan
    Object.entries(currentTool.plans).forEach(([planKey, currentPlan]) => {
      const oldPlan = oldTool.plans?.[planKey];

      if (!oldPlan) {
        changes.push({
          tool: toolKey,
          changeType: "plan_added",
          details: `${currentTool.displayName}: new plan "${planKey}"`,
        });
        return;
      }

      // Compare monthly price per seat
      if (
        oldPlan.monthlyPricePerSeat !==
        currentPlan.monthlyPricePerSeat
      ) {
        changes.push({
          tool: toolKey,
          changeType: "price_changed",
          details: `${currentTool.displayName} ${planKey}: was $${oldPlan.monthlyPricePerSeat}/month, now $${currentPlan.monthlyPricePerSeat}/month`,
        });
      }
    });

    // Check for removed plans
    if (oldTool.plans) {
      Object.keys(oldTool.plans).forEach((oldPlanKey) => {
        if (!currentTool.plans[oldPlanKey]) {
          changes.push({
            tool: toolKey,
            changeType: "plan_removed",
            details: `${currentTool.displayName}: plan "${oldPlanKey}" no longer available`,
          });
        }
      });
    }
  });

  return changes;
}

export function auditAffectedByChanges(
  audit: AuditResult,
  changes: PricingChange[]
): boolean {
  if (changes.length === 0) return false;

  // Check if any of the user's tools have changed pricing
  const changedTools = new Set(changes.map((c) => c.tool));

  return audit.formData.tools.some((t) => changedTools.has(t.tool));
}