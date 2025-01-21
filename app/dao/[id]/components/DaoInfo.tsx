'use client'

import { HydratedDaoItem } from '@/app/lib/types'

export function DaoInfo({ dao }: { dao: HydratedDaoItem }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Members</p>
          <p className="text-xl font-medium">{dao.activeMemberCount}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Proposals</p>
          <p className="text-xl font-medium">{dao.proposalCount}</p>
        </div>
      </div>

      {dao.profile?.description && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="text-muted-foreground">{dao.profile.description}</p>
        </div>
      )}
    </div>
  )
} 