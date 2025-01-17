import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { PrivyClient } from '@privy-io/server-auth'

const privy = new PrivyClient(
  process.env.PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
)

export async function middleware(request: NextRequest) {
  // Only protect /api routes
  if (!request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const token = authHeader.split(' ')[1]
  try {
    const { userId } = await privy.verifyAuthToken(token)
    // Add the verified user ID to the request headers
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-privy-user', userId)

    return NextResponse.next({
      headers: requestHeaders,
    })
  } catch (error) {
    return new NextResponse('Unauthorized', { status: 401 })
  }
}

export const config = {
  matcher: '/api/:path*',
} 