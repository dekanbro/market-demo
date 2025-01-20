import { Item } from '@/app/data/items'

interface DaoQueryParams {
  chainId?: string;
  filter?: string;
}

interface DaoResponse {
  daos: Item[];
  error: string | null;
  loading: boolean;
}

export async function getDaos({ chainId, filter }: DaoQueryParams = {}): Promise<DaoResponse> {
  try {
    const params = new URLSearchParams()
    if (chainId) params.append('chainId', chainId)
    if (filter) params.append('filter', filter)

    const res = await fetch(`/api/daos?${params}`)
    if (!res.ok) throw new Error('Failed to fetch DAOs')
    
    return await res.json()
  } catch (error) {
    return {
      daos: [],
      error: error instanceof Error ? error.message : 'Failed to fetch DAOs',
      loading: false
    }
  }
} 