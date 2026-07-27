export function GET() {
  return new Response('force-dynamic')
}

export async function generateStaticParams() {
  return [{ id: '0' }, { id: '1' }]
}
