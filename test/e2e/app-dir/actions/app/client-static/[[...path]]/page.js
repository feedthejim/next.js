import { Counter } from '../../../components/Counter'
import { incrementCounter } from '../actions'

export default function Page() {
  return (
    <div>
      <Counter onClick={incrementCounter} />
    </div>
  )
}

export async function generateStaticParams() {
  return [{ path: ['asdf'] }]
}
