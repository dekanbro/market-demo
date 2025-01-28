'use client'

import { useEthBalance } from '@/app/hooks/useEthBalance'
import { Progress } from '@/components/ui/progress'
import { formatEther } from 'viem'
import { Skeleton } from '@/components/ui/skeleton'

interface PresaleProgressProps {
  vaultAddress: string
  goal: string
}

export function PresaleProgress({ vaultAddress, goal }: PresaleProgressProps) {
  const { balance, isLoading, error } = useEthBalance(vaultAddress)
  
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-2 w-full" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    )
  }

  if (error) {
    console.error('Balance fetch error:', error)
    return <Progress value={0} className="w-full" />
  }

  const currentAmount = Number(balance)
  const goalAmount = Number(formatEther(BigInt(goal)))
  const percentage = Math.min((currentAmount / goalAmount) * 100, 100)
  
  return (
    <div className="space-y-2">
      <Progress value={percentage} className="w-full" />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{currentAmount.toFixed(4)} ETH</span>
        <span>{percentage.toFixed(1)}%</span>
        <span>{goalAmount.toFixed(4)} ETH</span>
      </div>
      {percentage >= 100 && (
        <p className="text-sm text-green-500 font-medium">Goal Reached! 🎉</p>
      )}
    </div>
  )
} 