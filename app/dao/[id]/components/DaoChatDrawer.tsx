'use client'

import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet'
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
        className="h-[85vh] p-0 sm:h-[85vh] w-full max-w-[100vw] sm:max-w-[600px]"
      >
        <div className="px-4 py-2">
          <SheetTitle>Chat with {title}</SheetTitle>
          <SheetDescription>
            Have a conversation with the {title} DAO. Ask about proposals, members, or general information.
          </SheetDescription>
        </div>
        <ChatWindow 
          agentName={title}
          itemId={daoId}
          initialMessage={`Hello! I'm ${title}. How can I assist you today? I can tell you about the DAO or details about proposals and members`}
        />
      </SheetContent>
    </Sheet>
  )
} 