'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useMobile } from '@/hooks/useMobile'
import { getResponsiveValue } from '@/lib/breakpoints'

interface ResponsiveNavigationProps {
  logo?: React.ReactNode
  logoText?: string
  logoSubtext?: string
  menuItems?: Array<{
    label: string
    href: string
    icon?: React.ReactNode
    external?: boolean
  }>
  ctaButton?: {
    label: string
    href: string
    variant?: 'primary' | 'secondary' | 'outline'
  }
  className?: string
  backgroundColor?: string
  textColor?: string
  borderColor?: string
  padding?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  height?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'
  zIndex?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  boxShadow?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', string>>
  borderRadius?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  backdropBlur?: boolean
  transparent?: boolean
}

export function ResponsiveNavigation({
  logo,
  logoText = 'E-Report',
  logoSubtext = 'Sistem Laporan Kendala',
  menuItems = [],
  ctaButton,
  className = '',
  backgroundColor,
  textColor,
  borderColor,
  padding,
  height,
  position = 'fixed',
  zIndex,
  boxShadow,
  borderRadius,
  backdropBlur = true,
  transparent = false
}: ResponsiveNavigationProps) {
  const { isMobile, viewportSize } = useMobile()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const responsivePadding = padding ? getResponsiveValue(padding, viewportSize.width) : undefined
  const responsiveHeight = height ? getResponsiveValue(height, viewportSize.width) : undefined
  const responsiveZIndex = zIndex ? getResponsiveValue(zIndex, viewportSize.width) : undefined
  const responsiveBoxShadow = boxShadow ? getResponsiveValue(boxShadow, viewportSize.width) : undefined
  const responsiveBorderRadius = borderRadius ? getResponsiveValue(borderRadius, viewportSize.width) : undefined

  const style: React.CSSProperties = {
    ...(backgroundColor && { backgroundColor }),
    ...(textColor && { color: textColor }),
    ...(borderColor && { borderColor }),
    ...(responsivePadding && { padding: `${responsivePadding}px` }),
    ...(responsiveHeight && { height: `${responsiveHeight}px` }),
    position,
    ...(responsiveZIndex && { zIndex: responsiveZIndex }),
    ...(responsiveBoxShadow && { boxShadow: responsiveBoxShadow }),
    ...(responsiveBorderRadius && { borderRadius: `${responsiveBorderRadius}px` }),
    ...(backdropBlur && { backdropFilter: 'blur(10px)' }),
    ...(transparent && { backgroundColor: 'rgba(255, 255, 255, 0.95)' })
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (isMenuOpen && !target.closest('.mobile-menu')) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMenuOpen])

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isMenuOpen])

  return (
    <nav className={`${className} ${backdropBlur ? 'backdrop-blur-sm' : ''}`} style={style}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            {logo || (
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L3 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-900">{logoText}</h1>
              <p className="text-xs text-gray-500">{logoSubtext}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="hidden md:flex items-center space-x-8">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-2"
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              {ctaButton && (
                <Link
                  href={ctaButton.href}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    ctaButton.variant === 'primary'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : ctaButton.variant === 'secondary'
                      ? 'bg-gray-600 text-white hover:bg-gray-700'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {ctaButton.label}
                </Link>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobile && isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 mobile-menu">
            <div className="flex flex-col space-y-4">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 transition-colors px-2 py-1 flex items-center space-x-2"
                  onClick={() => setIsMenuOpen(false)}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              {ctaButton && (
                <Link
                  href={ctaButton.href}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors text-center ${
                    ctaButton.variant === 'primary'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : ctaButton.variant === 'secondary'
                      ? 'bg-gray-600 text-white hover:bg-gray-700'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {ctaButton.label}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

interface ResponsiveBreadcrumbProps {
  items: Array<{
    label: string
    href?: string
    current?: boolean
  }>
  className?: string
  separator?: React.ReactNode
  textColor?: string
  activeTextColor?: string
  hoverTextColor?: string
  fontSize?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  padding?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  margin?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
}

export function ResponsiveBreadcrumb({
  items,
  className = '',
  separator = '>',
  textColor = '#6b7280',
  activeTextColor = '#111827',
  hoverTextColor = '#374151',
  fontSize,
  padding,
  margin
}: ResponsiveBreadcrumbProps) {
  const { viewportSize } = useMobile()

  const responsiveFontSize = fontSize ? getResponsiveValue(fontSize, viewportSize.width) : undefined
  const responsivePadding = padding ? getResponsiveValue(padding, viewportSize.width) : undefined
  const responsiveMargin = margin ? getResponsiveValue(margin, viewportSize.width) : undefined

  const style: React.CSSProperties = {
    ...(responsiveFontSize && { fontSize: `${responsiveFontSize}px` }),
    ...(responsivePadding && { padding: `${responsivePadding}px` }),
    ...(responsiveMargin && { margin: `${responsiveMargin}px` })
  }

  return (
    <nav className={className} style={style} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-gray-400" aria-hidden="true">
                {separator}
              </span>
            )}
            {item.href && !item.current ? (
              <Link
                href={item.href}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                style={{ color: textColor }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = hoverTextColor
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = textColor
                }}
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={item.current ? 'font-medium' : ''}
                style={{ color: item.current ? activeTextColor : textColor }}
                aria-current={item.current ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
