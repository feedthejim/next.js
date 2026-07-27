export default async function Page() {
  return <p id="value">{new Date().toISOString()}</p>
}
