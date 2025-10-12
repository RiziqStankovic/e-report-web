// Responsive utilities for mobile-first design
import React from 'react'

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const

export const isMobile = () => {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

export const isTablet = () => {
  if (typeof window === 'undefined') return false
  return window.innerWidth >= 768 && window.innerWidth < 1024
}

export const isDesktop = () => {
  if (typeof window === 'undefined') return false
  return window.innerWidth >= 1024
}

export const getDeviceType = () => {
  if (isMobile()) return 'mobile'
  if (isTablet()) return 'tablet'
  return 'desktop'
}

export const useResponsive = () => {
  const [deviceType, setDeviceType] = React.useState(getDeviceType())

  React.useEffect(() => {
    const handleResize = () => {
      setDeviceType(getDeviceType())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    deviceType,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop'
  }
}

// Mobile-specific CSS classes
export const mobileClasses = {
  container: 'px-4 sm:px-6 lg:px-8',
  text: {
    h1: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl',
    h2: 'text-2xl sm:text-3xl md:text-4xl',
    h3: 'text-xl sm:text-2xl md:text-3xl',
    body: 'text-sm sm:text-base md:text-lg',
    small: 'text-xs sm:text-sm'
  },
  spacing: {
    section: 'py-12 sm:py-16 md:py-20',
    container: 'py-8 sm:py-12 md:py-16'
  },
  grid: {
    cols1: 'grid-cols-1',
    cols2: 'grid-cols-1 sm:grid-cols-2',
    cols3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    cols4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  }
} as const
