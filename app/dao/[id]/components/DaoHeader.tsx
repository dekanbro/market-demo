'use client'

import { HydratedDaoItem } from '@/app/lib/types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function DaoHeader({ dao }: { dao: HydratedDaoItem }) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-4xl font-bold">{dao.name}</h1>
        <p className="text-8xl font-medium text-muted-foreground tracking-tight">
          {dao.shareTokenSymbol}
        </p>
        <div className="flex gap-2 mt-2">
          {dao.type === 'super' && (
            <Badge className="bg-gradient-to-r from-pink-500 to-purple-500">
              Super Agent
            </Badge>
          )}
          <Badge 
            variant="outline" 
            className={cn(
              "border-2",
              {
                "border-green-500 bg-green-500/10 text-green-500": dao.status === "featured",
                "border-blue-500 bg-blue-500/10 text-blue-500": dao.status === "active",
                "border-gray-500 bg-gray-500/10 text-gray-500": dao.status === "failed"
              }
            )}
          >
            {dao.status}
          </Badge>
          {dao.comingSoon && (
            <Badge variant="outline" className="border-2 border-yellow-500 bg-yellow-500/10 text-yellow-500">
              Coming Soon
            </Badge>
          )}
        </div>
      </div>
      {dao.price > 0 && (
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Price</p>
          <p className="text-2xl font-bold">{dao.price} ETH</p>
        </div>
      )}
    </div>
  )
} 