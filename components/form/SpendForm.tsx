"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToolName, FormData, ToolEntry, UseCase } from "@/types";
import { PRICING_DATA, ALL_TOOLS, getPlansForTool } from "@/lib/pricingData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const STORAGE_KEY = "credex_audit_form";

const USE_CASES: { value: UseCase; label: string }[] = [
  { value: "coding", label: "Coding / Engineering" },
  { value: "writing", label: "Writing / Content" },
  { value: "data", label: "Data / Analytics" },
  { value: "research", label: "Research" },
  { value: "mixed", label: "Mixed / General" },
];

const DEFAULT_FORM: FormData = {
  tools: [],
  teamSize: 1,
  useCase: "mixed",
};

export default function SpendForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData(parsed);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // ── Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  // ── Add a tool
  const addTool = (tool: ToolName) => {
    if (formData.tools.find((t) => t.tool === tool)) return;
    const plans = getPlansForTool(tool);
    const firstPlan = Object.keys(plans)[0];
    const firstPlanInfo = plans[firstPlan];

    setFormData((prev) => ({
      ...prev,
      tools: [
        ...prev.tools,
        {
          tool,
          plan: firstPlan,
          monthlySpend: firstPlanInfo.monthlyPricePerSeat,
          seats: 1,
        },
      ],
    }));
  };

  // ── Remove a tool
  const removeTool = (tool: ToolName) => {
    setFormData((prev) => ({
      ...prev,
      tools: prev.tools.filter((t) => t.tool !== tool),
    }));
  };

  // ── Update a tool entry field
  const updateTool = (
    tool: ToolName,
    field: keyof ToolEntry,
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      tools: prev.tools.map((t) => {
        if (t.tool !== tool) return t;

        // when plan changes, auto-update monthlySpend
        if (field === "plan") {
          const plans = getPlansForTool(tool);
          const planInfo = plans[value as string];
          return {
            ...t,
            plan: value as string,
            monthlySpend: planInfo
              ? planInfo.monthlyPricePerSeat * t.seats
              : t.monthlySpend,
          };
        }

        // when seats change, auto-update monthlySpend
        if (field === "seats") {
          const plans = getPlansForTool(tool);
          const planInfo = plans[t.plan];
          const seats = Number(value);
          return {
            ...t,
            seats,
            monthlySpend: planInfo
              ? planInfo.monthlyPricePerSeat * seats
              : t.monthlySpend,
          };
        }

        return { ...t, [field]: value };
      }),
    }));
  };

  // ── Submit form
  const handleSubmit = async () => {
    if (formData.tools.length === 0) {
      setError("Add at least one AI tool to audit.");
      return;
    }
    if (formData.teamSize < 1) {
      setError("Team size must be at least 1.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Get email from LeadCapture or prompt user
      const userEmail = prompt("Enter your email (optional):");

      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData,
          userEmail: userEmail || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      localStorage.removeItem(STORAGE_KEY);
      router.push(`/audit/${data.id}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedTools = formData.tools.map((t) => t.tool);
  const totalMonthly = formData.tools.reduce(
    (sum, t) => sum + t.monthlySpend,
    0,
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* ── Team context ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Team</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="teamSize">Team Size</Label>
            <Input
              id="teamSize"
              type="number"
              min={1}
              value={formData.teamSize}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  teamSize: Number(e.target.value),
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Primary Use Case</Label>
            <Select
              value={formData.useCase}
              onValueChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  useCase: val as UseCase,
                }))
              }
            >
              <SelectTrigger aria-label="Select primary use case">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {USE_CASES.map((uc) => (
                  <SelectItem key={uc.value} value={uc.value}>
                    {uc.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* ── Tool picker ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Select Your AI Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {ALL_TOOLS.map((tool) => {
              const isSelected = selectedTools.includes(tool);
              return (
                <Badge
                  key={tool}
                  variant={isSelected ? "default" : "outline"}
                  className="cursor-pointer select-none px-3 py-1 text-sm"
                  onClick={() =>
                    isSelected ? removeTool(tool) : addTool(tool)
                  }
                >
                  {PRICING_DATA[tool].displayName}
                  {isSelected && <span className="ml-2 opacity-70">✕</span>}
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ── Per-tool config ── */}
      {formData.tools.length > 0 && (
        <div className="space-y-4">
          {formData.tools.map((entry) => {
            const plans = getPlansForTool(entry.tool);
            return (
              <Card key={entry.tool}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {PRICING_DATA[entry.tool].displayName}
                    </CardTitle>
                    <button
                      onClick={() => removeTool(entry.tool)}
                      className="text-sm text-muted-foreground hover:text-destructive transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Plan</Label>
                    <Select
                      value={entry.plan}
                      onValueChange={(val) =>
                        updateTool(entry.tool, "plan", val)
                      }
                    >
                      <SelectTrigger
                        aria-label={`Select plan for ${PRICING_DATA[entry.tool].displayName}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(plans).map(([key, info]) => (
                          <SelectItem key={key} value={key}>
                            {info.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Seats</Label>
                    <Input
                      type="number"
                      min={1}
                      value={entry.seats}
                      onChange={(e) =>
                        updateTool(entry.tool, "seats", Number(e.target.value))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Monthly Spend ($)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={entry.monthlySpend}
                      onChange={(e) =>
                        updateTool(
                          entry.tool,
                          "monthlySpend",
                          Number(e.target.value),
                        )
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── Total + submit ── */}
      {formData.tools.length > 0 && (
        <>
          <Separator />
          <div className="flex items-center justify-between px-1">
            <span className="text-sm text-muted-foreground">
              Current monthly total
            </span>
            <span className="text-lg font-semibold">
              ${totalMonthly.toLocaleString()}/mo
            </span>
          </div>
        </>
      )}

      {error && <p className="text-sm text-destructive text-center">{error}</p>}

      <Button
        className="w-full"
        size="lg"
        onClick={handleSubmit}
        disabled={isSubmitting || formData.tools.length === 0}
      >
        {isSubmitting ? "Running Audit..." : "Run Free Audit →"}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        No account required. Takes 30 seconds.
      </p>
    </div>
  );
}
