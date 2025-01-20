import { NextResponse } from 'next/server'

export async function GET() {
  console.log("fetching daos")
  return new NextResponse(JSON.stringify({
    message: "Hello World"
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    }
  })
}
