import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { detectPricingChanges, auditAffectedByChanges } from "@/lib/pricingComparison";
import { AuditResult, FormData, Recommendation } from "@/types";

type AuditRow = {
  id: string;
  user_email: string | null;
  form_data: FormData;
  pricing_snapshot: Record<string, unknown>;
  recommendations: Recommendation[];
  total_monthly_savings: number | null;
  total_annual_savings: number | null;
};

export async function POST() {
  try {
    const batchSize = 500;
    const auditSelectColumns = [
      "id",
      "user_email",
      "form_data",
      "pricing_snapshot",
      "recommendations",
      "total_monthly_savings",
      "total_annual_savings",
    ].join(", ");

    let page = 0;
    let auditsChecked = 0;
    let changes: ReturnType<typeof detectPricingChanges> = [];
    let changesInitialized = false;
    const affectedAudits: Array<{
      id: string;
      email: string;
      toolsAffected: string[];
    }> = [];

    while (true) {
      const from = page * batchSize;
      const to = from + batchSize - 1;
      const { data: auditBatch, error: fetchError } = await supabase
        .from<"audits", AuditRow>("audits")
        .select(auditSelectColumns)
        .range(from, to);

      const auditRows = auditBatch as AuditRow[] | null;

      if (fetchError || !auditRows) {
        return NextResponse.json(
          { error: "Failed to fetch audits" },
          { status: 500 }
        );
      }

      if (auditRows.length === 0) {
        break;
      }

      if (!changesInitialized) {
        // Detect pricing changes from the same first audit snapshot used previously
        changes = detectPricingChanges(auditRows[0]?.pricing_snapshot || {});
        changesInitialized = true;

        if (changes.length === 0) {
          return NextResponse.json({
            message: "No pricing changes detected",
            auditsChecked: auditBatch.length,
            affectedAudits: [],
          });
        }
      }

      auditsChecked += auditRows.length;

      for (const auditRow of auditRows) {
        const audit: AuditResult = {
          formData: auditRow.form_data,
          recommendations: auditRow.recommendations,
          totalMonthlySavings: auditRow.total_monthly_savings ?? 0,
          totalAnnualSavings: auditRow.total_annual_savings ?? 0,
          id: auditRow.id,
        };

        if (auditAffectedByChanges(audit, changes)) {
          affectedAudits.push({
            id: auditRow.id,
            email: auditRow.user_email ?? "",
            toolsAffected: changes
              .filter((c) => auditRow.form_data.tools.some((t) => t.tool === c.tool))
              .map((c) => c.tool),
          });
        }
      }

      if (auditBatch.length < batchSize) {
        break;
      }

      page += 1;
    }

    return NextResponse.json({
      message: "Pricing changes detected",
      pricesChanged: changes,
      auditsChecked,
      affectedAudits,
    });
  } catch (err) {
    console.error("Detect changes error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}