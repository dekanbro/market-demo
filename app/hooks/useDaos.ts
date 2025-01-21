'use client'

import { useState, useEffect } from 'react'
import { DaoItem, HydratedDaoItem } from '@/app/lib/types'
import { FEATURED_DAOS, REFERRER, DEFAULT_DAO_DATE } from '@/app/lib/constants'
import { getDaoById } from '@/app/lib/dao-service'

interface UseDaosOptions {
  chainId?: string;
  filter?: string;
  createdAfter?: string;
}

interface UseDaosResult {
  daos: HydratedDaoItem[];
  error: string | null;
  loading: boolean;
}

export function useDaos({ chainId, filter }: UseDaosOptions = {}): UseDaosResult {
  const [daos, setDaos] = useState<HydratedDaoItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDaos() {
      try {
        const params = new URLSearchParams()
        if (chainId) params.append('chainId', chainId)
        if (filter) params.append('filter', filter)
        params.append('ids', FEATURED_DAOS.map(dao => dao.id).join(','))
        
        const res = await fetch(`/api/daos?${params}`)
        
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

export function useDaoById(id?: string) {
  const [dao, setDao] = useState<HydratedDaoItem | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    async function fetchDao() {
      setLoading(true)
      try {
        const dao = await getDaoById(id as string)  // Type assertion since we've checked id exists
        setDao(dao)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to fetch DAO')
      } finally {
        setLoading(false)
      }
    }

    fetchDao()
  }, [id])

  return { dao, loading, error }
} 