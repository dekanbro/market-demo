'use client'

import { useState } from 'react'
import { Item } from '@/app/data/items'
import { ChatWindow } from '@/app/components/ChatWindow'
import { useProtectedAction } from '@/app/hooks/useProtectedAction'
import { ItemTabs } from './components/ItemTabs'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose, DrawerTrigger } from '@/components/ui/drawer'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import Link from 'next/link'

export function ItemDetails({ item }: { item: Item }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false)
  const { handleProtectedAction, isAuthenticated, login } = useProtectedAction()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/" className="text-primary hover:underline mb-4 inline-block">
        &larr; Back to list
      </Link>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
          <div className="relative aspect-square">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover rounded-lg"
              priority
            />
            {item.type === 'super' && (
              <Badge className="absolute top-2 left-2 bg-purple-500">Super Agent</Badge>
            )}
          </div>
        </div>

        <div className="md:w-1/2 space-y-4">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{item.title}</h1>
            <Badge className={`bg-${item.status === 'featured' ? 'blue' : item.status === 'active' ? 'green' : 'red'}-500`}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Badge>
          </div>
          
          <p className="text-muted-foreground">{item.description}</p>
          <p className="text-2xl font-bold text-primary">{item.price.toFixed(4)} ETH</p>

          <div className="flex gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  className="flex-1" 
                  disabled={item.status !== 'active' || item.comingSoon}
                  onClick={() => handleProtectedAction(() => {
                    console.log('Buy clicked');
                  })}
                >
                  Buy
                </Button>
              </TooltipTrigger>
              {!isAuthenticated && (
                <TooltipContent>
                  <p>Connect wallet to buy</p>
                </TooltipContent>
              )}
            </Tooltip>

            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  disabled={item.comingSoon || item.status === 'failed'}
                  onClick={(e) => {
                    if (!isAuthenticated) {
                      e.preventDefault()
                      login()
                    }
                  }}
                >
                  Chat
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Chat with {item.title}</DrawerTitle>
                  <DrawerDescription>Start a conversation with this agent</DrawerDescription>
                </DrawerHeader>
                <ChatWindow agentName={item.title} itemId={item.id} />
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="outline">Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>

            <Drawer open={isProfileDrawerOpen} onOpenChange={setIsProfileDrawerOpen}>
              <DrawerTrigger asChild>
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleProtectedAction(() => setIsProfileDrawerOpen(true))}
                >
                  Propose Changes
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Propose Changes to {item.title}</DrawerTitle>
                  <DrawerDescription>Suggest improvements or modifications</DrawerDescription>
                </DrawerHeader>
                <div className="p-4">
                  <ChatWindow 
                    agentName={item.title} 
                    itemId={item.id}
                    initialMessage="I'm ready to hear your suggestions for improving my profile. What changes would you propose?"
                  />
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="outline">Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>

      <ItemTabs item={item} />
    </div>
  )
} 