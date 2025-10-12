'use client'

import { useState, useCallback } from 'react'
import { AppError, errorHandler } from '@/lib/error-handler'
import { apiErrorInterceptor } from '@/lib/api-error-handler'

// API error hook
export const useApiError = () => {
  const [error, setError] = useState<AppError | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleError = useCallback((error: any, context?: string) => {
    const appError = apiErrorInterceptor(error)
    setError(appError)
    return appError
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const executeWithErrorHandling = useCallback(async <T>(
    apiCall: () => Promise<T>,
    context?: string
  ): Promise<T | null> => {
    try {
      setIsLoading(true)
      clearError()
      const result = await apiCall()
      return result
    } catch (error: any) {
      handleError(error, context)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [handleError, clearError])

  const getErrorMessage = useCallback((error: AppError) => {
    return errorHandler.getErrorMessage(error)
  }, [])

  return {
    error,
    isLoading,
    handleError,
    clearError,
    executeWithErrorHandling,
    getErrorMessage
  }
}

// API error with retry hook
export const useApiErrorWithRetry = () => {
  const [error, setError] = useState<AppError | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  const handleError = useCallback((error: any, context?: string) => {
    const appError = apiErrorInterceptor(error)
    setError(appError)
    return appError
  }, [])

  const clearError = useCallback(() => {
    setError(null)
    setRetryCount(0)
  }, [])

  const executeWithRetry = useCallback(async <T>(
    apiCall: () => Promise<T>,
    context?: string,
    maxRetries: number = 3
  ): Promise<T | null> => {
    let lastError: any = null

    for (let i = 0; i <= maxRetries; i++) {
      try {
        setIsLoading(true)
        setRetryCount(i)
        
        if (i > 0) {
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * i))
        }

        const result = await apiCall()
        clearError()
        return result
      } catch (error: any) {
        lastError = error
        
        // Don't retry for certain error types
        if (error.code === 'AUTHENTICATION_ERROR' || 
            error.code === 'AUTHORIZATION_ERROR' ||
            error.code === 'NOT_FOUND_ERROR' ||
            error.code === 'VALIDATION_ERROR') {
          break
        }
        
        // If this is the last retry, handle the error
        if (i === maxRetries) {
          handleError(error, context)
          break
        }
      } finally {
        setIsLoading(false)
      }
    }

    return null
  }, [handleError, clearError])

  const getErrorMessage = useCallback((error: AppError) => {
    return errorHandler.getErrorMessage(error)
  }, [])

  return {
    error,
    isLoading,
    retryCount,
    handleError,
    clearError,
    executeWithRetry,
    getErrorMessage
  }
}

// API error with recovery hook
export const useApiErrorWithRecovery = () => {
  const [error, setError] = useState<AppError | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [canRecover, setCanRecover] = useState(false)

  const handleError = useCallback((error: any, context?: string) => {
    const appError = apiErrorInterceptor(error)
    setError(appError)
    
    // Check if error is recoverable
    const recoverable = (appError as any).code === 'NETWORK_ERROR' || 
                       (appError as any).code === 'TIMEOUT_ERROR' || 
                       (appError as any).code === 'SERVER_ERROR'
    
    setCanRecover(recoverable)
    return appError
  }, [])

  const clearError = useCallback(() => {
    setError(null)
    setCanRecover(false)
  }, [])

  const executeWithRecovery = useCallback(async <T>(
    apiCall: () => Promise<T>,
    context?: string
  ): Promise<T | null> => {
    try {
      setIsLoading(true)
      clearError()
      const result = await apiCall()
      return result
    } catch (error: any) {
      const appError = handleError(error, context)
      
      // If error is recoverable, return null and let user retry
      if (canRecover) {
        return null
      }
      
      // If error is not recoverable, throw it
      throw appError
    } finally {
      setIsLoading(false)
    }
  }, [handleError, clearError, canRecover])

  const retry = useCallback(async <T>(
    apiCall: () => Promise<T>,
    context?: string
  ): Promise<T | null> => {
    if (!canRecover) return null
    
    return executeWithRecovery(apiCall, context)
  }, [executeWithRecovery, canRecover])

  const getErrorMessage = useCallback((error: AppError) => {
    return errorHandler.getErrorMessage(error)
  }, [])

  return {
    error,
    isLoading,
    canRecover,
    handleError,
    clearError,
    executeWithRecovery,
    retry,
    getErrorMessage
  }
}

// API error with notification hook
export const useApiErrorWithNotification = () => {
  const [error, setError] = useState<AppError | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleError = useCallback((error: any, context?: string) => {
    const appError = apiErrorInterceptor(error)
    setError(appError)
    
    // Show notification
    if (typeof window !== 'undefined') {
      const message = errorHandler.getErrorMessage(appError)
      
      // Create notification element
      const notification = document.createElement('div')
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 max-w-sm'
      notification.textContent = message
      
      document.body.appendChild(notification)
      
      // Remove notification after 5 seconds
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 5000)
    }
    
    return appError
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const executeWithNotification = useCallback(async <T>(
    apiCall: () => Promise<T>,
    context?: string
  ): Promise<T | null> => {
    try {
      setIsLoading(true)
      clearError()
      const result = await apiCall()
      return result
    } catch (error: any) {
      handleError(error, context)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [handleError, clearError])

  const getErrorMessage = useCallback((error: AppError) => {
    return errorHandler.getErrorMessage(error)
  }, [])

  return {
    error,
    isLoading,
    handleError,
    clearError,
    executeWithNotification,
    getErrorMessage
  }
}

// API error with logging hook
export const useApiErrorWithLogging = () => {
  const [error, setError] = useState<AppError | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleError = useCallback((error: any, context?: string) => {
    const appError = apiErrorInterceptor(error)
    setError(appError)
    
    // Log error
    const errorLog = {
      timestamp: new Date().toISOString(),
      error: {
        message: (appError as any).message,
        code: (appError as any).code,
        status: (appError as any).status,
        details: (appError as any).details
      },
      context,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server',
      url: typeof window !== 'undefined' ? window.location.href : 'Server'
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', errorLog)
    }

    // Here you can add error logging to external services
    // e.g., Sentry, LogRocket, etc.
    
    return appError
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const executeWithLogging = useCallback(async <T>(
    apiCall: () => Promise<T>,
    context?: string
  ): Promise<T | null> => {
    try {
      setIsLoading(true)
      clearError()
      const result = await apiCall()
      return result
    } catch (error: any) {
      handleError(error, context)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [handleError, clearError])

  const getErrorMessage = useCallback((error: AppError) => {
    return errorHandler.getErrorMessage(error)
  }, [])

  return {
    error,
    isLoading,
    handleError,
    clearError,
    executeWithLogging,
    getErrorMessage
  }
}

export default useApiError
