import { installRuntimePrefetchResumeDataCache } from '../../../../packages/next/src/server/resume-data-cache/runtime-prefetch-cache'
import {
  createPrerenderResumeDataCache,
  createRenderResumeDataCache,
} from '../../../../packages/next/src/server/resume-data-cache/resume-data-cache'

describe('runtime prefetch resume cache', () => {
  it('preserves entries restored from the static prerender', () => {
    const prerenderCache = createPrerenderResumeDataCache()
    const cachedFetch = {
      kind: 'FETCH' as const,
      data: {
        headers: {},
        body: 'static-value',
        status: 200,
        url: 'https://example.com/value',
      },
      revalidate: 900,
    }
    prerenderCache.fetch.set('fetch-key', cachedFetch)

    const requestStore = {
      resumeDataCache: createRenderResumeDataCache(prerenderCache),
    }

    const runtimePrefetchCache =
      installRuntimePrefetchResumeDataCache(requestStore)

    expect(runtimePrefetchCache.mutable).toBe(true)
    expect(runtimePrefetchCache.fetch.get('fetch-key')).toBe(cachedFetch)
    expect(requestStore.resumeDataCache).toBe(runtimePrefetchCache)
  })
})
