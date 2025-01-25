import { NextResponse } from 'next/server'
import { getProposalsByDaoId } from '@/app/lib/proposal-service'
import { CHAIN_ID } from '@/app/lib/constants'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const chainId = searchParams.get('chainId') || CHAIN_ID.BASE
    
    const proposals = await getProposalsByDaoId(params.id, chainId)
    return NextResponse.json(proposals)
  } catch (error) {
    console.error('Error fetching proposals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch proposals' },
      { status: 500 }
    )
  }
} 