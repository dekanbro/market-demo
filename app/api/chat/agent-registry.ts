import { HydratedDaoItem } from '@/app/lib/types'
import { getDaoById } from '@/app/lib/dao-service'
import { docs } from '@/app/about/content/docs'
import { AGENT_IDS } from '@/app/lib/constants'
import { type DaoSummonParams } from '@/app/lib/contracts/schemas'
import { DEFAULT_DAO_PARAMS, DEFAULT_GOAL, DEFAULT_MEME_YEETER_VALUES, DEFAULT_YEETER_VALUES, END_TIME, START_TIME } from '@/app/lib/contracts/constants'
import { daoSummoner } from '@/app/lib/contracts/summoner-functions'
import OpenAI from 'openai'
import { ImageService } from '@/app/lib/image-service'


// At the top of the file, add an interface for agent config
interface AgentConfig {
  tools: any[];
  systemPrompt: (dao?: HydratedDaoItem) => string | Promise<string>;
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
      description: 'Create a new DAO with the provided parameters be sure to include the memberAddress parameter',
      parameters: {
        type: 'object' as const,
        properties: {
          name: { type: 'string' as const },
          symbol: { type: 'string' as const },
          description: { type: 'string' as const },
          price: { type: 'string' as const },
          imageUrl: { type: 'string' as const },
          memberAddress: { type: 'string' as const },
        },
        required: ['name', 'symbol', 'description', 'price', 'imageUrl', 'memberAddress']
      }
    }
  },
  {
    type: 'function' as const,
    function: {
      name: 'generateArt',
      description: 'Generate art using DALL-E based on a text prompt',
      parameters: {
        type: 'object' as const,
        properties: {
          prompt: {
            type: 'string',
            description: 'Text description of the desired artwork'
          }
        },
        required: ['prompt']
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
    }
  },
  [AGENT_IDS.SUMMONER]: {
    tools: summonerTools,
    systemPrompt: async (_dao?: HydratedDaoItem) => `
      You are the Summoner Agent, an expert in creating Agent DAOs on Agent Market.
      
      The user's connected wallet address will be provided in the first message.
      When creating a DAO, use this address as the memberAddress parameter.
      
      Your role is to:
      1. Guide users through the DAO creation process
      2. Generate unique artwork for the DAO using DALL-E
      3. Help users make informed decisions about their DAO setup
      4. Execute the DAO creation when ready

      When helping users create a DAO:
      - Ask for the DAO name and symbol
      - Help them craft a good description
      - Generate themed artwork for their DAO using generateArt
      - Guide them on token pricing and economics
      - Assist with any questions about the process

      For artwork generation:
      - Create prompts that reflect the DAO's theme and purpose
      - Suggest artistic styles that match the DAO's character
      - Use DALL-E to generate professional, unique artwork

      Use the createDao function when all details are ready, including:
      - Name and symbol
      - Description
      - Generated artwork URL
      - Token price

      Be friendly but professional. Focus on helping users create distinctive and well-designed DAOs.
    `
  },
  'blacksmith': {
    tools: [...baseFunctionTools],
    systemPrompt: (dao?: HydratedDaoItem) => `
      You are the Iron Blacksmith...
    `
  },
  'default': {
    tools: baseFunctionTools,
    systemPrompt: (dao?: HydratedDaoItem) => {
      if (!dao) return 'Default agent configuration not available.'
      return `
        You are ${dao.name}, a DAO agent with the following characteristics:
        DaoId: ${dao.id}
        Description: ${dao.profile?.description || 'No description available'}
        Token Symbol: ${dao.shareTokenSymbol}
        Status: ${dao.status}
        ${dao.comingSoon ? 'This DAO is coming soon and in development.' : ''}

        Decide what the user is asking for. You can check the tools available to you to see if the user is asking for a function.
        If the user is asking a question, respond in character based on these traits. Keep responses concise and engaging. 
      `
    }
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
      console.log('Creating DAO from executeFunctionCall:', args)

      if (!args.memberAddress) {
        throw new Error('Please connect your wallet first');
      }
      try {
        const result = await createDao({
          name: args.name,
          description: args.description,
          tokenName: args.name,
          tokenSymbol: args.symbol,
          price: args.price,
          imageUrl: args.imageUrl,
          memberAddress: args.memberAddress
        })
        return result.message
      } catch (error) {
        console.error('Error creating DAO:', error)
        // return `Failed to create DAO: ${error instanceof Error ? error.message : 'unknown error'}`
        // dont return full error because the user will see it and it will be confusing
        return `\nFailed to create DAO`

      }

    case 'forgeMetal':
      return `Forging ${args.quantity} units of ${args.type} metal...`

    case 'generateArt':
      return await generateArt(args.prompt)

    default:
      throw new Error(`Unknown function: ${name}`)
  }
}

export async function createDao(params: {
  name: string
  description: string
  tokenName: string
  tokenSymbol: string
  price: string
  imageUrl: string
  memberAddress: string
}) {
  console.log('Creating DAO from tool call:', params)

  const now = Math.floor(Date.now() / 1000)
  
  const daoParams: DaoSummonParams = {
    name: params.name,
    description: params.description,
    tokenConfig: {
      name: params.tokenName,
      symbol: params.tokenSymbol,
    },
    price: params.price,
    memberAddress: params.memberAddress,
    // Use defaults for governance params
    votingPeriod: DEFAULT_DAO_PARAMS.VOTING_PERIOD,
    gracePeriod: DEFAULT_DAO_PARAMS.GRACE_PERIOD,
    proposalOffering: DEFAULT_DAO_PARAMS.PROPOSAL_OFFERING,
    quorum: DEFAULT_DAO_PARAMS.QUORUM,
    sponsorThreshold: DEFAULT_DAO_PARAMS.SPONSOR_THRESHOLD,
    minRetention: DEFAULT_DAO_PARAMS.MIN_RETENTION,
    // Set time parameters
    startTime: START_TIME,
    endTime: END_TIME,
    multiplier: DEFAULT_YEETER_VALUES.multiplier,
    minThresholdGoal: DEFAULT_GOAL,
    feeRecipients: DEFAULT_YEETER_VALUES.feeRecipients,
    feeAmounts: DEFAULT_YEETER_VALUES.feeAmounts,
    // Meme Yeeter values
    boostRewardFee: DEFAULT_MEME_YEETER_VALUES.boostRewardFee,
    poolFee: DEFAULT_MEME_YEETER_VALUES.poolFee,
    imageUrl: params.imageUrl,
  }

  const result = await daoSummoner.createDao(daoParams)
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to create DAO')
  }

  return {
    txHash: result.txHash,
    message: `DAO creation transaction sent: ${result.txHash}`
  }
}

async function generateArt(prompt: string): Promise<string> {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!
    });

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      size: "1024x1024",
      quality: "standard",
      n: 1,
    });

    const imageUrl = response.data[0].url;

    if (!imageUrl) {
      throw new Error('Failed to generate artwork');
    }
    
    // Upload to ImgBB if we have an API key
    if (process.env.IMG_BB_API_KEY) {
      const imageService = new ImageService(process.env.IMG_BB_API_KEY);
      const uploadResult = await imageService.uploadImage(imageUrl);
      
      if (uploadResult.success) {
        return `Successfully generated and uploaded artwork: ${uploadResult.url}`;
      }
      
      console.error('Upload failed:', uploadResult.error);
    }

    return `Successfully generated artwork: ${imageUrl}`;

  } catch (error) {
    return `Error generating artwork: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
} 