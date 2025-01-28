// Chain IDs
export const CHAIN_ID = {
  ETHEREUM: '0x1',
  GOERLI: '0x5',
  ARBITRUM: '0xa4b1',
  BASE: '0x2105',
  OPTIMISM: '0xa',
  POLYGON: '0x89',
  GNOSIS: '0x64'  // Add Gnosis chain ID
} as const

// Default chain configuration
export const DEFAULT_CHAIN = {
  id: CHAIN_ID.BASE,
  name: 'Base',
} as const

// Graph API configuration
export const GRAPH = {
  SUBGRAPH_KEYS: {
    DAOHAUS: 'DAOHAUS',
    YEETER: 'YEETER',
  },
  // ...rest of your graph constants
} as const

// List of featured DAOs
export const FEATURED_DAOS = [
  {
    id: '0x4d5a5b4a679b10038e1677c84cb675d10d29fffd', // RGCVII
  },
  {
    id: '0x0d8d4d5de4ea1ed04bfd94375a8f34078194ff61', // IRON
  },
  {
    id: '0xc08ee7e26620da30e04ee85f23e00be189d4e2ec', // FLY
  },
] as const

export const SUPER_AGENTS = [
  {
    id: '0x0d8d4d5de4ea1ed04bfd94375a8f34078194ff61', // Super Agent
  },
] as const

// Convert date to Unix timestamp (seconds since epoch)
export const DEFAULT_DAO_DATE = Math.floor(new Date('2025-01-21').getTime() / 1000).toString()

export const REFERRER = "DHYeet24ShamanSummoner.5";

// Add these to your existing constants
export const AGENT_IDS = {
  HELP: 'help-agent-0x1',
  SUMMONER: 'summoner-agent-0x1',
} as const 

// Add new constant for special DAOs on different chains
export const SPECIAL_DAOS = {
  GNOSIS: [
    {
      id: '0xf02fd4286917270cb94fbc13a0f4e1ed76f7e986',
      chainId: '0x64',
      name: 'Special DAO Name' // Optional: add other metadata as needed
    }
  ]
} as const


