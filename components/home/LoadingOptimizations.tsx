'use client'

import React, { useEffect, useState } from 'react'

export function LoadingOptimizations() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Preload critical images
    const preloadImages = [
      '/images/hero-bg.jpg',
      '/images/dashboard-preview.png'
    ]

    const imagePromises = preloadImages.map(src => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = resolve
        img.onerror = reject
        img.src = src
      })
    })

    Promise.allSettled(imagePromises).then(() => {
      setIsLoaded(true)
    })

    // Lazy load non-critical components
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement
            element.classList.add('loaded')
            observer.unobserve(element)
          }
        })
      },
      { threshold: 0.1 }
    )

    const lazyElements = document.querySelectorAll('[data-lazy]')
    lazyElements.forEach(el => observer.observe(el))

    return () => {
      observer.disconnect()
    }
  }, [])

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L3 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    )
  }

  return null
}
