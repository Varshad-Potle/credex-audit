"use client";

import { AuditResult } from "@/types";
import { PRICING_DATA } from "@/lib/pricingData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type Props = {
    audit: AuditResult;
    aiSummary: string | null;
};

export default function AuditResults({ audit, aiSummary }: Props) {
    const { recommendations, totalMonthlySavings, totalAnnualSavings } = audit;
    const isHighSavings = totalMonthlySavings > 500;
    const isLowSavings = totalMonthlySavings < 100;

    return (
        <div className="space-y-8">

            {/* ── Hero savings block ── */}
            <Card className={isHighSavings ? "border-green-500 bg-green-50 dark:bg-green-950" : ""}>
                <CardContent className="pt-6 text-center space-y-2">
                    {totalMonthlySavings === 0 ? (
                        <>
                            You&apos;re spending well. ✓
                            <p className="text-muted-foreground">
                                Your current AI stack is optimized for your team size and use case. No changes recommended right now.
                            </p>
                        </>
                    ) : (
                        <>
                            <p className="text-sm text-muted-foreground uppercase tracking-wide font-medium">
                                Potential savings identified
                            </p>
                            <p className="text-5xl font-bold text-green-600 dark:text-green-400">
                                ${totalMonthlySavings.toLocaleString()}/mo
                            </p>
                            <p className="text-xl text-muted-foreground">
                                ${totalAnnualSavings.toLocaleString()} per year
                            </p>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* ── Credex CTA for high savings ── */}
            {isHighSavings && (
                <Card className="border-blue-500 bg-blue-50 dark:bg-blue-950">
                    <CardContent className="pt-6 space-y-3">
                        <p className="font-semibold text-lg">
                            You could save even more with Credex
                        </p>
                        <p className="text-muted-foreground text-sm">
                            Credex sells discounted AI credits — Cursor, Claude, ChatGPT Enterprise and others — sourced from companies that overforecast. The discount is real and substantial.
                        </p>
                        <a
                            href="https://credex.rocks"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
                        >
                            Book a free Credex consultation →
                        </a>
                    </CardContent>
                </Card>
            )}

            {/* ── Low savings CTA ── */}
            {isLowSavings && totalMonthlySavings >= 0 && (
                <Card>
                    <CardContent className="pt-6 space-y-2">
                        <p className="font-medium">Want to know when new optimizations apply to your stack?</p>
                        <p className="text-sm text-muted-foreground">
                            You&apos;re spending well
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* ── AI Summary ── */}
            {aiSummary && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Audit Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            {aiSummary}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* ── Per tool breakdown ── */}
            <div className="space-y-4">
                <h2 className="font-semibold text-lg">Tool Breakdown</h2>
                {recommendations.map((rec) => (
                    <Card key={rec.tool}>
                        <CardContent className="pt-4 space-y-3">

                            {/* Tool header */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">
                                        {PRICING_DATA[rec.tool].displayName}
                                    </span>
                                    <Badge variant="outline" className="text-xs">
                                        {rec.currentPlan}
                                    </Badge>
                                </div>
                                {rec.isOptimal ? (
                                    <Badge variant="secondary" className="text-xs text-green-600">
                                        ✓ Optimal
                                    </Badge>
                                ) : (
                                    <Badge variant="destructive" className="text-xs">
                                        Save ${rec.monthlySavings}/mo
                                    </Badge>
                                )}
                            </div>

                            <Separator />

                            {/* Spend row */}
                            <div className="grid grid-cols-3 gap-2 text-sm">
                                <div>
                                    <p className="text-muted-foreground text-xs">Current spend</p>
                                    <p className="font-medium">${rec.currentSpend}/mo</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-xs">Recommended</p>
                                    <p className="font-medium">{rec.recommendedAction}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-xs">Annual savings</p>
                                    <p className="font-medium text-green-600">
                                        {rec.annualSavings > 0
                                            ? `$${rec.annualSavings.toLocaleString()}`
                                            : "—"}
                                    </p>
                                </div>
                            </div>

                            {/* Reason */}
                            <p className="text-xs text-muted-foreground bg-muted rounded px-3 py-2">
                                {rec.reason}
                            </p>

                        </CardContent>
                    </Card>
                ))}
            </div>

        </div>
    );
}