'use client'

import { useState, useEffect } from 'react'
import { 
  isMobile, 
  isTablet, 
  isDesktop, 
  getDeviceType, 
  getTouchSupport,
  getOrientation,
  getViewportSize,
  getScrollPosition,
  getScrollPercentage
} from '@/lib/mobile-utils'

export function useMobile() {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')
  const [isMobileDevice, setIsMobileDevice] = useState(false)
  const [isTabletDevice, setIsTabletDevice] = useState(false)
  const [isDesktopDevice, setIsDesktopDevice] = useState(false)
  const [hasTouch, setHasTouch] = useState(false)
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 })
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 })
  const [scrollPercentage, setScrollPercentage] = useState(0)

  useEffect(() => {
    const updateDeviceInfo = () => {
      setDeviceType(getDeviceType())
      setIsMobileDevice(isMobile())
      setIsTabletDevice(isTablet())
      setIsDesktopDevice(isDesktop())
      setHasTouch(getTouchSupport())
      setOrientation(getOrientation())
      setViewportSize(getViewportSize())
      setScrollPosition(getScrollPosition())
      setScrollPercentage(getScrollPercentage())
    }

    // Initial check
    updateDeviceInfo()

    // Listen for resize events
    const handleResize = () => {
      updateDeviceInfo()
    }

    // Listen for scroll events
    const handleScroll = () => {
      setScrollPosition(getScrollPosition())
      setScrollPercentage(getScrollPercentage())
    }

    // Listen for orientation change
    const handleOrientationChange = () => {
      setTimeout(() => {
        updateDeviceInfo()
      }, 100)
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('orientationchange', handleOrientationChange)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('orientationchange', handleOrientationChange)
    }
  }, [])

  return {
    deviceType,
    isMobile: isMobileDevice,
    isTablet: isTabletDevice,
    isDesktop: isDesktopDevice,
    hasTouch,
    orientation,
    viewportSize,
    scrollPosition,
    scrollPercentage
  }
}

export function useViewport() {
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateViewport = () => {
      setViewportSize(getViewportSize())
    }

    updateViewport()
    window.addEventListener('resize', updateViewport)

    return () => {
      window.removeEventListener('resize', updateViewport)
    }
  }, [])

  return viewportSize
}

export function useScroll() {
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 })
  const [scrollPercentage, setScrollPercentage] = useState(0)

  useEffect(() => {
    const updateScroll = () => {
      setScrollPosition(getScrollPosition())
      setScrollPercentage(getScrollPercentage())
    }

    updateScroll()
    window.addEventListener('scroll', updateScroll)

    return () => {
      window.removeEventListener('scroll', updateScroll)
    }
  }, [])

  return { scrollPosition, scrollPercentage }
}

export function useOrientation() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')

  useEffect(() => {
    const updateOrientation = () => {
      setOrientation(getOrientation())
    }

    updateOrientation()
    window.addEventListener('orientationchange', updateOrientation)
    window.addEventListener('resize', updateOrientation)

    return () => {
      window.removeEventListener('orientationchange', updateOrientation)
      window.removeEventListener('resize', updateOrientation)
    }
  }, [])

  return orientation
}

export function useTouch() {
  const [hasTouch, setHasTouch] = useState(false)

  useEffect(() => {
    setHasTouch(getTouchSupport())
  }, [])

  return hasTouch
}

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    updateOnlineStatus()
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  return isOnline
}

export function useBattery() {
  const [batteryStatus, setBatteryStatus] = useState<{
    level: number
    charging: boolean
  } | null>(null)

  useEffect(() => {
    const updateBatteryStatus = async () => {
      try {
        if ('getBattery' in navigator) {
          const battery = await (navigator as any).getBattery()
          setBatteryStatus({
            level: battery.level * 100,
            charging: battery.charging
          })
        }
      } catch (err) {
        console.error('Failed to get battery status: ', err)
      }
    }

    updateBatteryStatus()
  }, [])

  return batteryStatus
}

export function useConnection() {
  const [connectionInfo, setConnectionInfo] = useState<{
    effectiveType: string
    downlink: number
    rtt: number
  } | null>(null)

  useEffect(() => {
    const updateConnectionInfo = () => {
      try {
        if ('connection' in navigator) {
          const connection = (navigator as any).connection
          setConnectionInfo({
            effectiveType: connection.effectiveType || 'unknown',
            downlink: connection.downlink || 0,
            rtt: connection.rtt || 0
          })
        }
      } catch (err) {
        console.error('Failed to get connection info: ', err)
      }
    }

    updateConnectionInfo()
  }, [])

  return connectionInfo
}

export function useVisibility() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return isVisible
}

export function useIntersectionObserver(
  elementRef: React.RefObject<HTMLElement>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [intersectionRatio, setIntersectionRatio] = useState(0)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
        setIntersectionRatio(entry.intersectionRatio)
      },
      options
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [elementRef, options])

  return { isIntersecting, intersectionRatio }
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue] as const
}

export function useSessionStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.sessionStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue] as const
}
