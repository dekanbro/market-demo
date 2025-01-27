'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { HydratedDaoItem } from '@/app/lib/types'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export function DaoCard({ dao }: { dao: HydratedDaoItem }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setIsLoading(true)
    router.push(`/dao/${dao.id}`)
  }
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow relative">
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      <Link href={`/dao/${dao.id}`} onClick={handleNavigate} className="block">
        <div className="relative aspect-[4/3]">
          <Image
            src={dao.profile?.avatarImg || '/herotry1.png'}
            alt={dao.name}
            fill
            className={cn(
              "object-cover",
              (!dao.profile?.avatarImg || dao.profile.avatarImg === '/herotry1.png') &&
              "dark:brightness-[0.2] dark:opacity-95"
            )}
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              if (img.src !== '/herotry1.png') {
                img.src = '/herotry1.png';
                img.classList.add('dark:brightness-[0.2]', 'dark:opacity-95');
              }
            }}
          />
          <div className="absolute top-2 left-2 flex gap-2">
            {dao.type === 'super' && (
              <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                Super Agent
              </Badge>
            )}
          </div>
          <div className="absolute top-2 right-2 flex gap-2">
            {dao.isSpecialDao ? (
              <Badge 
                variant="outline"
                className="bg-primary/90 text-primary-foreground border-primary/20 font-medium"
              >
                Notable DAO
              </Badge>
            ) : !dao.comingSoon && (
              <Badge
                variant="outline"
                className={cn(
                  "border font-medium backdrop-blur-sm",
                  {
                    "bg-green-600/90 text-white border-green-500/30": dao.status === "featured",
                    "bg-blue-600/90 text-white border-blue-500/30": dao.status === "active",
                    "bg-gray-600/90 text-white border-gray-500/30": dao.status === "failed"
                  }
                )}
              >
                {dao.status}
              </Badge>
            )}

            {dao.isPresale && (
              <Badge 
                variant="secondary"
                className="bg-green-600/90 text-white border-green-500/30 font-medium"
              >
                Presale Active
              </Badge>
            )}
            
            {!dao.isPresale && dao.comingSoon && (
              <Badge 
                variant="secondary"
                className="bg-blue-600/90 text-white border-blue-500/30 font-medium"
              >
                Coming Soon
              </Badge>
            )}
          </div>
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <Link href={`/dao/${dao.id}`} onClick={handleNavigate} className="hover:underline">
              <h3 className="font-semibold truncate">{dao.name}</h3>
            </Link>
            <p className="text-sm text-muted-foreground">
              Members: {dao.activeMemberCount}
            </p>
          </div>
          {dao.price > 0 && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="font-medium">{dao.price} ETH</p>
            </div>
          )}
        </div>
        {dao.profile?.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {dao.profile.description}
          </p>
        )}
        <div className="flex justify-between items-center">
          <Button variant="outline" size="sm">
            {dao.price > 0 ? `Buy for ${dao.price} ETH` : 'Buy'}
          </Button>
          <Link href={`/dao/${dao.id}`} onClick={handleNavigate}>
            <Button variant="ghost" size="sm">View Details</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
} 