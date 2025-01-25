import { NextResponse } from 'next/server'
import { getMembersByDaoId } from '@/app/lib/member-service'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const members = await getMembersByDaoId(params.id)
    return NextResponse.json(members)
  } catch (error) {
    console.error('Error fetching members:', error)
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    )
  }
} 