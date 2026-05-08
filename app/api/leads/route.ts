import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Lead } from "@/types";

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

        const { error } = await supabase.from("leads").insert({
            audit_id: lead.auditId,
            email: lead.email,
            company_name: lead.companyName,
            role: lead.role,
            team_size: lead.teamSize,
        });

        if (error) {
            console.error("Supabase leads error:", error);
            return NextResponse.json(
                { error: "Failed to save lead" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Leads API error:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}