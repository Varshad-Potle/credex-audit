import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { AuditResult } from "@/types";
import AuditResults from "@/components/results/AuditResults";
import LeadCapture from "@/components/results/LeadCapture";
import ShareButton from "@/components/results/ShareButton";
import { Metadata } from "next";

type Props = {
    params: Promise<{ id: string }>;
};

async function getAudit(id: string): Promise<AuditResult | null> {
    const { data, error } = await supabase
        .from("audits")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !data) return null;

    return {
        id: data.id,
        formData: data.form_data,
        recommendations: data.recommendations,
        totalMonthlySavings: data.total_monthly_savings,
        totalAnnualSavings: data.total_annual_savings,
        aiSummary: data.ai_summary,
        createdAt: data.created_at,
    };
}

async function getSummary(audit: AuditResult): Promise<string> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/summary`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ audit }),
                cache: "no-store",
            }
        );
        const data = await res.json();
        return data.summary ?? "";
    } catch {
        return "";
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const audit = await getAudit(id);

    if (!audit) {
        return { title: "Audit not found" };
    }

    const savings = audit.totalMonthlySavings;
    const title =
        savings > 0
            ? `I found $${savings}/mo in AI tool savings — SpendAudit`
            : "My AI tool stack is fully optimized — SpendAudit";

    const description =
        savings > 0
            ? `This free audit found $${savings}/mo ($${audit.totalAnnualSavings}/yr) in potential savings across ${audit.recommendations.length} AI tools.`
            : `This free audit confirmed my AI stack is optimized across ${audit.recommendations.length} tools.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/audit/${audit.id}`,
            siteName: "SpendAudit by Credex",
            type: "website",
        },
        twitter: {
            card: "summary",
            title,
            description,
        },
    };
}

export default async function AuditPage({ params }: Props) {
    const { id } = await params;
    const audit = await getAudit(id);

    if (!audit) notFound();

    const aiSummary = await getSummary(audit);
    const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/audit/${audit.id}`;

    return (
        <main className="min-h-screen bg-background">

            {/* ── Header ── */}
            <header className="border-b">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
                    <a href="/" className="font-semibold text-lg tracking-tight hover:opacity-80 transition-opacity">
                        SpendAudit{" "}
                        <span className="text-muted-foreground font-normal text-sm">
                            by Credex
                        </span>
                    </a>
                    <span className="text-xs text-muted-foreground">
                        Audit · {new Date(audit.createdAt!).toLocaleDateString()}
                    </span>
                </div>
            </header>

            <section className="max-w-2xl mx-auto px-4 py-10 space-y-8">

                {/* ── Page title ── */}
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold">Your AI Spend Audit</h1>
                    <p className="text-sm text-muted-foreground">
                        {audit.recommendations.length} tool
                        {audit.recommendations.length !== 1 ? "s" : ""} audited ·{" "}
                        {audit.formData.teamSize} person team ·{" "}
                        {audit.formData.useCase} use case
                    </p>
                </div>

                {/* ── Results ── */}
                <AuditResults audit={audit} aiSummary={aiSummary} />

                {/* ── Share ── */}
                <ShareButton shareUrl={shareUrl} />

                {/* ── Lead capture ── */}
                <LeadCapture
                    auditId={audit.id!}
                    totalMonthlySavings={audit.totalMonthlySavings}
                />

                {/* ── Run another ── */}
                <div className="text-center">
                    <a
                        href="/"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        ← Run another audit
                    </a>
                </div>

            </section>

            {/* ── Footer ── */}
            <footer className="border-t mt-8">
                <div className="max-w-2xl mx-auto px-4 py-6 flex items-center justify-between text-xs text-muted-foreground">
                    <span>© 2026 Credex · credex.rocks</span>
                    <span>Pricing data verified weekly</span>
                </div>
            </footer>

        </main>
    );
}