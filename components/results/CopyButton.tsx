"use client";

type Props = {
    text: string;
};

export default function CopyButton({ text }: Props) {
    return (
        <button
            onClick={() => navigator.clipboard.writeText(text)}
            className="text-xs bg-background border rounded px-3 py-1.5 hover:bg-muted transition-colors shrink-0"
        >
            Copy
        </button>
    );
}
