import { NextResponse } from 'next/server'
import { publicClient } from '@/app/lib/viem-client'
import { formatEther } from 'viem'

export async function GET(
  request: Request,
  { params }: { params: { address: string } }
) {
  try {
    const balance = await publicClient.getBalance({ 
      address: params.address as `0x${string}` 
    })
    
    return NextResponse.json({ 
      balance: formatEther(balance) 
    })
  } catch (error) {
    console.error('Error fetching balance:', error)
    return NextResponse.json(
      { error: 'Failed to fetch balance' }, 
      { status: 500 }
    )
  }
} 