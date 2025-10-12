// API Configuration and CORS handling for e-report-web

export const API_CONFIG = {
  // Base API URL
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081',
  
  // API Endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      LOGOUT: '/api/auth/logout',
      REFRESH: '/api/auth/refresh',
      PROFILE: '/api/auth/profile'
    },
    USERS: {
      LIST: '/api/users',
      CREATE: '/api/users',
      UPDATE: '/api/users',
      DELETE: '/api/users',
      BY_ID: (id: string) => `/api/users/${id}`
    },
    REPORTS: {
      LIST: '/api/reports',
      CREATE: '/api/reports',
      UPDATE: '/api/reports',
      DELETE: '/api/reports',
      BY_ID: (id: string) => `/api/reports/${id}`,
      MY_REPORTS: '/api/reports/my',
      BY_STATUS: (status: string) => `/api/reports/status/${status}`,
      BY_CATEGORY: (category: string) => `/api/reports/category/${category}`,
      BY_CLASS: (classId: string) => `/api/reports/class/${classId}`,
      BY_SHIFT: (shiftId: string) => `/api/reports/shift/${shiftId}`,
      BY_ROOM: (roomId: string) => `/api/reports/room/${roomId}`
    },
    MASTER_DATA: {
      CLASSES: '/api/master-data/classes',
      SHIFTS: '/api/master-data/shifts',
      ROOMS: '/api/master-data/rooms',
      CATEGORIES: '/api/master-data/categories',
      USERS: '/api/master-data/users'
    },
    DASHBOARD: {
      STATS: '/api/dashboard/stats',
      CHARTS: '/api/dashboard/charts',
      RECENT: '/api/dashboard/recent'
    },
    EXPORT: {
      PDF: '/api/export/pdf',
      EXCEL: '/api/export/excel'
    },
    NOTIFICATIONS: {
      WHATSAPP: '/api/notifications/whatsapp',
      EMAIL: '/api/notifications/email',
      PUSH: '/api/notifications/push'
    }
  },

  // Request Configuration
  REQUEST: {
    TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
    RETRIES: parseInt(process.env.NEXT_PUBLIC_API_RETRIES || '3'),
    RETRY_DELAY: 1000
  },

  // CORS Configuration
  CORS: {
    ALLOWED_ORIGINS: (process.env.NEXT_PUBLIC_CORS_ORIGINS || 'http://localhost:3000,http://localhost:3001').split(','),
    ALLOWED_METHODS: (process.env.NEXT_PUBLIC_CORS_METHODS || 'GET,POST,PUT,DELETE,PATCH,OPTIONS').split(','),
    ALLOWED_HEADERS: (process.env.NEXT_PUBLIC_CORS_HEADERS || 'Content-Type,Authorization,X-Requested-With,Accept,Origin').split(','),
    CREDENTIALS: process.env.NEXT_PUBLIC_CORS_CREDENTIALS === 'true'
  }
} as const

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  const baseUrl = API_CONFIG.BASE_URL.replace(/\/$/, '')
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return `${baseUrl}${cleanEndpoint}`
}

// Helper function to get endpoint URL
export const getEndpointUrl = (endpoint: string): string => {
  return getApiUrl(endpoint)
}

// CORS headers for API requests
export const getCorsHeaders = (): Record<string, string> => {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Origin': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
    'Access-Control-Request-Method': 'POST',
    'Access-Control-Request-Headers': 'Content-Type,Authorization'
  }
}

// Request headers for API calls
export const getRequestHeaders = (token?: string): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return headers
}

// CORS preflight request handler
export const handleCorsPreflight = (req: Request): Response => {
  const origin = req.headers.get('Origin')
  const method = req.headers.get('Access-Control-Request-Method')
  const headers = req.headers.get('Access-Control-Request-Headers')

  // Check if origin is allowed
  if (origin && !API_CONFIG.CORS.ALLOWED_ORIGINS.includes(origin)) {
    return new Response('CORS: Origin not allowed', { status: 403 })
  }

  // Check if method is allowed
  if (method && !API_CONFIG.CORS.ALLOWED_METHODS.includes(method)) {
    return new Response('CORS: Method not allowed', { status: 405 })
  }

  // Check if headers are allowed
  if (headers) {
    const requestedHeaders = headers.split(',').map(h => h.trim())
    const allowedHeaders = API_CONFIG.CORS.ALLOWED_HEADERS
    const hasInvalidHeader = requestedHeaders.some(header => !allowedHeaders.includes(header))
    
    if (hasInvalidHeader) {
      return new Response('CORS: Headers not allowed', { status: 400 })
    }
  }

  // Return CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': API_CONFIG.CORS.ALLOWED_METHODS.join(','),
    'Access-Control-Allow-Headers': API_CONFIG.CORS.ALLOWED_HEADERS.join(','),
    'Access-Control-Allow-Credentials': API_CONFIG.CORS.CREDENTIALS.toString(),
    'Access-Control-Max-Age': '86400' // 24 hours
  }

  return new Response(null, {
    status: 200,
    headers: corsHeaders
  })
}

// CORS response headers for API responses
export const getCorsResponseHeaders = (origin?: string): Record<string, string> => {
  const allowedOrigin = origin && API_CONFIG.CORS.ALLOWED_ORIGINS.includes(origin) 
    ? origin 
    : API_CONFIG.CORS.ALLOWED_ORIGINS[0]

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': API_CONFIG.CORS.ALLOWED_METHODS.join(','),
    'Access-Control-Allow-Headers': API_CONFIG.CORS.ALLOWED_HEADERS.join(','),
    'Access-Control-Allow-Credentials': API_CONFIG.CORS.CREDENTIALS.toString(),
    'Access-Control-Expose-Headers': 'Content-Length,Content-Type,Date,Server,Transfer-Encoding'
  }
}

// API request wrapper with CORS handling
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<Response> => {
  const url = getApiUrl(endpoint)
  const headers = getRequestHeaders(token)

  const requestOptions: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...options.headers
    }
  }

  try {
    const response = await fetch(url, requestOptions)
    
    // Add CORS headers to response
    const corsHeaders = getCorsResponseHeaders()
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

// Retry mechanism for failed requests
export const apiRequestWithRetry = async (
  endpoint: string,
  options: RequestInit = {},
  token?: string,
  retries: number = API_CONFIG.REQUEST.RETRIES
): Promise<Response> => {
  let lastError: Error | null = null

  for (let i = 0; i <= retries; i++) {
    try {
      const response = await apiRequest(endpoint, options, token)
      
      // If response is successful, return it
      if (response.ok) {
        return response
      }

      // If it's a client error (4xx), don't retry
      if (response.status >= 400 && response.status < 500) {
        return response
      }

      // If it's a server error (5xx), retry
      if (response.status >= 500) {
        lastError = new Error(`Server error: ${response.status}`)
        if (i < retries) {
          await new Promise(resolve => setTimeout(resolve, API_CONFIG.REQUEST.RETRY_DELAY * (i + 1)))
          continue
        }
      }

      return response
    } catch (error) {
      lastError = error as Error
      
      if (i < retries) {
        await new Promise(resolve => setTimeout(resolve, API_CONFIG.REQUEST.RETRY_DELAY * (i + 1)))
        continue
      }
    }
  }

  throw lastError || new Error('API request failed after all retries')
}

// Type definitions
export type ApiEndpoint = keyof typeof API_CONFIG.ENDPOINTS
export type AuthEndpoint = keyof typeof API_CONFIG.ENDPOINTS.AUTH
export type UsersEndpoint = keyof typeof API_CONFIG.ENDPOINTS.USERS
export type ReportsEndpoint = keyof typeof API_CONFIG.ENDPOINTS.REPORTS
export type MasterDataEndpoint = keyof typeof API_CONFIG.ENDPOINTS.MASTER_DATA
export type DashboardEndpoint = keyof typeof API_CONFIG.ENDPOINTS.DASHBOARD
export type ExportEndpoint = keyof typeof API_CONFIG.ENDPOINTS.EXPORT
export type NotificationsEndpoint = keyof typeof API_CONFIG.ENDPOINTS.NOTIFICATIONS
