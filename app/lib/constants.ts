// Chain IDs
export const CHAIN_ID = {
  ETHEREUM: '0x1',
  GOERLI: '0x5',
  ARBITRUM: '0xa4b1',
  BASE: '0x2105',
  OPTIMISM: '0xa',
  POLYGON: '0x89',
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
  }
} as const

// API Routes
export const API_ROUTES = {
  DAOS: '/api/daos',
  ITEMS: '/api/items',
  CHAT: '/api/chat',
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
