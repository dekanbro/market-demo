'use client'

import { useState, useEffect } from 'react'
import { HydratedDaoItem } from '@/app/lib/types'
import { DaoCard } from './DaoCard'
import { Marquee } from './Marquee'
import { useProtectedAction } from '@/app/hooks/useProtectedAction'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { useDaos } from '@/app/hooks/useDaos'
import { useWallets } from '@privy-io/react-auth'
import { DEFAULT_CHAIN } from '@/app/lib/constants'
import { BattleSection } from './BattleSection'
import { NewsletterSignup } from './NewsletterSignup'
import { DaoFilter, FilterType } from './DaoFilter'

export function HomePage() {
  const { handleProtectedAction } = useProtectedAction()
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  
  const { wallets } = useWallets()
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

  useEffect(() => {
    const featuredDaos = daos.filter(dao => dao.status === 'featured')
    const shuffled = [...featuredDaos].sort(() => Math.random() - 0.5)
  }, [daos])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <p className="text-lg text-muted-foreground">
          Welcome to the first ILO launcher and marketplace where tokens have teeth, 
          creators earn{' '}
          <Link 
            href="/about" 
            className="text-primary hover:text-primary/80 underline underline-offset-4 font-semibold"
          >
            66.6%
          </Link>
          {' '}of LP fees, 
          and the community decides who rules supreme.
          <Link href="/about" className="text-primary hover:text-primary/80 ml-2 underline underline-offset-4">
            Learn how it works →
          </Link>
        </p>
      </div>
      <NewsletterSignup />


      {/* <BattleSection daos={daos} /> */}

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Featured DAOs</h2>
        <Marquee>
          <div className="flex space-x-4 py-4">
            {daos.filter(dao => dao.status === 'featured').map((dao) => (
              <div key={dao.id} className="w-64 flex-shrink-0">
                <DaoCard dao={dao} />
              </div>
            ))}
          </div>
        </Marquee>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">All DAOs</h2>
          <DaoFilter 
            daos={daos}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDaos.map((dao) => (
            <DaoCard key={dao.id} dao={dao} />
          ))}
        </div>
        {filteredDaos.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            No DAOs found for the selected filter
          </div>
        )}
      </section>
    </div>
  )
} 