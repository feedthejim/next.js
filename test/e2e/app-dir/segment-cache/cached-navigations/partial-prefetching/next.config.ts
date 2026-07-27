import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  // The isolated package fixture currently resolves generated `next/*.js`
  // declarations as runtime modules under TypeScript 6. Core framework types
  // are validated separately; this journey protects navigation behavior.
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    prefetchInlining: false,
    exposeTestingApiInProductionBuild: true,
    optimisticRouting: true,
    useOffline: true,
    varyParams: true,
  },
}

export default nextConfig
