import { testDraftMode } from '../helpers'

export async function GET() {
  testDraftMode('/draft-mode/route-handler-static')
  return new Response()
}
