type OgModule = typeof import('next/dist/compiled/@vercel/og')

function importModule(): Promise<
  typeof import('next/dist/compiled/@vercel/og')
> {
  return import(
    process.env.NEXT_RUNTIME === 'edge'
      ? 'next/dist/compiled/@vercel/og/index.edge.js'
      : 'next/dist/compiled/@vercel/og/index.node.js'
  )
}

function getImageResponseBodyCache():
  | typeof import('./cache-image-response').getCachedImageResponseBody
  | undefined {
  if (process.env.__NEXT_USE_NODE_STREAMS) {
    const { workUnitAsyncStorage } =
      require('../app-render/work-unit-async-storage.external') as typeof import('../app-render/work-unit-async-storage.external')
    if (workUnitAsyncStorage.getStore()?.type === 'prerender') {
      return (
        require('./cache-image-response') as typeof import('./cache-image-response')
      ).getCachedImageResponseBody
    }
  } else {
    // The Node-only relative requires stay inside the branch that is removed
    // from edge bundles.
  }
  return undefined
}

/**
 * The ImageResponse class allows you to generate dynamic images using JSX and CSS.
 * This is useful for generating social media images such as Open Graph images, Twitter cards, and more.
 *
 * Read more: [Next.js Docs: `ImageResponse`](https://nextjs.org/docs/app/api-reference/functions/image-response)
 */
export class ImageResponse extends Response {
  public static displayName = 'ImageResponse'
  constructor(...args: ConstructorParameters<OgModule['ImageResponse']>) {
    // Under Cache Components, route the render through the cache so metadata
    // image routes can be statically prerendered. Otherwise stream the rendered
    // image directly from the underlying `@vercel/og` response.
    const getCachedImageResponseBody = getImageResponseBodyCache()
    const readable = getCachedImageResponseBody
      ? getCachedImageResponseBody(args)
      : new ReadableStream({
          async start(controller) {
            const OGImageResponse: typeof import('next/dist/compiled/@vercel/og').ImageResponse =
              // So far we have to manually determine which build to use, as the
              // auto resolving is not working
              (await importModule()).ImageResponse
            const imageResponse = new OGImageResponse(...args) as Response

            if (!imageResponse.body) {
              return controller.close()
            }

            const reader = imageResponse.body.getReader()
            while (true) {
              const { done, value } = await reader.read()
              if (done) {
                return controller.close()
              }
              controller.enqueue(value)
            }
          },
        })

    const options = args[1] || {}

    const headers = new Headers({
      'content-type': 'image/png',
      'cache-control':
        process.env.NODE_ENV === 'development'
          ? 'no-cache, no-store'
          : 'public, max-age=0, must-revalidate',
    })
    if (options.headers) {
      const newHeaders = new Headers(options.headers)
      newHeaders.forEach((value, key) => headers.set(key, value))
    }
    super(readable, {
      headers,
      status: options.status,
      statusText: options.statusText,
    })
  }
}
