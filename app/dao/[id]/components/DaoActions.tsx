'use client'

import { HydratedDaoItem } from '@/app/lib/types'
import { useProtectedAction } from '@/app/hooks/useProtectedAction'
import { BuyDialog } from './BuyDialog'
import { RatifyDialog } from './RatifyDialog'
import { Button } from '@/components/ui/button'
import { ExternalLinkIcon } from 'lucide-react'
import { useMarketMaker } from '@/app/hooks/useMarketMaker'
import { zeroAddress } from 'viem'

export function DaoActions({ dao }: { dao: HydratedDaoItem }) {
  const { handleProtectedAction } = useProtectedAction()
  const { data: marketMakerData } = useMarketMaker(
    dao.id, 
    dao.marketMakerShamanAddress,
    dao.chainId
  )
  
  const now = Math.floor(Date.now() / 1000)
  const isPresaleActive = dao.yeeterData && 
    now >= Number(dao.yeeterData.startTime) && 
    now <= Number(dao.yeeterData.endTime)
  const isPresaleEnded = dao.yeeterData && 
    now > Number(dao.yeeterData.endTime)
  const isPoolActive = marketMakerData?.executed && marketMakerData?.pool !== zeroAddress && marketMakerData?.uniswapUrl

  return (
    <div className="flex gap-4">
      {isPoolActive ? (
        <Button 
          size="lg"
          className="flex-1"
          onClick={() => window.open(marketMakerData.uniswapUrl, '_blank')}
        >
          Trade on Uniswap
          <ExternalLinkIcon className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <BuyDialog 
          dao={dao} 
          disabled={!isPresaleActive || dao.comingSoon}
        />
      )}
      <RatifyDialog />
    </div>
  )
} 