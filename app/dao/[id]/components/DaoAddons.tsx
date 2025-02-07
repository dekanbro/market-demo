'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Addon, addons } from '@/app/data/addons'
import { HydratedDaoItem } from '@/app/lib/types'
import { ExternalLink } from 'lucide-react'

interface DaoAddonsProps {
  dao: HydratedDaoItem
}

export function DaoAddons({ dao }: DaoAddonsProps) {
  console.log('DAO in DaoAddons:', {
    socialsBot: dao.socialsBot,
    farcasterBot: dao.farcasterBot,
    discordBot: dao.discordBot
  })

  function isSubscribed(dao: HydratedDaoItem) {
    return !!dao.socialsBot || !!dao.farcasterBot || !!dao.discordBot
  }

  function getServiceUrl(addon: Addon, dao: HydratedDaoItem) {
    switch (addon.id) {
      case 'farcastle':
        return dao.farcasterBot
      case 'liquid-intelligence':
        return dao.socialsBot
      default:
        return null
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {addons.map((addon) => {
        const subscribed = isSubscribed(dao)
        const serviceUrl = getServiceUrl(addon, dao)
        console.log('Service URL:', {
          addonId: addon.id,
          serviceUrl: serviceUrl
        })

        return (
          <a 
                    href={serviceUrl ?? ''}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm text-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
                  >
          <Card key={addon.id} className="relative overflow-hidden group">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{addon.title}</CardTitle>
                <div className="flex items-center gap-2">
                  {subscribed && (
                    <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                      Active
                    </Badge>
                  )}
                  <Badge variant="secondary">
                    {addon.price} ETH/{addon.billingPeriod}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{addon.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                  {addon.type}
                </Badge>
                
              </div>

            </CardContent>

            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-pink-500/0 to-purple-500/0 opacity-0 group-hover:opacity-10 transition-opacity" />
          </Card>
                  </a>
        )
      })}
    </div>
  )
} 