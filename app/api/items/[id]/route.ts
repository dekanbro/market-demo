import { items } from '@/app/data/items'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const item = items.find(i => i.id === params.id)
  
  if (!item) {
    return new NextResponse('Not found', { status: 404 })
  }
  
  return NextResponse.json(item)
} 