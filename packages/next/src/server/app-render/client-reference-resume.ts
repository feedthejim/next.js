import type { ClientReferenceManifest } from '../../build/webpack/plugins/flight-manifest-plugin'
import type { DeepReadonly } from '../../shared/lib/deep-readonly'
import { htmlEscapeJsonString } from '../../shared/lib/htmlescape'
import { getCurrentClientReferenceManifest } from './manifests-singleton'

export type ClientReferenceResumeEntry = readonly [
  modulePath: string,
  moduleId: string | number,
  chunks: ClientReferenceManifest['clientModules'][string]['chunks'],
  async: boolean,
]

export function createClientReferenceResumeEntries(
  manifest: DeepReadonly<ClientReferenceManifest>
): ClientReferenceResumeEntry[] {
  const entries: ClientReferenceResumeEntry[] = []

  for (const [modulePath, module] of Object.entries(manifest.clientModules)) {
    // A resume runtime owns framework behavior itself. Shipping the React App
    // Router's built-in client references would restore the graph this mode is
    // explicitly replacing.
    if (
      modulePath.includes('/node_modules/next/dist/') ||
      modulePath.includes('/next/dist/')
    ) {
      continue
    }

    entries.push([modulePath, module.id, module.chunks, module.async === true])
  }

  return entries
}

export function getClientReferenceResumeBootstrapScript(): string {
  const entries = createClientReferenceResumeEntries(
    getCurrentClientReferenceManifest()
  )

  return `self.__next_client_reference_resume__=${htmlEscapeJsonString(
    JSON.stringify(entries)
  )}`
}
