import SharedPage from '../../shared-page'

export const revalidate = 900

export default function Page() {
  return <SharedPage isDynamic={false} />
}
