'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'

interface CountdownTimerProps {
  startTime: string
  endTime: string
}

function formatTimeLeft(timeLeft: number) {
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds }
}

export function CountdownTimer({ startTime, endTime }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [isPresale, setIsPresale] = useState(false)

  useEffect(() => {
    const startTimeMs = parseInt(startTime) * 1000
    const endTimeMs = parseInt(endTime) * 1000
    const now = Date.now()

    // Determine if we're in presale period
    const isInPresalePeriod = now >= startTimeMs && now < endTimeMs
    setIsPresale(isInPresalePeriod)

    // Set target time based on current period
    const targetTime = now < startTimeMs ? startTimeMs : 
                      now < endTimeMs ? endTimeMs : 0

    if (!targetTime) return

    const interval = setInterval(() => {
      const now = Date.now()
      const timeLeft = targetTime - now
      
      // Update presale state
      const isInPresale = now >= startTimeMs && now < endTimeMs
      setIsPresale(isInPresale)
      
      setTimeLeft(timeLeft > 0 ? timeLeft : 0)
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime, endTime])

  const { days, hours, minutes, seconds } = formatTimeLeft(timeLeft)

  if (timeLeft <= 0) {
    const now = Date.now()
    const endTimeMs = parseInt(endTime) * 1000
    if (now >= endTimeMs) {
      return <Card className="p-4 text-center">Presale Ended</Card>
    }
    return (
      <Card className="p-4">
        <p className="text-sm text-muted-foreground mb-2">Presale Active!</p>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-500">🎉 Join Now 🎉</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4">
      <p className="text-sm text-muted-foreground mb-2">
        {isPresale ? 'Presale Ends In:' : 'Presale Starts In:'}
      </p>
      <div className="grid grid-cols-4 gap-2 text-center">
        <div>
          <p className="text-2xl font-bold">{days}</p>
          <p className="text-xs text-muted-foreground">Days</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{hours}</p>
          <p className="text-xs text-muted-foreground">Hours</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{minutes}</p>
          <p className="text-xs text-muted-foreground">Minutes</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{seconds}</p>
          <p className="text-xs text-muted-foreground">Seconds</p>
        </div>
      </div>
    </Card>
  )
} 