'use client'

import { useState, useEffect } from 'react'
import { HydratedDaoItem } from '@/app/lib/types'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { useProtectedAction } from '@/app/hooks/useProtectedAction'

interface BattleSectionProps {
  daos: HydratedDaoItem[]
}

export function BattleSection({ daos }: BattleSectionProps) {
  const { handleProtectedAction } = useProtectedAction()
  const [selectedBattlers, setSelectedBattlers] = useState<HydratedDaoItem[]>([])

  useEffect(() => {
    const featuredDaos = daos.filter(dao => dao.status === 'featured')
    const shuffled = [...featuredDaos].sort(() => Math.random() - 0.5)
    setSelectedBattlers([
      shuffled[0],
      shuffled.find(dao => dao.id !== shuffled[0]?.id) || shuffled[1]
    ].filter(Boolean))
  }, [daos])

  if (selectedBattlers.length < 2) return null

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Battle Mode</h2>
      <div className="relative bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-red-500/10 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="text-center">
            <Link href={`/dao/${selectedBattlers[0].id}`} className="block">
              <div className="relative aspect-square max-w-[200px] md:max-w-[300px] mx-auto mb-4 transition-transform hover:scale-105">
                <Image
                  src={selectedBattlers[0].profile?.avatarImg || '/placeholder.svg'}
                  alt={selectedBattlers[0].name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </Link>
            <h3 className="text-xl font-bold">{selectedBattlers[0].name}</h3>
            <p className="text-sm text-muted-foreground">{selectedBattlers[0].price} ETH</p>
          </div>

          <div className="relative justify-self-center">
            <div className="hidden md:block absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-full font-bold">
              VS
            </div>
            <div className="hidden md:block w-px h-[300px] bg-gradient-to-b from-transparent via-primary/50 to-transparent" />
            <div className="md:hidden bg-primary text-primary-foreground px-4 py-2 rounded-full font-bold text-center">
              VS
            </div>
          </div>

          <div className="text-center">
            <Link href={`/dao/${selectedBattlers[1].id}`} className="block">
              <div className="relative aspect-square max-w-[200px] md:max-w-[300px] mx-auto mb-4 transition-transform hover:scale-105">
                <Image
                  src={selectedBattlers[1].profile?.avatarImg || '/placeholder.svg'}
                  alt={selectedBattlers[1].name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </Link>
            <h3 className="text-xl font-bold">{selectedBattlers[1].name}</h3>
            <p className="text-sm text-muted-foreground">{selectedBattlers[1].price} ETH</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
          {selectedBattlers.map((dao) => (
            <Button 
              key={dao.id}
              variant="outline" 
              className="w-full sm:w-40"
              onClick={() => handleProtectedAction(() => {
                console.log('Vote for', dao.name);
              })}
            >
              Vote {dao.shareTokenSymbol}
            </Button>
          ))}
        </div>
      </div>
    </section>
  )
} 