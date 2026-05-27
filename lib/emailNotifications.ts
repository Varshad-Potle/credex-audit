import { Resend } from "resend";
import { PricingChange } from "./pricingComparison";

export type AffectedAuditInfo = {
  auditId: string;
  email: string;
  toolsAffected: string[];
};

export type ConsolidatedNotification = {
  email: string;
  audits: AffectedAuditInfo[];
  changes: PricingChange[];
};

// Consolidate multiple affected audits per email (avoid spam)
export function consolidateNotificationsByEmail(
  affectedAudits: AffectedAuditInfo[],
  changes: PricingChange[]
): ConsolidatedNotification[] {
  const grouped = affectedAudits.reduce(
    (acc, audit) => {
      if (!acc[audit.email]) {
        acc[audit.email] = [];
      }
      acc[audit.email].push(audit);
      return acc;
    },
    {} as Record<string, AffectedAuditInfo[]>
  );

  return Object.entries(grouped).map(([email, audits]) => ({
    email,
    audits,
    changes,
  }));
}

// Build email HTML
function buildEmailHtml(notification: ConsolidatedNotification): string {
  const changesHtml = notification.changes
    .map(
      (change) => `
    <li style="margin-bottom: 12px; color: #555;">
      <strong>${change.tool}:</strong> ${change.details}
    </li>
  `
    )
    .join("");

  const auditsHtml = notification.audits
    .map(
      (audit) => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 12px; color: #555;">${audit.toolsAffected.join(", ")}</td>
      <td style="padding: 12px;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/audit/${audit.auditId}/diff" 
           style="color: #2563eb; text-decoration: none; font-weight: 500;">
          View Updated Audit →
        </a>
      </td>
    </tr>
  `
    )
    .join("");

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #111; margin-bottom: 8px;">AI Tool Pricing Has Changed</h2>
      <p style="color: #555; margin-bottom: 24px;">
        We detected pricing changes in tools from your previous audits. 
        Your savings potential may have changed. Check the updated audits below.
      </p>

      <div style="background: #f3f4f6; border-left: 4px solid #2563eb; padding: 16px; margin-bottom: 24px;">
        <p style="color: #555; margin: 0; font-weight: 500;">What changed:</p>
        <ul style="margin: 12px 0 0 20px; padding: 0; color: #555;">
          ${changesHtml}
        </ul>
      </div>

      <div style="margin-bottom: 24px;">
        <p style="color: #555; font-weight: 500; margin-bottom: 12px;">Your affected audits:</p>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f3f4f6;">
              <th style="padding: 12px; text-align: left; color: #555; font-weight: 500;">Tools Affected</th>
              <th style="padding: 12px; text-align: left; color: #555; font-weight: 500;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${auditsHtml}
          </tbody>
        </table>
      </div>

      <p style="color: #555; font-size: 14px;">
        Click "View Updated Audit" for any audit to see the new recommendations.
      </p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p style="color: #999; font-size: 12px;">
        SpendAudit by Credex · credex.rocks<br/>
        You received this email because pricing changed for tools in your saved audits.
      </p>
    </div>
  `;
}

// Send consolidated emails
type NotificationSendResult = {
  sent: number;
  failed: number;
  errors: Array<{ email: string; error: unknown }>;
};

export async function sendPricingChangeNotifications(
  notifications: ConsolidatedNotification[]
): Promise<NotificationSendResult> {
  const results: NotificationSendResult = { sent: 0, failed: 0, errors: [] };

  // Initialize Resend here, not at module level
  const resend = new Resend(process.env.RESEND_API_KEY);

  for (const notification of notifications) {
    try {
      await resend.emails.send({
        from: "SpendAudit <onboarding@resend.dev>",
        to: notification.email,
        subject: `AI Tool Pricing Changed — Your Audits Updated`,
        html: buildEmailHtml(notification),
      });
      results.sent++;
    } catch (err) {
      results.failed++;
      results.errors.push({ email: notification.email, error: err });
      console.error(`Failed to send email to ${notification.email}:`, err);
    }
  }

  return results;
}