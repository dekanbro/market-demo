'use client'

import { useMarketMaker } from '@/app/hooks/useMarketMaker'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatEther, zeroAddress } from 'viem'
import { ExternalLinkIcon, Rocket } from 'lucide-react'
import { ExecuteDialog } from './ExecuteDialog'

interface MarketMakerStatusProps {
  daoId: string
  shamanAddress: string
  chainId?: string
}

export function MarketMakerStatus({ daoId, shamanAddress, chainId }: MarketMakerStatusProps) {
  const { data, isLoading, error } = useMarketMaker(daoId, shamanAddress, chainId)

  if (isLoading) {
    return (
      <Card className="p-4">
        <Skeleton className="h-4 w-3/4 mb-4" />
        <Skeleton className="h-4 w-1/2" />
      </Card>
    )
  }

  if (error || !data) {
    return null
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Market Maker Status</h3>
      <Card className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="font-medium">
              {data.executed && data.pool !== zeroAddress ? (
                <span className="text-green-500">Pool Active</span>
              ) : data.canExecute ? (
                <span className="text-yellow-500">Ready to Execute</span>
              ) : data.pool === zeroAddress ? (
                <span className="text-red-500">Pool Not Created</span>
              ) : (
                <span className="text-muted-foreground">Pending</span>
              )}
              {}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Goal Status</p>
            <p className="font-medium">
              {data.goalAchieved ? (
                <span className="text-green-500">Achieved</span>
              ) : (
                <span className="text-red-500">Not Met</span>
              )}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Execution Balance</p>
            <p className="font-medium">
              {formatEther(BigInt(data.balance))} ETH
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {data.canExecute && (
            <ExecuteDialog 
              shamanAddress={shamanAddress}
              chainId={chainId}
            />
          )}
          
          {data.uniswapUrl && data.pool !== zeroAddress && (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.open(data.uniswapUrl, '_blank')}
            >
              View Pool on Uniswap
              <ExternalLinkIcon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
} 