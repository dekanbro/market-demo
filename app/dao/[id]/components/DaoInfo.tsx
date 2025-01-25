'use client'

import { useEthBalance } from '@/app/hooks/useEthBalance'
import { HydratedDaoItem } from '@/app/lib/types'
import { PresaleProgress } from './PresaleProgress'

function formatDate(timestamp: string) {
  return new Date(parseInt(timestamp) * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })
}

export function DaoInfo({ dao }: { dao: HydratedDaoItem }) {
  const { balance, isLoading } = useEthBalance(dao.safeAddress)

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
        {dao.yeeterData && (
          <>
            <div>
              <p className="text-sm text-muted-foreground">Presale Start</p>
              <p className="text-xl font-medium">{formatDate(dao.yeeterData.startTime)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Presale End</p>
              <p className="text-xl font-medium">{formatDate(dao.yeeterData.endTime)}</p>
            </div>
          </>
        )}
        <div>
          <p className="text-sm text-muted-foreground">Treasury</p>
          <p className="text-xl font-medium">
            {isLoading ? '...' : `${Number(balance).toFixed(4)} ETH`}
          </p>
        </div>
      </div>

      {dao.isPresale && dao.yeeterData?.goal && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Presale Progress</h2>
          <PresaleProgress 
            vaultAddress={dao.safeAddress}
            goal={dao.yeeterData?.goal}
          />
        </div>
      )}

      {dao.profile?.description && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="text-muted-foreground">{dao.profile.description}</p>
        </div>
      )}
    </div>
  )
} 