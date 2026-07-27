import type {
  FlightDataPath,
  FlightDataSegment,
  FlightRouterState,
  PrefetchHints,
  Segment,
  HeadData,
} from '../../shared/lib/app-router-types'
import type { PreloadCallbacks } from './types'
import { matchSegment } from '../../client/components/match-segments'
import type { LoaderTree } from '../lib/app-dir-module'
import { getLinkAndScriptTags } from './get-css-inlined-link-tags'
import { getPreloadableFonts } from './get-preloadable-fonts'
import {
  createFlightRouterStateFromLoaderTree,
  createRouteTreePrefetch,
} from './create-flight-router-state-from-loader-tree'
import type { AppRenderContext } from './app-render'
import { addSearchParamsIfPageSegment } from '../../shared/lib/segment'
import { createComponentTree } from './create-component-tree'
import { getSegmentParam } from '../../shared/lib/router/utils/get-segment-param'

/**
 * Use router state to decide at what common layout to render the page.
 * This can either be the common layout between two pages or a specific place to start rendering from using the "refetch" marker in the tree.
 */
export async function walkTreeWithFlightRouterState({
  loaderTreeToFilter,
  parentParams,
  flightRouterState,
  rscHead,
  injectedCSS,
  injectedJS,
  injectedFontPreloadTags,
  rootLayoutIncluded,
  ctx,
  preloadCallbacks,
  MetadataOutlet,
  hintTree,
}: {
  loaderTreeToFilter: LoaderTree
  parentParams: { [key: string]: string | string[] }
  flightRouterState?: FlightRouterState
  rscHead: HeadData
  injectedCSS: Set<string>
  injectedJS: Set<string>
  injectedFontPreloadTags: Set<string>
  rootLayoutIncluded: boolean
  ctx: AppRenderContext
  preloadCallbacks: PreloadCallbacks
  MetadataOutlet: React.ComponentType
  hintTree: PrefetchHints | null
}): Promise<FlightDataPath[]> {
  const {
    renderOpts: { nextFontManifest, experimental },
    query,
    getDynamicParamFromSegment,
    parsedRequestHeaders,
    workStore,
  } = ctx
  const prefetchInliningEnabled = Boolean(experimental.prefetchInlining)
  const isStaticGeneration = workStore.isStaticGeneration
  const isBuildTimePrerendering =
    ctx.renderOpts.isBuildTimePrerendering ?? false

  const [segment, parallelRoutes, modules] = loaderTreeToFilter

  const parallelRoutesKeys = Object.keys(parallelRoutes)

  const { layout } = modules
  const isLayout = typeof layout !== 'undefined'

  /**
   * Checks if the current segment is a root layout.
   */
  const rootLayoutAtThisLevel = isLayout && !rootLayoutIncluded
  /**
   * Checks if the current segment or any level above it has a root layout.
   */
  const rootLayoutIncludedAtThisLevelOrAbove =
    rootLayoutIncluded || rootLayoutAtThisLevel

  // Because this function walks to a deeper point in the tree to start rendering we have to track the dynamic parameters up to the point where rendering starts
  const segmentParam = getDynamicParamFromSegment(loaderTreeToFilter)
  const currentParams =
    // Handle null case where dynamic param is optional
    segmentParam && segmentParam.value !== null
      ? {
          ...parentParams,
          [segmentParam.param]: segmentParam.value,
        }
      : parentParams
  const actualSegment: Segment = addSearchParamsIfPageSegment(
    segmentParam ? segmentParam.treeSegment : segment,
    query
  )

  /**
   * Decide if the current segment is where rendering has to start.
   */
  const renderComponentsOnThisLevel =
    // No further router state available
    !flightRouterState ||
    // Segment in router state does not match current segment
    !matchSegment(actualSegment, flightRouterState[0]) ||
    // Explicit refresh
    flightRouterState[3] === 'refetch'

  // Similar to the previous branch. This flag is sent by the client to request
  // only the metadata for a page. No segment data.
  if (flightRouterState && flightRouterState[3] === 'metadata-only') {
    const overriddenSegment =
      flightRouterState &&
      canSegmentBeOverridden(actualSegment, flightRouterState[0])
        ? flightRouterState[0]
        : actualSegment
    const routerState = parsedRequestHeaders.isRouteTreePrefetchRequest
      ? await createRouteTreePrefetch(
          loaderTreeToFilter,
          hintTree,
          prefetchInliningEnabled,
          isStaticGeneration,
          isBuildTimePrerendering,
          getDynamicParamFromSegment
        )
      : await createFlightRouterStateFromLoaderTree(
          loaderTreeToFilter,
          hintTree,
          prefetchInliningEnabled,
          isStaticGeneration,
          isBuildTimePrerendering,
          getDynamicParamFromSegment,
          query,
          rootLayoutIncluded
        )
    return [
      [
        overriddenSegment,
        routerState,
        null,
        rscHead,
        false,
      ] satisfies FlightDataSegment,
    ]
  }

  if (renderComponentsOnThisLevel) {
    const overriddenSegment =
      flightRouterState &&
      // TODO: Why does canSegmentBeOverridden exist? Why don't we always just
      // use `actualSegment`? Is it to avoid overwriting some state that's
      // tracked by the client? Dig deeper to see if we can simplify this.
      canSegmentBeOverridden(actualSegment, flightRouterState[0])
        ? flightRouterState[0]
        : actualSegment

    const routerState = await createFlightRouterStateFromLoaderTree(
      // Create router state using the slice of the loaderTree
      loaderTreeToFilter,
      hintTree,
      prefetchInliningEnabled,
      isStaticGeneration,
      isBuildTimePrerendering,
      getDynamicParamFromSegment,
      query,
      rootLayoutIncluded
    )

    // Create component tree using the slice of the loaderTree
    const seedData = await createComponentTree(
      // This ensures flightRouterPath is valid and filters down the tree
      {
        ctx,
        loaderTree: loaderTreeToFilter,
        parentParams: currentParams,
        parentOptionalCatchAllParamName: null,
        parentRuntimePrefetchable: false,
        injectedCSS,
        injectedJS,
        injectedFontPreloadTags,
        // This is intentionally not "rootLayoutIncludedAtThisLevelOrAbove" as createComponentTree starts at the current level and does a check for "rootLayoutAtThisLevel" too.
        rootLayoutIncluded,
        preloadCallbacks,
        authInterrupts: experimental.authInterrupts,
        MetadataOutlet,
      }
    )

    return [
      [
        overriddenSegment,
        routerState,
        seedData,
        rscHead,
        false,
      ] satisfies FlightDataSegment,
    ]
  }

  // If we are not rendering on this level we need to check if the current
  // segment has a layout. If so, we need to track all the used CSS to make
  // the result consistent.
  const layoutPath = layout?.[1]
  const injectedCSSWithCurrentLayout = new Set(injectedCSS)
  const injectedJSWithCurrentLayout = new Set(injectedJS)
  const injectedFontPreloadTagsWithCurrentLayout = new Set(
    injectedFontPreloadTags
  )
  if (layoutPath) {
    getLinkAndScriptTags(
      layoutPath,
      injectedCSSWithCurrentLayout,
      injectedJSWithCurrentLayout,
      true
    )
    getPreloadableFonts(
      nextFontManifest,
      layoutPath,
      injectedFontPreloadTagsWithCurrentLayout
    )
  }

  const paths: FlightDataPath[] = []

  // Walk through all parallel routes.
  for (const parallelRouteKey of parallelRoutesKeys) {
    const parallelRoute = parallelRoutes[parallelRouteKey]

    const subPaths = await walkTreeWithFlightRouterState({
      ctx,
      loaderTreeToFilter: parallelRoute,
      parentParams: currentParams,
      flightRouterState:
        flightRouterState && flightRouterState[1][parallelRouteKey],
      rscHead,
      injectedCSS: injectedCSSWithCurrentLayout,
      injectedJS: injectedJSWithCurrentLayout,
      injectedFontPreloadTags: injectedFontPreloadTagsWithCurrentLayout,
      rootLayoutIncluded: rootLayoutIncludedAtThisLevelOrAbove,
      preloadCallbacks,
      MetadataOutlet,
      hintTree: hintTree?.slots?.[parallelRouteKey] ?? null,
    })

    for (const subPath of subPaths) {
      paths.push([actualSegment, parallelRouteKey, ...subPath])
    }
  }

  return paths
}

/**
 * A simplified version of `walkTreeWithFlightRouterState` that doesn't skip any layouts
 * but returns a result of the same shape.
 * Intended to be used for instant validation, where we need the complete tree.
 */
export async function createFullTreeFlightDataForNavigation({
  loaderTree,
  rscHead,
  injectedCSS,
  injectedJS,
  injectedFontPreloadTags,
  ctx,
  preloadCallbacks,
  MetadataOutlet,
}: {
  loaderTree: LoaderTree
  flightRouterState?: FlightRouterState
  rscHead: HeadData
  injectedCSS: Set<string>
  injectedJS: Set<string>
  injectedFontPreloadTags: Set<string>
  ctx: AppRenderContext
  preloadCallbacks: PreloadCallbacks
  MetadataOutlet: React.ComponentType
}): Promise<[rootSegment: FlightDataPath]> {
  const {
    renderOpts: { experimental },
    query,
    getDynamicParamFromSegment,
    pagePath,
    workStore: workStoreForInitialRender,
  } = ctx

  const hintTreeForInitialRender =
    ctx.renderOpts.prefetchHints?.[pagePath] ?? null

  const routerState = await createFlightRouterStateFromLoaderTree(
    loaderTree,
    hintTreeForInitialRender,
    Boolean(experimental.prefetchInlining),
    workStoreForInitialRender.isStaticGeneration,
    ctx.renderOpts.isBuildTimePrerendering ?? false,
    getDynamicParamFromSegment,
    query
  )
  const rootSegment = routerState[0]

  const seedData = await createComponentTree({
    ctx,
    loaderTree,
    parentParams: {},
    parentOptionalCatchAllParamName: null,
    parentRuntimePrefetchable: false,
    injectedCSS,
    injectedJS,
    injectedFontPreloadTags,
    rootLayoutIncluded: false,
    preloadCallbacks,
    authInterrupts: experimental.authInterrupts,
    MetadataOutlet,
  })

  return [
    [
      // TODO: app-render slices this Segment off.
      // why is that valid, and why are we including it in the first place?
      rootSegment,
      routerState,
      seedData,
      rscHead,
      false,
    ] satisfies FlightDataSegment,
  ]
}

/*
 * This function is used to determine if an existing segment can be overridden
 * by the incoming segment.
 */
const canSegmentBeOverridden = (
  existingSegment: Segment,
  segment: Segment
): boolean => {
  if (Array.isArray(existingSegment) || !Array.isArray(segment)) {
    return false
  }

  return getSegmentParam(existingSegment)?.paramName === segment[0]
}
