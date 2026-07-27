export const runtime = 'edge'
export const preferredRegion = ['cdg1']

export function GET(_request: Request) {
  return new Response('Hello, world!', { status: 200 })
}
