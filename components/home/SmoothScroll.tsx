'use client'

import { useEffect } from 'react'

export function SmoothScroll() {
  useEffect(() => {
    // Smooth scrolling for anchor links
    const handleClick = (e: Event) => {
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

    document.addEventListener('click', handleClick)
    
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  return null
}
