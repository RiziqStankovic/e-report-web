// Mobile-specific utilities and helpers

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

export const getTouchSupport = () => {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

export const getOrientation = () => {
  if (typeof window === 'undefined') return 'portrait'
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
}

export const getViewportSize = () => {
  if (typeof window === 'undefined') return { width: 0, height: 0 }
  return {
    width: window.innerWidth,
    height: window.innerHeight
  }
}

export const getScrollPosition = () => {
  if (typeof window === 'undefined') return { x: 0, y: 0 }
  return {
    x: window.scrollX,
    y: window.scrollY
  }
}

export const getScrollPercentage = () => {
  if (typeof window === 'undefined') return 0
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  return (scrollTop / docHeight) * 100
}

export const isElementInViewport = (element: HTMLElement) => {
  if (typeof window === 'undefined') return false
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= window.innerHeight &&
    rect.right <= window.innerWidth
  )
}

export const getElementVisibility = (element: HTMLElement) => {
  if (typeof window === 'undefined') return 0
  const rect = element.getBoundingClientRect()
  const windowHeight = window.innerHeight
  
  if (rect.bottom < 0 || rect.top > windowHeight) {
    return 0 // Not visible
  }
  
  const visibleTop = Math.max(0, rect.top)
  const visibleBottom = Math.min(windowHeight, rect.bottom)
  const visibleHeight = visibleBottom - visibleTop
  
  return (visibleHeight / rect.height) * 100
}

export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

export const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9)
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/
  return phoneRegex.test(phone)
}

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
}

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      const successful = document.execCommand('copy')
      document.body.removeChild(textArea)
      return successful
    }
  } catch (err) {
    console.error('Failed to copy text: ', err)
    return false
  }
}

export const downloadFile = (url: string, filename: string): void => {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const shareContent = async (data: {
  title?: string
  text?: string
  url?: string
}): Promise<boolean> => {
  try {
    if (navigator.share) {
      await navigator.share(data)
      return true
    } else {
      // Fallback to copying URL to clipboard
      const shareText = `${data.title || ''}\n${data.text || ''}\n${data.url || ''}`
      return await copyToClipboard(shareText)
    }
  } catch (err) {
    console.error('Failed to share content: ', err)
    return false
  }
}

export const getNetworkStatus = (): 'online' | 'offline' => {
  if (typeof navigator === 'undefined') return 'online'
  return navigator.onLine ? 'online' : 'offline'
}

export const getBatteryStatus = async (): Promise<{
  level: number
  charging: boolean
} | null> => {
  try {
    if ('getBattery' in navigator) {
      const battery = await (navigator as { getBattery: () => Promise<{ level: number; charging: boolean }> }).getBattery()
      return {
        level: battery.level * 100,
        charging: battery.charging
      }
    }
  } catch (err) {
    console.error('Failed to get battery status: ', err)
  }
  return null
}

export const getConnectionInfo = (): {
  effectiveType: string
  downlink: number
  rtt: number
} | null => {
  try {
    if ('connection' in navigator) {
      const connection = (navigator as { connection: { effectiveType?: string; downlink?: number; rtt?: number } }).connection
      return {
        effectiveType: connection.effectiveType || 'unknown',
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0
      }
    }
  } catch (err) {
    console.error('Failed to get connection info: ', err)
  }
  return null
}
