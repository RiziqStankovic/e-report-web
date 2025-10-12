// API error handling utilities for e-report-web

import { AppError, errorHandler, ERROR_TYPES } from './error-handler'

// API error response interface
export interface ApiErrorResponse {
  message: string
  code?: string
  details?: Record<string, unknown>
  status: number
}

// Enhanced API request function with error handling
export const apiRequestWithErrorHandling = async <T = unknown>(
  requestFn: () => Promise<T>,
  context?: string
): Promise<T> => {
  try {
    return await requestFn()
  } catch (error: unknown) {
    // Add context to error
    const errorWithContext = {
      ...(error as Record<string, unknown>),
      context: context || 'API Request'
    }
    
    // Handle error using error handler
    const appError = errorHandler.handleError(errorWithContext, context)
    
    // Throw the processed error
    throw appError
  }
}

// API error interceptor for axios
export const apiErrorInterceptor = (error: unknown) => {
  // Check if it's a CORS error
  if (error && typeof error === 'object' && 'code' in error && error.code === 'ERR_NETWORK' && 
      'message' in error && typeof error.message === 'string' && error.message.includes('CORS')) {
    const corsError = new AppError(
      'Cross-origin request blocked. Please check CORS configuration.',
      403,
      ERROR_TYPES.CORS_ERROR,
      { originalError: error }
    )
    throw corsError
  }

  // Check if it's a network error
  if (error && typeof error === 'object' && 'code' in error && error.code === 'ERR_NETWORK') {
    const networkError = new AppError(
      'Network connection failed. Please check your internet connection.',
      0,
      ERROR_TYPES.NETWORK_ERROR,
      { originalError: error }
    )
    throw networkError
  }

  // Check if it's a timeout error
  if (error && typeof error === 'object' && 'code' in error && error.code === 'ECONNABORTED') {
    const timeoutError = new AppError(
      'Request timeout. Please try again.',
      408,
      ERROR_TYPES.TIMEOUT_ERROR,
      { originalError: error }
    )
    throw timeoutError
  }

  // Handle API response errors
  if (error && typeof error === 'object' && 'response' in error && error.response) {
    const { status, data } = (error as { response: { status: number; data: { message?: string } } }).response
    const message = data?.message || (error as { message?: string }).message || 'API request failed'
    
    switch (status) {
      case 400:
        throw new AppError(
          message,
          status,
          ERROR_TYPES.VALIDATION_ERROR,
          { originalError: error, response: data }
        )
      case 401:
        throw new AppError(
          'Authentication required. Please log in.',
          status,
          ERROR_TYPES.AUTHENTICATION_ERROR,
          { originalError: error, response: data }
        )
      case 403:
        throw new AppError(
          'Access denied. You do not have permission to perform this action.',
          status,
          ERROR_TYPES.AUTHORIZATION_ERROR,
          { originalError: error, response: data }
        )
      case 404:
        throw new AppError(
          'Resource not found.',
          status,
          ERROR_TYPES.NOT_FOUND_ERROR,
          { originalError: error, response: data }
        )
      case 422:
        throw new AppError(
          message,
          status,
          ERROR_TYPES.VALIDATION_ERROR,
          { originalError: error, response: data }
        )
      case 500:
      case 502:
      case 503:
      case 504:
        throw new AppError(
          'Server error. Please try again later.',
          status,
          ERROR_TYPES.SERVER_ERROR,
          { originalError: error, response: data }
        )
      default:
        throw new AppError(
          message,
          status,
          ERROR_TYPES.API_ERROR,
          { originalError: error, response: data }
        )
    }
  }

  // Handle network errors
  if (error && typeof error === 'object' && 'code' in error && 
      (error.code === 'NETWORK_ERROR' || error.code === 'ECONNABORTED' || !('response' in error))) {
    throw new AppError(
      'Network connection failed. Please check your internet connection.',
      0,
      ERROR_TYPES.NETWORK_ERROR,
      { originalError: error }
    )
  }

  // Handle other errors
  throw new AppError(
    (error as { message?: string }).message || 'An unexpected error occurred',
    (error as { status?: number }).status || 500,
    ERROR_TYPES.UNKNOWN_ERROR,
    { originalError: error }
  )
}

// Retry mechanism for failed requests
export const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: unknown

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn()
    } catch (error: unknown) {
      lastError = error
      
      // Don't retry for certain error types
      if ((error as { code?: string }).code === ERROR_TYPES.AUTHENTICATION_ERROR || 
          (error as { code?: string }).code === ERROR_TYPES.AUTHORIZATION_ERROR ||
          (error as { code?: string }).code === ERROR_TYPES.NOT_FOUND_ERROR ||
          (error as { code?: string }).code === ERROR_TYPES.VALIDATION_ERROR) {
        throw error
      }
      
      // Wait before retrying
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
      }
    }
  }

  throw lastError
}

// Error recovery strategies
export const recoverFromApiError = (error: AppError): boolean => {
  switch (error.code) {
    case ERROR_TYPES.NETWORK_ERROR:
    case ERROR_TYPES.TIMEOUT_ERROR:
    case ERROR_TYPES.SERVER_ERROR:
      return true
    case ERROR_TYPES.AUTHENTICATION_ERROR:
      // Clear auth data and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('e-report-token')
        localStorage.removeItem('e-report-user')
        window.location.href = '/login'
      }
      return false
    case ERROR_TYPES.CORS_ERROR:
      // Refresh page
      if (typeof window !== 'undefined') {
        window.location.reload()
      }
      return false
    default:
      return false
  }
}

// API error logging
export const logApiError = (error: AppError, context?: string) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    error: {
      message: error.message,
      code: error.code,
      status: error.status,
      details: error.details
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
}

// API error notification
export const notifyApiError = (error: AppError) => {
  // Show toast notification
  if (typeof window !== 'undefined') {
    // You can use react-hot-toast or any other notification library
    const message = errorHandler.getErrorMessage(error)
    
    // Create a simple notification
    const notification = document.createElement('div')
    notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
    notification.textContent = message
    
    document.body.appendChild(notification)
    
    // Remove notification after 5 seconds
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 5000)
  }
}

// API error handler hook
export const useApiErrorHandler = () => {
  const handleApiError = (error: unknown, context?: string) => {
    const appError = apiErrorInterceptor(error)
    logApiError(appError, context)
    notifyApiError(appError)
    return appError
  }

  const handleApiErrorWithRetry = async <T>(
    requestFn: () => Promise<T>,
    context?: string,
    maxRetries: number = 3
  ) => {
    try {
      return await retryRequest(requestFn, maxRetries)
    } catch (error: unknown) {
      const appError = handleApiError(error, context)
      throw appError
    }
  }

  return {
    handleApiError,
    handleApiErrorWithRetry
  }
}

// API error boundary for specific API calls
export const withApiErrorHandling = <T extends unknown[], R>(
  apiFunction: (...args: T) => Promise<R>,
  context?: string
) => {
  return async (...args: T): Promise<R> => {
    try {
      return await apiFunction(...args)
    } catch (error: unknown) {
      const appError = apiErrorInterceptor(error)
      logApiError(appError, context)
      notifyApiError(appError)
      throw appError
    }
  }
}

// Error recovery hook
export const useErrorRecovery = () => {
  const recoverFromError = (error: AppError) => {
    const canRecover = recoverFromApiError(error)
    
    if (canRecover) {
      // Implement recovery logic here
      // e.g., retry request, show retry button, etc.
      return true
    }
    
    return false
  }

  return {
    recoverFromError
  }
}
