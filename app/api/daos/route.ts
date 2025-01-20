import { NextResponse } from 'next/server'
import { fetchFeaturedAndRecentDaos } from '@/app/lib/dao-service'
import { FEATURED_DAOS, DEFAULT_DAO_DATE } from '@/app/lib/constants'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const chainId = searchParams.get('chainId') || undefined
    const filter = searchParams.get('filter') || undefined
    const first = searchParams.get('first') ? parseInt(searchParams.get('first')!) : 100
    const createdAfter = searchParams.get('createdAfter') || DEFAULT_DAO_DATE

    const response = await fetchFeaturedAndRecentDaos({ 
      chainId,
      filter,
      featuredIds: FEATURED_DAOS.map(dao => dao.id),
      first,
      createdAfter
    })
    
    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  } catch (error) {
    console.error("[API] Error:", error)
    return new NextResponse(JSON.stringify({
      daos: [],
      error: 'Failed to fetch DAOs',
      loading: false
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }
}
