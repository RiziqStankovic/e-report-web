// CORS handler for Next.js API routes
import { NextApiRequest, NextApiResponse } from 'next'

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

export function handleCors(req: NextApiRequest, res: NextApiResponse) {
  const origin = req.headers.origin
  const method = req.method

  // Check if origin is allowed
  if (origin && !CORS_ORIGINS.includes(origin)) {
    res.status(403).json({ error: 'CORS: Origin not allowed' })
    return false
  }

  // Check if method is allowed
  if (method && !CORS_METHODS.includes(method)) {
    res.status(405).json({ error: 'CORS: Method not allowed' })
    return false
  }

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', origin || '*')
  res.setHeader('Access-Control-Allow-Methods', CORS_METHODS.join(','))
  res.setHeader('Access-Control-Allow-Headers', CORS_HEADERS.join(','))
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Max-Age', '86400') // 24 hours

  return true
}

export function handleCorsPreflight(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'OPTIONS') {
    const origin = req.headers.origin
    const method = req.headers['access-control-request-method']
    const headers = req.headers['access-control-request-headers']

    // Check if origin is allowed
    if (origin && !CORS_ORIGINS.includes(origin)) {
      res.status(403).json({ error: 'CORS: Origin not allowed' })
      return
    }

    // Check if method is allowed
    if (method && !CORS_METHODS.includes(method)) {
      res.status(405).json({ error: 'CORS: Method not allowed' })
      return
    }

    // Check if headers are allowed
    if (headers) {
      const requestedHeaders = headers.split(',').map(h => h.trim())
      const hasInvalidHeader = requestedHeaders.some(header => !CORS_HEADERS.includes(header))
      
      if (hasInvalidHeader) {
        res.status(400).json({ error: 'CORS: Headers not allowed' })
        return
      }
    }

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', origin || '*')
    res.setHeader('Access-Control-Allow-Methods', CORS_METHODS.join(','))
    res.setHeader('Access-Control-Allow-Headers', CORS_HEADERS.join(','))
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Max-Age', '86400') // 24 hours

    res.status(200).end()
    return
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle preflight requests
  handleCorsPreflight(req, res)
}
