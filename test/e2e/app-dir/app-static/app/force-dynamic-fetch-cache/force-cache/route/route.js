import { NextResponse } from 'next/server'

export async function GET() {
  const data = await fetch(
    'https://next-data-api-endpoint.vercel.app/api/random',
    { cache: 'force-cache' }
  ).then((res) => res.text())

  return NextResponse.json({ random: data })
}
