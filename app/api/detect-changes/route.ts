import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { detectPricingChanges, auditAffectedByChanges } from "@/lib/pricingComparison";
import { AuditResult } from "@/types";

export async function POST() {
  try {
    // Fetch all audits from database
    const { data: allAudits, error: fetchError } = await supabase
      .from("audits")
      .select("*");

    if (fetchError || !allAudits) {
      return NextResponse.json(
        { error: "Failed to fetch audits" },
        { status: 500 }
      );
    }

    // Detect pricing changes
    const changes = detectPricingChanges(allAudits[0]?.pricing_snapshot || {});

    if (changes.length === 0) {
      return NextResponse.json({
        message: "No pricing changes detected",
        auditsChecked: allAudits.length,
        affectedAudits: [],
      });
    }

    // Find audits affected by the changes
    const affectedAudits = allAudits.filter((auditRow) => {
      const audit: AuditResult = {
        formData: auditRow.form_data,
        recommendations: auditRow.recommendations,
        totalMonthlySavings: auditRow.total_monthly_savings,
        totalAnnualSavings: auditRow.total_annual_savings,
        id: auditRow.id,
      };
      return auditAffectedByChanges(audit, changes);
    });

    return NextResponse.json({
      message: "Pricing changes detected",
      pricesChanged: changes,
      auditsChecked: allAudits.length,
      affectedAudits: affectedAudits.map((a) => ({
        id: a.id,
        email: a.user_email,
        toolsAffected: changes
          .filter((c) => a.form_data.tools.some((t: { tool: string }) => t.tool === c.tool))
          .map((c) => c.tool),
      })),
    });
  } catch (err) {
    console.error("Detect changes error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}