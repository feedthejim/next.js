import SharedPage from '../../shared-page'

export const fetchCache = 'force-cache'

export default function Page() {
  return <SharedPage isDynamic={true} />
}
