export default async function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}

export async function generateStaticParams() {
  return [{ lang: 'en' }]
}
