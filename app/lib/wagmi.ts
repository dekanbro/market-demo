import { http, createConfig } from '@wagmi/core'
import { base, baseGoerli, mainnet } from 'viem/chains'
import { createClient } from 'viem'
import { QueryClient } from '@tanstack/react-query'

// Create query client for React Query
export const queryClient = new QueryClient()

// Create wagmi config
export const config = createConfig({
  chains: [base, baseGoerli, mainnet],
  transports: {
    [base.id]: http(process.env.NEXT_PUBLIC_RPC_URL),
    [baseGoerli.id]: http('https://goerli.base.org'),
    [mainnet.id]: http(process.env.NEXT_PUBLIC_RPC_URL),
  },
})

// Create viem client
export const publicClient = createClient({
  chain: process.env.NEXT_PUBLIC_NETWORK === 'mainnet' ? base : baseGoerli,
  transport: http(process.env.NEXT_PUBLIC_RPC_URL)
})

// Contract addresses per chain
export const CONTRACT_ADDRESSES = {
  [baseGoerli.id]: {
    BAAL_SINGLETON: '',
    BAAL_SUMMONER: '',
    SHARES_SINGLETON: '',
    LOOT_SINGLETON: '',
    POSTER: '',
    SAFE_SINGLETON: '',
    SAFE_FACTORY: '',
    SAFE_PROXY_FACTORY: '',
    SAFE_FALLBACK_HANDLER: '',
    L2_RESOLVER: '',
    YEET24_SUMMONER: '', // Replace with actual address
  },
  [base.id]: {
    BAAL_SINGLETON: '0x4050E747Ed393e1Fd89783662C48373421fD0647', // HIGHER_HOS_SUMMONER
    BAAL_SUMMONER: '0x22e0382194AC1e9929E023bBC2fD2BA6b778E098', // 
    SHARES_SINGLETON: '0x59a7C71221d05e30b9d7981AB83f0A1700e51Af8', // GOV_LOOT_SINGLETON
    LOOT_SINGLETON: '0xD2bA2c50D16D35d6B8642A06b2C882F9fe790EDD', // DH_TOKEN_SINGLETON
    POSTER: '0x000000000000cd17345801aa8147b8d3950260ff',
    SAFE_SINGLETON: '0x69f4D1788e39c87893C980c06EdF4b7f686e2938', // GNOSIS_SAFE_MASTER_COPY
    SAFE_FACTORY: '0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67',
    GNOSIS_SAFE_PROXY_FACTORY: '0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC',
    SAFE_FALLBACK_HANDLER: '0x2f3637757875414c938EF80A5aD197aAaCDaA924', // Using YEET24_SINGLETON as fallback
    L2_RESOLVER: '0x8D60971eFf778966356c1cADD76d525E7B25cc6b', // YEETER_SINGLETON
    YEET24_SUMMONER: '0xe6eB99FaB27bE81D5F5F4dC44fCdf508a1B97Cd3',
    YEET24_SINGLETON: '0xcbcdce90ddaf50739dfb90b84e9b84a312b0a4e5',
  }
} as const

// Additional contract addresses that might be needed
export const ADDITIONAL_ADDRESSES = {
  [base.id]: {
    YEET24_CLAIM_MODULE: '0xc5ec2eabfd8d1a1e38896ad2ec1d452f66dac761',
    WETH: '0x4200000000000000000000000000000000000006',
    GNOSIS_MULTISEND: '0x998739BFdAAdde7C933B942a68053933098f9EDa',
    UNISWAP_V3_POSITION_MANAGER: '0x03a520b32C04BF3bEEf7BEb72E919cf822Ed34f1',
  }
} as const

export const MEME_SHAMAN_PERMISSIONS = 3
export const YEET_SHAMAN_PERMISSIONS = 2

// Chain-specific configurations
export const CHAIN_CONFIG = {
  [base.id]: {
    RESOLVER_TYPE: 'l2',
    SAFE_L1: false,
    SAFE_L2: true,
  },
  [baseGoerli.id]: {
    RESOLVER_TYPE: 'l2',
    SAFE_L1: false,
    SAFE_L2: true,
  }
} as const 

// locker 0xCFcf187F6A5cF5E7cdF52E7e1EBaE1970E38a6F0
// MM 0x088c48a05C3d7A5C3F019C1CbD16873d64D6d839