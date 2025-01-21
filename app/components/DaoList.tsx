'use client'

import { useDaos } from '@/app/hooks/useDaos'
import { useWallets } from '@privy-io/react-auth'
import { DEFAULT_CHAIN } from '@/app/lib/constants'
import { DaoCard } from './DaoCard'

export function DaoList() {
  const { wallets } = useWallets()
  const embeddedWallet = wallets.find(wallet => wallet.walletClientType === 'privy')
  
  const { daos, error, loading } = useDaos({
    chainId: embeddedWallet?.chainId || DEFAULT_CHAIN.id
  })

  if (loading) return <div>Loading DAOs...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {daos.map((dao) => (
        <DaoCard key={dao.id} dao={dao} />
      ))}
    </div>
  )
} 