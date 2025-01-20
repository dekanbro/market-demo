import { Item } from '@/app/data/items'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// TODO: Replace with real API calls when ready
export async function getItems(): Promise<Item[]> {
  const res = await fetch(`${API_URL}/api/items`, {
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store'  // Disable caching
  })
  const data = await res.json()
  return data.items
}

export async function getItem(id: string): Promise<Item | undefined> {
  const items = await getItems()
  return items.find(i => i.id === id)
} 