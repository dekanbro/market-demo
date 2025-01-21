import { NextResponse } from 'next/server'
import { getDaoById } from '@/app/lib/dao-service'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const dao = await getDaoById(params.id)
    return NextResponse.json(dao)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch DAO' },
      { status: 500 }
    )
  }
} 