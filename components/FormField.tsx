'use client'

import React from 'react'
import { Input } from '@/components/ui/Input'

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string | null
  helperText?: string
  required?: boolean
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  helperText,
  required = false,
  className,
  ...props
}) => {
  return (
    <div className="space-y-2">
      <Input
        label={label}
        error={error || undefined}
        helperText={helperText}
        required={required}
        className={className}
        {...props}
      />
      {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
    </div>
  )
}

// Form field with validation
export const ValidatedFormField: React.FC<FormFieldProps & {
  validation?: {
    required?: boolean | string
    minLength?: { value: number; message: string }
    maxLength?: { value: number; message: string }
    pattern?: { value: RegExp; message: string }
    validate?: (value: unknown) => string | boolean
  }
}> = ({
  label,
  error,
  helperText,
  required = false,
  validation,
  className,
  ...props
}) => {
  const [fieldError, setFieldError] = React.useState<string>('')

  const validateField = (value: string) => {
    if (!validation) return

    // Required validation
    if (validation.required && !value) {
      const message = typeof validation.required === 'string' 
        ? validation.required 
        : `${label} wajib diisi`
      setFieldError(message)
      return false
    }

    // Min length validation
    if (validation.minLength && value.length < validation.minLength.value) {
      setFieldError(validation.minLength.message)
      return false
    }

    // Max length validation
    if (validation.maxLength && value.length > validation.maxLength.value) {
      setFieldError(validation.maxLength.message)
      return false
    }

    // Pattern validation
    if (validation.pattern && !validation.pattern.value.test(value)) {
      setFieldError(validation.pattern.message)
      return false
    }

    // Custom validation
    if (validation.validate) {
      const result = validation.validate(value)
      if (typeof result === 'string') {
        setFieldError(result)
        return false
      }
    }

    setFieldError('')
    return true
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.onChange) {
      props.onChange(e)
    }
    validateField(e.target.value)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (props.onBlur) {
      props.onBlur(e)
    }
    validateField(e.target.value)
  }

  return (
    <div className="space-y-2">
      <Input
        label={label}
        error={error || fieldError}
        helperText={helperText}
        required={required}
        className={className}
        onChange={handleChange}
        onBlur={handleBlur}
        {...props}
      />
      {(error || fieldError) && <div className="text-red-600 text-sm mt-1">{error || fieldError}</div>}
    </div>
  )
}

// Form field with icon
export const IconFormField: React.FC<FormFieldProps & {
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}> = ({
  label,
  error,
  helperText,
  required = false,
  icon,
  iconPosition = 'left',
  className,
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-semibold text-gray-800 block mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          className={`
            flex h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 transition-colors
            ${icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${className || ''}
          `}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
      </div>
      {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
      {helperText && !error && (
        <p className="text-sm text-gray-600">{helperText}</p>
      )}
    </div>
  )
}

// Form field with floating label
export const FloatingLabelField: React.FC<FormFieldProps> = ({
  label,
  error,
  helperText,
  required = false,
  className,
  ...props
}) => {
  const [isFocused, setIsFocused] = React.useState(false)
  const [hasValue, setHasValue] = React.useState(false)

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    if (props.onFocus) {
      props.onFocus(e)
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    setHasValue(e.target.value.length > 0)
    if (props.onBlur) {
      props.onBlur(e)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0)
    if (props.onChange) {
      props.onChange(e)
    }
  }

  const isLabelFloating = isFocused || hasValue

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          className={`
            peer w-full h-12 px-4 pt-6 pb-2 text-base text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${className || ''}
          `}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />
        <label
          className={`
            absolute left-4 transition-all duration-200 pointer-events-none
            ${isLabelFloating 
              ? 'top-2 text-xs text-blue-600 font-medium' 
              : 'top-1/2 -translate-y-1/2 text-base text-gray-500'
            }
          `}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
      {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
      {helperText && !error && (
        <p className="text-sm text-gray-600">{helperText}</p>
      )}
    </div>
  )
}

export default FormField