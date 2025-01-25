'use client'

import { useState, useEffect } from 'react'

export function useEthBalance(address: string | undefined) {
  const [balance, setBalance] = useState<string>('0')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchBalance() {
      if (!address) return
      
      try {
        const res = await fetch(`/api/dao/balance/${address}`)
        const data = await res.json()
        if (data.error) throw new Error(data.error)
        setBalance(data.balance)
      } catch (error) {
        console.error('Error fetching balance:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBalance()
  }, [address])

  return { balance, isLoading }
} 