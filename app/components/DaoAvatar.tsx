'use client'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { HydratedDaoItem } from '@/app/lib/types'

export function DaoAvatar({ dao }: { dao: HydratedDaoItem }) {
  const fallbackText = dao.name?.charAt(0)?.toUpperCase() || '?'
  
  return (
    <Avatar className="h-12 w-12">
      <AvatarImage 
        src={dao.profile?.avatarImg} 
        alt={dao.name} 
      />
      <AvatarFallback>{fallbackText}</AvatarFallback>
    </Avatar>
  )
} 