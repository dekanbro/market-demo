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
        initialMessage={`
# Welcome to the Summoner Agent! 

I'm here to help you summon a new DAO. You'll need:

- A **name**
- A **symbol** (ex. M$FT) 
- A **price** (probably less than .1 ETH)

You can also add a description and I can create an image for you.

... or if you're feeling lucky, ask me to fill it with random stuff.

**Ready to get started?**
  `}
      />
    </Card>
  )
} 