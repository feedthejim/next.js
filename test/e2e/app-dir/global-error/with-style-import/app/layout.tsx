// to avoid bailing out of the build

export default function RootLayout({ children }) {
  throw new Error('Root Layout Error')

  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
