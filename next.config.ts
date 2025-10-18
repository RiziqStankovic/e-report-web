import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Remove custom CORS headers; rely on backend CORS and API routes/proxy
  // Keep security headers only
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }
        ]
      }
    ]
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://be-report.cloudfren.id',
    NEXT_PUBLIC_CORS_ORIGINS: process.env.NEXT_PUBLIC_CORS_ORIGINS || 'http://e-report.cloudfren.id,http://localhost:3001'
  },

  // Image optimization
  images: {
    domains: ['localhost', 'your-s3-bucket.s3.amazonaws.com'],
    formats: ['image/webp', 'image/avif']
  },

  // Experimental features
  experimental: {
    // appDir is now stable in Next.js 13+ and doesn't need to be in experimental
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false
      }
    }
    return config
  }
};

export default nextConfig;