'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    // TODO: Implement email signup
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSubscribed(true)
    setIsLoading(false)
  }

  return (
    <section className="relative overflow-hidden rounded-lg border bg-background p-8 mb-12">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-pink-500/10 to-purple-500/10" />
      <div className="relative">
        <div className="flex flex-col items-center text-center space-y-4 mb-6">
          <h2 className="text-3xl font-bold tracking-tighter">
            Join the Revolution
          </h2>
          <p className="text-muted-foreground max-w-[600px]">
            Get exclusive updates about new features, ILO presale launcher, Talk to DAOS, DAO battles, MolochOS, and community events. 
            Be the first to know when new super agents emerge.
          </p>
        </div>

        <form 
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
        >
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={cn(
              "bg-background/50 backdrop-blur-sm",
              isSubscribed && "opacity-50"
            )}
            disabled={isLoading || isSubscribed}
            required
          />
          <Button 
            type="submit"
            disabled={isLoading || isSubscribed}
            className={cn(
              "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600",
              "text-white font-semibold",
              isSubscribed && "opacity-50"
            )}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isSubscribed ? (
              "You're in! 🎉"
            ) : (
              "Subscribe"
            )}
          </Button>
        </form>

        <div className="mt-6 flex justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            Early Access
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            Weekly Updates
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-purple-500" />
            Community Events
          </div>
        </div>
      </div>
    </section>
  )
} 