'use client'

import React, { useEffect, useRef, useState } from 'react'

interface MobileAnimationsProps {
  children: React.ReactNode
  className?: string
  delay?: number
  animation?: 'fadeIn' | 'slideUp' | 'scaleIn' | 'slideLeft' | 'slideRight'
}

export function MobileAnimations({ 
  children, 
  className = '', 
  delay = 0,
  animation = 'fadeIn'
}: MobileAnimationsProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true)
          }, delay)
        }
      },
      { threshold: 0.1 }
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
  }, [delay])

  const getAnimationClasses = () => {
    const baseClasses = 'transition-all duration-700 ease-out'
    
    if (!isVisible) {
      switch (animation) {
        case 'fadeIn':
          return `${baseClasses} opacity-0`
        case 'slideUp':
          return `${baseClasses} opacity-0 translate-y-8`
        case 'scaleIn':
          return `${baseClasses} opacity-0 scale-95`
        case 'slideLeft':
          return `${baseClasses} opacity-0 -translate-x-8`
        case 'slideRight':
          return `${baseClasses} opacity-0 translate-x-8`
        default:
          return `${baseClasses} opacity-0`
      }
    } else {
      switch (animation) {
        case 'fadeIn':
          return `${baseClasses} opacity-100`
        case 'slideUp':
          return `${baseClasses} opacity-100 translate-y-0`
        case 'scaleIn':
          return `${baseClasses} opacity-100 scale-100`
        case 'slideLeft':
          return `${baseClasses} opacity-100 translate-x-0`
        case 'slideRight':
          return `${baseClasses} opacity-100 translate-x-0`
        default:
          return `${baseClasses} opacity-100`
      }
    }
  }

  return (
    <div
      ref={ref}
      className={`${getAnimationClasses()} ${className}`}
    >
      {children}
    </div>
  )
}

// Mobile-specific animation components
export function MobileFadeIn({ children, className = '', delay = 0 }: Omit<MobileAnimationsProps, 'animation'>) {
  return (
    <MobileAnimations animation="fadeIn" className={className} delay={delay}>
      {children}
    </MobileAnimations>
  )
}

export function MobileSlideUp({ children, className = '', delay = 0 }: Omit<MobileAnimationsProps, 'animation'>) {
  return (
    <MobileAnimations animation="slideUp" className={className} delay={delay}>
      {children}
    </MobileAnimations>
  )
}

export function MobileScaleIn({ children, className = '', delay = 0 }: Omit<MobileAnimationsProps, 'animation'>) {
  return (
    <MobileAnimations animation="scaleIn" className={className} delay={delay}>
      {children}
    </MobileAnimations>
  )
}

export function MobileSlideLeft({ children, className = '', delay = 0 }: Omit<MobileAnimationsProps, 'animation'>) {
  return (
    <MobileAnimations animation="slideLeft" className={className} delay={delay}>
      {children}
    </MobileAnimations>
  )
}

export function MobileSlideRight({ children, className = '', delay = 0 }: Omit<MobileAnimationsProps, 'animation'>) {
  return (
    <MobileAnimations animation="slideRight" className={className} delay={delay}>
      {children}
    </MobileAnimations>
  )
}
