import * as React from 'react'
import { after } from 'next/server'
import { cliLog } from '../../../utils/log'

export default function Index() {
  after(async () => {
    cliLog({ source: '[page] /static/dynamic-force-static' })
  })
  return <div>Page with after()</div>
}
