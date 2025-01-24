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

  function extractImageUrl(message: string): string | null {
    // Check for @http format first
    if (message.startsWith('@http')) {
      const urlEnd = message.indexOf(' ');
      return urlEnd === -1 ? message.slice(1) : message.slice(1, urlEnd);
    }
    
    // Then check for regular image URLs
    const imageSourcesPattern = Object.values(IMAGE_SOURCES).join('|');
    const extensionsPattern = IMAGE_EXTENSIONS.join('|');
    
    const imageUrlRegex = new RegExp(
      `https?:\\/\\/[^\\s<>"]+?(?:\\.(?:${extensionsPattern})|(?:${imageSourcesPattern})\\/[^\\s<>"]+)`,
      'i'
    );
    
    const match = message.match(imageUrlRegex);
    return match ? match[0] : null;
  }

  function getProxiedImageUrl(url: string) {
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
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
                    {extractImageUrl(message.message) && (
                      <div className="relative w-full aspect-square max-w-sm rounded-lg overflow-hidden">
                        <Image 
                          src={getProxiedImageUrl(extractImageUrl(message.message)!)}
                          alt="Generated image"
                          fill
                          className="object-cover"
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LC0yMi4xODY6NT47Pi0uRUhFS2NRW11bMkFlbWRYbFBZW1f/2wBDARUXFx4aHR4eHVdeOjVeV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1f/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                        />
                      </div>
                    )}
                    <ReactMarkdown className="prose dark:prose-invert prose-sm">
                      {message.message.replace(/<\/?tool-call>/g, '')}
                    </ReactMarkdown>
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