'use client'

import { after } from 'next/server'
import { cliLog } from '../../utils/log'

export default function Page() {
  after(() => {
    cliLog({ source: '[page] /invalid-in-client' })
  })
  return <div>Invalid: Client page with after()</div>
}
