import { NextResponse } from 'next/server'
import { getProposalsByDaoId } from '@/app/lib/proposal-service'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const proposals = await getProposalsByDaoId(params.id)
    return NextResponse.json(proposals)
  } catch (error) {
    console.error('Error fetching proposals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch proposals' },
      { status: 500 }
    )
  }
} 