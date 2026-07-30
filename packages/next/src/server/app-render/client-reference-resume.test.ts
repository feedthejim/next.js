import type { ClientReferenceManifest } from '../../build/webpack/plugins/flight-manifest-plugin'
import { createClientReferenceResumeEntries } from './client-reference-resume'

describe('client reference resume manifest', () => {
  it('keeps renderer-owned references and drops React App Router internals', () => {
    const manifest = {
      clientModules: {
        '[project]/app/counter.tsx': {
          id: 17,
          name: '*',
          chunks: ['/_next/static/chunks/counter.js'],
          async: false,
        },
        '[project]/node_modules/next/dist/client/components/layout-router.js': {
          id: 29,
          name: '*',
          chunks: ['/_next/static/chunks/layout-router.js'],
          async: false,
        },
      },
    } as unknown as ClientReferenceManifest

    expect(createClientReferenceResumeEntries(manifest)).toEqual([
      [
        '[project]/app/counter.tsx',
        17,
        ['/_next/static/chunks/counter.js'],
        false,
      ],
    ])
  })
})
