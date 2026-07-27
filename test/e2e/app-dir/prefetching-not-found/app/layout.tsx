// we want the layout to opt-out of static prefetching

import Link from 'next/link'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Link href="/">Link to `/`</Link>
        <div>{children}</div>
      </body>
    </html>
  )
}
