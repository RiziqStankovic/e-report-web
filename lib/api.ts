import axios from 'axios'
import { MasterData, LoginCredentials, CreateReportData, UpdateReportData, CreateUserData, UpdateUserData } from '@/types'
import { API_CONFIG, getCorsHeaders } from './api-config'
import { apiErrorInterceptor } from './api-error-handler'

// Use proxy in development, direct URL in production
const isDevelopment = process.env.NODE_ENV !== 'production'
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (isDevelopment ? '/api/proxy' : 'https://be-ereport.cloudfren.id/api')

console.log('🔧 API Configuration:')
console.log('  - isDevelopment:', isDevelopment)
console.log('  - NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL)
console.log('  - Final API_BASE_URL:', API_BASE_URL)

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_CONFIG.REQUEST.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: API_CONFIG.CORS.CREDENTIALS
})

// Add retry interceptor for network errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config
    
    // Don't retry if already retried
    if (config._retry) {
      return Promise.reject(error)
    }
    
    // Only retry on network errors
    if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNABORTED' || !error.response) {
      config._retry = true
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.REQUEST.RETRY_DELAY))
      
      return api(config)
    }
    
    return Promise.reject(error)
  }
)

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('e-report-token')
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // Add standard headers (no CORS headers - browser handles these automatically)
  const standardHeaders = getCorsHeaders()
  Object.entries(standardHeaders).forEach(([key, value]) => {
    config.headers[key] = value
  })

  return config
})

// Handle errors in responses
api.interceptors.response.use(
  (response) => {
    // Return response as-is (CORS headers are handled by the server)
    return response
  },
  (error) => {
    // Use the enhanced error interceptor
    return Promise.reject(apiErrorInterceptor(error))
  }
)

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },
  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },
  getProfile: async () => {
    const response = await api.get('/auth/profile')
    return response.data
  },
}

// Reports API
export const reportsApi = {
  getAll: async (params?: {
    status?: string
    kelas?: string
    shift?: string
    ruangan?: string
    kategori?: string
    startDate?: string
    endDate?: string
  }) => {
    const response = await api.get('/reports', { params })
    return response.data
  },
  getById: async (id: string) => {
    const response = await api.get(`/reports/${id}`)
    return response.data
  },
  create: async (data: CreateReportData) => {
    const response = await api.post('/reports', data)
    return response.data
  },
  getMyReports: async () => {
    const response = await api.get('/reports/my')
    return response.data
  },
  update: async (id: string, data: UpdateReportData) => {
    const response = await api.put(`/reports/${id}`, data)
    return response.data
  },
  delete: async (id: string) => {
    const response = await api.delete(`/reports/${id}`)
    return response.data
  },
}

// Dashboard API
export const dashboardApi = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats')
    return response.data
  },
}

// Master Data API
export const masterDataApi = {
  getKelas: async () => {
    const response = await api.get('/master-data/kelas')
    return response.data
  },
  getShift: async () => {
    const response = await api.get('/master-data/shift')
    return response.data
  },
  getRuangan: async () => {
    const response = await api.get('/master-data/ruangan')
    return response.data
  },
  getKategori: async () => {
    const response = await api.get('/master-data/kategori')
    return response.data
  },
  create: async (data: Omit<MasterData, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post('/master-data', data)
    return response.data
  },
  update: async (id: string, data: Partial<MasterData>) => {
    const response = await api.put(`/master-data/${id}`, data)
    return response.data
  },
  delete: async (id: string) => {
    const response = await api.delete(`/master-data/${id}`)
    return response.data
  },
}

// Users API (Admin only)
export const usersApi = {
  getAll: async () => {
    const response = await api.get('/users')
    return response.data
  },
  getById: async (id: string) => {
    const response = await api.get(`/users/${id}`)
    return response.data
  },
  create: async (data: CreateUserData) => {
    const response = await api.post('/users', data)
    return response.data
  },
  update: async (id: string, data: UpdateUserData) => {
    const response = await api.put(`/users/${id}`, data)
    return response.data
  },
  delete: async (id: string) => {
    const response = await api.delete(`/users/${id}`)
    return response.data
  },
}

// Export API
export const exportApi = {
  exportPDF: async (params?: {
    status?: string
    kelas?: string
    shift?: string
    ruangan?: string
    kategori?: string
    startDate?: string
    endDate?: string
  }) => {
    const response = await api.get('/export/pdf', { 
      params,
      responseType: 'blob'
    })
    return response.data
  },
  exportExcel: async (params?: {
    status?: string
    kelas?: string
    shift?: string
    ruangan?: string
    kategori?: string
    startDate?: string
    endDate?: string
  }) => {
    const response = await api.get('/export/excel', { 
      params,
      responseType: 'blob'
    })
    return response.data
  },
}

// Upload API
export const uploadApi = {
  uploadFile: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    
    // Create axios instance without default headers for file upload
    const uploadClient = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_CONFIG.REQUEST.TIMEOUT,
      withCredentials: API_CONFIG.CORS.CREDENTIALS
    })
    
    // Add auth token
    const token = localStorage.getItem('e-report-token')
    if (token) {
      uploadClient.defaults.headers.Authorization = `Bearer ${token}`
    }
    
    const response = await uploadClient.post('/upload/file', formData, {
      headers: {
        // Don't set Content-Type - let browser set it with boundary
      },
    })
    return response.data
  },
  
  deleteFile: async (filename: string) => {
    const response = await api.delete(`/upload/file/${filename}`)
    return response.data
  },
  
  getFileUrl: (filename: string) => {
    // Get base URL and remove /api suffix if present
    let baseUrl = process.env.NEXT_PUBLIC_API_URL || (isDevelopment ? 'https://be-ereport.cloudfren.id' : 'https://be-ereport.cloudfren.id')
    
    if (baseUrl.endsWith('/api')) {
      baseUrl = baseUrl.replace('/api', '')
    }
    
    // If filename already includes /uploads/, use it as is
    if (filename.startsWith('/uploads/')) {
      return `${baseUrl}${filename}`
    }
    
    // Otherwise, construct the path
    return `${baseUrl}/uploads/${filename}`
  }
}

export default api
