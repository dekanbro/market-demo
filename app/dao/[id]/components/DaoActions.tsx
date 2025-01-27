'use client'

import { HydratedDaoItem } from '@/app/lib/types'
import { useProtectedAction } from '@/app/hooks/useProtectedAction'
import { BuyDialog } from './BuyDialog'
import { RatifyDialog } from './RatifyDialog'

export function DaoActions({ dao }: { dao: HydratedDaoItem }) {
  const { handleProtectedAction } = useProtectedAction()
  
  const handleBuy = (amount: string, message: string) => {
    handleProtectedAction(() => {
      console.log('Buy DAO:', { daoId: dao.id, amount, message })
      // Add purchase logic here
    })
  }

  return (
    <div className="flex gap-4">
      <BuyDialog dao={dao} />
      <RatifyDialog />
    </div>
  )
} 