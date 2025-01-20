import { items } from '@/app/data/items'
import { Item } from '@/app/data/items'

// TODO: Replace with real API calls when ready
export async function getItems() {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // Later this will be:
  // const res = await fetch(`${process.env.API_URL}/items`)
  return items
}

export async function getItem(id: string): Promise<Item | undefined> {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // Later this will be:
  // const res = await fetch(`${process.env.API_URL}/items/${id}`)
  return items.find(i => i.id === id)
} 