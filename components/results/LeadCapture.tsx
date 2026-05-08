"use client";

import { useState } from "react";
import { Lead } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
    auditId: string;
    totalMonthlySavings: number;
};

export default function LeadCapture({ auditId, totalMonthlySavings }: Props) {
    const [email, setEmail] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [role, setRole] = useState("");
    const [website, setWebsite] = useState(""); // honeypot field
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!email) {
            setError("Email is required.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const lead: Lead = {
            email,
            companyName,
            role,
            auditId,
        };

        try {
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lead, website }), // website is honeypot
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Something went wrong.");
                return;
            }

            setIsDone(true);
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isDone) {
        return (
            <Card className="border-green-500">
                <CardContent className="pt-6 text-center space-y-2">
                    <p className="text-xl font-semibold">✓ Report sent</p>
                    <p className="text-sm text-muted-foreground">
                        Check your inbox for the full audit report.
                        {totalMonthlySavings > 500 &&
                            " Our team will reach out about Credex credits shortly."}
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">
                    {totalMonthlySavings > 0
                        ? `Get your full report — save $${totalMonthlySavings}/mo`
                        : "Get notified when new optimizations apply"}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    We'll email you the full breakdown. No spam. One email.
                </p>

                {/* honeypot — hidden from real users */}
                <input
                    type="text"
                    name="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    style={{ display: "none" }}
                    tabIndex={-1}
                    autoComplete="off"
                />

                <div className="space-y-2">
                    <Label htmlFor="email">
                        Work email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                        <Label htmlFor="companyName">Company (optional)</Label>
                        <Input
                            id="companyName"
                            placeholder="Acme Inc"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role">Your role (optional)</Label>
                        <Input
                            id="role"
                            placeholder="Engineering Manager"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        />
                    </div>
                </div>

                {error && (
                    <p className="text-sm text-destructive">{error}</p>
                )}

                <Button
                    className="w-full"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Sending..." : "Email me the report →"}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                    No account created. Unsubscribe anytime.
                </p>
            </CardContent>
        </Card>
    );
}