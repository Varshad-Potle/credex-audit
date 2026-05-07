export type ToolName =
    | "cursor"
    | "github_copilot"
    | "claude"
    | "chatgpt"
    | "anthropic_api"
    | "openai_api"
    | "gemini"
    | "windsurf";

export type UseCase =
    | "coding"
    | "writing"
    | "data"
    | "research"
    | "mixed";

export type ToolEntry = {
    tool: ToolName;
    plan: string;
    monthlySpend: number;
    seats: number;
};

export type FormData = {
    tools: ToolEntry[];
    teamSize: number;
    useCase: UseCase;
};

export type Recommendation = {
    tool: ToolName;
    currentPlan: string;
    currentSpend: number;
    recommendedAction: string;
    recommendedPlan: string | null;
    monthlySavings: number;
    annualSavings: number;
    reason: string;
    isOptimal: boolean;
};

export type AuditResult = {
    id?: string;
    formData: FormData;
    recommendations: Recommendation[];
    totalMonthlySavings: number;
    totalAnnualSavings: number;
    aiSummary?: string;
    createdAt?: string;
};

export type Lead = {
    email: string;
    companyName?: string;
    role?: string;
    teamSize?: number;
    auditId: string;
};