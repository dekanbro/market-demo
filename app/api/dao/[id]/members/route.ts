import { NextResponse } from 'next/server'
import { getMembersByDaoId } from '@/app/lib/member-service'
import { CHAIN_ID } from '@/app/lib/constants'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const chainId = searchParams.get('chainId') || CHAIN_ID.BASE
    
    const members = await getMembersByDaoId(params.id, chainId)
    return NextResponse.json(members)
  } catch (error) {
    console.error('Error fetching members:', error)
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    )
  }
} 