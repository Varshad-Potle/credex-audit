import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { runAudit } from "@/lib/auditEngine";
import { FormData } from "@/types";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const formData: FormData = body.formData;

        if (!formData || !formData.tools || formData.tools.length === 0) {
            return NextResponse.json(
                { error: "Invalid form data" },
                { status: 400 }
            );
        }

        const auditResult = runAudit(formData);

        const { data, error } = await supabase
            .from("audits")
            .insert({
                form_data: auditResult.formData,
                recommendations: auditResult.recommendations,
                total_monthly_savings: auditResult.totalMonthlySavings,
                total_annual_savings: auditResult.totalAnnualSavings,
            })
            .select("id")
            .single();

        if (error) {
            console.error("Supabase error:", error);
            return NextResponse.json(
                { error: "Failed to save audit" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            id: data.id,
            ...auditResult,
        });
    } catch (err) {
        console.error("Audit API error:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}