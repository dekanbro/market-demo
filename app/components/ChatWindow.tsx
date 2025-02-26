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
import { Loader2, Send, Trash2 } from 'lucide-react';

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
  backgroundImage?: string;
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

export function ChatWindow({ agentName, itemId, initialMessage, backgroundImage }: ChatWindowProps) {
  const { user } = usePrivy();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');
  const { messages, sendMessage, isLoading, clearHistory, isInitialized } = useChat(itemId, initialMessage);
  const inputRef = useRef<HTMLInputElement>(null);

  // Updated scroll logic
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
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

  // Add loading state for initial load
  if (!isInitialized) {
    return (
      <div className="flex-1 min-h-0 relative p-4">
        <div className="flex justify-start">
          <div className="rounded-lg px-4 py-2 max-w-[85%] bg-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <h2 className="font-semibold">Chat History</h2>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={clearHistory}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 min-h-0 relative">
        {backgroundImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-60"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        )}
        <ScrollArea ref={scrollRef} className="h-full p-4 relative">
          <div className="space-y-4 max-w-full">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.user === 'You' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={cn(
                    "rounded-lg px-4 py-2 max-w-[85%] break-words opacity-90",
                    message.user === 'You'
                      ? 'bg-primary text-primary-foreground'
                      : getMessageStyles(message.message)
                  )}
                >
                  {renderMessageContent(message.message)}
                  {message.data && (
                    <p className="text-xs mt-1 opacity-70 break-all">
                      {JSON.stringify(message.data)}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-lg px-4 py-2 max-w-[85%] bg-muted">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t p-4 flex items-center gap-4 bg-background"
      >
        <Input
          ref={inputRef}
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1"
          disabled={isLoading}
        />
        <Button type="submit" size="icon" disabled={isLoading}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
} 