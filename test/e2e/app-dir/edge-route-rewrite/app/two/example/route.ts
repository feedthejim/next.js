export const runtime = 'edge'

export function GET() {
  return new Response('Hello from /app/two/example/route.ts')
}
