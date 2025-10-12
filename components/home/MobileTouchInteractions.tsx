'use client'

import React, { useEffect, useRef } from 'react'

export function MobileTouchInteractions() {
  useEffect(() => {
    // Prevent double-tap zoom
    let lastTouchEnd = 0
    const preventDoubleTap = (e: TouchEvent) => {
      const now = new Date().getTime()
      if (now - lastTouchEnd <= 300) {
        e.preventDefault()
      }
      lastTouchEnd = now
    }

    document.addEventListener('touchend', preventDoubleTap, { passive: false })

    // Prevent pull-to-refresh
    const preventPullToRefresh = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault()
      }
    }

    document.addEventListener('touchstart', preventPullToRefresh, { passive: false })

    // Optimize touch scrolling
    const optimizeTouchScroll = () => {
      document.body.style.touchAction = 'pan-x pan-y'
    }

    optimizeTouchScroll()

    // Cleanup
    return () => {
      document.removeEventListener('touchend', preventDoubleTap)
      document.removeEventListener('touchstart', preventPullToRefresh)
    }
  }, [])

  return null
}

// Mobile-specific touch gesture component
interface MobileTouchGesturesProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onTap?: () => void
  onDoubleTap?: () => void
  className?: string
}

export function MobileTouchGestures({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onTap,
  onDoubleTap,
  className = ''
}: MobileTouchGesturesProps) {
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null)
  const touchEnd = useRef<{ x: number; y: number; time: number } | null>(null)
  const lastTap = useRef<number>(0)

  const minSwipeDistance = 50
  const maxSwipeTime = 300
  const doubleTapDelay = 300

  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    }
    touchEnd.current = null
  }

  const onTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchEnd.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    }
  }

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return

    const distanceX = touchStart.current.x - touchEnd.current.x
    const distanceY = touchStart.current.y - touchEnd.current.y
    const timeDiff = touchEnd.current.time - touchStart.current.time

    // Check for swipe gestures
    if (timeDiff < maxSwipeTime) {
      const isLeftSwipe = distanceX > minSwipeDistance
      const isRightSwipe = distanceX < -minSwipeDistance
      const isUpSwipe = distanceY > minSwipeDistance
      const isDownSwipe = distanceY < -minSwipeDistance

      if (isLeftSwipe && onSwipeLeft) {
        onSwipeLeft()
      } else if (isRightSwipe && onSwipeRight) {
        onSwipeRight()
      } else if (isUpSwipe && onSwipeUp) {
        onSwipeUp()
      } else if (isDownSwipe && onSwipeDown) {
        onSwipeDown()
      }
    }

    // Check for tap gestures
    if (timeDiff < 200 && Math.abs(distanceX) < 10 && Math.abs(distanceY) < 10) {
      const now = Date.now()
      if (now - lastTap.current < doubleTapDelay && onDoubleTap) {
        onDoubleTap()
      } else if (onTap) {
        onTap()
      }
      lastTap.current = now
    }
  }

  return (
    <div
      className={className}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {children}
    </div>
  )
}

// Mobile-specific haptic feedback
export function MobileHapticFeedback() {
  useEffect(() => {
    const addHapticFeedback = (element: HTMLElement) => {
      const addFeedback = () => {
        if ('vibrate' in navigator) {
          navigator.vibrate(10) // Short vibration
        }
      }

      element.addEventListener('touchstart', addFeedback)
      return () => element.removeEventListener('touchstart', addFeedback)
    }

    // Add haptic feedback to buttons and interactive elements
    const interactiveElements = document.querySelectorAll('button, [role="button"], input, select, textarea')
    const cleanupFunctions: (() => void)[] = []

    interactiveElements.forEach(element => {
      const cleanup = addHapticFeedback(element as HTMLElement)
      cleanupFunctions.push(cleanup)
    })

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup())
    }
  }, [])

  return null
}

// Mobile-specific scroll optimizations
export function MobileScrollOptimizations() {
  useEffect(() => {
    // Smooth scrolling for mobile
    const smoothScroll = (e: Event) => {
      const target = e.target as HTMLElement
      const link = target.closest('a[href^="#"]')
      
      if (link) {
        e.preventDefault()
        const href = link.getAttribute('href')
        if (href && href !== '#') {
          const element = document.querySelector(href)
          if (element) {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            })
          }
        }
      }
    }

    document.addEventListener('click', smoothScroll)

    // Optimize scroll performance
    let ticking = false
    const optimizeScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Add scroll optimizations here
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', optimizeScroll, { passive: true })

    return () => {
      document.removeEventListener('click', smoothScroll)
      window.removeEventListener('scroll', optimizeScroll)
    }
  }, [])

  return null
}
