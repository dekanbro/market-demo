import { NextResponse } from 'next/server'
import { publicClient } from '@/app/lib/viem-client'
import { MarketMakerAbi } from '@/app/lib/contracts/abis/market-maker'
import { formatEther } from 'viem'

const YEET24_NAME = 'Yeet24ShamanModule'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const chainId = searchParams.get('chainId')
    const shamanAddress = searchParams.get('shamanAddress')

    if (!shamanAddress) {
      return NextResponse.json(
        { error: 'Market maker shaman address is required' },
        { status: 400 }
      )
    }

    const client = publicClient(chainId || undefined)

    // Verify this is the correct shaman type
    const shamanName = await client.readContract({
      address: shamanAddress as `0x${string}`,
      abi: MarketMakerAbi,
      functionName: 'name',
    })

    if (shamanName !== YEET24_NAME) {
      return NextResponse.json(
        { error: 'Invalid market maker shaman' },
        { status: 400 }
      )
    }

    // Fetch all relevant data in parallel
    const [
      executed,
      goalAchieved,
      pool,
      endTime,
      balance
    ] = await Promise.all([
      client.readContract({
        address: shamanAddress as `0x${string}`,
        abi: MarketMakerAbi,
        functionName: 'executed'
      }),
      client.readContract({
        address: shamanAddress as `0x${string}`,
        abi: MarketMakerAbi,
        functionName: 'goalAchieved'
      }),
      client.readContract({
        address: shamanAddress as `0x${string}`,
        abi: MarketMakerAbi,
        functionName: 'pool'
      }),
      client.readContract({
        address: shamanAddress as `0x${string}`,
        abi: MarketMakerAbi,
        functionName: 'endTime'
      }),
      client.readContract({
        address: shamanAddress as `0x${string}`,
        abi: MarketMakerAbi,
        functionName: 'balance'
      })
    ])

    const now = Math.floor(Date.now() / 1000)
    const canExecute = !executed && Number(endTime) < now

    return NextResponse.json({
      executed,
      goalAchieved,
      pool,
      endTime: endTime.toString(),
      balance: balance.toString(),
      canExecute,
      uniswapUrl: executed && pool ? `https://app.uniswap.org/explore/pools/base/${pool}` : undefined
    })
  } catch (error) {
    console.error('Error fetching market maker data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch market maker data' },
      { status: 500 }
    )
  }
} 