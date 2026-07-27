export default function Page() {
  return 'page'
}

export async function generateStaticParams() {
  return [{ id: '0' }, { id: '1' }]
}
