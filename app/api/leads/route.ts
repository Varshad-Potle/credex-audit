import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";
import { Lead } from "@/types";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const lead: Lead = body.lead;

    if (body.website) {
      return NextResponse.json({ success: true });
    }

    if (!lead.email || !lead.auditId) {
      return NextResponse.json(
        { error: "Email and audit ID are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(lead.email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const { error: dbError } = await supabase.from("leads").insert({
      audit_id: lead.auditId,
      email: lead.email,
      company_name: lead.companyName,
      role: lead.role,
      team_size: lead.teamSize,
    });

    if (dbError) {
      console.error("Supabase leads error:", dbError);
      return NextResponse.json(
        { error: "Failed to save lead" },
        { status: 500 }
      );
    }

    const auditUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/audit/${lead.auditId}`;

    await resend.emails.send({
      from: "SpendAudit <onboarding@resend.dev>",
      to: lead.email,
      subject: "Your AI Spend Audit Report",
      html: `
  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
    <h2 style="color: #111; margin-bottom: 8px;">Your AI Spend Audit is ready</h2>
    <p style="color: #555; margin-bottom: 24px;">Thanks for using SpendAudit. Your full audit report is available at the link below.</p>
    <a href="${auditUrl}" style="display: inline-block; background: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; margin-bottom: 24px;">View Full Audit Report</a>
    <p style="color: #555;">If you are seeing significant savings opportunities, our team at Credex can help you capture even more through discounted AI credits.</p>
    <p style="color: #555;">Visit <a href="https://credex.rocks" style="color: #2563eb;">credex.rocks</a> to learn more.</p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
    <p style="color: #999; font-size: 12px;">SpendAudit by Credex · credex.rocks<br/>You received this email because you requested an audit report.</p>
  </div>
`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Leads API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}