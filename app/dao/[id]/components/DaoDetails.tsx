'use client'

import { useEffect, useState, useCallback } from 'react'
import { HydratedDaoItem } from '@/app/lib/types'
import { DaoHeader } from './DaoHeader'
import { DaoInfo } from './DaoInfo'
import { DaoTabs } from './DaoTabs'
import { DaoActions } from './DaoActions'
import { DaoImage } from './DaoImage'
import { CountdownTimer } from './CountdownTimer'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ErrorBoundary } from '@/components/ErrorBoundary'

interface DaoDetailsProps {
  id: string
  initialDao: HydratedDaoItem
}

export function DaoDetails({ id, initialDao }: DaoDetailsProps) {
  const [dao, setDao] = useState<HydratedDaoItem>(initialDao)
  const [error, setError] = useState<string | null>(null)

  const refreshDao = useCallback(async () => {
    try {
      const res = await fetch(`/api/dao/${id}`)
      if (!res.ok) throw new Error('Failed to fetch DAO')
      const data = await res.json()
      setDao(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch DAO')
    }
  }, [id])

  useEffect(() => {
    // Optionally refresh data periodically
    const interval = setInterval(refreshDao, 30000)
    return () => clearInterval(interval)
  }, [refreshDao])

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="container mx-auto py-4">
      <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to DAOs
      </Link>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <ErrorBoundary fallback={<div>Error loading DAO image</div>}>
          <DaoImage dao={dao} />
        </ErrorBoundary>
        
        <div className="space-y-8">
          <ErrorBoundary fallback={<div>Error loading DAO header</div>}>
            <DaoHeader dao={dao} />
          </ErrorBoundary>

          {dao.yeeterData && (
            <ErrorBoundary fallback={<div>Error loading countdown</div>}>
              <CountdownTimer 
                startTime={dao.yeeterData.startTime} 
                endTime={dao.yeeterData.endTime}
              />
            </ErrorBoundary>
          )}

          <ErrorBoundary fallback={<div>Error loading DAO info</div>}>
            <DaoInfo 
              dao={dao} 
              onRefresh={refreshDao}
            />
          </ErrorBoundary>

          <ErrorBoundary fallback={<div>Error loading DAO actions</div>}>
            <DaoActions dao={dao} />
          </ErrorBoundary>
        </div>
      </div>
      
      <div className="border-t pt-8">
        <ErrorBoundary fallback={<div>Error loading DAO tabs</div>}>
          <DaoTabs dao={dao} />
        </ErrorBoundary>
      </div>
    </div>
  )
} 