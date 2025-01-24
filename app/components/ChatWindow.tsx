"use client"

import { useState, useEffect, useRef } from 'react';
import { useChat } from '@/app/hooks/useChat';
import { usePrivy } from '@privy-io/react-auth';
import { UserProfile } from './UserProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

const IMAGE_SOURCES = {
  DALLE: 'oaidalleapiprodscus.blob.core.windows.net',
  DALLE_LABS: 'dalle.com',
  LABS: 'labs.openai.com',
  IMGUR: 'i.imgur.com',
  IMGBB: 'i.ibb.co',
  DISCORD: 'cdn.discordapp.com',
} as const;

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'gif', 'png', 'webp'] as const;

interface ChatWindowProps {
  agentName: string;
  itemId: string;
  initialMessage?: string;
}

function renderMessageContent(message: string) {
  // Match any image URL that ends with common image extensions
  const imageMatch = message.match(/https?:\/\/\S+\.(?:png|jpe?g|gif|webp)/i)
  
  if (imageMatch) {
    const imageUrl = imageMatch[0]
    return (
      <div className="space-y-2">
        <div className="relative w-full aspect-square rounded-lg overflow-hidden">
          <Image 
            src={imageUrl}
            alt="Generated artwork"
            fill
            className="object-cover"
          />
        </div>
        <ReactMarkdown 
          className="prose dark:prose-invert"
          components={{
            a: ({ node, ...props }) => (
              <a target="_blank" rel="noopener noreferrer" {...props} />
            )
          }}
        >
          {message}
        </ReactMarkdown>
      </div>
    )
  }

  return (
    <ReactMarkdown 
      className="prose dark:prose-invert"
      components={{
        a: ({ node, ...props }) => (
          <a target="_blank" rel="noopener noreferrer" {...props} />
        )
      }}
    >
      {message}
    </ReactMarkdown>
  )
}

export function ChatWindow({ agentName, itemId, initialMessage }: ChatWindowProps) {
  const { user } = usePrivy();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');
  const { messages, sendMessage, isLoading, clearHistory } = useChat(itemId, initialMessage);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    sendMessage(input);
    setInput('');
  };

  function getMessageStyles(content: string) {
    if (content.includes('<tool-call>')) {
      return 'bg-muted/50 border border-border';
    }
    return 'bg-muted';
  }

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="p-4 flex flex-row items-center justify-between shrink-0">
        <CardTitle className="text-lg">Chat with {agentName}</CardTitle>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={clearHistory}
          disabled={messages.length === 1 || isLoading}
        >
          Clear Chat
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-4">
        <ScrollArea className="h-full pr-2">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.user === 'You' ? 'justify-end' : 'justify-start'}`}>
                <div className="flex items-start gap-2 max-w-[85%] sm:max-w-[80%]">
                  {message.user !== 'You' && (
                    <UserProfile 
                      address={itemId}
                      showName={false}
                      size="sm"
                      isAgent={true}
                      agentName={agentName}
                    />
                  )}
                  <div className={cn(
                    "rounded-lg px-3 py-2 text-sm sm:text-base",
                    message.user === 'You' ? "bg-primary text-primary-foreground" : getMessageStyles(message.message)
                  )}>
                    {renderMessageContent(message.message)}
                    {message.data && (
                      <p className="text-xs mt-1 opacity-70 break-all">
                        {JSON.stringify(message.data)}
                      </p>
                    )}
                  </div>
                  {message.user === 'You' && (
                    <UserProfile 
                      address={user?.wallet?.address}
                      showName={false}
                      size="sm"
                    />
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[160px]" />
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 pt-2 shrink-0">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 text-sm sm:text-base"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading} size="sm" className="whitespace-nowrap">
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
} 