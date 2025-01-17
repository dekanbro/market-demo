'use client'

import { useState } from 'react'
import { ItemCard } from './components/ItemCard'
import { Marquee } from './components/Marquee'
import { items } from './data/items'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useProtectedAction } from '@/app/hooks/useProtectedAction'
import Link from 'next/link'

export default function Home() {
  const { handleProtectedAction } = useProtectedAction();
  const [selectedBattlers] = useState(() => {
    const featuredAgents = items.filter(item => item.status === 'featured');
    // Shuffle array and pick first two
    const shuffled = [...featuredAgents].sort(() => Math.random() - 0.5);
    // Ensure we don't pick the same agent twice
    return [
      shuffled[0],
      shuffled.find(agent => agent.id !== shuffled[0].id) || shuffled[1]
    ];
  });

  return (
    <div>
      <div className="mb-8 text-center">
        <p className="text-lg text-muted-foreground">
          Welcome to the first marketplace where AI agents battle for glory, 
          creators earn <span className="text-primary font-semibold">66.6%</span> of LP fees, 
          and the community decides who rules supreme. 
          <Link href="/about" className="text-primary hover:text-primary/80 ml-2 underline underline-offset-4">
            Learn how it works →
          </Link>
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Battle Mode</h2>
        <div className="relative bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-red-500/10 rounded-lg p-6">
          <div className="flex justify-between items-center gap-8">
            {/* Left Agent */}
            <div className="flex-1 text-center">
              <Link href={`/item/${selectedBattlers[0].id}`} className="block">
                <div className="relative aspect-square max-w-[300px] mx-auto mb-4 transition-transform hover:scale-105">
                  <Image
                    src={selectedBattlers[0].image}
                    alt={selectedBattlers[0].title}
                    fill
                    className="object-cover object-top rounded-lg"
                  />
                </div>
              </Link>
              <h3 className="text-xl font-bold">{selectedBattlers[0].title}</h3>
              <p className="text-sm text-muted-foreground">{selectedBattlers[0].price.toFixed(4)} ETH</p>
            </div>

            {/* VS Badge */}
            <div className="relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-full font-bold">
                VS
              </div>
              <div className="w-px h-[300px] bg-gradient-to-b from-transparent via-primary/50 to-transparent" />
            </div>

            {/* Right Agent */}
            <div className="flex-1 text-center">
              <Link href={`/item/${selectedBattlers[1].id}`} className="block">
                <div className="relative aspect-square max-w-[300px] mx-auto mb-4 transition-transform hover:scale-105">
                  <Image
                    src={selectedBattlers[1].image}
                    alt={selectedBattlers[1].title}
                    fill
                    className="object-cover object-top rounded-lg"
                  />
                </div>
              </Link>
              <h3 className="text-xl font-bold">{selectedBattlers[1].title}</h3>
              <p className="text-sm text-muted-foreground">{selectedBattlers[1].price.toFixed(4)} ETH</p>
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <Button 
              variant="outline" 
              className="w-40"
              onClick={() => handleProtectedAction(() => {
                console.log('Vote for', selectedBattlers[0].title);
              })}
            >
              Vote {selectedBattlers[0].title}
            </Button>
            <Button 
              variant="outline" 
              className="w-40"
              onClick={() => handleProtectedAction(() => {
                console.log('Vote for', selectedBattlers[1].title);
              })}
            >
              Vote {selectedBattlers[1].title}
            </Button>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Featured Agents</h2>
        <Marquee>
          <div className="flex space-x-4 py-4">
            {items.filter(item => item.status === 'featured').map((item) => (
              <div key={item.id} className="w-64 flex-shrink-0">
                <ItemCard item={item} />
              </div>
            ))}
          </div>
        </Marquee>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Active Presales</h2>
        <Marquee direction="right" speed={25}>
          <div className="flex space-x-4 py-4">
            {items.filter(item => item.status === 'active').map((item) => (
              <div key={item.id} className="w-64 flex-shrink-0">
                <ItemCard item={item} />
              </div>
            ))}
          </div>
        </Marquee>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">All Agents</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  )
}

