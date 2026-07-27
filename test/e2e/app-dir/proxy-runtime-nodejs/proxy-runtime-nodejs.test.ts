import { nextTestSetup } from 'e2e-utils'

describe('proxy-runtime-node', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  it('should apply a Node proxy redirect with request storage', async () => {
    const browser = await next.browser('/')
    await browser.addCookie({
      name: 'proxy-cookie',
      value: 'redirect',
    })
    await browser.loadPage(`${next.url}/foo`)
    expect(await browser.elementByCss('p').text()).toBe('hello world')
  })
})
