import { createPublicClient, http } from 'viem'
import { base, gnosis } from 'viem/chains'
import { CHAIN_ID } from './constants'

const chains = {
    [CHAIN_ID.BASE]: base,
    [CHAIN_ID.GNOSIS]: gnosis,
  }

export function publicClient(chainId: string = CHAIN_ID.BASE) {
  return createPublicClient({
    chain: chains[chainId as keyof typeof chains],
    transport: http(process.env.BASE_RPC_URL)
  })
} 