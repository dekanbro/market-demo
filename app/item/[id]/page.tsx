import { notFound } from 'next/navigation'
import { ItemDetails } from './ItemDetails'
import { TooltipProvider } from '@/components/ui/tooltip'
import { getItem } from '@/app/lib/items'

export default async function ItemPage({ params }: { params: { id: string } }) {
  const item = await getItem(params.id)
  if (!item) notFound()

  return (
    <TooltipProvider>
      <ItemDetails item={item} />
    </TooltipProvider>
  )
}

