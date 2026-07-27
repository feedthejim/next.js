import type { ResumeDataCache } from './resume-data-cache'
import {
  createPrerenderResumeDataCache,
  type PrerenderResumeDataCache,
} from './resume-data-cache'

type RuntimePrefetchRequestStore = {
  resumeDataCache: ResumeDataCache | null
}

/**
 * Makes the request's resume cache mutable for a runtime prefetch without
 * discarding values restored from the static prerender.
 */
export function installRuntimePrefetchResumeDataCache(
  requestStore: RuntimePrefetchRequestStore
): PrerenderResumeDataCache {
  const resumeDataCache = createPrerenderResumeDataCache(
    requestStore.resumeDataCache ?? undefined
  )
  requestStore.resumeDataCache = resumeDataCache
  return resumeDataCache
}
