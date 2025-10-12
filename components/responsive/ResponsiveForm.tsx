'use client'

import React, { useState } from 'react'
import { useMobile } from '@/hooks/useMobile'
import { getResponsiveValue } from '@/lib/breakpoints'

interface ResponsiveFormProps {
  children: React.ReactNode
  onSubmit?: (e: React.FormEvent) => void
  className?: string
  padding?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  margin?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  backgroundColor?: string
  borderRadius?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  boxShadow?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', string>>
  border?: string
  width?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number | string>>
  maxWidth?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number | string>>
  minWidth?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number | string>>
}

export function ResponsiveForm({
  children,
  onSubmit,
  className = '',
  padding,
  margin,
  backgroundColor,
  borderRadius,
  boxShadow,
  border,
  width,
  maxWidth,
  minWidth
}: ResponsiveFormProps) {
  const { viewportSize } = useMobile()

  const responsivePadding = padding ? getResponsiveValue(padding, viewportSize.width) : undefined
  const responsiveMargin = margin ? getResponsiveValue(margin, viewportSize.width) : undefined
  const responsiveBorderRadius = borderRadius ? getResponsiveValue(borderRadius, viewportSize.width) : undefined
  const responsiveBoxShadow = boxShadow ? getResponsiveValue(boxShadow, viewportSize.width) : undefined
  const responsiveWidth = width ? getResponsiveValue(width, viewportSize.width) : undefined
  const responsiveMaxWidth = maxWidth ? getResponsiveValue(maxWidth, viewportSize.width) : undefined
  const responsiveMinWidth = minWidth ? getResponsiveValue(minWidth, viewportSize.width) : undefined

  const style: React.CSSProperties = {
    ...(responsivePadding && { padding: `${responsivePadding}px` }),
    ...(responsiveMargin && { margin: `${responsiveMargin}px` }),
    ...(backgroundColor && { backgroundColor }),
    ...(responsiveBorderRadius && { borderRadius: `${responsiveBorderRadius}px` }),
    ...(responsiveBoxShadow && { boxShadow: responsiveBoxShadow }),
    ...(border && { border }),
    ...(responsiveWidth && { width: typeof responsiveWidth === 'number' ? `${responsiveWidth}px` : responsiveWidth }),
    ...(responsiveMaxWidth && { maxWidth: typeof responsiveMaxWidth === 'number' ? `${responsiveMaxWidth}px` : responsiveMaxWidth }),
    ...(responsiveMinWidth && { minWidth: typeof responsiveMinWidth === 'number' ? `${responsiveMinWidth}px` : responsiveMinWidth })
  }

  return (
    <form className={className} onSubmit={onSubmit} style={style}>
      {children}
    </form>
  )
}

interface ResponsiveInputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  className?: string
  label?: string
  error?: string
  required?: boolean
  disabled?: boolean
  autoComplete?: string
  autoFocus?: boolean
  maxLength?: number
  minLength?: number
  pattern?: string
  size?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  padding?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  margin?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  fontSize?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  borderRadius?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  borderColor?: string
  focusBorderColor?: string
  errorBorderColor?: string
  backgroundColor?: string
  textColor?: string
  placeholderColor?: string
  width?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number | string>>
  maxWidth?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number | string>>
  minWidth?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number | string>>
}

export function ResponsiveInput({
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  className = '',
  label,
  error,
  required = false,
  disabled = false,
  autoComplete,
  autoFocus = false,
  maxLength,
  minLength,
  pattern,
  size,
  padding,
  margin,
  fontSize,
  borderRadius,
  borderColor = '#d1d5db',
  focusBorderColor = '#3b82f6',
  errorBorderColor = '#ef4444',
  backgroundColor = '#ffffff',
  textColor = '#111827',
  width,
  maxWidth,
  minWidth
}: ResponsiveInputProps) {
  const { viewportSize } = useMobile()
  const [isFocused, setIsFocused] = useState(false)

  const responsiveSize = size ? getResponsiveValue(size, viewportSize.width) : undefined
  const responsivePadding = padding ? getResponsiveValue(padding, viewportSize.width) : undefined
  const responsiveMargin = margin ? getResponsiveValue(margin, viewportSize.width) : undefined
  const responsiveFontSize = fontSize ? getResponsiveValue(fontSize, viewportSize.width) : undefined
  const responsiveBorderRadius = borderRadius ? getResponsiveValue(borderRadius, viewportSize.width) : undefined
  const responsiveWidth = width ? getResponsiveValue(width, viewportSize.width) : undefined
  const responsiveMaxWidth = maxWidth ? getResponsiveValue(maxWidth, viewportSize.width) : undefined
  const responsiveMinWidth = minWidth ? getResponsiveValue(minWidth, viewportSize.width) : undefined

  const inputStyle: React.CSSProperties = {
    ...(responsiveSize && { height: `${responsiveSize}px` }),
    ...(responsivePadding && { padding: `${responsivePadding}px` }),
    ...(responsiveMargin && { margin: `${responsiveMargin}px` }),
    ...(responsiveFontSize && { fontSize: `${responsiveFontSize}px` }),
    ...(responsiveBorderRadius && { borderRadius: `${responsiveBorderRadius}px` }),
    borderColor: error ? errorBorderColor : isFocused ? focusBorderColor : borderColor,
    backgroundColor,
    color: textColor,
    ...(responsiveWidth && { width: typeof responsiveWidth === 'number' ? `${responsiveWidth}px` : responsiveWidth }),
    ...(responsiveMaxWidth && { maxWidth: typeof responsiveMaxWidth === 'number' ? `${responsiveMaxWidth}px` : responsiveMaxWidth }),
    ...(responsiveMinWidth && { minWidth: typeof responsiveMinWidth === 'number' ? `${responsiveMinWidth}px` : responsiveMinWidth })
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    onFocus?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    onBlur?.(e)
  }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${className}`}
        style={inputStyle}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        maxLength={maxLength}
        minLength={minLength}
        pattern={pattern}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

interface ResponsiveTextareaProps {
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void
  className?: string
  label?: string
  error?: string
  required?: boolean
  disabled?: boolean
  autoFocus?: boolean
  maxLength?: number
  minLength?: number
  rows?: number
  cols?: number
  resize?: 'none' | 'both' | 'horizontal' | 'vertical'
  padding?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  margin?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  fontSize?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  borderRadius?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  borderColor?: string
  focusBorderColor?: string
  errorBorderColor?: string
  backgroundColor?: string
  textColor?: string
  placeholderColor?: string
  width?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number | string>>
  maxWidth?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number | string>>
  minWidth?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number | string>>
  height?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number | string>>
  minHeight?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number | string>>
  maxHeight?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number | string>>
}

export function ResponsiveTextarea({
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  className = '',
  label,
  error,
  required = false,
  disabled = false,
  autoFocus = false,
  maxLength,
  minLength,
  rows = 4,
  cols,
  resize = 'vertical',
  padding,
  margin,
  fontSize,
  borderRadius,
  borderColor = '#d1d5db',
  focusBorderColor = '#3b82f6',
  errorBorderColor = '#ef4444',
  backgroundColor = '#ffffff',
  textColor = '#111827',
  width,
  maxWidth,
  minWidth,
  height,
  minHeight,
  maxHeight
}: ResponsiveTextareaProps) {
  const { viewportSize } = useMobile()
  const [isFocused, setIsFocused] = useState(false)

  const responsivePadding = padding ? getResponsiveValue(padding, viewportSize.width) : undefined
  const responsiveMargin = margin ? getResponsiveValue(margin, viewportSize.width) : undefined
  const responsiveFontSize = fontSize ? getResponsiveValue(fontSize, viewportSize.width) : undefined
  const responsiveBorderRadius = borderRadius ? getResponsiveValue(borderRadius, viewportSize.width) : undefined
  const responsiveWidth = width ? getResponsiveValue(width, viewportSize.width) : undefined
  const responsiveMaxWidth = maxWidth ? getResponsiveValue(maxWidth, viewportSize.width) : undefined
  const responsiveMinWidth = minWidth ? getResponsiveValue(minWidth, viewportSize.width) : undefined
  const responsiveHeight = height ? getResponsiveValue(height, viewportSize.width) : undefined
  const responsiveMinHeight = minHeight ? getResponsiveValue(minHeight, viewportSize.width) : undefined
  const responsiveMaxHeight = maxHeight ? getResponsiveValue(maxHeight, viewportSize.width) : undefined

  const textareaStyle: React.CSSProperties = {
    ...(responsivePadding && { padding: `${responsivePadding}px` }),
    ...(responsiveMargin && { margin: `${responsiveMargin}px` }),
    ...(responsiveFontSize && { fontSize: `${responsiveFontSize}px` }),
    ...(responsiveBorderRadius && { borderRadius: `${responsiveBorderRadius}px` }),
    borderColor: error ? errorBorderColor : isFocused ? focusBorderColor : borderColor,
    backgroundColor,
    color: textColor,
    resize,
    ...(responsiveWidth && { width: typeof responsiveWidth === 'number' ? `${responsiveWidth}px` : responsiveWidth }),
    ...(responsiveMaxWidth && { maxWidth: typeof responsiveMaxWidth === 'number' ? `${responsiveMaxWidth}px` : responsiveMaxWidth }),
    ...(responsiveMinWidth && { minWidth: typeof responsiveMinWidth === 'number' ? `${responsiveMinWidth}px` : responsiveMinWidth }),
    ...(responsiveHeight && { height: typeof responsiveHeight === 'number' ? `${responsiveHeight}px` : responsiveHeight }),
    ...(responsiveMinHeight && { minHeight: typeof responsiveMinHeight === 'number' ? `${responsiveMinHeight}px` : responsiveMinHeight }),
    ...(responsiveMaxHeight && { maxHeight: typeof responsiveMaxHeight === 'number' ? `${responsiveMaxHeight}px` : responsiveMaxHeight })
  }

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true)
    onFocus?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false)
    onBlur?.(e)
  }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${className}`}
        style={textareaStyle}
        required={required}
        disabled={disabled}
        autoFocus={autoFocus}
        maxLength={maxLength}
        minLength={minLength}
        rows={rows}
        cols={cols}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

interface ResponsiveSelectProps {
  options: Array<{
    value: string
    label: string
    disabled?: boolean
  }>
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void
  onFocus?: (e: React.FocusEvent<HTMLSelectElement>) => void
  className?: string
  label?: string
  error?: string
  required?: boolean
  disabled?: boolean
  autoFocus?: boolean
  placeholder?: string
  padding?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  margin?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  fontSize?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  borderRadius?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  borderColor?: string
  focusBorderColor?: string
  errorBorderColor?: string
  backgroundColor?: string
  textColor?: string
  width?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number | string>>
  maxWidth?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number | string>>
  minWidth?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number | string>>
}

export function ResponsiveSelect({
  options,
  value,
  onChange,
  onBlur,
  onFocus,
  className = '',
  label,
  error,
  required = false,
  disabled = false,
  autoFocus = false,
  placeholder,
  padding,
  margin,
  fontSize,
  borderRadius,
  borderColor = '#d1d5db',
  focusBorderColor = '#3b82f6',
  errorBorderColor = '#ef4444',
  backgroundColor = '#ffffff',
  textColor = '#111827',
  width,
  maxWidth,
  minWidth
}: ResponsiveSelectProps) {
  const { viewportSize } = useMobile()
  const [isFocused, setIsFocused] = useState(false)

  const responsivePadding = padding ? getResponsiveValue(padding, viewportSize.width) : undefined
  const responsiveMargin = margin ? getResponsiveValue(margin, viewportSize.width) : undefined
  const responsiveFontSize = fontSize ? getResponsiveValue(fontSize, viewportSize.width) : undefined
  const responsiveBorderRadius = borderRadius ? getResponsiveValue(borderRadius, viewportSize.width) : undefined
  const responsiveWidth = width ? getResponsiveValue(width, viewportSize.width) : undefined
  const responsiveMaxWidth = maxWidth ? getResponsiveValue(maxWidth, viewportSize.width) : undefined
  const responsiveMinWidth = minWidth ? getResponsiveValue(minWidth, viewportSize.width) : undefined

  const selectStyle: React.CSSProperties = {
    ...(responsivePadding && { padding: `${responsivePadding}px` }),
    ...(responsiveMargin && { margin: `${responsiveMargin}px` }),
    ...(responsiveFontSize && { fontSize: `${responsiveFontSize}px` }),
    ...(responsiveBorderRadius && { borderRadius: `${responsiveBorderRadius}px` }),
    borderColor: error ? errorBorderColor : isFocused ? focusBorderColor : borderColor,
    backgroundColor,
    color: textColor,
    ...(responsiveWidth && { width: typeof responsiveWidth === 'number' ? `${responsiveWidth}px` : responsiveWidth }),
    ...(responsiveMaxWidth && { maxWidth: typeof responsiveMaxWidth === 'number' ? `${responsiveMaxWidth}px` : responsiveMaxWidth }),
    ...(responsiveMinWidth && { minWidth: typeof responsiveMinWidth === 'number' ? `${responsiveMinWidth}px` : responsiveMinWidth })
  }

  const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
    setIsFocused(true)
    onFocus?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    setIsFocused(false)
    onBlur?.(e)
  }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${className}`}
        style={selectStyle}
        required={required}
        disabled={disabled}
        autoFocus={autoFocus}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option, index) => (
          <option
            key={index}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
