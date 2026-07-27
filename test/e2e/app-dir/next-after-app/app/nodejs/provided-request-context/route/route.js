import { after } from 'next/server'
import { cliLog } from '../../../../utils/log'

export const runtime = 'nodejs'

export async function GET() {
  const data = { message: 'Hello, world!' }
  after(() => {
    cliLog({ source: '[route handler] /provided-request-context/route' })
  })

  return Response.json({ data })
}
