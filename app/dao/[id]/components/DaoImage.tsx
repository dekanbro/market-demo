'use client'

import { HydratedDaoItem } from '@/app/lib/types'
import { Button } from '@/components/ui/button'
import { DaoChatDrawer } from './DaoChatDrawer'
import Image from 'next/image'
import { useState } from 'react'

export function DaoImage({ dao }: { dao: HydratedDaoItem }) {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <>
      <div className="space-y-4">
        <div className="relative aspect-square rounded-lg overflow-hidden">
          <Image
            src={dao.profile?.avatarImg || '/placeholder.svg'}
            alt={dao.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="lg" 
            className="flex-1"
            onClick={() => setIsChatOpen(true)}
          >
            Chat with DAO
          </Button>
        </div>
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