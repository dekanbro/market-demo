import { NextResponse } from 'next/server'
import { docs } from '@/app/about/content/docs'

export async function GET() {
  try {
    return NextResponse.json({ docs })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch help content' },
      { status: 500 }
    )
  }
} 