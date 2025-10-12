'use client'

import React, { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/router'
import { Header } from '@/components/home/Header'
import { HeroSection } from '@/components/home/HeroSection'
import { RolesSection } from '@/components/home/RolesSection'
import { FeaturesSection } from '@/components/home/FeaturesSection'
import { BenefitsSection } from '@/components/home/BenefitsSection'
import { AboutSection } from '@/components/home/AboutSection'
import { Footer } from '@/components/home/Footer'
import { SmoothScroll } from '@/components/home/SmoothScroll'
import { MobileOptimizations } from '@/components/home/MobileOptimizations'
import { LoadingOptimizations } from '@/components/home/LoadingOptimizations'
import { MobilePerformance } from '@/components/home/MobilePerformance'
import { MobilePerformanceMonitor } from '@/components/home/MobilePerformance'
import { MobileTouchInteractions } from '@/components/home/MobileTouchInteractions'
import { MobileHapticFeedback } from '@/components/home/MobileTouchInteractions'
import { MobileScrollOptimizations } from '@/components/home/MobileTouchInteractions'

export default function HomePage() {
  const { isAuthenticated, user, loading } = useAuth()
  const router = useRouter()

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      // Redirect based on user role
      switch (user.role) {
        case 'admin':
          router.push('/dashboard')
          break
        case 'ketua_kelas':
          router.push('/reports/my')
          break
        case 'staff':
        case 'kepala_bagian':
          router.push('/reports')
          break
        default:
          router.push('/dashboard')
      }
    }
  }, [isAuthenticated, user, loading, router])

  // Show loading if checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show homepage if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        <LoadingOptimizations />
        <MobileOptimizations />
        <MobilePerformance />
        <MobilePerformanceMonitor />
        <MobileTouchInteractions />
        <MobileHapticFeedback />
        <MobileScrollOptimizations />
        <SmoothScroll />
        <Header />
        <main>
          <HeroSection />
          <RolesSection />
          <FeaturesSection />
          <BenefitsSection />
          <AboutSection />
        </main>
        <Footer />
      </div>
    )
  }

  // This should not be reached due to redirect, but just in case
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  )
}