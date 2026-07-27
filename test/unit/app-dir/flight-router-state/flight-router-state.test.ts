import {
  PrefetchHint,
  type FlightRouterState,
} from '../../../../packages/next/src/shared/lib/app-router-types'
import { createFlightRouterStateFromLoaderTree } from '../../../../packages/next/src/server/app-render/create-flight-router-state-from-loader-tree'
import type { LoaderTree } from '../../../../packages/next/src/server/lib/app-dir-module'

function createLoaderTree(config: {
  instant?: boolean
  prefetch?: 'partial' | 'unstable_eager' | 'force-disabled' | 'allow-runtime'
}): LoaderTree {
  return [
    '',
    {},
    {
      layout: [async () => config, '/app/layout.tsx'],
    },
    null,
  ]
}

async function createRouterState(
  config: Parameters<typeof createLoaderTree>[0],
  {
    prefetchInliningEnabled = false,
    isStaticGeneration = false,
    isBuildTimePrerendering = false,
  }: {
    prefetchInliningEnabled?: boolean
    isStaticGeneration?: boolean
    isBuildTimePrerendering?: boolean
  } = {}
): Promise<FlightRouterState> {
  return createFlightRouterStateFromLoaderTree(
    createLoaderTree(config),
    null,
    prefetchInliningEnabled,
    isStaticGeneration,
    isBuildTimePrerendering,
    () => null,
    {}
  )
}

function hasHint(state: FlightRouterState, hint: PrefetchHint): boolean {
  return ((state[4] ?? 0) & hint) !== 0
}

describe('Flight router state', () => {
  it('uses Partial Prefetching when a segment has no explicit strategy', async () => {
    const state = await createRouterState({})

    expect(hasHint(state, PrefetchHint.SubtreeHasPartialPrefetching)).toBe(true)
    expect(hasHint(state, PrefetchHint.SubtreeHasEagerPrefetch)).toBe(false)
  })

  it('preserves an explicit disabled prefetch strategy', async () => {
    const state = await createRouterState({ prefetch: 'force-disabled' })

    expect(hasHint(state, PrefetchHint.PrefetchDisabled)).toBe(true)
  })

  it('disables runtime prefetching when build-time hints are unavailable', async () => {
    const state = await createRouterState(
      {},
      {
        prefetchInliningEnabled: true,
      }
    )

    expect(hasHint(state, PrefetchHint.PrefetchDisabled)).toBe(true)
  })
})
