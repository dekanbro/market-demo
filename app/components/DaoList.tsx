'use client'

import { useDaos } from '@/app/hooks/useDaos'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useWallets } from '@privy-io/react-auth'
import { DEFAULT_CHAIN } from '@/app/lib/constants'

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
        <Card key={dao.id}>
          <CardHeader>
            <CardTitle>{dao.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>Members: {dao.activeMemberCount}</p>
              <p>Proposals: {dao.proposalCount}</p>
              {dao.rawProfile[0]?.content && (
                <p className="text-muted-foreground">
                  {JSON.parse(dao.rawProfile[0].content).description}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 