import Link from 'next/link'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from 'next/image'
import { Item } from '../data/items'

export function ItemCard({ item }: { item: Item }) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <CardContent className="p-0">
        <div className="relative h-48 sm:h-56 md:h-64">
          <Image
            src={item.image || "/placeholder.svg"}
            alt={item.title}
            fill
            className="object-cover"
          />
          {item.comingSoon && (
            <Badge className="absolute top-2 right-2 bg-yellow-500 text-black">
              Coming Soon
            </Badge>
          )}
        </div>
        <div className="p-4">
          <h2 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">{item.title}</h2>
          <div className="h-[3rem] mb-2">
            <p className="text-sm sm:text-base text-muted-foreground line-clamp-2 overflow-hidden leading-snug">{item.description}</p>
          </div>
          <p className="text-lg font-bold text-primary">${item.price.toFixed(4)}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4">
        <Link href={`/item/${item.id}`} passHref className="w-full">
          <Button className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

