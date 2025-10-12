'use client'

import React, { useState, useEffect } from 'react'
import { AppError, errorHandler } from '@/lib/error-handler'
import { ErrorMessage, ErrorAlert } from './ErrorToast'

interface FormErrorHandlerProps {
  error: AppError | Error | null
  onClearError?: () => void
  showAlert?: boolean
  showInline?: boolean
  className?: string
}

export const FormErrorHandler: React.FC<FormErrorHandlerProps> = ({
  error,
  onClearError,
  showAlert = true,
  showInline = false,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (error) {
      setIsVisible(true)
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClearError?.()
      }, 5000)

      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [error, onClearError])

  if (!error || !isVisible) return null

  if (showAlert) {
    return (
      <div className={className}>
        <ErrorAlert 
          error={error} 
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
        <ErrorMessage error={error} />
      </div>
    )
  }

  return null
}

// Form field error component
export const FormFieldError: React.FC<{ 
  error: AppError | Error | null; 
  className?: string;
}> = ({ error, className = '' }) => {
  if (!error) return null

  const appError = error instanceof AppError ? error : errorHandler.handleError(error)
  const message = errorHandler.getErrorMessage(appError)

  return (
    <div className={`text-red-600 text-sm mt-1 flex items-center ${className}`}>
      <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      {message}
    </div>
  )
}

// Form validation error component
export const FormValidationError: React.FC<{ 
  errors: Record<string, string>; 
  fieldName: string;
  className?: string;
}> = ({ errors, fieldName, className = '' }) => {
  const error = errors[fieldName]
  
  if (!error) return null

  return (
    <div className={`text-red-600 text-sm mt-1 flex items-center ${className}`}>
      <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      {error}
    </div>
  )
}

// Form error summary component
export const FormErrorSummary: React.FC<{ 
  errors: Record<string, string>; 
  className?: string;
}> = ({ errors, className = '' }) => {
  const errorEntries = Object.entries(errors)
  
  if (errorEntries.length === 0) return null

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800 mb-2">
            Terdapat {errorEntries.length} kesalahan yang perlu diperbaiki:
          </h3>
          <ul className="text-sm text-red-700 space-y-1">
            {errorEntries.map(([field, message]) => (
              <li key={field} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{message}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

// Form error hook
export const useFormError = () => {
  const [error, setError] = useState<AppError | Error | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const setFieldError = (field: string, message: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: message
    }))
  }

  const clearFieldError = (field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }

  const clearAllErrors = () => {
    setError(null)
    setErrors({})
  }

  const setFormError = (error: AppError | Error) => {
    setError(error)
  }

  const hasErrors = Object.keys(errors).length > 0 || error !== null

  const getFieldError = (field: string) => {
    return errors[field] || null
  }

  return {
    error,
    errors,
    setError: setFormError,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    hasErrors,
    getFieldError
  }
}

// Form error context
interface FormErrorContextType {
  error: AppError | Error | null
  errors: Record<string, string>
  setError: (error: AppError | Error) => void
  setFieldError: (field: string, message: string) => void
  clearFieldError: (field: string) => void
  clearAllErrors: () => void
  hasErrors: boolean
  getFieldError: (field: string) => string | null
}

const FormErrorContext = React.createContext<FormErrorContextType | null>(null)

export const FormErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const formError = useFormError()

  return (
    <FormErrorContext.Provider value={formError}>
      {children}
    </FormErrorContext.Provider>
  )
}

export const useFormErrorContext = () => {
  const context = React.useContext(FormErrorContext)
  if (!context) {
    throw new Error('useFormErrorContext must be used within a FormErrorProvider')
  }
  return context
}

export default FormErrorHandler
