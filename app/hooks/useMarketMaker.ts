import { useQuery } from '@tanstack/react-query'

interface MarketMakerData {
  executed: boolean
  goalAchieved: boolean
  pool: string
  endTime: string
  balance: string
  canExecute: boolean
  uniswapUrl?: string
}

export function useMarketMaker(
  daoId: string,
  shamanAddress?: string,
  chainId?: string
) {
  return useQuery<MarketMakerData>({
    queryKey: ['market-maker', daoId, shamanAddress],
    queryFn: async () => {
      if (!shamanAddress) throw new Error('Market maker shaman address is required')
      
      const response = await fetch(
        `/api/dao/${daoId}/market-maker?shamanAddress=${shamanAddress}&chainId=${chainId}`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch market maker data')
      }
      return response.json()
    },
    enabled: Boolean(daoId && shamanAddress),
  })
} 