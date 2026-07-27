/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  experimental: {
    authInterrupts: true,
    instantInsights: {
      validationLevel: 'manual-warning',
    },
  },
}

module.exports = nextConfig
