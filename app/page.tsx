import SpendForm from "@/components/form/SpendForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* ── Header ── */}
      <header className="border-b">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="font-semibold text-lg tracking-tight">
            SpendAudit <span className="text-muted-foreground font-normal text-sm">by Credex</span>
          </span>
          <span className="text-xs text-muted-foreground">Free · No signup required</span>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="max-w-2xl mx-auto px-4 pt-12 pb-8 text-center space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">
          Are you overpaying for AI tools?
        </h1>
        <p className="text-muted-foreground text-lg">
          Enter what you pay. Get an instant audit showing exactly where your money is going and how to cut it.
        </p>
        <p className="text-sm text-muted-foreground">
          Used by 500+ engineering teams — free, no login, 30 seconds.{" "}
          <span className="italic">(social proof — mocked)</span>
        </p>
      </section>

      {/* ── Form ── */}
      <section className="max-w-2xl mx-auto px-4 pb-16">
        <SpendForm />
      </section>

      {/* ── Footer ── */}
      <footer className="border-t">
        <div className="max-w-2xl mx-auto px-4 py-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>© 2026 Credex · credex.rocks</span>
          <span>Pricing data verified weekly</span>
        </div>
      </footer>
    </main>
  );
}