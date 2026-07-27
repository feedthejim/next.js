import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { join } from 'path/posix'

export async function proxy(request: NextRequest) {
  const proxyCookie = (await cookies()).get('proxy-cookie')
  if (
    request.nextUrl.pathname === join('/', 'foo') &&
    proxyCookie?.value === 'redirect'
  ) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}
