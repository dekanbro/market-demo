'use client'

import { useEthBalance } from '@/app/hooks/useEthBalance'
import { Progress } from '@/components/ui/progress'
import { formatEther } from 'viem'

interface PresaleProgressProps {
  vaultAddress: string
  goal: string
}

export function PresaleProgress({ vaultAddress, goal }: PresaleProgressProps) {
  const { balance, isLoading } = useEthBalance(vaultAddress)
  
  if (isLoading) {
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