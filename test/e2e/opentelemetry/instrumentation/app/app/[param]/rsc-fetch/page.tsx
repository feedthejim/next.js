// We want to trace this fetch in runtime

export async function generateMetadata() {
  return {}
}

export default async function Page() {
  const data = await fetch('https://example.vercel.sh')
  return (
    <>
      <p>Page</p>
      <pre>{await data.text()}</pre>
    </>
  )
}
