'use client'

import { useState, useEffect } from 'react'
import { DaoItem } from '@/app/lib/types'

interface UseDaosOptions {
  chainId?: string;
  filter?: string;
}

export function useDaos({ chainId, filter }: UseDaosOptions = {}) {
  const [daos, setDaos] = useState<DaoItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDaos() {
      try {
        console.log("[Hook] Fetching DAOs with:", { chainId, filter });
        
        const params = new URLSearchParams()
        if (chainId) params.append('chainId', chainId)
        if (filter) params.append('filter', filter)

        const res = await fetch(`/api/daos?${params}`, {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        })
        
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || 'Failed to fetch DAOs')
        }
        
        const data = await res.json()
        console.log("[Hook] Received data:", data);
        
        setDaos(data.daos)
        setError(data.error)
      } catch (error) {
        console.error("[Hook] Error:", error);
        setError(error instanceof Error ? error.message : 'Failed to fetch DAOs')
        setDaos([])
      } finally {
        setLoading(false)
      }
    }

    fetchDaos()
  }, [chainId, filter])

  console.log("[Hook] Current state:", { daos, error, loading });
  return { daos, error, loading }
} 