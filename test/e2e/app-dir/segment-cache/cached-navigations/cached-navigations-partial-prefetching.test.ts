import path from 'path'
import { nextTestSetup } from 'e2e-utils'
import type * as Playwright from 'playwright'
import { createRouterAct } from 'router-act'

// The fork enables Partial Prefetching globally, which opts every route into
// runtime Cached Navigations even without a per-segment `prefetch` config.
describe('cached navigations - fork Partial Prefetching default', () => {
  const { next, isNextDev } = nextTestSetup({
    files: path.join(__dirname, 'partial-prefetching'),
  })

  if (isNextDev) {
    it('is skipped', () => {})
    return
  }

  it('runtime-caches a route that has no per-segment prefetch config', async () => {
    let page: Playwright.Page
    const browser = await next.browser('/', {
      async beforePageLoad(p: Playwright.Page) {
        page = p
        await page.clock.install()
      },
    })
    const act = createRouterAct(page, { includeAppShellRequests: true })

    // Imperative prefetching uses the same partial protocol as automatic
    // prefetching: cached shell content is included, but dynamic content is
    // deferred until navigation.
    await act(async () => {
      await browser.eval('window.next.router.prefetch("/runtime-prefetchable")')
    }, [
      { includes: 'Cached content' },
      { includes: 'Dynamic content', block: 'reject' },
    ])

    // First navigation to /runtime-prefetchable — a route that reads request
    // data but does NOT export any `prefetch` config. The link itself uses
    // prefetch={false}; the shell above came from the imperative prefetch.
    await act(
      async () => {
        await browser.elementByCss('a[href="/runtime-prefetchable"]').click()
      },
      { includes: 'Dynamic content' }
    )

    expect(await browser.elementById('cached-content').text()).toContain(
      'Cached content'
    )

    // Navigate back to home
    await browser.back()
    expect(await browser.elementByCss('h1').text()).toBe('Home')

    // Second navigation: request-derived content (searchParams, cookies,
    // headers) was runtime-cached from the first navigation and shows
    // instantly, even with the dynamic request blocked. Only the truly dynamic
    // connection() content needs a server request.
    await act(async () => {
      await act(
        async () => {
          await browser.elementByCss('a[href="/runtime-prefetchable"]').click()
        },
        {
          includes: 'Dynamic content',
          block: true,
        }
      )

      expect(await browser.elementById('cached-content').text()).toContain(
        'Cached content'
      )
      expect(
        await browser.elementById('search-params-boundary').text()
      ).toContain('Search params:')
      expect(await browser.elementById('cookies-boundary').text()).toContain(
        'Cookie:'
      )
      expect(await browser.elementById('headers-boundary').text()).toContain(
        'Header:'
      )

      // Only connection() shows a Suspense fallback — it's truly dynamic.
      expect(await browser.elementById('connection-boundary').text()).toBe(
        'Loading connection...'
      )
    })

    // After unblocking, the dynamic content resolves too.
    expect(await browser.elementById('connection-boundary').text()).toContain(
      'Dynamic content'
    )
  })
})
