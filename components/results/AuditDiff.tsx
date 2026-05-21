"use client";

import { AuditResult } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PRICING_DATA } from "@/lib/pricingData";

type Props = {
  oldAudit: AuditResult;
  newAudit: AuditResult;
};

export default function AuditDiff({ oldAudit, newAudit }: Props) {
  const monthlySavingsDelta =
    newAudit.totalMonthlySavings - oldAudit.totalMonthlySavings;
  const annualSavingsDelta =
    newAudit.totalAnnualSavings - oldAudit.totalAnnualSavings;

  const isDeltaPositive = monthlySavingsDelta > 0;

  return (
    <div className="space-y-8">
      {/* ── Hero: Savings Delta ── */}
      <Card
        className={
          isDeltaPositive
            ? "border-green-500 bg-green-50 dark:bg-green-950"
            : "border-orange-500 bg-orange-50 dark:bg-orange-950"
        }
      >
        <CardContent className="pt-6 text-center space-y-2">
          <p className="text-sm text-muted-foreground uppercase tracking-wide font-medium">
            Savings Impact from Pricing Changes
          </p>
          <p
            className={`text-5xl font-bold ${
              isDeltaPositive ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"
            }`}
          >
            {isDeltaPositive ? "+" : ""}${Math.abs(monthlySavingsDelta).toLocaleString()}/mo
          </p>
          <p className="text-muted-foreground">
            {isDeltaPositive
              ? "Your potential savings increased"
              : "Your potential savings decreased"}{" "}
            by ${Math.abs(annualSavingsDelta).toLocaleString()}/year
          </p>
        </CardContent>
      </Card>

      {/* ── Comparison Header ── */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Tool-by-Tool Comparison</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Showing your previous recommendations vs current recommendations based
          on pricing changes.
        </p>
      </div>

      {/* ── Per-Tool Comparison ── */}
      {oldAudit.recommendations.map((oldRec) => {
        const newRec = newAudit.recommendations.find(
          (r) => r.tool === oldRec.tool
        );

        if (!newRec) return null;

        const savingsDelta = newRec.monthlySavings - oldRec.monthlySavings;
        const recommendationChanged =
          oldRec.recommendedAction !== newRec.recommendedAction;

        return (
          <Card
            key={oldRec.tool}
            className={recommendationChanged ? "border-blue-500" : ""}
          >
            <CardContent className="pt-6 space-y-4">
              {/* Tool name */}
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  {PRICING_DATA[oldRec.tool].displayName}
                </h3>
                {recommendationChanged && (
                  <Badge className="bg-blue-600">Recommendation Changed</Badge>
                )}
              </div>

              <Separator />

              {/* Old vs New Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    PREVIOUS RECOMMENDATION
                  </p>
                  <p className="text-sm">{oldRec.recommendedAction}</p>
                  <p className="text-xs text-muted-foreground">
                    Save: ${oldRec.monthlySavings}/mo
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    CURRENT RECOMMENDATION
                  </p>
                  <p className="text-sm font-medium text-blue-600">
                    {newRec.recommendedAction}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Save: ${newRec.monthlySavings}/mo
                  </p>
                </div>
              </div>

              {/* Savings Delta */}
              {savingsDelta !== 0 && (
                <div className="bg-muted rounded px-3 py-2 text-sm">
                  <p className="text-muted-foreground">
                    Monthly savings changed by{" "}
                    <span
                      className={
                        savingsDelta > 0 ? "text-green-600 font-medium" : "text-orange-600 font-medium"
                      }
                    >
                      {savingsDelta > 0 ? "+" : ""}${savingsDelta}/mo
                    </span>
                  </p>
                </div>
              )}

              {/* Reason */}
              <p className="text-xs text-muted-foreground bg-muted rounded px-3 py-2">
                <span className="font-medium">Why it changed:</span> {newRec.reason}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}