'use client'

import React, { useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { AppError, errorHandler } from '@/lib/error-handler'

interface ErrorToastProps {
  error: AppError | Error | null
  onClose?: () => void
}

export const ErrorToast: React.FC<ErrorToastProps> = ({ error, onClose }) => {
  useEffect(() => {
    if (error) {
      const appError = error instanceof AppError ? error : errorHandler.handleError(error)
      const message = errorHandler.getErrorMessage(appError)
      
      toast.error(message, {
        duration: 5000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: '#fff',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        },
        icon: '❌'
      })
    }
  }, [error, onClose])

  return null
}

// Error toast hook
export const useErrorToast = () => {
  const showError = (error: AppError | Error | string) => {
    let appError: AppError
    
    if (typeof error === 'string') {
      appError = new AppError(error, 500, 'CLIENT_ERROR')
    } else if (error instanceof AppError) {
      appError = error
    } else {
      appError = errorHandler.handleError(error)
    }
    
    const message = errorHandler.getErrorMessage(appError)
    
    toast.error(message, {
      duration: 5000,
      position: 'top-right',
      style: {
        background: '#EF4444',
        color: '#fff',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      },
      icon: '❌'
    })
  }

  const showSuccess = (message: string) => {
    toast.success(message, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#10B981',
        color: '#fff',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      },
      icon: '✅'
    })
  }

  const showWarning = (message: string) => {
    toast(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#F59E0B',
        color: '#fff',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      },
      icon: '⚠️'
    })
  }

  const showInfo = (message: string) => {
    toast(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#3B82F6',
        color: '#fff',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      },
      icon: 'ℹ️'
    })
  }

  return {
    showError,
    showSuccess,
    showWarning,
    showInfo
  }
}

// Error message component
export const ErrorMessage: React.FC<{ error: AppError | Error | null; className?: string }> = ({ 
  error, 
  className = '' 
}) => {
  if (!error) return null

  const appError = error instanceof AppError ? error : errorHandler.handleError(error)
  const message = errorHandler.getErrorMessage(appError)

  return (
    <div className={`text-red-600 text-sm mt-1 ${className}`}>
      {message}
    </div>
  )
}

// Error alert component
export const ErrorAlert: React.FC<{ 
  error: AppError | Error | null; 
  onClose?: () => void;
  className?: string;
}> = ({ error, onClose, className = '' }) => {
  if (!error) return null

  const appError = error instanceof AppError ? error : errorHandler.handleError(error)
  const message = errorHandler.getErrorMessage(appError)

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            Terjadi Kesalahan
          </h3>
          <p className="mt-1 text-sm text-red-700">
            {message}
          </p>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              onClick={onClose}
              className="inline-flex text-red-400 hover:text-red-600"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Loading error component
export const LoadingError: React.FC<{ 
  error: AppError | Error | null; 
  onRetry?: () => void;
  className?: string;
}> = ({ error, onRetry, className = '' }) => {
  if (!error) return null

  const appError = error instanceof AppError ? error : errorHandler.handleError(error)
  const message = errorHandler.getErrorMessage(appError)

  return (
    <div className={`text-center py-8 ${className}`}>
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Gagal Memuat Data</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Coba Lagi
        </button>
      )}
    </div>
  )
}

export default ErrorToast
