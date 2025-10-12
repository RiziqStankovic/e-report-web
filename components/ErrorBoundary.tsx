'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AppError, errorHandler, ErrorBoundaryProps, ErrorBoundaryState } from '@/lib/error-handler'

// Default error fallback component
const DefaultErrorFallback: React.FC<{ error: AppError; resetError: () => void }> = ({ error, resetError }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="ml-4">
            <h2 className="text-lg font-semibold text-gray-900">Terjadi Kesalahan</h2>
            <p className="text-sm text-gray-600">Aplikasi mengalami masalah yang tidak terduga</p>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-700 mb-2">
            {errorHandler.getErrorMessage(error)}
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-2">
              <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                Detail Error (Development)
              </summary>
              <pre className="mt-2 text-xs text-gray-600 bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(error, null, 2)}
              </pre>
            </details>
          )}
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={resetError}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Coba Lagi
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  )
}

// Error boundary class component
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error: errorHandler.handleError(error)
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to error handler
    const appError = errorHandler.handleError(error, 'ErrorBoundary')
    
    // Call onError callback if provided
    if (this.props.onError) {
      this.props.onError(appError, errorInfo)
    }
    
    // Update state with the error
    this.setState({
      hasError: true,
      error: appError
    })
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null
    })
  }

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // Render custom fallback UI if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />
      }
      
      // Render default fallback UI
      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />
    }

    return this.props.children
  }
}

// Hook for error handling
export const useErrorHandler = () => {
  const handleError = (error: unknown, context?: string) => {
    const appError = errorHandler.handleError(error, context)
    return appError
  }

  const getErrorMessage = (error: AppError) => {
    return errorHandler.getErrorMessage(error)
  }

  const reportError = (error: unknown, context?: string) => {
    errorHandler.handleError(error, context)
  }

  return {
    handleError,
    getErrorMessage,
    reportError
  }
}

// Error boundary wrapper component
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error: AppError; resetError: () => void }>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

// Error page component
export const ErrorPage: React.FC<{ error: AppError; resetError: () => void }> = ({ error, resetError }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops! Terjadi Kesalahan</h1>
          <p className="text-gray-600 mb-6">
            {errorHandler.getErrorMessage(error)}
          </p>
          
          <div className="space-y-3">
            <button
              onClick={resetError}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Coba Lagi
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ErrorBoundary
