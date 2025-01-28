'use client'

import { HydratedDaoItem } from '@/app/lib/types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function DaoHeader({ dao }: { dao: HydratedDaoItem }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">{dao.name}</h1>
        {dao.isPresale && (
          <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
            Presale Active
          </Badge>
        )}
        {!dao.isPresale && dao.comingSoon && (
          <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            Coming Soon
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <p>{dao.shareTokenSymbol}</p>
      </div>
    </div>
  )
} 