// Error handling utilities for e-report-web

export interface ApiError {
  message: string
  status?: number
  code?: string
  details?: Record<string, unknown>
}

export class AppError extends Error {
  public status: number
  public code: string
  public details: Record<string, unknown>

  constructor(message: string, status: number = 500, code: string = 'INTERNAL_ERROR', details: Record<string, unknown> | null = null) {
    super(message)
    this.name = 'AppError'
    this.status = status
    this.code = code
    this.details = details || {}
  }
}

// Error types
export const ERROR_TYPES = {
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  CONNECTION_ERROR: 'CONNECTION_ERROR',
  
  // API errors
  API_ERROR: 'API_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  
  // CORS errors
  CORS_ERROR: 'CORS_ERROR',
  CORS_ORIGIN_ERROR: 'CORS_ORIGIN_ERROR',
  CORS_METHOD_ERROR: 'CORS_METHOD_ERROR',
  CORS_HEADER_ERROR: 'CORS_HEADER_ERROR',
  
  // Client errors
  CLIENT_ERROR: 'CLIENT_ERROR',
  VALIDATION_CLIENT_ERROR: 'VALIDATION_CLIENT_ERROR',
  FORM_ERROR: 'FORM_ERROR',
  
  // System errors
  SYSTEM_ERROR: 'SYSTEM_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const

export type ErrorType = keyof typeof ERROR_TYPES

// Error handler class
export class ErrorHandler {
  private static instance: ErrorHandler
  private errorLog: Array<{ timestamp: Date; error: unknown; context?: string }> = []

  private constructor() {}

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
  }

  // Handle different types of errors
  public handleError(error: unknown, context?: string): AppError {
    const timestamp = new Date()
    
    // Log error
    this.errorLog.push({ timestamp, error, context })
    
    // Determine error type and create appropriate AppError
    if (error instanceof AppError) {
      return error
    }

    // Network errors
    if ((error as { code?: string }).code === 'ERR_NETWORK' || 
        (error as { message?: string }).message?.includes('Network Error')) {
      return new AppError(
        'Network connection failed. Please check your internet connection.',
        (error as { status?: number }).status || 0,
        ERROR_TYPES.NETWORK_ERROR,
        { originalError: error, context }
      )
    }

    // Timeout errors
    if ((error as { code?: string }).code === 'ECONNABORTED' || 
        (error as { message?: string }).message?.includes('timeout')) {
      return new AppError(
        'Request timeout. Please try again.',
        (error as { status?: number }).status || 408,
        ERROR_TYPES.TIMEOUT_ERROR,
        { originalError: error, context }
      )
    }

    // CORS errors
    if ((error as { message?: string }).message?.includes('CORS') || 
        (error as { message?: string }).message?.includes('cross-origin')) {
      return new AppError(
        'Cross-origin request blocked. Please check CORS configuration.',
        (error as { status?: number }).status || 403,
        ERROR_TYPES.CORS_ERROR,
        { originalError: error, context }
      )
    }

    // API errors
    if (error && typeof error === 'object' && 'response' in error && error.response) {
      const status = (error as { response: { status: number; data?: { message?: string } } }).response.status
      const message = (error as { response: { data?: { message?: string } } }).response.data?.message || 
                     (error as { message?: string }).message || 'API request failed'
      
      switch (status) {
        case 400:
          return new AppError(
            message,
            status,
            ERROR_TYPES.VALIDATION_ERROR,
            { originalError: error, context, response: (error as { response: { data?: unknown } }).response.data }
          )
        case 401:
          return new AppError(
            'Authentication required. Please log in.',
            status,
            ERROR_TYPES.AUTHENTICATION_ERROR,
            { originalError: error, context, response: (error as { response: { data?: unknown } }).response.data }
          )
        case 403:
          return new AppError(
            'Access denied. You do not have permission to perform this action.',
            status,
            ERROR_TYPES.AUTHORIZATION_ERROR,
            { originalError: error, context, response: (error as { response: { data?: unknown } }).response.data }
          )
        case 404:
          return new AppError(
            'Resource not found.',
            status,
            ERROR_TYPES.NOT_FOUND_ERROR,
            { originalError: error, context, response: (error as { response: { data?: unknown } }).response.data }
          )
        case 500:
        case 502:
        case 503:
        case 504:
          return new AppError(
            'Server error. Please try again later.',
            status,
            ERROR_TYPES.SERVER_ERROR,
            { originalError: error, context, response: (error as { response: { data?: unknown } }).response.data }
          )
        default:
          return new AppError(
            message,
            status,
            ERROR_TYPES.API_ERROR,
            { originalError: error, context, response: (error as { response: { data?: unknown } }).response.data }
          )
      }
    }

    // Client errors
    if ((error as { name?: string }).name === 'ValidationError' || 
        (error as { message?: string }).message?.includes('validation')) {
      return new AppError(
        (error as { message?: string }).message || 'Validation failed',
        400,
        ERROR_TYPES.VALIDATION_CLIENT_ERROR,
        { originalError: error, context }
      )
    }

    // Unknown errors
    return new AppError(
      (error as { message?: string }).message || 'An unexpected error occurred',
      (error as { status?: number }).status || 500,
      ERROR_TYPES.UNKNOWN_ERROR,
      { originalError: error, context }
    )
  }

  // Get error message for display
  public getErrorMessage(error: AppError): string {
    switch (error.code) {
      case ERROR_TYPES.NETWORK_ERROR:
        return 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'
      case ERROR_TYPES.TIMEOUT_ERROR:
        return 'Permintaan timeout. Silakan coba lagi.'
      case ERROR_TYPES.CORS_ERROR:
        return 'Permintaan cross-origin diblokir. Silakan refresh halaman.'
      case ERROR_TYPES.AUTHENTICATION_ERROR:
        return 'Sesi Anda telah berakhir. Silakan login kembali.'
      case ERROR_TYPES.AUTHORIZATION_ERROR:
        return 'Anda tidak memiliki izin untuk melakukan tindakan ini.'
      case ERROR_TYPES.NOT_FOUND_ERROR:
        return 'Data yang diminta tidak ditemukan.'
      case ERROR_TYPES.SERVER_ERROR:
        return 'Terjadi kesalahan server. Silakan coba lagi nanti.'
      case ERROR_TYPES.VALIDATION_ERROR:
        return error.message || 'Data yang dimasukkan tidak valid.'
      case ERROR_TYPES.VALIDATION_CLIENT_ERROR:
        return error.message || 'Data yang dimasukkan tidak valid.'
      default:
        return error.message || 'Terjadi kesalahan yang tidak terduga.'
    }
  }

  // Get error log
  public getErrorLog(): Array<{ timestamp: Date; error: unknown; context?: string }> {
    return [...this.errorLog]
  }

  // Clear error log
  public clearErrorLog(): void {
    this.errorLog = []
  }

  // Get error count
  public getErrorCount(): number {
    return this.errorLog.length
  }

  // Get recent errors
  public getRecentErrors(count: number = 10): Array<{ timestamp: Date; error: unknown; context?: string }> {
    return this.errorLog.slice(-count)
  }
}

// Global error handler instance
export const errorHandler = ErrorHandler.getInstance()

// Error boundary component props
export interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: AppError; resetError: () => void }>
  onError?: (error: AppError, errorInfo: unknown) => void
}

// Error boundary state
export interface ErrorBoundaryState {
  hasError: boolean
  error: AppError | null
}

// Utility functions
export const isApiError = (error: unknown): error is AppError => {
  return error instanceof AppError
}

export const isNetworkError = (error: unknown): boolean => {
  return (error as { code?: string }).code === ERROR_TYPES.NETWORK_ERROR || 
         (error as { code?: string }).code === ERROR_TYPES.TIMEOUT_ERROR
}

export const isCorsError = (error: unknown): boolean => {
  return (error as { code?: string }).code === ERROR_TYPES.CORS_ERROR
}

export const isAuthError = (error: unknown): boolean => {
  return (error as { code?: string }).code === ERROR_TYPES.AUTHENTICATION_ERROR || 
         (error as { code?: string }).code === ERROR_TYPES.AUTHORIZATION_ERROR
}

export const isValidationError = (error: unknown): boolean => {
  return (error as { code?: string }).code === ERROR_TYPES.VALIDATION_ERROR || 
         (error as { code?: string }).code === ERROR_TYPES.VALIDATION_CLIENT_ERROR
}

// Error reporting
export const reportError = (error: unknown, context?: string): void => {
  const appError = errorHandler.handleError(error, context)
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error reported:', appError)
  }
  
  // Here you can add error reporting to external services
  // e.g., Sentry, LogRocket, etc.
}

// Error recovery
export const recoverFromError = (error: AppError): boolean => {
  // Determine if error is recoverable
  switch (error.code) {
    case ERROR_TYPES.NETWORK_ERROR:
    case ERROR_TYPES.TIMEOUT_ERROR:
    case ERROR_TYPES.SERVER_ERROR:
      return true
    case ERROR_TYPES.AUTHENTICATION_ERROR:
      // Redirect to login
      if (typeof window !== 'undefined') {
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
