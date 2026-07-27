export async function GET() {
  throw new Error('foobar')
}

export const runtime = 'edge'
