'use client'

import { useEthBalance } from '@/app/hooks/useEthBalance'
import { HydratedDaoItem } from '@/app/lib/types'
import { PresaleProgress } from './PresaleProgress'
import { CHAIN_ID } from '@/app/lib/constants'
import { MarketMakerStatus } from './MarketMakerStatus'

function formatDate(timestamp: string) {
  return new Date(parseInt(timestamp) * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })
}

interface DaoInfoProps {
  dao: HydratedDaoItem
  onRefresh?: () => void
}

export function DaoInfo({ dao, onRefresh }: DaoInfoProps) {
  const { balance, isLoading } = useEthBalance(dao.safeAddress, dao.chainId)
  const now = Math.floor(Date.now() / 1000)
  const isPresaleEnded = dao.yeeterData && now > Number(dao.yeeterData.endTime)

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
            {isLoading ? '...' : `${Number(balance).toFixed(4)}`}{dao.chainId === CHAIN_ID.GNOSIS ? ' XDAI' : ' ETH'}
          </p>
          <a 
            href={`https://admin.daohaus.club/#/molochv3/${dao.chainId}/${dao.id}/safes`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-500 underline"
          >
            View Treasury
          </a>
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

      {isPresaleEnded && dao.marketMakerShamanAddress && (
        <MarketMakerStatus 
          daoId={dao.id}
          shamanAddress={dao.marketMakerShamanAddress}
          chainId={dao.chainId}
          onRefresh={onRefresh}
        />
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