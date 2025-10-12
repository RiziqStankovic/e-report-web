// Responsive breakpoints and utilities

export const breakpoints = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const

export const mediaQueries = {
  xs: `(min-width: ${breakpoints.xs})`,
  sm: `(min-width: ${breakpoints.sm})`,
  md: `(min-width: ${breakpoints.md})`,
  lg: `(min-width: ${breakpoints.lg})`,
  xl: `(min-width: ${breakpoints.xl})`,
  '2xl': `(min-width: ${breakpoints['2xl']})`
} as const

export const mobileQueries = {
  xs: `(max-width: ${breakpoints.sm})`,
  sm: `(max-width: ${breakpoints.md})`,
  md: `(max-width: ${breakpoints.lg})`,
  lg: `(max-width: ${breakpoints.xl})`,
  xl: `(max-width: ${breakpoints['2xl']})`
} as const

export const getBreakpoint = (width: number): keyof typeof breakpoints => {
  if (width >= 1536) return '2xl'
  if (width >= 1280) return 'xl'
  if (width >= 1024) return 'lg'
  if (width >= 768) return 'md'
  if (width >= 640) return 'sm'
  return 'xs'
}

export const isBreakpoint = (width: number, breakpoint: keyof typeof breakpoints): boolean => {
  const breakpointValue = parseInt(breakpoints[breakpoint])
  return width >= breakpointValue
}

export const isMobileBreakpoint = (width: number): boolean => {
  return width < 768
}

export const isTabletBreakpoint = (width: number): boolean => {
  return width >= 768 && width < 1024
}

export const isDesktopBreakpoint = (width: number): boolean => {
  return width >= 1024
}

export const getResponsiveValue = <T>(
  values: Partial<Record<keyof typeof breakpoints, T>>,
  width: number
): T | undefined => {
  const breakpoint = getBreakpoint(width)
  
  // Try to find the value for the current breakpoint or the closest smaller one
  const orderedBreakpoints: (keyof typeof breakpoints)[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
  const currentIndex = orderedBreakpoints.indexOf(breakpoint)
  
  for (let i = currentIndex; i >= 0; i--) {
    const bp = orderedBreakpoints[i]
    if (values[bp] !== undefined) {
      return values[bp]
    }
  }
  
  return undefined
}

export const getResponsiveClasses = (
  classes: Partial<Record<keyof typeof breakpoints, string>>,
  width: number
): string => {
  const breakpoint = getBreakpoint(width)
  const orderedBreakpoints: (keyof typeof breakpoints)[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
  const currentIndex = orderedBreakpoints.indexOf(breakpoint)
  
  let result = ''
  
  for (let i = 0; i <= currentIndex; i++) {
    const bp = orderedBreakpoints[i]
    if (classes[bp]) {
      result += ` ${classes[bp]}`
    }
  }
  
  return result.trim()
}

export const getMobileClasses = (classes: string): string => {
  return classes
    .split(' ')
    .filter(cls => cls.startsWith('sm:') || cls.startsWith('md:') || cls.startsWith('lg:') || cls.startsWith('xl:') || cls.startsWith('2xl:'))
    .join(' ')
}

export const getDesktopClasses = (classes: string): string => {
  return classes
    .split(' ')
    .filter(cls => !cls.startsWith('sm:') && !cls.startsWith('md:') && !cls.startsWith('lg:') && !cls.startsWith('xl:') && !cls.startsWith('2xl:'))
    .join(' ')
}

export const getResponsiveSpacing = (
  spacing: Partial<Record<keyof typeof breakpoints, number>>,
  width: number
): number => {
  const breakpoint = getBreakpoint(width)
  const orderedBreakpoints: (keyof typeof breakpoints)[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
  const currentIndex = orderedBreakpoints.indexOf(breakpoint)
  
  for (let i = currentIndex; i >= 0; i--) {
    const bp = orderedBreakpoints[i]
    if (spacing[bp] !== undefined) {
      return spacing[bp]
    }
  }
  
  return 0
}

export const getResponsiveFontSize = (
  sizes: Partial<Record<keyof typeof breakpoints, number>>,
  width: number
): number => {
  const breakpoint = getBreakpoint(width)
  const orderedBreakpoints: (keyof typeof breakpoints)[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
  const currentIndex = orderedBreakpoints.indexOf(breakpoint)
  
  for (let i = currentIndex; i >= 0; i--) {
    const bp = orderedBreakpoints[i]
    if (sizes[bp] !== undefined) {
      return sizes[bp]
    }
  }
  
  return 16 // Default font size
}

export const getResponsiveGrid = (
  grid: Partial<Record<keyof typeof breakpoints, number>>,
  width: number
): number => {
  const breakpoint = getBreakpoint(width)
  const orderedBreakpoints: (keyof typeof breakpoints)[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
  const currentIndex = orderedBreakpoints.indexOf(breakpoint)
  
  for (let i = currentIndex; i >= 0; i--) {
    const bp = orderedBreakpoints[i]
    if (grid[bp] !== undefined) {
      return grid[bp]
    }
  }
  
  return 1 // Default grid columns
}

export const getResponsivePadding = (
  padding: Partial<Record<keyof typeof breakpoints, number>>,
  width: number
): { top: number; right: number; bottom: number; left: number } => {
  const value = getResponsiveSpacing(padding, width)
  return {
    top: value,
    right: value,
    bottom: value,
    left: value
  }
}

export const getResponsiveMargin = (
  margin: Partial<Record<keyof typeof breakpoints, number>>,
  width: number
): { top: number; right: number; bottom: number; left: number } => {
  const value = getResponsiveSpacing(margin, width)
  return {
    top: value,
    right: value,
    bottom: value,
    left: value
  }
}

export const getResponsiveBorderRadius = (
  radius: Partial<Record<keyof typeof breakpoints, number>>,
  width: number
): number => {
  const breakpoint = getBreakpoint(width)
  const orderedBreakpoints: (keyof typeof breakpoints)[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
  const currentIndex = orderedBreakpoints.indexOf(breakpoint)
  
  for (let i = currentIndex; i >= 0; i--) {
    const bp = orderedBreakpoints[i]
    if (radius[bp] !== undefined) {
      return radius[bp]
    }
  }
  
  return 0 // Default border radius
}

export const getResponsiveShadow = (
  shadows: Partial<Record<keyof typeof breakpoints, string>>,
  width: number
): string => {
  const breakpoint = getBreakpoint(width)
  const orderedBreakpoints: (keyof typeof breakpoints)[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
  const currentIndex = orderedBreakpoints.indexOf(breakpoint)
  
  for (let i = currentIndex; i >= 0; i--) {
    const bp = orderedBreakpoints[i]
    if (shadows[bp] !== undefined) {
      return shadows[bp]
    }
  }
  
  return 'none' // Default shadow
}

export const getResponsiveZIndex = (
  zIndexes: Partial<Record<keyof typeof breakpoints, number>>,
  width: number
): number => {
  const breakpoint = getBreakpoint(width)
  const orderedBreakpoints: (keyof typeof breakpoints)[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
  const currentIndex = orderedBreakpoints.indexOf(breakpoint)
  
  for (let i = currentIndex; i >= 0; i--) {
    const bp = orderedBreakpoints[i]
    if (zIndexes[bp] !== undefined) {
      return zIndexes[bp]
    }
  }
  
  return 0 // Default z-index
}

export const getResponsiveOpacity = (
  opacities: Partial<Record<keyof typeof breakpoints, number>>,
  width: number
): number => {
  const breakpoint = getBreakpoint(width)
  const orderedBreakpoints: (keyof typeof breakpoints)[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
  const currentIndex = orderedBreakpoints.indexOf(breakpoint)
  
  for (let i = currentIndex; i >= 0; i--) {
    const bp = orderedBreakpoints[i]
    if (opacities[bp] !== undefined) {
      return opacities[bp]
    }
  }
  
  return 1 // Default opacity
}

export const getResponsiveTransform = (
  transforms: Partial<Record<keyof typeof breakpoints, string>>,
  width: number
): string => {
  const breakpoint = getBreakpoint(width)
  const orderedBreakpoints: (keyof typeof breakpoints)[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
  const currentIndex = orderedBreakpoints.indexOf(breakpoint)
  
  for (let i = currentIndex; i >= 0; i--) {
    const bp = orderedBreakpoints[i]
    if (transforms[bp] !== undefined) {
      return transforms[bp]
    }
  }
  
  return 'none' // Default transform
}
