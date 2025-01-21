'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { usePrivy } from '@privy-io/react-auth'
import { ConnectButton } from "@/app/components/ConnectButton"
import { Button } from "@/components/ui/button"
import { SummonAgent } from "./SummonAgent"

export function CreateTabs() {
  const { authenticated, login } = usePrivy()

  return (
    <Tabs defaultValue="docs" className="space-y-4">
      <TabsList className="w-full">
        <TabsTrigger value="docs" className="flex-1">
          Documentation
        </TabsTrigger>
        {authenticated ? (
          <TabsTrigger value="chat" className="flex-1">
            Chat with Summon Agent
          </TabsTrigger>
        ) : (
          <Button 
            variant="ghost" 
            onClick={login}
            className="flex-1 h-9 rounded-md"
          >
            Chat with Help Agent
          </Button>
        )}
      </TabsList>
      
      <TabsContent value="docs" className="space-y-4">
        Use the agent to create a new DAO
      </TabsContent>
      
      <TabsContent value="chat">
        {authenticated ? (
          <SummonAgent />
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Please connect your wallet to chat with the help agent</p>
            <ConnectButton />
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
} 