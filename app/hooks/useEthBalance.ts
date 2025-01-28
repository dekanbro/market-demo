'use client'

import { useState, useEffect } from 'react'
import { CHAIN_ID } from '../lib/constants'

export function useEthBalance(address?: string, chainId?: string) {
  const [balance, setBalance] = useState<string>('0')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchBalance() {
    if (!address) return
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/dao/balance/${address}?chainId=${chainId || CHAIN_ID.BASE}`)
      if (!response.ok) throw new Error('Failed to fetch balance')
      
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      
      setBalance(data.balance)
    } catch (error) {
      console.error('Error fetching balance:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch balance')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBalance()
  }, [address, chainId])

  return { balance, isLoading, error, refetch: fetchBalance }
} 