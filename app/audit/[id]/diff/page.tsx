import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { runAudit } from "@/lib/auditEngine";
import { AuditResult } from "@/types";
import AuditDiff from "@/components/results/AuditDiff";

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

export default async function AuditDiffPage({ params }: Props) {
  const { id } = await params;
  const oldAudit = await getAudit(id);

  if (!oldAudit) notFound();

  // Re-run audit with current pricing
  const newAudit = runAudit(oldAudit.formData);

  return (
    <main className="min-h-screen bg-background">
      {/* ── Header ── */}
      <header className="border-b">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <a
            href="/"
            className="font-semibold text-lg tracking-tight hover:opacity-80 transition-opacity"
          >
            SpendAudit{" "}
            <span className="text-muted-foreground font-normal text-sm">
              by Credex
            </span>
          </a>
          <span className="text-xs text-muted-foreground">
            Audit Comparison
          </span>
        </div>
      </header>

      <section className="max-w-2xl mx-auto px-4 py-10 space-y-8">
        {/* ── Page title ── */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Updated Audit Results</h1>
          <p className="text-sm text-muted-foreground">
            Pricing changed since your original audit on{" "}
            {new Date(oldAudit.createdAt!).toLocaleDateString()}. Here&apos;s
            what&apos;s different.
          </p>
        </div>

        {/* ── Diff component ── */}
        <AuditDiff oldAudit={oldAudit} newAudit={newAudit} />

        {/* ── CTA ── */}
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6 space-y-2">
          <p className="font-medium">Ready to act on these changes?</p>
          <p className="text-sm text-muted-foreground">
            Credex can help you capture the full savings with discounted AI
            credits.
          </p>
          <a
            href="https://credex.rocks"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
          >
            Learn About Credex Credits →
          </a>
        </div>

        {/* ── Run another audit ── */}
        <div className="text-center">
          <a
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Start a new audit
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