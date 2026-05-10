"use client";

import { useState } from "react";

const FAQS = [
    {
        q: "Is this actually free?",
        a: "Yes. No credit card, no account, no trial period. The audit is free because it is a lead-generation tool for Credex. We make money if you buy discounted AI credits through us — and only if that saves you money.",
    },
    {
        q: "How accurate is the pricing data?",
        a: "Every number traces to an official vendor pricing page, verified during submission week. We update pricing weekly.",
    },
    {
        q: "Do you store my data?",
        a: "Your audit results are stored so your shareable URL works. If you submit your email, that is stored in our database. We do not sell your data.",
    },
    {
        q: "What AI tools do you support?",
        a: "Cursor, GitHub Copilot, Claude, ChatGPT, Anthropic API, OpenAI API, Gemini, and Windsurf.",
    },
    {
        q: "What is Credex?",
        a: "Credex sells discounted AI infrastructure credits sourced from companies that overforecast or pivoted. The discount is real. SpendAudit helps you find where you are overspending — Credex credits are often the solution.",
    },
];

export default function FaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="max-w-2xl mx-auto px-4 pb-16 space-y-2">
            <h2 className="text-xl font-bold mb-4">FAQ</h2>
            {FAQS.map(({ q, a }, i) => (
                <div key={q} className="border rounded-lg overflow-hidden">
                    <button
                        onClick={() => setOpenIndex(openIndex === i ? null : i)}
                        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted transition-colors"
                    >
                        <span className="font-medium text-sm">{q}</span>
                        <span className="text-muted-foreground text-lg">
                            {openIndex === i ? "−" : "+"}
                        </span>
                    </button>
                    {openIndex === i && (
                        <div className="px-4 pb-3">
                            <p className="text-sm text-muted-foreground">{a}</p>
                        </div>
                    )}
                </div>
            ))}
        </section>
    );
}