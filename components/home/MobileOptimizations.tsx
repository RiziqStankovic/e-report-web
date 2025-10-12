'use client'

import { useEffect } from 'react'

export function MobileOptimizations() {
  useEffect(() => {
    // Prevent zoom on input focus (iOS)
    const preventZoom = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        const viewport = document.querySelector('meta[name="viewport"]')
        if (viewport) {
          viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no')
        }
      }
    }

    const restoreZoom = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        const viewport = document.querySelector('meta[name="viewport"]')
        if (viewport) {
          viewport.setAttribute('content', 'width=device-width, initial-scale=1')
        }
      }
    }

    document.addEventListener('focusin', preventZoom)
    document.addEventListener('focusout', restoreZoom)

    return () => {
      document.removeEventListener('focusin', preventZoom)
      document.removeEventListener('focusout', restoreZoom)
    }
  }, [])

  return null
}
