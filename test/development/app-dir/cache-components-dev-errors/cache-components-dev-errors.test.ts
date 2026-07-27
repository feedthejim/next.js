import stripAnsi from 'strip-ansi'
import { nextTestSetup } from 'e2e-utils'
import { waitForNoErrorToast, hasErrorToast, retry } from 'next-test-utils'

describe('Cache Components Dev Errors', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  it('should show a red box error on the SSR render', async () => {
    const browser = await next.browser('/error')

    // TODO(veil): The "Page <anonymous>" frame should be omitted.
    // Interestingly, it only appears on initial load, and not when
    // soft-navigating to the page (see test below).
    await expect(browser).toDisplayCollapsedRedbox(`
     {
       "code": "E1432",
       "description": "Next.js encountered the unstable value Math.random() while prerendering.",
       "environmentLabel": "Server",
       "label": "Blocking Route",
       "source": "app/error/page.tsx (2:23) @ Page
     > 2 |   const random = Math.random()
         |                       ^",
       "stack": [
         "Page app/error/page.tsx (2:23)",
         "Page <anonymous>",
       ],
     }
    `)
  })

  it('should not show a red box error on client navigations', async () => {
    const browser = await next.browser('/no-error')

    await retry(async () => {
      expect(await hasErrorToast(browser)).toBe(false)
    })

    await browser.elementByCss("[href='/error']").click()
    await waitForNoErrorToast(browser)

    await browser.loadPage(`${next.url}/error`)

    // TODO: React should not include the anon stack in the Owner Stack.
    await expect(browser).toDisplayCollapsedRedbox(`
     {
       "code": "E1432",
       "description": "Next.js encountered the unstable value Math.random() while prerendering.",
       "environmentLabel": "Server",
       "label": "Blocking Route",
       "source": "app/error/page.tsx (2:23) @ Page
     > 2 |   const random = Math.random()
         |                       ^",
       "stack": [
         "Page app/error/page.tsx (2:23)",
         "Page <anonymous>",
       ],
     }
    `)
  })

  it('should not log unhandled rejections for persistently thrown top-level errors', async () => {
    const cliOutputLength = next.cliOutput.length
    const res = await next.fetch('/top-level-error')
    expect(res.status).toBe(500)

    await retry(() => {
      const cliOutput = stripAnsi(next.cliOutput.slice(cliOutputLength))
      expect(cliOutput).toContain('GET /top-level-error 500')
    })

    expect(next.cliOutput.slice(cliOutputLength)).not.toContain(
      'unhandledRejection'
    )
  })

  // NOTE: when update this snapshot, use `pnpm build` in packages/next to avoid next source code get mapped to source.
  it('should display error when component accessed data without suspense boundary', async () => {
    const outputIndex = next.cliOutput.length
    const browser = await next.browser('/no-accessed-data')

    await retry(() => {
      expect(next.cliOutput.slice(outputIndex)).toContain(
        'Error: Route "/no-accessed-data"'
      )
    })

    expect(stripAnsi(next.cliOutput.slice(outputIndex))).toContain(
      'https://nextjs.org/docs/messages/blocking-prerender-dynamic'
    )
    expect(stripAnsi(next.cliOutput.slice(outputIndex))).toContain(
      '\n    at Page (app/no-accessed-data/page.js:2:9)' +
        '\n  1 | export default async function Page() {' +
        '\n> 2 |   await new Promise((r) => setTimeout(r, 200))' +
        '\n    |         ^' +
        '\n  3 |   return <p>Page</p>' +
        '\n  4 | }'
    )

    await expect(browser).toDisplayCollapsedRedbox(`
     {
       "code": "E1440",
       "description": "Next.js encountered uncached data during prerendering.",
       "environmentLabel": "Server",
       "label": "Blocking Route",
       "source": "app/no-accessed-data/page.js (2:9) @ Page
     > 2 |   await new Promise((r) => setTimeout(r, 200))
         |         ^",
       "stack": [
         "Page app/no-accessed-data/page.js (2:9)",
       ],
     }
    `)
  })
})
