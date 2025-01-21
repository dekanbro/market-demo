'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AboutAgent } from './AboutAgent'
import { DocsContent } from './DocsContent'
import { usePrivy } from '@privy-io/react-auth'
import { ConnectButton } from "@/app/components/ConnectButton"
import { Button } from "@/components/ui/button"

export function AboutTabs() {
  const { authenticated, login } = usePrivy()

  return (
    <Tabs defaultValue="docs" className="space-y-4">
      <TabsList className="w-full">
        <TabsTrigger value="docs" className="flex-1">
          Documentation
        </TabsTrigger>
        {authenticated ? (
          <TabsTrigger value="chat" className="flex-1">
            Chat with Help Agent
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
        <DocsContent />
      </TabsContent>
      
      <TabsContent value="chat">
        {authenticated ? (
          <AboutAgent />
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