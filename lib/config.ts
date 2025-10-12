// Configuration file for e-report-web

export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081',
    timeout: 10000,
    retries: 3
  },

  // CORS Configuration
  cors: {
    allowedOrigins: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://yourdomain.com'
    ],
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin'
    ],
    credentials: true
  },

  // Authentication Configuration
  auth: {
    tokenKey: 'e-report-token',
    refreshTokenKey: 'e-report-refresh-token',
    tokenExpiry: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    refreshTokenExpiry: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
  },

  // Environment Configuration
  env: {
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test'
  },

  // Feature Flags
  features: {
    enableWhatsAppNotifications: process.env.NEXT_PUBLIC_ENABLE_WHATSAPP === 'true',
    enableExport: process.env.NEXT_PUBLIC_ENABLE_EXPORT === 'true',
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true'
  },

  // UI Configuration
  ui: {
    theme: {
      primary: '#3b82f6',
      secondary: '#6b7280',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#06b6d4'
    },
    breakpoints: {
      xs: '0px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem'
    }
  },

  // Mobile Configuration
  mobile: {
    enableTouchGestures: true,
    enableHapticFeedback: true,
    enableSwipeNavigation: true,
    enablePullToRefresh: false,
    enableSmoothScrolling: true
  },

  // Performance Configuration
  performance: {
    enableLazyLoading: true,
    enableImageOptimization: true,
    enableCodeSplitting: true,
    enableServiceWorker: process.env.NODE_ENV === 'production',
    enableCaching: true
  },

  // Error Handling Configuration
  error: {
    enableErrorBoundary: true,
    enableErrorReporting: process.env.NODE_ENV === 'production',
    enableErrorLogging: true,
    maxRetries: 3,
    retryDelay: 1000
  },

  // Security Configuration
  security: {
    enableCSP: process.env.NODE_ENV === 'production',
    enableHSTS: process.env.NODE_ENV === 'production',
    enableXSSProtection: true,
    enableClickjackingProtection: true,
    enableMimeSniffingProtection: true
  },

  // Logging Configuration
  logging: {
    level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
    enableConsole: process.env.NODE_ENV === 'development',
    enableFile: process.env.NODE_ENV === 'production',
    enableRemote: process.env.NODE_ENV === 'production'
  }
} as const

// Type definitions for better TypeScript support
export type Config = typeof config
export type ApiConfig = typeof config.api
export type CorsConfig = typeof config.cors
export type AuthConfig = typeof config.auth
export type EnvConfig = typeof config.env
export type FeaturesConfig = typeof config.features
export type UIConfig = typeof config.ui
export type MobileConfig = typeof config.mobile
export type PerformanceConfig = typeof config.performance
export type ErrorConfig = typeof config.error
export type SecurityConfig = typeof config.security
export type LoggingConfig = typeof config.logging

// Helper functions
export const getApiUrl = (endpoint: string): string => {
  const baseUrl = config.api.baseUrl.replace(/\/$/, '')
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return `${baseUrl}${cleanEndpoint}`
}

export const isFeatureEnabled = (feature: keyof FeaturesConfig): boolean => {
  return config.features[feature] === true
}

export const getThemeColor = (color: keyof UIConfig['theme']): string => {
  return config.ui.theme[color]
}

export const getBreakpoint = (breakpoint: keyof UIConfig['breakpoints']): string => {
  return config.ui.breakpoints[breakpoint]
}

export const getSpacing = (size: keyof UIConfig['spacing']): string => {
  return config.ui.spacing[size]
}

export const isDevelopment = (): boolean => {
  return config.env.isDevelopment
}

export const isProduction = (): boolean => {
  return config.env.isProduction
}

export const isTest = (): boolean => {
  return config.env.isTest
}

// Environment validation
export const validateConfig = (): void => {
  const requiredEnvVars = [
    'NEXT_PUBLIC_API_URL'
  ]

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
  
  if (missingVars.length > 0) {
    console.warn('Missing required environment variables:', missingVars)
  }
}

// Initialize configuration
validateConfig()
