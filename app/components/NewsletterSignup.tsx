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
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to subscribe')
            }

            setIsSubscribed(true)
        } catch (error) {
            console.error('Failed to subscribe:', error)
            setError(error instanceof Error ? error.message : 'Failed to subscribe')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className="relative overflow-hidden rounded-lg border bg-background p-8 mb-12">
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
                style={{ backgroundImage: 'url(/herotry1.png)' }}
            />
            <div className="relative">
                <div className="flex flex-col items-center text-center space-y-4 mb-6">
                    <h2 className="text-3xl font-bold tracking-tighter">
                        Join the Revolution
                    </h2>
                    <p className="text-muted-foreground max-w-[600px]">
                        Discover the ILO Market: A glimpse into the power of HAUSOS and Vertical DAO Agents. 
                        Stay in the loop on cutting-edge features like Liquid Intelligence, Second Brain, and Farcastle. 
                        Subscribe now for exclusive updates on ILO Market innovations, presale launches, Talk-to-DAO interfaces, DAO Battles, more dao configurations, and community events. 
                        Be the first to meet the next wave of Super Agents and shape the future of DAO engagement.
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

                {error && (
                    <p className="text-red-500 text-sm text-center mt-2">{error}</p>
                )}

                <div className="mt-6 flex justify-center gap-8 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        Alpha Access
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                        Periodic Updates
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