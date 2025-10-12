'use client'

import React from 'react'
import { useMobile } from '@/hooks/useMobile'
import { getResponsiveValue } from '@/lib/breakpoints'

interface ResponsiveLayoutProps {
  children: React.ReactNode
  className?: string
  direction?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', 'row' | 'column'>>
  alignItems?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline'>>
  justifyContent?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'>>
  gap?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  wrap?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', 'nowrap' | 'wrap' | 'wrap-reverse'>>
  padding?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  margin?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  width?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number | string>>
  height?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number | string>>
  maxWidth?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number | string>>
  maxHeight?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number | string>>
  minWidth?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number | string>>
  minHeight?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number | string>>
  backgroundColor?: string
  borderRadius?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  boxShadow?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', string>>
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'
  zIndex?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto'
  overflowX?: 'visible' | 'hidden' | 'scroll' | 'auto'
  overflowY?: 'visible' | 'hidden' | 'scroll' | 'auto'
}

export function ResponsiveLayout({
  children,
  className = '',
  direction,
  alignItems,
  justifyContent,
  gap,
  wrap,
  padding,
  margin,
  width,
  height,
  maxWidth,
  maxHeight,
  minWidth,
  minHeight,
  backgroundColor,
  borderRadius,
  boxShadow,
  position = 'static',
  zIndex,
  overflow,
  overflowX,
  overflowY
}: ResponsiveLayoutProps) {
  const { viewportSize } = useMobile()

  const responsiveDirection = direction ? getResponsiveValue(direction, viewportSize.width) : undefined
  const responsiveAlignItems = alignItems ? getResponsiveValue(alignItems, viewportSize.width) : undefined
  const responsiveJustifyContent = justifyContent ? getResponsiveValue(justifyContent, viewportSize.width) : undefined
  const responsiveGap = gap ? getResponsiveValue(gap, viewportSize.width) : undefined
  const responsiveWrap = wrap ? getResponsiveValue(wrap, viewportSize.width) : undefined
  const responsivePadding = padding ? getResponsiveValue(padding, viewportSize.width) : undefined
  const responsiveMargin = margin ? getResponsiveValue(margin, viewportSize.width) : undefined
  const responsiveWidth = width ? getResponsiveValue(width, viewportSize.width) : undefined
  const responsiveHeight = height ? getResponsiveValue(height, viewportSize.width) : undefined
  const responsiveMaxWidth = maxWidth ? getResponsiveValue(maxWidth, viewportSize.width) : undefined
  const responsiveMaxHeight = maxHeight ? getResponsiveValue(maxHeight, viewportSize.width) : undefined
  const responsiveMinWidth = minWidth ? getResponsiveValue(minWidth, viewportSize.width) : undefined
  const responsiveMinHeight = minHeight ? getResponsiveValue(minHeight, viewportSize.width) : undefined
  const responsiveBorderRadius = borderRadius ? getResponsiveValue(borderRadius, viewportSize.width) : undefined
  const responsiveBoxShadow = boxShadow ? getResponsiveValue(boxShadow, viewportSize.width) : undefined
  const responsiveZIndex = zIndex ? getResponsiveValue(zIndex, viewportSize.width) : undefined

  const style: React.CSSProperties = {
    display: 'flex',
    ...(responsiveDirection && { flexDirection: responsiveDirection }),
    ...(responsiveAlignItems && { alignItems: responsiveAlignItems }),
    ...(responsiveJustifyContent && { justifyContent: responsiveJustifyContent }),
    ...(responsiveGap && { gap: `${responsiveGap}px` }),
    ...(responsiveWrap && { flexWrap: responsiveWrap }),
    ...(responsivePadding && { padding: `${responsivePadding}px` }),
    ...(responsiveMargin && { margin: `${responsiveMargin}px` }),
    ...(responsiveWidth && { width: typeof responsiveWidth === 'number' ? `${responsiveWidth}px` : responsiveWidth }),
    ...(responsiveHeight && { height: typeof responsiveHeight === 'number' ? `${responsiveHeight}px` : responsiveHeight }),
    ...(responsiveMaxWidth && { maxWidth: typeof responsiveMaxWidth === 'number' ? `${responsiveMaxWidth}px` : responsiveMaxWidth }),
    ...(responsiveMaxHeight && { maxHeight: typeof responsiveMaxHeight === 'number' ? `${responsiveMaxHeight}px` : responsiveMaxHeight }),
    ...(responsiveMinWidth && { minWidth: typeof responsiveMinWidth === 'number' ? `${responsiveMinWidth}px` : responsiveMinWidth }),
    ...(responsiveMinHeight && { minHeight: typeof responsiveMinHeight === 'number' ? `${responsiveMinHeight}px` : responsiveMinHeight }),
    ...(backgroundColor && { backgroundColor }),
    ...(responsiveBorderRadius && { borderRadius: `${responsiveBorderRadius}px` }),
    ...(responsiveBoxShadow && { boxShadow: responsiveBoxShadow }),
    position,
    ...(responsiveZIndex && { zIndex: responsiveZIndex }),
    ...(overflow && { overflow }),
    ...(overflowX && { overflowX }),
    ...(overflowY && { overflowY })
  }

  return (
    <div className={className} style={style}>
      {children}
    </div>
  )
}

interface ResponsiveGridLayoutProps {
  children: React.ReactNode
  className?: string
  columns?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  rows?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  gap?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  rowGap?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  columnGap?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  padding?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  margin?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  width?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number | string>>
  height?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number | string>>
  maxWidth?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number | string>>
  maxHeight?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number | string>>
  minWidth?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number | string>>
  minHeight?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number | string>>
  backgroundColor?: string
  borderRadius?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  boxShadow?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', string>>
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'
  zIndex?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto'
  overflowX?: 'visible' | 'hidden' | 'scroll' | 'auto'
  overflowY?: 'visible' | 'hidden' | 'scroll' | 'auto'
}

export function ResponsiveGridLayout({
  children,
  className = '',
  columns,
  rows,
  gap,
  rowGap,
  columnGap,
  padding,
  margin,
  width,
  height,
  maxWidth,
  maxHeight,
  minWidth,
  minHeight,
  backgroundColor,
  borderRadius,
  boxShadow,
  position = 'static',
  zIndex,
  overflow,
  overflowX,
  overflowY
}: ResponsiveGridLayoutProps) {
  const { viewportSize } = useMobile()

  const responsiveColumns = columns ? getResponsiveValue(columns, viewportSize.width) : undefined
  const responsiveRows = rows ? getResponsiveValue(rows, viewportSize.width) : undefined
  const responsiveGap = gap ? getResponsiveValue(gap, viewportSize.width) : undefined
  const responsiveRowGap = rowGap ? getResponsiveValue(rowGap, viewportSize.width) : undefined
  const responsiveColumnGap = columnGap ? getResponsiveValue(columnGap, viewportSize.width) : undefined
  const responsivePadding = padding ? getResponsiveValue(padding, viewportSize.width) : undefined
  const responsiveMargin = margin ? getResponsiveValue(margin, viewportSize.width) : undefined
  const responsiveWidth = width ? getResponsiveValue(width, viewportSize.width) : undefined
  const responsiveHeight = height ? getResponsiveValue(height, viewportSize.width) : undefined
  const responsiveMaxWidth = maxWidth ? getResponsiveValue(maxWidth, viewportSize.width) : undefined
  const responsiveMaxHeight = maxHeight ? getResponsiveValue(maxHeight, viewportSize.width) : undefined
  const responsiveMinWidth = minWidth ? getResponsiveValue(minWidth, viewportSize.width) : undefined
  const responsiveMinHeight = minHeight ? getResponsiveValue(minHeight, viewportSize.width) : undefined
  const responsiveBorderRadius = borderRadius ? getResponsiveValue(borderRadius, viewportSize.width) : undefined
  const responsiveBoxShadow = boxShadow ? getResponsiveValue(boxShadow, viewportSize.width) : undefined
  const responsiveZIndex = zIndex ? getResponsiveValue(zIndex, viewportSize.width) : undefined

  const style: React.CSSProperties = {
    display: 'grid',
    ...(responsiveColumns && { gridTemplateColumns: `repeat(${responsiveColumns}, 1fr)` }),
    ...(responsiveRows && { gridTemplateRows: `repeat(${responsiveRows}, 1fr)` }),
    ...(responsiveGap && { gap: `${responsiveGap}px` }),
    ...(responsiveRowGap && { rowGap: `${responsiveRowGap}px` }),
    ...(responsiveColumnGap && { columnGap: `${responsiveColumnGap}px` }),
    ...(responsivePadding && { padding: `${responsivePadding}px` }),
    ...(responsiveMargin && { margin: `${responsiveMargin}px` }),
    ...(responsiveWidth && { width: typeof responsiveWidth === 'number' ? `${responsiveWidth}px` : responsiveWidth }),
    ...(responsiveHeight && { height: typeof responsiveHeight === 'number' ? `${responsiveHeight}px` : responsiveHeight }),
    ...(responsiveMaxWidth && { maxWidth: typeof responsiveMaxWidth === 'number' ? `${responsiveMaxWidth}px` : responsiveMaxWidth }),
    ...(responsiveMaxHeight && { maxHeight: typeof responsiveMaxHeight === 'number' ? `${responsiveMaxHeight}px` : responsiveMaxHeight }),
    ...(responsiveMinWidth && { minWidth: typeof responsiveMinWidth === 'number' ? `${responsiveMinWidth}px` : responsiveMinWidth }),
    ...(responsiveMinHeight && { minHeight: typeof responsiveMinHeight === 'number' ? `${responsiveMinHeight}px` : responsiveMinHeight }),
    ...(backgroundColor && { backgroundColor }),
    ...(responsiveBorderRadius && { borderRadius: `${responsiveBorderRadius}px` }),
    ...(responsiveBoxShadow && { boxShadow: responsiveBoxShadow }),
    position,
    ...(responsiveZIndex && { zIndex: responsiveZIndex }),
    ...(overflow && { overflow }),
    ...(overflowX && { overflowX }),
    ...(overflowY && { overflowY })
  }

  return (
    <div className={className} style={style}>
      {children}
    </div>
  )
}

interface ResponsiveSpacerProps {
  className?: string
  height?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  width?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
}

export function ResponsiveSpacer({
  className = '',
  height,
  width
}: ResponsiveSpacerProps) {
  const { viewportSize } = useMobile()

  const responsiveHeight = height ? getResponsiveValue(height, viewportSize.width) : undefined
  const responsiveWidth = width ? getResponsiveValue(width, viewportSize.width) : undefined

  const style: React.CSSProperties = {
    ...(responsiveHeight && { height: `${responsiveHeight}px` }),
    ...(responsiveWidth && { width: `${responsiveWidth}px` })
  }

  return <div className={className} style={style} />
}
