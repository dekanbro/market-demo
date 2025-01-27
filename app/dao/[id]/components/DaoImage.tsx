'use client'

import { HydratedDaoItem } from '@/app/lib/types'
import { Button } from '@/components/ui/button'
import { DaoChatDrawer } from './DaoChatDrawer'
import Image from 'next/image'
import { useState } from 'react'
import { useProtectedAction } from '@/app/hooks/useProtectedAction'
import { MessageSquare } from 'lucide-react'

export function DaoImage({ dao }: { dao: HydratedDaoItem }) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const { handleProtectedAction } = useProtectedAction()

  const handleChatClick = () => {
    handleProtectedAction(() => {
      setIsChatOpen(true)
    })
  }

  return (
    <>
      <div className="space-y-4">
        <div 
          className="relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
          onClick={handleChatClick}
        >
          <Image
            src={dao.profile?.avatarImg || '/placeholder.svg'}
            alt={dao.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
            <MessageSquare className="text-white opacity-0 hover:opacity-100 transition-opacity h-12 w-12" />
          </div>
        </div>
        <Button 
          size="lg" 
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold h-12"
          onClick={handleChatClick}
        >
          <MessageSquare className="mr-2 h-5 w-5" />
          Chat with DAO
        </Button>
      </div>

      <DaoChatDrawer
        open={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        title={dao.name}
        daoId={dao.id}
      />
    </>
  )
} 