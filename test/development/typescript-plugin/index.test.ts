import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import ts from 'typescript'
import type { PluginLanguageService, QuickInfoTestAdapter } from './test-utils'
import { getQuickInfoTestAdapter } from './test-utils'

const nativeDocumentation = 'Native quick info documentation.'
const quickInfoFile = join(__dirname, 'app/quick-info/page.tsx')
const quickInfoSource = readFileSync(quickInfoFile, 'utf8')

function positionOf(text: string, occurrence = 0) {
  let position = -1
  for (let index = 0; index <= occurrence; index++) {
    position = quickInfoSource.indexOf(text, position + 1)
  }
  if (position === -1) {
    throw new Error(`Could not find quick info fixture text: ${text}`)
  }
  return position
}

function documentationText(quickInfo: ts.QuickInfo | undefined) {
  return quickInfo?.documentation?.map((part) => part.text) || []
}

describe('typescript-plugin', () => {
  let languageService: PluginLanguageService
  let quickInfo: QuickInfoTestAdapter

  beforeAll(() => {
    quickInfo = getQuickInfoTestAdapter(__dirname, (prior, args) => {
      const nativeQuickInfo: ts.QuickInfo = prior || {
        kind: ts.ScriptElementKind.unknown,
        kindModifiers: ts.ScriptElementKindModifier.none,
        textSpan: { start: args[1], length: 1 },
        displayParts: [],
      }

      return {
        ...nativeQuickInfo,
        canIncreaseVerbosityLevel: true,
        documentation: [
          { kind: 'text', text: nativeDocumentation },
          ...(nativeQuickInfo.documentation || []),
        ],
      }
    })
    languageService = quickInfo.languageService
  })

  it('should be able to get the language service', () => {
    expect(languageService).toBeDefined()
    const capturedLogs = languageService.getCapturedLogs()
    expect(capturedLogs).toContain(
      '[next] Initialized Next.js TypeScript plugin'
    )
  })

  it('keeps native quick info inside function config initializers', () => {
    const result = quickInfo.getQuickInfoAtPosition(
      quickInfoFile,
      positionOf('metadataTitle', 1)
    )

    expect(result?.canIncreaseVerbosityLevel).toBe(true)
    expect(documentationText(result)).toEqual([nativeDocumentation])
  })

  it('enhances the function config identifier', () => {
    const result = quickInfo.getQuickInfoAtPosition(
      quickInfoFile,
      positionOf('generateMetadata')
    )

    expect(result?.canIncreaseVerbosityLevel).toBe(true)

    const documentation = documentationText(result)
    expect(documentation[0]).toBe(nativeDocumentation)
    expect(documentation.slice(1).join(' ')).toContain(
      'Next.js generateMetadata configurations'
    )
  })
})
