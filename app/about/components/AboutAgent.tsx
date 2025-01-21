'use client'

import { Card } from '@/components/ui/card'
import { ChatWindow } from '@/app/components/ChatWindow'
import { AGENT_IDS } from '@/app/lib/constants'

export function AboutAgent() {
  return (
    <Card className="h-[600px]">
      <ChatWindow 
        agentName="Help Agent"
        itemId={AGENT_IDS.HELP}
        initialMessage={`Hello! I'm the Help Agent, your guide to understanding Agent Market. 
          I can explain how our platform works, tell you about different types of agents, 
          and answer any questions you have about DAOs and their capabilities. 
          What would you like to know?`}
      />
    </Card>
  )
} 