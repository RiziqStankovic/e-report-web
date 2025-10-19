'use client'

import React, { useEffect, useRef } from 'react'
import Image from 'next/image'

export function MobilePerformance() {

  useEffect(() => {
    // Lazy loading for images
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            if (img.dataset.src) {
              img.src = img.dataset.src
              img.classList.remove('lazy')
              imageObserver.unobserve(img)
            }
          }
        })
      },
      { threshold: 0.1 }
    )

    const lazyImages = document.querySelectorAll('img[data-src]')
    lazyImages.forEach(img => imageObserver.observe(img))

    // Preload critical resources
    const preloadCriticalResources = () => {
      const criticalResources = [
        '/images/hero-bg.jpg',
        '/images/dashboard-preview.png'
      ]

      criticalResources.forEach(resource => {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.href = resource
        link.as = 'image'
        document.head.appendChild(link)
      })
    }

    preloadCriticalResources()

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

    // Cleanup
    return () => {
      window.removeEventListener('scroll', optimizeScroll)
      imageObserver.disconnect()
    }
  }, [])

  return null
}

// Mobile-specific image component
interface MobileImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
}

export function MobileImage({ src, alt, className = '', priority = false }: MobileImageProps) {
  const [isLoaded, setIsLoaded] = React.useState(priority)

  useEffect(() => {
    if (priority) {
      setIsLoaded(true)
    }
  }, [priority])

  return (
    <Image
      src={isLoaded ? src : '/placeholder.png'}
      alt={alt}
      width={400}
      height={300}
      unoptimized={true}
      className={`${className} ${!isLoaded ? 'lazy' : ''}`}
      priority={priority}
      onLoad={() => setIsLoaded(true)}
    />
  )
}

// Mobile-specific lazy loading component
interface MobileLazyLoadProps {
  children: React.ReactNode
  className?: string
  threshold?: number
}

export function MobileLazyLoad({ children, className = '', threshold = 0.1 }: MobileLazyLoadProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold])

  return (
    <div ref={ref} className={className}>
      {isVisible && children}
    </div>
  )
}

// Mobile-specific performance monitoring
export function MobilePerformanceMonitor() {
  useEffect(() => {
    // Monitor performance metrics
    const monitorPerformance = () => {
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        
        // Performance metrics are available but not logged in production
      }
    }

    // Monitor after page load
    if (document.readyState === 'complete') {
      monitorPerformance()
    } else {
      window.addEventListener('load', monitorPerformance)
    }

    // Monitor memory usage (if available)
    if ('memory' in performance) {
      const memory = (performance as { memory: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory
      // Memory usage is available but not logged in production
    }

    return () => {
      window.removeEventListener('load', monitorPerformance)
    }
  }, [])

  return null
}
