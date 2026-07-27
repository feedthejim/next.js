import fs from 'fs'
import path from 'path'

export async function GET() {
  // dummy call
  fs.readdirSync(path.join(process.cwd(), 'public/exclude-me'))

  return new Response('foo')
}
