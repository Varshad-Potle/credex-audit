import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { detectPricingChanges, auditAffectedByChanges } from "@/lib/pricingComparison";
import { consolidateNotificationsByEmail, sendPricingChangeNotifications } from "@/lib/emailNotifications";
import { AuditResult } from "@/types";

export async function POST(req: NextRequest) {
  try {
    // Fetch all audits from database
    const { data: allAudits, error: fetchError } = await supabase
      .from("audits")
      .select("*")
      .not("user_email", "is", null); // Only audits with email

    if (fetchError || !allAudits || allAudits.length === 0) {
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
          totalMonthlySavings: auditRow.total_monthly_savings,
          totalAnnualSavings: auditRow.total_annual_savings,
          id: auditRow.id,
        };
        return auditAffectedByChanges(audit, changes);
      })
      .map((a) => ({
        auditId: a.id,
        email: a.user_email,
        toolsAffected: changes
          .filter((c) => a.form_data.tools.some((t: any) => t.tool === c.tool))
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