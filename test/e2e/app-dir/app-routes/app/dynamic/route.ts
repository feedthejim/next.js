import { cookies, headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  return NextResponse.json({
    nextUrl: {
      href: (req as any).nextUrl.href,
      search: (req as any).nextUrl.search,
      searchParams: (req as any).nextUrl.searchParams.get('query'),
      clone: (req as any).nextUrl.clone().toString(),
    },
    req: {
      url: req.url,
      headers: req.headers.get('accept'),
    },
    headers: (await headers()).get('accept'),
    cookies: (await cookies()).get('session')?.value ?? null,
  })
}
