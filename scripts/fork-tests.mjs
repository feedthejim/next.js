import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

const fastSuites = [
  'packages/next/src/server/app-render/postponed-state.test.ts',
  'packages/next/src/server/request/fallback-params.test.ts',
  'packages/next/src/server/response-cache/index.test.ts',
  'packages/next/src/server/resume-data-cache/resume-data-cache.test.ts',
  'test/unit/app-dir/flight-router-state/flight-router-state.test.ts',
  'test/unit/app-dir/runtime-prefetch-resume-cache/runtime-prefetch-resume-cache.test.ts',
]

const browserSuites = new Map([
  [
    'ppr',
    'test/e2e/app-dir/ppr-partial-hydration/ppr-partial-hydration.test.ts',
  ],
  [
    'resume-cache',
    'test/e2e/app-dir/resume-data-cache/resume-data-cache.test.ts',
  ],
  [
    'error-recovery',
    'test/e2e/app-dir/cache-components-errors/http-access-fallback-prerender.test.ts',
  ],
  [
    'navigation',
    'test/e2e/app-dir/segment-cache/cached-navigations/cached-navigations-partial-prefetching.test.ts',
  ],
])

const arguments_ = process.argv.slice(2).filter((argument) => argument !== '--')
const mode = arguments_[0] ?? 'fast'

if (mode === 'fast') {
  execFileSync('pnpm', ['exec', 'jest', ...fastSuites, '--runInBand'], {
    stdio: 'inherit',
  })
} else if (mode === 'browser') {
  const selection = arguments_[1] ?? 'all'
  const names =
    selection === 'all' ? [...browserSuites.keys()] : selection.split(',')
  const suites = names.map((name) => {
    const suite = browserSuites.get(name)
    if (!suite) {
      throw new Error(
        `Unknown browser suite "${name}". Choose from: ${[
          ...browserSuites.keys(),
        ].join(', ')}`
      )
    }
    return suite
  })

  execFileSync(
    'pnpm',
    [
      'turbo',
      'run',
      'pack-for-isolated-tests',
      '--force',
      '--output-logs',
      'errors-only',
      '--ui',
      'stream',
    ],
    { stdio: 'inherit' }
  )

  const packageTarballs = [
    ['next', 'packages/next/packed.tgz'],
    ['eslint-config-next', 'packages/eslint-config-next/packed.tgz'],
    ['@next/font', 'packages/font/packed.tgz'],
    ['@next/bundle-analyzer', 'packages/next-bundle-analyzer/packed.tgz'],
    ['@next/env', 'packages/next-env/packed.tgz'],
    ['@next/mdx', 'packages/next-mdx/packed.tgz'],
    ['next-rspack', 'packages/next-rspack/packed.tgz'],
    ['@next/third-parties', 'packages/third-parties/packed.tgz'],
  ].map(([name, path]) => [name, resolve(path)])

  for (const [, path] of packageTarballs) {
    if (!existsSync(path)) {
      throw new Error(`Missing packed test dependency: ${path}`)
    }
  }

  const nextPackagePath = resolve('packages/next/packed.tgz')
  const requiredNextRuntime =
    'package/dist/compiled/next-server/app-page-turbo.runtime.prod.js'
  const packedNextFiles = execFileSync('tar', ['-tzf', nextPackagePath], {
    encoding: 'utf8',
  })
  if (!packedNextFiles.split('\n').includes(requiredNextRuntime)) {
    execFileSync(
      'pnpm',
      ['--dir', 'packages/next', 'pack', '--out', './packed.tgz'],
      { stdio: 'inherit' }
    )
  }

  let nativeDirectory = process.env.NEXT_TEST_NATIVE_DIR
  if (!nativeDirectory) {
    const nativePackage = readdirSync('node_modules/@next').find((entry) =>
      entry.startsWith('swc-')
    )
    if (!nativePackage) {
      throw new Error('No local @next/swc native package is installed')
    }
    nativeDirectory = resolve('node_modules/@next', nativePackage)
  }

  execFileSync('pnpm', ['test-start-turbo', ...suites], {
    stdio: 'inherit',
    env: {
      ...process.env,
      HEADLESS: 'true',
      NEXT_TEST_NATIVE_DIR: nativeDirectory,
      NEXT_TEST_PKG_PATHS: JSON.stringify(packageTarballs),
    },
  })
} else {
  throw new Error(
    'Usage: pnpm fork-test [fast | browser [ppr|resume-cache|error-recovery|navigation]]'
  )
}
