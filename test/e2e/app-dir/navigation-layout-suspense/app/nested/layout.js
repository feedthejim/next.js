import { Suspense } from 'react'
import Link from 'next/link'

export default async function Layout(props) {
  return (
    <>
      <div>
        <Link href={`/`} className="text-blue-500">
          Home Page
        </Link>
      </div>
      <Suspense fallback={<h1>Loading...</h1>}>{props.children}</Suspense>
    </>
  )
}
