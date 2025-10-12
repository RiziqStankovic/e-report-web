// API wrapper with error handling for e-report-web

import { useState } from 'react'
import { AppError, errorHandler } from './error-handler'
import { apiErrorInterceptor } from './api-error-handler'

// API response interface
export interface ApiResponse<T = unknown> {
  data: T
  success: boolean
  message?: string
  error?: AppError
}

// API wrapper class
export class ApiWrapper {
  private baseUrl: string
  private timeout: number
  private retries: number

  constructor(baseUrl: string, timeout: number = 10000, retries: number = 3) {
    this.baseUrl = baseUrl
    this.timeout = timeout
    this.retries = retries
  }

  // Generic API request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      return {
        data,
        success: true,
        message: 'Request successful'
      }
    } catch (error: unknown) {
      const appError = apiErrorInterceptor(error)
      
      return {
        data: null as T,
        success: false,
        message: errorHandler.getErrorMessage(appError),
        error: appError
      }
    }
  }

  // GET request
  async get<T = unknown>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  // POST request
  async post<T = unknown>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  // PUT request
  async put<T = unknown>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  // DELETE request
  async delete<T = unknown>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  // PATCH request
  async patch<T = unknown>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  // Upload file request
  async upload<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      const response = await fetch(url, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      return {
        data,
        success: true,
        message: 'Upload successful'
      }
    } catch (error: unknown) {
      const appError = apiErrorInterceptor(error)
      
      return {
        data: null as T,
        success: false,
        message: errorHandler.getErrorMessage(appError),
        error: appError
      }
    }
  }

  // Download file request
  async download(endpoint: string, filename?: string): Promise<ApiResponse<Blob>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      const response = await fetch(url, {
        method: 'GET'
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const blob = await response.blob()
      
      // Trigger download
      if (typeof window !== 'undefined') {
        const downloadUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = filename || 'download'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(downloadUrl)
      }
      
      return {
        data: blob,
        success: true,
        message: 'Download successful'
      }
    } catch (error: unknown) {
      const appError = apiErrorInterceptor(error)
      
      return {
        data: null as unknown as Blob,
        success: false,
        message: errorHandler.getErrorMessage(appError),
        error: appError
      }
    }
  }
}

// Create API wrapper instance
const apiWrapper = new ApiWrapper(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081',
  parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
  parseInt(process.env.NEXT_PUBLIC_API_RETRIES || '3')
)

// Export API wrapper instance
export default apiWrapper

// Export individual methods for convenience
export const api = {
  get: <T>(endpoint: string) => apiWrapper.get<T>(endpoint),
  post: <T>(endpoint: string, data?: unknown) => apiWrapper.post<T>(endpoint, data),
  put: <T>(endpoint: string, data?: unknown) => apiWrapper.put<T>(endpoint, data),
  delete: <T>(endpoint: string) => apiWrapper.delete<T>(endpoint),
  patch: <T>(endpoint: string, data?: unknown) => apiWrapper.patch<T>(endpoint, data),
  upload: <T>(endpoint: string, formData: FormData) => apiWrapper.upload<T>(endpoint, formData),
  download: (endpoint: string, filename?: string) => apiWrapper.download(endpoint, filename)
}

// API wrapper hook
export const useApiWrapper = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<AppError | null>(null)

  const execute = async <T>(
    apiCall: () => Promise<ApiResponse<T>>
  ): Promise<ApiResponse<T>> => {
    try {
      setIsLoading(true)
      setError(null)
      
      const result = await apiCall()
      
      if (!result.success && result.error) {
        setError(result.error)
      }
      
      return result
    } catch (error: unknown) {
      const appError = apiErrorInterceptor(error)
      setError(appError)
      
      return {
        data: null as T,
        success: false,
        message: errorHandler.getErrorMessage(appError),
        error: appError
      }
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  return {
    isLoading,
    error,
    execute,
    clearError
  }
}

// API wrapper with retry
export const useApiWrapperWithRetry = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<AppError | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const executeWithRetry = async <T>(
    apiCall: () => Promise<ApiResponse<T>>,
    context?: string,
    maxRetries: number = 3
  ): Promise<ApiResponse<T>> => {
    let lastResult: ApiResponse<T> | null = null

    for (let i = 0; i <= maxRetries; i++) {
      try {
        setIsLoading(true)
        setRetryCount(i)
        setError(null)
        
        if (i > 0) {
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * i))
        }

        const result = await apiCall()
        lastResult = result
        
        if (result.success) {
          return result
        }
        
        // Don't retry for certain error types
        if (result.error && (
          result.error.code === 'AUTHENTICATION_ERROR' || 
          result.error.code === 'AUTHORIZATION_ERROR' ||
          result.error.code === 'NOT_FOUND_ERROR' ||
          result.error.code === 'VALIDATION_ERROR'
        )) {
          break
        }
        
        // If this is the last retry, return the result
        if (i === maxRetries) {
          if (result.error) {
            setError(result.error)
          }
          break
        }
      } catch (error: unknown) {
        const appError = apiErrorInterceptor(error)
        setError(appError)
        
        lastResult = {
          data: null as T,
          success: false,
          message: errorHandler.getErrorMessage(appError),
          error: appError
        }
        
        // Don't retry for certain error types
        if ((appError as { code?: string }).code === 'AUTHENTICATION_ERROR' || 
            (appError as { code?: string }).code === 'AUTHORIZATION_ERROR' ||
            (appError as { code?: string }).code === 'NOT_FOUND_ERROR' ||
            (appError as { code?: string }).code === 'VALIDATION_ERROR') {
          break
        }
        
        // If this is the last retry, return the error
        if (i === maxRetries) {
          break
        }
      } finally {
        setIsLoading(false)
      }
    }

    return lastResult || {
      data: null as T,
      success: false,
      message: 'Request failed after all retries',
      error: new AppError('Request failed after all retries', 500, 'RETRY_EXHAUSTED')
    }
  }

  const clearError = () => {
    setError(null)
    setRetryCount(0)
  }

  return {
    isLoading,
    error,
    retryCount,
    executeWithRetry,
    clearError
  }
}

// API wrapper with recovery
export const useApiWrapperWithRecovery = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<AppError | null>(null)
  const [canRecover, setCanRecover] = useState(false)

  const executeWithRecovery = async <T>(
    apiCall: () => Promise<ApiResponse<T>>
  ): Promise<ApiResponse<T>> => {
    try {
      setIsLoading(true)
      setError(null)
      setCanRecover(false)
      
      const result = await apiCall()
      
      if (!result.success && result.error) {
        setError(result.error)
        
        // Check if error is recoverable
        const recoverable = result.error.code === 'NETWORK_ERROR' || 
                           result.error.code === 'TIMEOUT_ERROR' || 
                           result.error.code === 'SERVER_ERROR'
        
        setCanRecover(recoverable)
      }
      
      return result
    } catch (error: unknown) {
      const appError = apiErrorInterceptor(error)
      setError(appError)
      
      // Check if error is recoverable
      const recoverable = (appError as { code?: string }).code === 'NETWORK_ERROR' || 
                          (appError as { code?: string }).code === 'TIMEOUT_ERROR' || 
                          (appError as { code?: string }).code === 'SERVER_ERROR'
      
      setCanRecover(recoverable)
      
      return {
        data: null as T,
        success: false,
        message: errorHandler.getErrorMessage(appError),
        error: appError
      }
    } finally {
      setIsLoading(false)
    }
  }

  const retry = async <T>(
    apiCall: () => Promise<ApiResponse<T>>
  ): Promise<ApiResponse<T>> => {
    if (!canRecover) {
      return {
        data: null as T,
        success: false,
        message: 'Cannot retry this request',
        error: new AppError('Cannot retry this request', 400, 'RETRY_NOT_AVAILABLE')
      }
    }
    
    return executeWithRecovery(apiCall)
  }

  const clearError = () => {
    setError(null)
    setCanRecover(false)
  }

  return {
    isLoading,
    error,
    canRecover,
    executeWithRecovery,
    retry,
    clearError
  }
}
