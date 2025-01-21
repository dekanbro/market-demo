import { HydratedDaoItem } from '@/app/lib/types'
import { getDaoById } from '@/app/lib/dao-service'
import { docs } from '@/app/about/content/docs'
import { AGENT_IDS } from '@/app/lib/constants'

// Define function types for each agent type
interface BaseAgentFunctions {
  getAgentPrice: (args: { daoId: string }) => Promise<string>
  submitProposal: (args: { daoId: string, proposal: string }) => Promise<string>
}

interface SummonerFunctions extends BaseAgentFunctions {
  createDao: (args: { 
    name: string
    symbol: string
    description: string
    price: number 
  }) => Promise<string>
}

interface BlacksmithFunctions extends BaseAgentFunctions {
  forgeMetal: (args: { type: string, quantity: number }) => Promise<string>
}

// At the top of the file, add an interface for agent config
interface AgentConfig {
  tools: any[];
  systemPrompt: (dao?: HydratedDaoItem) => string | Promise<string>;
  functions: BaseAgentFunctions | SummonerFunctions | BlacksmithFunctions;
}

// Define tool schemas for each function
const baseFunctionTools = [
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

const summonerTools = [
  ...baseFunctionTools,
  {
    type: 'function' as const,
    function: {
      name: 'createDao',
      description: 'Create a new DAO',
      parameters: {
        type: 'object' as const,
        properties: {
          name: { type: 'string' as const },
          symbol: { type: 'string' as const },
          description: { type: 'string' as const },
          price: { type: 'number' as const }
        },
        required: ['name', 'symbol', 'description', 'price']
      }
    }
  }
]

// Registry mapping DAO types to their functions and tools
export const agentRegistry: Record<string, AgentConfig> = {
  [AGENT_IDS.HELP]: {
    tools: baseFunctionTools,
    systemPrompt: async () => {
      try {
        const response = await fetch('/api/about')
        const { docs } = await response.json()
        
        return `
          You are the Help Agent, an expert on the Agent Market platform.
          
          Use this documentation to answer questions accurately:

          ${Object.values(docs).join('\n\n')}
          
          When answering:
          1. Be friendly and informative
          2. Use simple language to explain complex concepts
          3. Give specific examples when possible
          4. Reference specific sections from the documentation
          5. Stay within the scope of the provided documentation
          
          If you don't know something or it's not in the documentation, say so clearly.
        `
      } catch (error) {
        console.error('Failed to fetch help content:', error)
        return 'You are the Help Agent, but currently have limited access to documentation. Please try again later.'
      }
    },
    functions: {
      // Help agent functions
    } as BaseAgentFunctions
  },
  [AGENT_IDS.SUMMONER]: {
    tools: summonerTools,
    systemPrompt: async (_dao?: HydratedDaoItem) => `
      You are the Summoner Agent, an expert in creating DAOs on Agent Market.
      
      Your role is to:
      1. Guide users through the DAO creation process
      2. Explain the different options and parameters
      3. Help users make informed decisions about their DAO setup
      4. Execute the DAO creation when ready

      When helping users create a DAO:
      - Ask for the DAO name and symbol
      - Help them craft a good description
      - Explain governance options
      - Guide them on token setup
      - Assist with any questions about the process

      Use the createDao function when the user is ready to create their DAO.
      Always confirm the details before proceeding with creation.

      Be friendly but professional. Focus on helping users make good decisions.
    `,
    functions: {
      createDao: async ({ name, symbol, description, price }) => {
        console.log('Creating DAO:', { name, symbol, description, price })
        return `DAO creation initiated with name: ${name}`
      }
    } as SummonerFunctions
  },
  'blacksmith': {
    tools: [...baseFunctionTools], // Add blacksmith-specific tools
    systemPrompt: (dao: HydratedDaoItem) => `
      You are the Iron Blacksmith...
    `,
    functions: {
      // Implement Blacksmith-specific functions
    } as BlacksmithFunctions
  },
  'default': {
    tools: baseFunctionTools,
    systemPrompt: (dao: HydratedDaoItem) => `
      You are ${dao.name}, a DAO agent with the following characteristics:
      DaoId: ${dao.id}
      Description: ${dao.profile?.description || 'No description available'}
      Token Symbol: ${dao.shareTokenSymbol}
      Status: ${dao.status}
      ${dao.comingSoon ? 'This DAO is coming soon and in development.' : ''}

      Decide what the user is asking for. You can check the tools available to you to see if the user is asking for a function.
      If the user is asking a question, respond in character based on these traits. Keep responses concise and engaging. 

      
    `,
    functions: {
      // Implement base functions
    } as BaseAgentFunctions
  }
}

// Add function implementations
export async function executeFunctionCall(name: string, args: any) {
  switch (name) {
    case 'getAgentPrice':
      const dao = await getDaoById(args.daoId)
      return `The current price is ${dao?.price || 0} ETH`

    case 'submitProposal':
      console.log('Proposal submitted:', args.proposal)
      return 'Thank you for your proposal. It has been recorded.'

    case 'createDao':
      console.log('Creating DAO:', args)
      return `DAO creation initiated with name: ${args.name}, symbol: ${args.symbol}`

    case 'forgeMetal':
      return `Forging ${args.quantity} units of ${args.type} metal...`

    default:
      throw new Error(`Unknown function: ${name}`)
  }
} 