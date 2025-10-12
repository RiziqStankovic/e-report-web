'use client'

import React, { useState, useEffect } from 'react'
import { AppError, errorHandler } from '@/lib/error-handler'
import { ErrorMessage, ErrorAlert, LoadingError } from './ErrorToast'

interface ErrorHandlerProps {
  error: AppError | Error | null
  onRetry?: () => void
  onClearError?: () => void
  showAlert?: boolean
  showInline?: boolean
  showLoading?: boolean
  className?: string
}

export const ErrorHandler: React.FC<ErrorHandlerProps> = ({
  error,
  onRetry,
  onClearError,
  showAlert = true,
  showInline = false,
  showLoading = false,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (error) {
      setIsVisible(true)
      
      // Auto-hide after 5 seconds for certain error types
      if (error instanceof AppError && 
          (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT_ERROR')) {
        const timer = setTimeout(() => {
          setIsVisible(false)
          onClearError?.()
        }, 5000)

        return () => clearTimeout(timer)
      }
    } else {
      setIsVisible(false)
    }
  }, [error, onClearError])

  if (!error || !isVisible) return null

  const appError = error instanceof AppError ? error : errorHandler.handleError(error)

  if (showLoading) {
    return (
      <div className={className}>
        <LoadingError 
          error={appError} 
          onRetry={onRetry}
        />
      </div>
    )
  }

  if (showAlert) {
    return (
      <div className={className}>
        <ErrorAlert 
          error={appError} 
          onClose={() => {
            setIsVisible(false)
            onClearError?.()
          }} 
        />
      </div>
    )
  }

  if (showInline) {
    return (
      <div className={className}>
        <ErrorMessage error={appError} />
      </div>
    )
  }

  return null
}

// Error handler hook
export const useErrorHandler = () => {
  const [error, setError] = useState<AppError | Error | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const handleError = (error: unknown, context?: string) => {
    const appError = errorHandler.handleError(error, context)
    setError(appError)
    setIsVisible(true)
    return appError
  }

  const clearError = () => {
    setError(null)
    setIsVisible(false)
  }

  const getErrorMessage = (error: AppError) => {
    return errorHandler.getErrorMessage(error)
  }

  const showError = (error: AppError | Error | string) => {
    let appError: AppError
    
    if (typeof error === 'string') {
      appError = new AppError(error, 500, 'CLIENT_ERROR')
    } else if (error instanceof AppError) {
      appError = error
    } else {
      appError = errorHandler.handleError(error)
    }
    
    setError(appError)
    setIsVisible(true)
  }

  const hideError = () => {
    setIsVisible(false)
  }

  return {
    error,
    isVisible,
    handleError,
    clearError,
    getErrorMessage,
    showError,
    hideError
  }
}

// Error handler context
interface ErrorHandlerContextType {
  error: AppError | Error | null
  isVisible: boolean
  handleError: (error: unknown, context?: string) => AppError
  clearError: () => void
  getErrorMessage: (error: AppError) => string
  showError: (error: AppError | Error | string) => void
  hideError: () => void
}

const ErrorHandlerContext = React.createContext<ErrorHandlerContextType | null>(null)

export const ErrorHandlerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const errorHandler = useErrorHandler()

  return (
    <ErrorHandlerContext.Provider value={errorHandler}>
      {children}
    </ErrorHandlerContext.Provider>
  )
}

export const useErrorHandlerContext = () => {
  const context = React.useContext(ErrorHandlerContext)
  if (!context) {
    throw new Error('useErrorHandlerContext must be used within an ErrorHandlerProvider')
  }
  return context
}

// Error handler wrapper component
export const withErrorHandler = <P extends object>(
  Component: React.ComponentType<P>,
  errorHandlerProps?: Partial<ErrorHandlerProps>
) => {
  const WrappedComponent = (props: P) => {
    const { error, clearError } = useErrorHandler()

    return (
      <>
        <Component {...props} />
        <ErrorHandler
          error={error}
          onClearError={clearError}
          {...errorHandlerProps}
        />
      </>
    )
  }

  WrappedComponent.displayName = `withErrorHandler(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

// Error handler for specific error types
export const ErrorHandlerByType: React.FC<{ 
  error: AppError | Error | null;
  onRetry?: () => void;
  onClearError?: () => void;
  className?: string;
}> = ({ error, onRetry, onClearError, className = '' }) => {
  if (!error) return null

  const appError = error instanceof AppError ? error : errorHandler.handleError(error)

  switch (appError.code) {
    case 'NETWORK_ERROR':
    case 'TIMEOUT_ERROR':
      return (
        <div className={className}>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-yellow-800">
                  Koneksi Bermasalah
                </h3>
                <p className="mt-1 text-sm text-yellow-700">
                  {errorHandler.getErrorMessage(appError)}
                </p>
                {onRetry && (
                  <div className="mt-3">
                    <button
                      onClick={onRetry}
                      className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 transition-colors"
                    >
                      Coba Lagi
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )

    case 'AUTHENTICATION_ERROR':
    case 'AUTHORIZATION_ERROR':
      return (
        <div className={className}>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-red-800">
                  Akses Ditolak
                </h3>
                <p className="mt-1 text-sm text-red-700">
                  {errorHandler.getErrorMessage(appError)}
                </p>
                <div className="mt-3">
                  <button
                    onClick={() => window.location.href = '/login'}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                  >
                    Login Ulang
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )

    case 'CORS_ERROR':
      return (
        <div className={className}>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-orange-800">
                  CORS Error
                </h3>
                <p className="mt-1 text-sm text-orange-700">
                  {errorHandler.getErrorMessage(appError)}
                </p>
                <div className="mt-3">
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700 transition-colors"
                  >
                    Refresh Halaman
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )

    default:
      return (
        <div className={className}>
          <ErrorAlert 
            error={appError} 
            onClose={onClearError}
          />
        </div>
      )
  }
}

export default ErrorHandler
