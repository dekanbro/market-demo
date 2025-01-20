import { NextResponse } from 'next/server'
import { fetchDaos } from '@/app/lib/dao-service'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const chainId = searchParams.get('chainId') || '0x5'
    const filter = searchParams.get('filter') || ''

    const response = await fetchDaos({ chainId, filter })
    
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
