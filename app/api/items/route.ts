import { NextResponse } from 'next/server'
import { items } from '@/app/data/items'

export const dynamic = 'force-dynamic'

export async function GET() {
  return new NextResponse(JSON.stringify({
    items: items
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    }
  })
} 