import { NextRequest, NextResponse } from 'next/server'

const CORS_ORIGINS = [
  'http://e-report.cloudfren.id',
  'http://localhost:3001',
  'https://yourdomain.com'
]

const CORS_METHODS = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'PATCH',
  'OPTIONS'
]

const CORS_HEADERS = [
  'Content-Type',
  'Authorization',
  'X-Requested-With',
  'Accept',
  'Origin'
]

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin')
  const method = request.method

  // Handle CORS preflight requests
  if (method === 'OPTIONS') {
    // Check if origin is allowed
    if (origin && !CORS_ORIGINS.includes(origin)) {
      return new NextResponse('CORS: Origin not allowed', { status: 403 })
    }

    // Check if method is allowed
    if (method && !CORS_METHODS.includes(method)) {
      return new NextResponse('CORS: Method not allowed', { status: 405 })
    }

    // Check if headers are allowed
    const requestedHeaders = request.headers.get('access-control-request-headers')
    if (requestedHeaders) {
      const headers = requestedHeaders.split(',').map(h => h.trim())
      const hasInvalidHeader = headers.some(header => !CORS_HEADERS.includes(header))
      
      if (hasInvalidHeader) {
        return new NextResponse('CORS: Headers not allowed', { status: 400 })
      }
    }

    // Return CORS headers
    const response = new NextResponse(null, { status: 200 })
    response.headers.set('Access-Control-Allow-Origin', origin || '*')
    response.headers.set('Access-Control-Allow-Methods', CORS_METHODS.join(','))
    response.headers.set('Access-Control-Allow-Headers', CORS_HEADERS.join(','))
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Max-Age', '86400') // 24 hours

    return response
  }

  // Handle regular requests
  const response = NextResponse.next()

  // Add CORS headers to all responses
  if (origin && CORS_ORIGINS.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  } else {
    response.headers.set('Access-Control-Allow-Origin', '*')
  }
  
  response.headers.set('Access-Control-Allow-Methods', CORS_METHODS.join(','))
  response.headers.set('Access-Control-Allow-Headers', CORS_HEADERS.join(','))
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Expose-Headers', 'Content-Length,Content-Type,Date,Server,Transfer-Encoding')

  return response
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
