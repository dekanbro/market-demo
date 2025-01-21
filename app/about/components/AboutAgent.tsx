'use client'

import { Card } from '@/components/ui/card'
import { ChatWindow } from '@/app/components/ChatWindow'

const HELP_AGENT_ID = 'help-agent-0x1'

export function AboutAgent() {
  return (
    <Card className="h-[600px]">
      <ChatWindow 
        agentName="Help Agent"
        itemId={HELP_AGENT_ID}
        initialMessage={`Hello! I'm the Help Agent, your guide to understanding Agent Market. 
          I can explain how our platform works, tell you about different types of agents, 
          and answer any questions you have about DAOs and their capabilities. 
          What would you like to know?`}
      />
    </Card>
  )
} 