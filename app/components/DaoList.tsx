'use client'

import { useDaos } from '@/app/hooks/useDaos'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useWallets } from '@privy-io/react-auth'
import { DEFAULT_CHAIN } from '@/app/lib/constants'
import { HydratedDaoItem } from '@/app/lib/types'
import { cn } from '@/lib/utils'

function DaoAvatar({ dao }: { dao: HydratedDaoItem }) {
  // Get first letter of DAO name for fallback
  const fallbackText = dao.name?.charAt(0)?.toUpperCase() || '?'
  
  return (
    <Avatar className="h-12 w-12">
      <AvatarImage 
        src={dao.profile?.avatarImg} 
        alt={dao.name} 
      />
      <AvatarFallback>{fallbackText}</AvatarFallback>
    </Avatar>
  )
}

function DaoCard({ dao }: { dao: HydratedDaoItem }) {
  return (
    <Card key={dao.id}>
      <CardHeader className="flex flex-row items-center gap-4">
        <DaoAvatar dao={dao} />
        <div className="flex flex-col gap-1">
          <CardTitle>{dao.name}</CardTitle>
          <div className="flex items-center gap-2 text-sm">
            <span className={cn(
              "px-2 py-0.5 rounded-full text-xs",
              {
                "bg-green-100 text-green-700": dao.status === "featured",
                "bg-blue-100 text-blue-700": dao.status === "active",
                "bg-gray-100 text-gray-700": dao.status === "failed"
              }
            )}>
              {dao.status}
            </span>
            {dao.comingSoon && (
              <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs">
                Coming Soon
              </span>
            )}
            {dao.price > 0 && (
              <span className="text-sm font-medium">
                {dao.price} ETH
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <p>Members: {dao.activeMemberCount}</p>
          <p>Proposals: {dao.proposalCount}</p>
          {dao.profile?.description && (
            <p className="text-muted-foreground">
              {dao.profile.description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function DaoList() {
  const { wallets } = useWallets()
  const embeddedWallet = wallets.find(wallet => wallet.walletClientType === 'privy')
  
  console.log("Privy chain:", {
    chainId: embeddedWallet?.chainId, // Returns CAIP-2 chain ID
    walletAddress: embeddedWallet?.address
  })

  const { daos, error, loading } = useDaos({
    chainId: embeddedWallet?.chainId || DEFAULT_CHAIN.id
  })

  if (loading) return <div>Loading DAOs...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {daos.map((dao) => (
        <DaoCard key={dao.id} dao={dao} />
      ))}
    </div>
  )
} 