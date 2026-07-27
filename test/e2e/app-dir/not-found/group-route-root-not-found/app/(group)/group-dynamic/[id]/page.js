import { notFound } from 'next/navigation'

export default async function Page(props) {
  const params = await props.params
  if (params.id === '404') {
    notFound()
  }

  return <p>{`group-dynamic [id]`}</p>
}
