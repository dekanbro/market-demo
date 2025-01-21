'use client'

import { Card } from '@/components/ui/card'
import { ChatWindow } from '@/app/components/ChatWindow'

const SUMMON_AGENT_ID = 'summoner-agent-0x1'

export function SummonAgent() {
  return (
    <Card className="h-[600px]">
      <ChatWindow 
        agentName="Summoner Agent"
        itemId={SUMMON_AGENT_ID}
        initialMessage={`Hello! I'm the Summon Agent, your guide to summoning a new DAO`}
      />
    </Card>
  )
} 