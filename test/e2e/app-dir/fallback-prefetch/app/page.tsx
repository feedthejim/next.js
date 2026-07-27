import Link from 'next/link'

export default function HomePage() {
  const randomId = crypto.randomUUID()

  return (
    <section>
      <Link href={`/${randomId}`} id="link-to-random">
        Go to Random Page
      </Link>
    </section>
  )
}
