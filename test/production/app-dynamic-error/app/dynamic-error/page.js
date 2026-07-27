import { headers } from 'next/headers'

export default async function Page() {
  await headers()
  return (
    <>
      <p id="page">/dynamic-error</p>
      <p id="date">{Date.now()}</p>
    </>
  )
}
