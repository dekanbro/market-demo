import { HomePage } from '@/app/components/HomePage'
import { getItems } from '@/app/lib/items'

export default async function Home() {
  const items = await getItems()
  console.log("items: ", items)
  return <HomePage items={items} />
}

