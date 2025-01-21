'use client'

import { HydratedDaoItem } from '@/app/lib/types'
import { Button } from '@/components/ui/button'
import { useProtectedAction } from '@/app/hooks/useProtectedAction'

export function DaoActions({ dao }: { dao: HydratedDaoItem }) {
  const { handleProtectedAction } = useProtectedAction()
  

  return (
    <div className="flex gap-4">
      <Button 
        size="lg" 
        className="flex-1"
        onClick={() => handleProtectedAction(() => {
          console.log('Buy DAO:', dao.id)
        })}
      >
        {dao.price > 0 ? `Buy for ${dao.price} ETH` : 'Buy'}
      </Button>
      <Button 
        size="lg" 
        variant="outline" 
        className="flex-1"
        onClick={() => handleProtectedAction(() => {
          console.log('Some Action:', dao.id)
        })}
      >
        Some Action
      </Button>
    </div>
  )
} 