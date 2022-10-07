import { webpack, sources } from 'next/dist/compiled/webpack/webpack'
import type { CompilerResult } from './compiler'
import fs from 'fs'
import { join } from 'path'

export function postProcessWebpackResults({
  clientResult,
  serverResult,
  edgeServerResult,
}: {
  clientResult?: CompilerResult
  serverResult?: CompilerResult
  edgeServerResult?: CompilerResult
}): void {
  //   console.log(
  //     'stats',
  //     // c: clientResult.stats,
  //     // serverResult.stats,
  //     edgeServerResult.stats.compilation.emittedAssets
  //   )
  if (edgeServerResult?.stats) {
    postProcessEdgeServerResult(edgeServerResult.stats)
  }
}

function postProcessEdgeServerResult(result: webpack.Stats): void {
  injectManifestToBundles(result)
}

function injectManifestToBundles({ compilation }: webpack.Stats): void {
  const { assets, emittedAssets, assetsInfo } = compilation
  console.log(assetsInfo)
  const distDir = compilation.compiler.outputPath
  const bundlesToInject = Array.from(assetsInfo.entries())
    .filter(([path, info]) => {
      console.log(path, info)
      return (
        (path.startsWith('pages/') || path.startsWith('app/')) &&
        !path.endsWith('.map')
      )
    })
    .map(([path, info]) => {
      const source = fs.readFileSync(join(distDir, path), 'utf8')
      const sourceMap = fs.readFileSync(join(distDir, `${path}.map`), 'utf8')
      console.log('source', source)

      return {
        sourceAndMap: new sources.SourceMapSource(
          source,
          path,
          sourceMap as any
        ),
        path,
      }
    })

  console.log(bundlesToInject)

  bundlesToInject.forEach(({ sourceAndMap, path }) => {
    const result = new sources.ConcatSource(
      new sources.RawSource(
        `
        // Injected by Next.js
        `
      ),

      sourceAndMap
    )

    const { source, map } = sourceAndMap.sourceAndMap()
    console.log('source', source)
    console.log('map', map)
    delete map.sourcesContent
    fs.writeFileSync(join(distDir, path), source)
    fs.writeFileSync(join(distDir, `${path}.map`), JSON.stringify(map))
  })

  //   const manifestAsset = assets['manifest.json']
  //   if (!manifestAsset) {
  //     throw new Error('manifest.json is not found')
  //   }

  //   const manifest = compilation.getModule('manifest.json')?.source()
  //   //   const manifest = JSON.parse(manifestAsset.source().toString())
  //   Object.entries(assets).forEach(([assetName, asset]) => {
  //     if (assetName.endsWith('.js')) {
  //       const source = asset.source().toString()
  //       const newSource = source.replace(
  //         /__NEXT_MANIFEST/g,
  //         JSON.stringify(manifest)
  //       )
  //       asset.source = () => newSource
  //     }
  //   })
}
