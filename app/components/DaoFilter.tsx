'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { HydratedDaoItem } from '../lib/types'

export type FilterType = 'all' | 'coming-soon' | 'presale'

interface DaoFilterProps {
  daos: HydratedDaoItem[]
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
}

export function DaoFilter({ daos, activeFilter, onFilterChange }: DaoFilterProps) {
  const filterBadges = [
    { id: 'all', label: 'All DAOs' },
    { id: 'coming-soon', label: 'Coming Soon' },
    { id: 'presale', label: 'Presale Active' },
  ] as const

  return (
    <div className="flex gap-2 flex-wrap">
      {filterBadges.map(({ id, label }) => (
        <Badge
          key={id}
          variant="outline"
          className={cn(
            "cursor-pointer hover:bg-primary/20",
            activeFilter === id && "bg-primary text-primary-foreground hover:bg-primary"
          )}
          onClick={() => onFilterChange(id as FilterType)}
        >
          {label}
          {id !== 'all' && (
            <span className="ml-2 text-xs">
              ({daos.filter(dao => 
                id === 'coming-soon' ? dao.comingSoon : dao.isPresale
              ).length})
            </span>
          )}
        </Badge>
      ))}
    </div>
  )
} 