import Link from 'next/link'
import { LinkAccordion } from '../components/link-accordion'

export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <h2>
        Links with <code>prefetch=false</code>
      </h2>
      <ul>
        <li>
          <LinkAccordion href="/link-prefetchable">
            Prefetch link-prefetchable page
          </LinkAccordion>
        </li>
        <li>
          <Link href="/runtime-prefetchable" prefetch={false}>
            Go to runtime-prefetchable page
          </Link>
        </li>
      </ul>
    </main>
  )
}
