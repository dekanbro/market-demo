'use client'

import { useState, useEffect } from 'react'
import { CHAIN_ID } from '../lib/constants'

export function useEthBalance(address?: string, chainId?: string) {
  const [balance, setBalance] = useState<string>('0')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchBalance() {
      if (!address) return
      try {
        const response = await fetch(`/api/dao/balance/${address}?chainId=${chainId || CHAIN_ID.BASE}`)
        const data = await response.json()
        setBalance(data.balance)
      } catch (error) {
        console.error('Error fetching balance:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBalance()
  }, [address, chainId])

  return { balance, isLoading }
} 