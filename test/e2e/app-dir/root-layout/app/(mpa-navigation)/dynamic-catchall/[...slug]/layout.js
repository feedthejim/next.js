export default function Root({ children }) {
  return (
    <html>
      <head>
        <title>Hello</title>
      </head>
      <body>{children}</body>
    </html>
  )
}

export async function generateStaticParams() {
  return [{ slug: ['slug'] }]
}
