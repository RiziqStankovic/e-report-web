import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

const BACKEND_URL = 'https://be-report.cloudfren.id'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path } = req.query
  const pathString = Array.isArray(path) ? path.join('/') : path || ''
  
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Origin,Content-Type,Accept,Authorization,X-Requested-With,X-CSRF-Token')
    res.setHeader('Access-Control-Allow-Credentials', 'false')
    res.setHeader('Access-Control-Max-Age', '86400')
    res.setHeader('Access-Control-Expose-Headers', 'Content-Length,Content-Type,Date,Server,Transfer-Encoding,X-Total-Count')

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(204).end()
      return
    }

    // Forward request to backend
    const backendUrl = `${BACKEND_URL}/api/${pathString}`
    console.log(`Proxying ${req.method} request to: ${backendUrl}`)

    const response = await axios({
      method: req.method,
      url: backendUrl,
      data: req.body,
      headers: {
        ...req.headers,
        host: undefined, // Remove host header
      },
      params: req.query,
    })

    // Forward response headers
    Object.keys(response.headers).forEach(key => {
      if (key.toLowerCase() !== 'transfer-encoding') {
        res.setHeader(key, response.headers[key])
      }
    })

    res.status(response.status).json(response.data)
  } catch (error: unknown) {
    console.error('Proxy error:', error)
    
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json(error.response.data)
    } else {
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}
