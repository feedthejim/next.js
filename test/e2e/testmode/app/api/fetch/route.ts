export async function GET() {
  const text = await (await fetch('https://example.com')).text()
  return new Response(JSON.stringify({ text }))
}
