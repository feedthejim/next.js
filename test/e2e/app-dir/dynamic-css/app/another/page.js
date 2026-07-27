'use client'

import dynamicApi from 'next/dynamic'

const AsyncBar = dynamicApi(() => import('../../components/bar'))

export default function Page() {
  return <AsyncBar />
}
