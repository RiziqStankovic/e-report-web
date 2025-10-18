'use client'

import React from 'react'
import Image from 'next/image'
import { useMobile } from '@/hooks/useMobile'
import { getResponsiveValue } from '@/lib/breakpoints'

interface ResponsiveContainerProps {
  children: React.ReactNode
  className?: string
  padding?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  margin?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  maxWidth?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  backgroundColor?: string
  borderRadius?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  boxShadow?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', string>>
}

export function ResponsiveContainer({
  children,
  className = '',
  padding,
  margin,
  maxWidth,
  backgroundColor,
  borderRadius,
  boxShadow
}: ResponsiveContainerProps) {
  const { viewportSize } = useMobile()

  const responsivePadding = padding ? getResponsiveValue(padding, viewportSize.width) : undefined
  const responsiveMargin = margin ? getResponsiveValue(margin, viewportSize.width) : undefined
  const responsiveMaxWidth = maxWidth ? getResponsiveValue(maxWidth, viewportSize.width) : undefined
  const responsiveBorderRadius = borderRadius ? getResponsiveValue(borderRadius, viewportSize.width) : undefined
  const responsiveBoxShadow = boxShadow ? getResponsiveValue(boxShadow, viewportSize.width) : undefined

  const style: React.CSSProperties = {
    ...(responsivePadding && { padding: `${responsivePadding}px` }),
    ...(responsiveMargin && { margin: `${responsiveMargin}px` }),
    ...(responsiveMaxWidth && { maxWidth: `${responsiveMaxWidth}px` }),
    ...(backgroundColor && { backgroundColor }),
    ...(responsiveBorderRadius && { borderRadius: `${responsiveBorderRadius}px` }),
    ...(responsiveBoxShadow && { boxShadow: responsiveBoxShadow })
  }

  return (
    <div className={className} style={style}>
      {children}
    </div>
  )
}

interface ResponsiveGridProps {
  children: React.ReactNode
  className?: string
  columns?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  gap?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  rowGap?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  columnGap?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
}

export function ResponsiveGrid({
  children,
  className = '',
  columns,
  gap,
  rowGap,
  columnGap
}: ResponsiveGridProps) {
  const { viewportSize } = useMobile()

  const responsiveColumns = columns ? getResponsiveValue(columns, viewportSize.width) : undefined
  const responsiveGap = gap ? getResponsiveValue(gap, viewportSize.width) : undefined
  const responsiveRowGap = rowGap ? getResponsiveValue(rowGap, viewportSize.width) : undefined
  const responsiveColumnGap = columnGap ? getResponsiveValue(columnGap, viewportSize.width) : undefined

  const style: React.CSSProperties = {
    display: 'grid',
    ...(responsiveColumns && { gridTemplateColumns: `repeat(${responsiveColumns}, 1fr)` }),
    ...(responsiveGap && { gap: `${responsiveGap}px` }),
    ...(responsiveRowGap && { rowGap: `${responsiveRowGap}px` }),
    ...(responsiveColumnGap && { columnGap: `${responsiveColumnGap}px` })
  }

  return (
    <div className={className} style={style}>
      {children}
    </div>
  )
}

interface ResponsiveTextProps {
  children: React.ReactNode
  className?: string
  fontSize?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  fontWeight?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  lineHeight?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  color?: string
  textAlign?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', 'left' | 'center' | 'right' | 'justify'>>
}

export function ResponsiveText({
  children,
  className = '',
  fontSize,
  fontWeight,
  lineHeight,
  color,
  textAlign
}: ResponsiveTextProps) {
  const { viewportSize } = useMobile()

  const responsiveFontSize = fontSize ? getResponsiveValue(fontSize, viewportSize.width) : undefined
  const responsiveFontWeight = fontWeight ? getResponsiveValue(fontWeight, viewportSize.width) : undefined
  const responsiveLineHeight = lineHeight ? getResponsiveValue(lineHeight, viewportSize.width) : undefined
  const responsiveTextAlign = textAlign ? getResponsiveValue(textAlign, viewportSize.width) : undefined

  const style: React.CSSProperties = {
    ...(responsiveFontSize && { fontSize: `${responsiveFontSize}px` }),
    ...(responsiveFontWeight && { fontWeight: responsiveFontWeight }),
    ...(responsiveLineHeight && { lineHeight: responsiveLineHeight }),
    ...(color && { color }),
    ...(responsiveTextAlign && { textAlign: responsiveTextAlign })
  }

  return (
    <div className={className} style={style}>
      {children}
    </div>
  )
}

interface ResponsiveImageProps {
  src: string
  alt: string
  className?: string
  width?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  height?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  borderRadius?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
}

export function ResponsiveImage({
  src,
  alt,
  className = '',
  width,
  height,
  objectFit = 'cover',
  borderRadius
}: ResponsiveImageProps) {
  const { viewportSize } = useMobile()

  const responsiveWidth = width ? getResponsiveValue(width, viewportSize.width) : undefined
  const responsiveHeight = height ? getResponsiveValue(height, viewportSize.width) : undefined
  const responsiveBorderRadius = borderRadius ? getResponsiveValue(borderRadius, viewportSize.width) : undefined

  const style: React.CSSProperties = {
    ...(responsiveWidth && { width: `${responsiveWidth}px` }),
    ...(responsiveHeight && { height: `${responsiveHeight}px` }),
    objectFit,
    ...(responsiveBorderRadius && { borderRadius: `${responsiveBorderRadius}px` })
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={400}
      height={300}
      unoptimized={true}
      className={className}
      style={style}
    />
  )
}

interface ResponsiveButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  padding?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  fontSize?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  borderRadius?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  backgroundColor?: string
  color?: string
  border?: string
  boxShadow?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', string>>
}

export function ResponsiveButton({
  children,
  className = '',
  onClick,
  disabled = false,
  type = 'button',
  padding,
  fontSize,
  borderRadius,
  backgroundColor,
  color,
  border,
  boxShadow
}: ResponsiveButtonProps) {
  const { viewportSize } = useMobile()

  const responsivePadding = padding ? getResponsiveValue(padding, viewportSize.width) : undefined
  const responsiveFontSize = fontSize ? getResponsiveValue(fontSize, viewportSize.width) : undefined
  const responsiveBorderRadius = borderRadius ? getResponsiveValue(borderRadius, viewportSize.width) : undefined
  const responsiveBoxShadow = boxShadow ? getResponsiveValue(boxShadow, viewportSize.width) : undefined

  const style: React.CSSProperties = {
    ...(responsivePadding && { padding: `${responsivePadding}px` }),
    ...(responsiveFontSize && { fontSize: `${responsiveFontSize}px` }),
    ...(responsiveBorderRadius && { borderRadius: `${responsiveBorderRadius}px` }),
    ...(backgroundColor && { backgroundColor }),
    ...(color && { color }),
    ...(border && { border }),
    ...(responsiveBoxShadow && { boxShadow: responsiveBoxShadow })
  }

  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  )
}
