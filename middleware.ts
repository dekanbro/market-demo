import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { PrivyClient } from '@privy-io/server-auth'

const privy = new PrivyClient(
  process.env.PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
)

// Define public routes that don't need authentication
const PUBLIC_ROUTES = [
  '/api/daos',  
  '/api/about',
  '/api/dao/:id'
]

// Helper to check if route is public
function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.some(route => {
    // Handle routes with parameters
    if (route.includes(':')) {
      const routePattern = route.replace(/:[\w-]+/g, '[\\w-]+')
      const regex = new RegExp(`^${routePattern}$`)
      return regex.test(pathname)
    }
    return route === pathname
  })
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes without authentication
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  // Only protect /api routes
  if (!pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const token = authHeader.split(' ')[1]
    const { userId } = await privy.verifyAuthToken(token)
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