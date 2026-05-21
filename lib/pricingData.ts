import { ToolName, UseCase } from "@/types";

export type PlanInfo = {
    name: string;
    monthlyPricePerSeat: number;
    minSeats: number;
    bestFor: UseCase[];
    isEnterprise?: boolean;
};

export type ToolInfo = {
    displayName: string;
    plans: Record<string, PlanInfo>;
};

export const PRICING_DATA: Record<ToolName, ToolInfo> = {
    cursor: {
        displayName: "Cursor",
        plans: {
            hobby: {
                name: "Hobby",
                monthlyPricePerSeat: 0,
                minSeats: 1,
                bestFor: ["coding"],
            },
            pro: {
                name: "Pro",
                monthlyPricePerSeat: 25,
                minSeats: 1,
                bestFor: ["coding"],
            },
            business: {
                name: "Business",
                monthlyPricePerSeat: 40,
                minSeats: 1,
                bestFor: ["coding"],
            },
            enterprise: {
                name: "Enterprise",
                monthlyPricePerSeat: 40,
                minSeats: 20,
                bestFor: ["coding"],
                isEnterprise: true,
            },
        },
    },

    github_copilot: {
        displayName: "GitHub Copilot",
        plans: {
            individual: {
                name: "Individual",
                monthlyPricePerSeat: 10,
                minSeats: 1,
                bestFor: ["coding"],
            },
            business: {
                name: "Business",
                monthlyPricePerSeat: 19,
                minSeats: 1,
                bestFor: ["coding"],
            },
            enterprise: {
                name: "Enterprise",
                monthlyPricePerSeat: 39,
                minSeats: 1,
                bestFor: ["coding"],
                isEnterprise: true,
            },
        },
    },

    claude: {
        displayName: "Claude",
        plans: {
            free: {
                name: "Free",
                monthlyPricePerSeat: 0,
                minSeats: 1,
                bestFor: ["writing", "research", "mixed"],
            },
            pro: {
                name: "Pro",
                monthlyPricePerSeat: 20,
                minSeats: 1,
                bestFor: ["writing", "research", "mixed"],
            },
            max: {
                name: "Max",
                monthlyPricePerSeat: 100,
                minSeats: 1,
                bestFor: ["coding", "research", "mixed"],
            },
            team: {
                name: "Team",
                monthlyPricePerSeat: 30,
                minSeats: 5,
                bestFor: ["writing", "mixed"],
            },
            enterprise: {
                name: "Enterprise",
                monthlyPricePerSeat: 60,
                minSeats: 10,
                bestFor: ["mixed"],
                isEnterprise: true,
            },
            api: {
                name: "API Direct",
                monthlyPricePerSeat: 0,
                minSeats: 1,
                bestFor: ["coding", "data", "mixed"],
            },
        },
    },

    chatgpt: {
        displayName: "ChatGPT",
        plans: {
            free: {
                name: "Free",
                monthlyPricePerSeat: 0,
                minSeats: 1,
                bestFor: ["writing", "research", "mixed"],
            },
            plus: {
                name: "Plus",
                monthlyPricePerSeat: 20,
                minSeats: 1,
                bestFor: ["writing", "research", "mixed"],
            },
            team: {
                name: "Team",
                monthlyPricePerSeat: 30,
                minSeats: 2,
                bestFor: ["writing", "mixed"],
            },
            enterprise: {
                name: "Enterprise",
                monthlyPricePerSeat: 60,
                minSeats: 10,
                bestFor: ["mixed"],
                isEnterprise: true,
            },
            api: {
                name: "API Direct",
                monthlyPricePerSeat: 0,
                minSeats: 1,
                bestFor: ["coding", "data", "mixed"],
            },
        },
    },

    anthropic_api: {
        displayName: "Anthropic API",
        plans: {
            payg: {
                name: "Pay as you go",
                monthlyPricePerSeat: 0,
                minSeats: 1,
                bestFor: ["coding", "data", "mixed"],
            },
        },
    },

    openai_api: {
        displayName: "OpenAI API",
        plans: {
            payg: {
                name: "Pay as you go",
                monthlyPricePerSeat: 0,
                minSeats: 1,
                bestFor: ["coding", "data", "mixed"],
            },
        },
    },

    gemini: {
        displayName: "Gemini",
        plans: {
            free: {
                name: "Free",
                monthlyPricePerSeat: 0,
                minSeats: 1,
                bestFor: ["writing", "research", "mixed"],
            },
            pro: {
                name: "Pro (AI Premium)",
                monthlyPricePerSeat: 20,
                minSeats: 1,
                bestFor: ["writing", "research", "mixed"],
            },
            ultra: {
                name: "Ultra / Advanced",
                monthlyPricePerSeat: 20,
                minSeats: 1,
                bestFor: ["research", "mixed"],
            },
            api: {
                name: "API Direct",
                monthlyPricePerSeat: 0,
                minSeats: 1,
                bestFor: ["coding", "data", "mixed"],
            },
        },
    },

    windsurf: {
        displayName: "Windsurf",
        plans: {
            free: {
                name: "Free",
                monthlyPricePerSeat: 0,
                minSeats: 1,
                bestFor: ["coding"],
            },
            pro: {
                name: "Pro",
                monthlyPricePerSeat: 15,
                minSeats: 1,
                bestFor: ["coding"],
            },
            teams: {
                name: "Teams",
                monthlyPricePerSeat: 30,
                minSeats: 1,
                bestFor: ["coding"],
            },
        },
    },
};

export const getPlansForTool = (tool: ToolName): Record<string, PlanInfo> => {
    return PRICING_DATA[tool].plans;
};

export const getDisplayName = (tool: ToolName): string => {
    return PRICING_DATA[tool].displayName;
};

export const ALL_TOOLS: ToolName[] = Object.keys(PRICING_DATA) as ToolName[];