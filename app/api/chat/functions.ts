import { items } from '@/app/data/items';

// Define standard response type
type FunctionResponse = {
  success: boolean;
  message: string;
  data?: any;
};

// Define function types
type FunctionArgs = {
  getAgentPrice: { agentId: string };
  submitProposal: { agentId: string; proposal: string };
};

// Define the functions
export const functions = {
  getAgentPrice: async ({ agentId }: FunctionArgs['getAgentPrice']): Promise<FunctionResponse> => {
    console.log('getAgentPrice', agentId);
    const agent = items.find(i => i.id === agentId);
    return {
      success: true,
      message: `Current price is ${agent?.price || 0} ETH`,
      data: { price: agent?.price || "0" }
    };
  },
  submitProposal: async (args: FunctionArgs['submitProposal']): Promise<FunctionResponse> => {
    console.log('submitProposal', args);
    return {
      success: true,
      message: "Proposal submitted successfully",
      data: { proposalId: Date.now() }
    };
  },
} as const;

// Define the tool schemas
export const functionTools = [
  {
    type: "function" as const,
    function: {
      name: "getAgentPrice",
      description: "Get the current price of an agent",
      parameters: {
        type: "object" as const,
        properties: {
          agentId: {
            type: "string" as const,
            description: "The id of the agent"
          }
        },
        required: ["agentId"]
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "submitProposal",
      description: "Submit a proposal to change an agent's profile",
      parameters: {
        type: "object" as const,
        properties: {
          agentId: {
            type: "string" as const,
            description: "The id of the agent"
          },
          proposal: {
            type: "string" as const,
            description: "The proposed changes to the agent's profile"
          }
        },
        required: ["agentId", "proposal"]
      }
    }
  },
  // Add new tool schemas here
];

// Generic function executor
export async function executeFunctionCall<T extends keyof typeof functions>(
  functionName: T,
  args: FunctionArgs[T]
): Promise<number | { success: boolean; message: string }> {
  const fn = functions[functionName];
  return await fn(args as any); // Type assertion needed due to union type limitations
}

// Update the response formatter
function formatToolResponse(response: FunctionResponse): string {
  return response.message;
} 