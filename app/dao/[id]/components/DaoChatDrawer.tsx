'use client'

import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { ChatWindow } from '@/app/components/ChatWindow'
import { HydratedDaoItem } from '@/app/lib/types'

interface DaoChatDrawerProps {
  open: boolean
  onClose: () => void
  title: string
  daoId: string
  dao: HydratedDaoItem
}

export function DaoChatDrawer({ open, onClose, title, daoId, dao }: DaoChatDrawerProps) {
  // Use agentName if available, otherwise fall back to title
  const displayName = dao.agentName || title

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent 
        side="bottom" 
        className="flex flex-col h-[85%] p-0"
      >
        <div className="px-4 py-2 border-b">
          <SheetTitle>Chat with {displayName}</SheetTitle>
          <SheetDescription>
            Have a conversation with the {displayName} DAO. Ask about proposals, members, or general information.
          </SheetDescription>
        </div>
        <div className="flex-1 min-h-0">
          <ChatWindow 
            agentName={displayName}
            itemId={daoId}
            initialMessage={`Hello! I'm ${displayName}. How can I assist you today? I can tell you about the DAO or details about proposals and members`}
            backgroundImage={dao.agentImage || dao.profile?.avatarImg}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
} 