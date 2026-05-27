import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { detectPricingChanges, auditAffectedByChanges } from "@/lib/pricingComparison";
import { consolidateNotificationsByEmail, sendPricingChangeNotifications } from "@/lib/emailNotifications";
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
    // Fetch audits from database in batches, selecting only required columns
    const batchSize = 500;
    const allAudits: AuditRow[] = [];
    let from = 0;

    while (true) {
      const query = await supabase
        .from("audits")
        .select(
          "id, user_email, form_data, pricing_snapshot, recommendations, total_monthly_savings, total_annual_savings"
        )
        .not("user_email", "is", null)
        .order("id", { ascending: true })
        .range(from, from + batchSize - 1);

      const auditBatch = query.data as AuditRow[] | null;
      const fetchError = query.error;

      if (fetchError) {
        throw fetchError;
      }

      if (!auditBatch || auditBatch.length === 0) {
        break;
      }

      allAudits.push(...auditBatch);

      if (auditBatch.length < batchSize) {
        break;
      }

      from += batchSize;
    }

    if (allAudits.length === 0) {
      return NextResponse.json({
        message: "No audits with emails found",
        sent: 0,
        failed: 0,
      });
    }

    // Detect pricing changes
    const changes = detectPricingChanges(allAudits[0]?.pricing_snapshot || {});

    if (changes.length === 0) {
      return NextResponse.json({
        message: "No pricing changes detected, no emails sent",
        sent: 0,
        failed: 0,
      });
    }

    // Find affected audits
    const affectedAudits = allAudits
      .filter((auditRow) => {
        const audit: AuditResult = {
          formData: auditRow.form_data,
          recommendations: auditRow.recommendations,
          totalMonthlySavings: auditRow.total_monthly_savings ?? 0,
          totalAnnualSavings: auditRow.total_annual_savings ?? 0,
          id: auditRow.id,
        };
        return auditAffectedByChanges(audit, changes);
      })
      .map((a) => ({
        auditId: a.id,
        email: a.user_email ?? "",
        toolsAffected: changes
          .filter((c) => a.form_data.tools.some((t) => t.tool === c.tool))
          .map((c) => c.tool),
      }));

    if (affectedAudits.length === 0) {
      return NextResponse.json({
        message: "No audits affected by pricing changes",
        sent: 0,
        failed: 0,
      });
    }

    // Consolidate by email (one email per user)
    const notifications = consolidateNotificationsByEmail(affectedAudits, changes);

    // Send emails
    const results = await sendPricingChangeNotifications(notifications);

    return NextResponse.json({
      message: "Pricing change emails sent",
      priceChangesDetected: changes.length,
      auditsAffected: affectedAudits.length,
      usersNotified: results.sent,
      emailsFailed: results.failed,
      errors: results.errors.length > 0 ? results.errors : null,
    });
  } catch (err) {
    console.error("Send pricing emails error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}