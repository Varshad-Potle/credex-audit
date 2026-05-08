"use client";

import { useState } from "react";

type Props = {
    shareUrl: string;
};

export default function ShareButton({ shareUrl }: Props) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1">Share your audit</p>
                <p className="text-sm font-mono truncate">{shareUrl}</p>
            </div>
            <button
                onClick={handleCopy}
                className="text-xs bg-background border rounded px-3 py-1.5 hover:bg-muted transition-colors shrink-0"
            >
                {copied ? "Copied ✓" : "Copy"}
            </button>
        </div>
    );
}