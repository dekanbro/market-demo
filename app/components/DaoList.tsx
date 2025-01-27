'use client'

import { useDaos } from '@/app/hooks/useDaos'
import { useWallets } from '@privy-io/react-auth'
import { DEFAULT_CHAIN } from '@/app/lib/constants'
import { DaoCard } from './DaoCard'
import { useState } from 'react'
import { DaoFilter, FilterType } from './DaoFilter'

export function DaoList() {
  const { wallets } = useWallets()
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const embeddedWallet = wallets.find(wallet => wallet.walletClientType === 'privy')
  
  const { daos, error, loading } = useDaos({
    chainId: embeddedWallet?.chainId || DEFAULT_CHAIN.id
  })

  const filteredDaos = daos.filter(dao => {
    switch (activeFilter) {
      case 'coming-soon':
        return dao.comingSoon
      case 'presale':
        return dao.isPresale
      default:
        return true
    }
  })

  if (loading) return <div>Loading DAOs...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="space-y-6">
      <DaoFilter 
        daos={daos}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDaos.map((dao) => (
          <DaoCard key={dao.id} dao={dao} />
        ))}
      </div>

      {filteredDaos.length === 0 && (
        <div className="text-center text-muted-foreground py-12">
          No DAOs found for the selected filter
        </div>
      )}
    </div>
  )
} 