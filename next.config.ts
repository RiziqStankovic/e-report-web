import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // CORS configuration
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'production' 
              ? 'https://yourdomain.com' 
              : 'http://localhost:3000,http://localhost:3001'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, PATCH, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With, Accept, Origin'
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true'
          },
          {
            key: 'Access-Control-Max-Age',
            value: '86400'
          }
        ]
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ]
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081',
    NEXT_PUBLIC_CORS_ORIGINS: process.env.NEXT_PUBLIC_CORS_ORIGINS || 'http://localhost:3000,http://localhost:3001'
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