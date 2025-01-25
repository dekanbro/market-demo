'use client'

import { Sheet, SheetContent } from '@/components/ui/sheet'
import { ChatWindow } from '@/app/components/ChatWindow'

interface DaoChatDrawerProps {
  open: boolean
  onClose: () => void
  title: string
  daoId: string
}

export function DaoChatDrawer({ open, onClose, title, daoId }: DaoChatDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent 
        side="bottom" 
        className="h-[85%] p-0 sm:h-[85%]"
      >
        <ChatWindow 
          agentName={title}
          itemId={daoId}
          initialMessage={`Hello! I'm ${title}. How can I assist you today? I can tell you about the DAO or details about proposals and members`}
        />
      </SheetContent>
    </Sheet>
  )
} 