import { execFileSync } from 'node:child_process'
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { extname, join } from 'node:path'
import ts from 'typescript'

const args = new Map()
for (let index = 2; index < process.argv.length; index++) {
  const key = process.argv[index]
  if (key === '--') continue
  const value = process.argv[index + 1]
  if (!key?.startsWith('--') || value === undefined) {
    throw new Error(`Expected --name value arguments, received: ${key ?? ''}`)
  }
  args.set(key.slice(2), value)
  index++
}

const sourceExtensions = new Set([
  '.cjs',
  '.css',
  '.js',
  '.jsx',
  '.mjs',
  '.mts',
  '.scss',
  '.ts',
  '.tsx',
])
const compilerSourceExtensions = new Set([...sourceExtensions, '.rs'])

function git(...gitArgs) {
  return execFileSync('git', gitArgs, { encoding: 'utf8' }).trim()
}

function worktreeFiles(pathspec) {
  const output = git(
    'ls-files',
    '--cached',
    '--others',
    '--exclude-standard',
    '--',
    pathspec
  )
  return output ? output.split('\n').filter(existsSync) : []
}

function isSourceFile(path) {
  return sourceExtensions.has(extname(path))
}

function countLines(text) {
  if (text.length === 0) return 0
  const newlines = text.match(/\n/g)?.length ?? 0
  return newlines + (text.endsWith('\n') ? 0 : 1)
}

function summarize(files) {
  let bytes = 0
  let lines = 0

  for (const file of files) {
    const contents = readFileSync(file)
    bytes += contents.byteLength
    lines += countLines(contents.toString('utf8'))
  }

  return { files: files.length, lines, bytes }
}

function countMatches(files, expression) {
  let matches = 0
  for (const file of files) {
    const contents = readFileSync(file, 'utf8')
    matches += contents.match(expression)?.length ?? 0
  }
  return matches
}

function countInterfaceMembers(file, interfaceName) {
  const source = ts.createSourceFile(
    file,
    readFileSync(file, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  )

  for (const statement of source.statements) {
    if (
      ts.isInterfaceDeclaration(statement) &&
      statement.name.text === interfaceName
    ) {
      return statement.members.length
    }
  }

  throw new Error(`Could not find interface ${interfaceName} in ${file}`)
}

function directoryBytes(root, predicate = () => true) {
  if (!existsSync(root)) return null

  let bytes = 0
  const pending = [root]
  while (pending.length > 0) {
    const directory = pending.pop()
    for (const entry of readdirSync(directory)) {
      const path = join(directory, entry)
      const stats = statSync(path)
      if (stats.isDirectory()) {
        pending.push(path)
      } else if (predicate(path)) {
        bytes += stats.size
      }
    }
  }
  return bytes
}

function optionalNumber(name) {
  const value = args.get(name)
  if (value === undefined) return null
  const number = Number(value)
  if (!Number.isFinite(number) || number < 0) {
    throw new Error(`--${name} must be a non-negative number`)
  }
  return number
}

const frameworkSourceFiles =
  worktreeFiles('packages/next/src').filter(isSourceFile)
const authoredFrameworkSourceFiles = frameworkSourceFiles.filter(
  (file) => !file.startsWith('packages/next/src/compiled/')
)
const vendoredCompiledSourceFiles = frameworkSourceFiles.filter((file) =>
  file.startsWith('packages/next/src/compiled/')
)
const appRenderFiles = frameworkSourceFiles.filter((file) =>
  file.startsWith('packages/next/src/server/app-render/')
)
const clientRouterFiles = frameworkSourceFiles.filter(
  (file) =>
    file.startsWith('packages/next/src/client/components/router-reducer/') ||
    file.startsWith('packages/next/src/client/components/segment-cache/')
)
const clientRuntimeFiles = frameworkSourceFiles.filter(
  (file) =>
    file.startsWith('packages/next/src/client/') ||
    file.startsWith('packages/next/src/next-devtools/')
)
const appSegmentConfigFiles = frameworkSourceFiles.filter((file) =>
  file.startsWith('packages/next/src/build/segment-config/app/')
)
const appRouteConfigFiles = [
  ...appSegmentConfigFiles,
  'packages/next/src/build/static-paths/app.ts',
  'packages/next/src/build/swc/types.ts',
  'packages/next/src/build/templates/app-page-runtime.ts',
  'packages/next/src/build/webpack/loaders/next-metadata-route-loader.ts',
  'packages/next/src/build/webpack/plugins/next-types-plugin/index.ts',
  'packages/next/src/server/route-modules/app-route/module.ts',
  'packages/next/src/server/typescript/rules/config.ts',
  'crates/next-core/src/segment_config.rs',
  'crates/next-custom-transforms/src/transforms/react_server_components.rs',
].filter(existsSync)
const appDynamicModeFiles = [
  ...new Set(
    [
      ...appRouteConfigFiles,
      'packages/next/src/build/index.ts',
      'packages/next/src/build/utils.ts',
      'packages/next/src/build/webpack/loaders/next-metadata-route-loader.ts',
      'packages/next/src/export/routes/app-page.ts',
      'packages/next/src/export/worker.ts',
      'packages/next/src/server/config-schema.ts',
      'packages/next/src/server/config-shared.ts',
      'packages/next/src/server/app-render/dev-validation-worker-globals.ts',
      'packages/next/src/server/app-render/dev-validation-worker-snapshot.ts',
      'packages/next/src/server/app-render/app-render.tsx',
      'packages/next/src/server/app-render/create-component-tree.tsx',
      'packages/next/src/server/app-render/dynamic-rendering.ts',
      'packages/next/src/server/app-render/work-async-storage.external.ts',
      'packages/next/src/server/lib/patch-fetch.ts',
      'packages/next/src/server/request/connection.ts',
      'packages/next/src/server/request/cookies.ts',
      'packages/next/src/server/request/draft-mode.ts',
      'packages/next/src/server/request/headers.ts',
      'packages/next/src/server/request/params.ts',
      'packages/next/src/server/request/root-params.ts',
      'packages/next/src/server/request/search-params.ts',
      'packages/next/src/server/request/utils.ts',
      'packages/next/src/server/route-modules/app-route/helpers/is-static-gen-enabled.ts',
      'packages/next/src/server/route-modules/app-route/module.ts',
      'packages/next/src/server/web/spec-extension/unstable-no-store.ts',
      'crates/next-core/src/next_app/metadata/route.rs',
    ].filter(existsSync)
  ),
]
const appFetchCacheConfigFiles = [
  ...new Set(
    [
      ...appRouteConfigFiles,
      'packages/next/src/build/utils.ts',
      'packages/next/src/server/app-render/action-handler.ts',
      'packages/next/src/server/app-render/app-render.tsx',
      'packages/next/src/server/app-render/create-component-tree.tsx',
      'packages/next/src/server/app-render/work-async-storage.external.ts',
      'packages/next/src/server/async-storage/work-store.ts',
      'packages/next/src/server/config-shared.ts',
    ].filter(existsSync)
  ),
]
const appRevalidateModeFiles = [
  ...new Set(
    [
      ...appRouteConfigFiles,
      'packages/next/src/build/index.ts',
      'packages/next/src/build/utils.ts',
      'packages/next/src/server/app-render/create-component-tree.tsx',
      'packages/next/src/server/route-modules/app-route/helpers/is-static-gen-enabled.ts',
    ].filter(existsSync)
  ),
]
const appRendererRuntimeFiles = [
  ...frameworkSourceFiles.filter((file) =>
    file.startsWith('packages/next/src/server/app-render/')
  ),
  'packages/next/src/server/use-cache/use-cache-wrapper.ts',
  'packages/next/src/server/resume-data-cache/resume-data-cache.ts',
  'packages/next/src/server/lib/incremental-cache/index.ts',
  'packages/next/src/server/lib/incremental-cache/file-system-cache.ts',
  'packages/next/src/server/lib/patch-fetch.ts',
  'packages/next/src/server/route-modules/app-route/module.compiled.js',
].filter(existsSync)
const appEntryFiles = [
  'crates/next-api/src/app.rs',
  'crates/next-core/src/next_app/app_page_entry.rs',
  'crates/next-core/src/next_app/app_route_entry.rs',
].filter(existsSync)
const appApiRustFiles = ['crates/next-api/src/app.rs'].filter(existsSync)
const appApiSource = readFileSync('crates/next-api/src/app.rs', 'utf8')
const appEndpointSource =
  appApiSource.split('#[turbo_tasks::value]\nenum AppEndpointType')[1] ?? ''
const compilerRustFiles = [
  ...worktreeFiles('crates/next-core'),
  ...worktreeFiles('crates/next-custom-transforms'),
].filter((file) => compilerSourceExtensions.has(extname(file)))
const webpackFiles = frameworkSourceFiles.filter(
  (file) =>
    file.includes('/webpack/') || /(^|[/.-])webpack([/.-]|$)/i.test(file)
)
const pagesRouterFiles = frameworkSourceFiles.filter(
  (file) =>
    file.includes('/pages/') ||
    file.includes('/pages-router/') ||
    /(^|[/.-])pages-runtime([/.-]|$)/i.test(file)
)
const testFiles = worktreeFiles('test').filter((file) =>
  /\.(test|spec)\.[cm]?[jt]sx?$/.test(file)
)
const testSourceFiles = worktreeFiles('test').filter(isSourceFile)
const appRouterTestSourceFiles = testSourceFiles.filter(
  (file) => !file.includes('/pages/')
)

const nextPackage = JSON.parse(
  readFileSync('packages/next/package.json', 'utf8')
)
const configFile = 'packages/next/src/server/config-shared.ts'

const metrics = {
  schemaVersion: 2,
  label: args.get('label') ?? null,
  capturedAt: new Date().toISOString(),
  git: {
    baseHead: git('rev-parse', '--short=10', 'HEAD'),
  },
  source: {
    frameworkTracked: summarize(frameworkSourceFiles),
    frameworkAuthored: summarize(authoredFrameworkSourceFiles),
    vendoredCompiled: summarize(vendoredCompiledSourceFiles),
    appRender: summarize(appRenderFiles),
    clientRouter: summarize(clientRouterFiles),
    compilerRust: summarize(compilerRustFiles),
    appApiRust: summarize(appApiRustFiles),
    webpackPathProxy: summarize(webpackFiles),
    pagesRouterPathProxy: summarize(pagesRouterFiles),
  },
  publicConfigMembers: {
    nextConfig: countInterfaceMembers(configFile, 'NextConfig'),
    experimentalConfig: countInterfaceMembers(configFile, 'ExperimentalConfig'),
  },
  legacyModeReferences: {
    cacheComponents: countMatches(frameworkSourceFiles, /\bcacheComponents\b/g),
    routePPR: countMatches(frameworkSourceFiles, /\bisRoutePPREnabled\b/g),
    appPPR: countMatches(frameworkSourceFiles, /\bisAppPPREnabled\b/g),
    cacheComponentsEnv: countMatches(
      frameworkSourceFiles,
      /__NEXT_CACHE_COMPONENTS/g
    ),
    pprEnv: countMatches(frameworkSourceFiles, /__NEXT_PPR/g),
    cachedNavigationsEnv: countMatches(
      frameworkSourceFiles,
      /__NEXT_EXPERIMENTAL_CACHED_NAVIGATIONS/g
    ),
    prefetchKind: countMatches(frameworkSourceFiles, /\bPrefetchKind\b/g),
    fullPrefetchStrategy: countMatches(
      frameworkSourceFiles,
      /\bFetchStrategy\.Full\b/g
    ),
    loadingBoundaryStrategy: countMatches(
      frameworkSourceFiles,
      /\bFetchStrategy\.LoadingBoundary\b/g
    ),
    perSegmentPrefetchCapability: countMatches(
      frameworkSourceFiles,
      /\bsupportsPerSegmentPrefetching\b/g
    ),
    clientRenderingModeEnv: countMatches(
      clientRuntimeFiles,
      /__NEXT_CACHE_COMPONENTS|__NEXT_EXPERIMENTAL_CACHED_NAVIGATIONS|__NEXT_PPR/g
    ),
    compilerCacheModeFields: countMatches(
      compilerRustFiles,
      /\bcache_components_enabled\b|\buse_cache_enabled\b/g
    ),
    appRouteConfigRuntimeSchemaFields: countMatches(
      appSegmentConfigFiles,
      /^\s*runtime(?:\?|):/gm
    ),
    appEdgeEntryWrappers: countMatches(
      appEntryFiles,
      /\bwrap_edge_page\b|\bwrap_edge_route\b/g
    ),
    appRuntimeSelectionBranches:
      appEndpointSource.match(/\bNextRuntime::Edge\b/g)?.length ?? 0,
    appEdgeContextRuntimeConstants: countMatches(
      appEntryFiles,
      /\bNextRuntime::Edge\b/g
    ),
    appDynamicParamsModeReferences: countMatches(
      appRouteConfigFiles,
      /\bdynamicParams\b|\bdynamic_params\b/g
    ),
    appDynamicModeReferences: countMatches(
      appDynamicModeFiles,
      /\bNextSegmentDynamic\b|\bdynamicShouldError\b|\bforceDynamic\b|\bforceStatic\b|\b_isDynamicError\b|\b(?:appConfig|layoutOrPageMod|userland|liveUserland|config|segmentConfig|mod)\??\.dynamic\b/g
    ),
    appDynamicFixtureExports: countMatches(
      testSourceFiles,
      /\bexport\s+const\s+dynamic\s*=/g
    ),
    appDynamicTestModeReferences: countMatches(
      testSourceFiles,
      /\bdynamic\s*=\s*["'](?:error|force-dynamic|force-static)["']|\bforce-(?:dynamic|static)\b/g
    ),
    appFetchCacheModeReferences:
      countMatches(
        appFetchCacheConfigFiles,
        /\bNextSegmentFetchCache\b|\bfetch_cache\b|\bfetchCache\b/g
      ) +
      countMatches(
        ['packages/next/src/server/lib/patch-fetch.ts'],
        /\bpageFetchCacheMode\b|\bworkStore\.fetchCache\b|fetchCache = (?:force|only|default)/g
      ),
    appFetchCacheFixtureExports: countMatches(
      testSourceFiles,
      /\bexport\s+const\s+fetchCache\s*=/g
    ),
    appFetchCacheTestModeReferences: countMatches(
      testSourceFiles,
      /\b(?:force-no-store|only-no-store|only-cache|default-no-store|default-cache)\b/g
    ),
    appRevalidateModeReferences: countMatches(
      appRevalidateModeFiles,
      /\bNextRevalidate\b|\bRevalidateRange\b|\b(?:appConfig|layoutOrPageMod|userland|liveUserland|segmentConfig)\??\.revalidate\b|\brevalidate\?:\s*(?:number|RevalidateRange)|^\s{2}revalidate:\s*\{/gm
    ),
    appRevalidateFixtureExports: countMatches(
      appRouterTestSourceFiles,
      /\bexport\s+const\s+revalidate\s*=\s*(?:false|\d[\d_]*)/g
    ),
    appRevalidateTestModeReferences: countMatches(
      appRouterTestSourceFiles,
      /\bexport\s+const\s+revalidate\s*=|\b(?:segment|config|variable)-revalidate\b|\brevalidate-(?:0|[1-9]\d*)\b/g
    ),
    appRendererEdgeRuntimeReferences: countMatches(
      appRendererRuntimeFiles,
      /\bNEXT_RUNTIME\b[^;\n]*\bedge\b|\bisEdgeRuntime\b|\bedge(?:Rsc|SSR)ModuleMapping\b|\b__NEXT_EDGE_PROJECT_DIR\b|\bisWebNextRequest\b/g
    ),
  },
  packageDependencies: {
    dependencies: Object.keys(nextPackage.dependencies ?? {}).length,
    optionalDependencies: Object.keys(nextPackage.optionalDependencies ?? {})
      .length,
    peerDependencies: Object.keys(nextPackage.peerDependencies ?? {}).length,
  },
  tests: {
    totalFiles: testFiles.length,
    e2eFiles: testFiles.filter((file) => file.startsWith('test/e2e/')).length,
    developmentFiles: testFiles.filter((file) =>
      file.startsWith('test/development/')
    ).length,
    productionFiles: testFiles.filter((file) =>
      file.startsWith('test/production/')
    ).length,
    unitFiles: testFiles.filter((file) => file.startsWith('test/unit/')).length,
  },
  builtArtifacts: {
    conditions: args.get('artifact-conditions') ?? null,
    nextDistBytes: directoryBytes('packages/next/dist'),
    nextDistJavaScriptBytes: directoryBytes(
      'packages/next/dist',
      (file) => extname(file) === '.js'
    ),
  },
  validationTimingConditions: args.get('timing-conditions') ?? null,
  validationTimingsMs: {
    types: optionalNumber('types-ms'),
    directTests: optionalNumber('direct-tests-ms'),
    focusedTests: optionalNumber('focused-tests-ms'),
    testSelectionOverhead: optionalNumber('test-selection-overhead-ms'),
    httpTests: optionalNumber('http-tests-ms'),
    httpTestBody: optionalNumber('http-test-body-ms'),
    browserStartup: optionalNumber('browser-startup-ms'),
    browserTestBody: optionalNumber('browser-test-body-ms'),
    browserTests: optionalNumber('browser-tests-ms'),
    edgeDceBuild: optionalNumber('edge-dce-build-ms'),
    nativeBuild: optionalNumber('native-build-ms'),
    nextBuild: optionalNumber('next-build-ms'),
    buildAll: optionalNumber('build-all-ms'),
    total: optionalNumber('validation-total-ms'),
  },
  runtimePerformance: {
    conditions: args.get('runtime-conditions') ?? null,
    devStartupMs: optionalNumber('dev-startup-ms'),
    productionStartupMs: optionalNumber('production-startup-ms'),
    routeHandlerRequestMs: optionalNumber('route-handler-request-ms'),
    routeHandlerRevalidationMs: optionalNumber('route-handler-revalidation-ms'),
    edgeMiddlewareStartupMs: optionalNumber('edge-middleware-startup-ms'),
    edgeImageResponseMs: optionalNumber('edge-image-response-ms'),
    edgeImageResponseBytes: optionalNumber('edge-image-response-bytes'),
    pprShellFirstByteMs: optionalNumber('ppr-shell-first-byte-ms'),
    pprCompleteMs: optionalNumber('ppr-complete-ms'),
    partialNavigationMs: optionalNumber('partial-navigation-ms'),
    partialNavigationResponseBytes: optionalNumber(
      'partial-navigation-response-bytes'
    ),
    fastRefreshMaxMs: optionalNumber('fast-refresh-max-ms'),
    fastRefreshSamples: optionalNumber('fast-refresh-samples'),
    peakRssBytes: optionalNumber('peak-rss-bytes'),
  },
}

const output = `${JSON.stringify(metrics, null, 2)}\n`
const outputPath = args.get('output')
if (outputPath) {
  writeFileSync(outputPath, output)
} else {
  process.stdout.write(output)
}
