import { getDaoById } from '@/app/lib/dao-service'

// Define standard response type
type FunctionResponse = {
  success: boolean;
  message: string;
  data?: any;
};

// Define function types
type FunctionArgs = {
  getDaoPrice: { daoId: string };
  submitProposal: { daoId: string; proposal: string };
};

// Define the functions
export const functions = {
  getAgentPrice: async ({ daoId }: FunctionArgs['getDaoPrice']): Promise<FunctionResponse> => {
    console.log('getAgentPrice', daoId);
    const dao = await getDaoById(daoId);
    return {
      success: true,
      message: `Current price is ${dao?.price || 0} ETH`,
      data: { price: dao?.price || "0" }
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
    type: 'function' as const,
    function: {
      name: 'getAgentPrice',
      description: 'Get the current price of a DAO',
      parameters: {
        type: 'object' as const,
        properties: {
          daoId: {
            type: 'string' as const,
            description: 'The ID of the DAO'
          }
        },
        required: ['daoId']
      }
    }
  },
  {
    type: 'function' as const,
    function: {
      name: 'submitProposal',
      description: 'Submit a proposal for a DAO',
      parameters: {
        type: 'object' as const,
        properties: {
          daoId: {
            type: 'string' as const,
            description: 'The ID of the DAO'
          },
          proposal: {
            type: 'string' as const,
            description: 'The proposal text'
          }
        },
        required: ['daoId', 'proposal']
      }
    }
  }
]

// Generic function executor
export async function executeFunctionCall(name: string, args: any) {
  switch (name) {
    case 'getAgentPrice':
      console.log('getAgentPrice', args)
      const dao = await getDaoById(args.daoId)
      const response = await functions.getAgentPrice({ daoId: args.daoId })
      return formatToolResponse(response)

    case 'submitProposal':
      console.log('submitProposal', args)
      const proposalResponse = await functions.submitProposal({ 
        daoId: args.daoId, 
        proposal: args.proposal 
      })
      return formatToolResponse(proposalResponse)

    default:
      throw new Error(`Unknown function: ${name}`)
  }
}

// Update the response formatter
function formatToolResponse(response: FunctionResponse): string {
  if (!response.success) {
    return `Error: ${response.message}`
  }
  return response.message
} 