'use client'

import { useEffect, useState } from 'react'
import { HydratedDaoItem } from '@/app/lib/types'
import { DaoHeader } from './DaoHeader'
import { DaoInfo } from './DaoInfo'
import { DaoTabs } from './DaoTabs'
import { DaoActions } from './DaoActions'
import { DaoImage } from './DaoImage'
import { CountdownTimer } from './CountdownTimer'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export function DaoDetails({ id }: { id: string }) {
  const [dao, setDao] = useState<HydratedDaoItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDao() {
      try {
        const res = await fetch(`/api/dao/${id}`)
        if (!res.ok) throw new Error('Failed to fetch DAO')
        const data = await res.json()
        setDao(data)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to fetch DAO')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchDao()
  }, [id])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!dao) return <div>DAO not found</div>

  return (
    <div className="container mx-auto py-4">
      <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to DAOs
      </Link>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <DaoImage dao={dao} />
        <div className="space-y-8">
          <DaoHeader dao={dao} />
          {dao.yeeterData && (
            <CountdownTimer 
              startTime={dao.yeeterData.startTime} 
              endTime={dao.yeeterData.endTime}
            />
          )}
          <DaoInfo dao={dao} />
          <DaoActions dao={dao} />
        </div>
      </div>
      
      <div className="border-t pt-8 mt-12">
        <DaoTabs dao={dao} />
      </div>
    </div>
  )
} 