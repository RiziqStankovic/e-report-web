'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { 
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  BellIcon,
} from '@heroicons/react/24/outline'

export function BenefitsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeBenefit, setActiveBenefit] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  const benefits = [
    {
      icon: ClockIcon,
      title: 'Efisiensi Waktu',
      description: 'Mengurangi waktu pelaporan dari jam menjadi menit dengan sistem yang terintegrasi.',
      stats: '90% lebih cepat',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      icon: ChartBarIcon,
      title: 'Analisis Data Real-time',
      description: 'Dashboard interaktif memberikan insight mendalam tentang tren dan pola kendala.',
      stats: 'Real-time updates',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      icon: UserGroupIcon,
      title: 'Kolaborasi Tim',
      description: 'Sistem multi-role memungkinkan koordinasi yang lebih baik antar departemen.',
      stats: '4 role berbeda',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Keamanan Data',
      description: 'Enkripsi end-to-end dan role-based access control untuk perlindungan maksimal.',
      stats: '100% aman',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      icon: BellIcon,
      title: 'Notifikasi Instan',
      description: 'WhatsApp integration memastikan tidak ada laporan yang terlewat atau terlambat.',
      stats: 'Instant alerts',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBenefit((prev) => (prev + 1) % benefits.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [benefits.length])

  return (
    <section ref={sectionRef} id="benefits" className="py-16 lg:py-24 bg-gradient-to-br from-white via-gray-50 to-indigo-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      {/* Gradient Overlay untuk smooth transition */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-10'
        }`}>
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-6">
            <CheckCircleIcon className="w-4 h-4 mr-2" />
            Manfaat & Keunggulan
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Mengapa{' '}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              E-Report
            </span>{' '}
            adalah Pilihan Terbaik?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Tingkatkan efisiensi dan efektivitas manajemen laporan kendala dengan solusi yang telah terbukti memberikan hasil nyata.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon
            const isActive = index === activeBenefit
            const delay = index * 200
            
            // Variasi animasi berdasarkan posisi
            const animations = [
              'slideInFromTop',
              'bounceIn',
              'zoomInRotate',
              'elasticIn',
              'flipInX'
            ]
            const animationType = animations[index % animations.length]

            return (
              <Card 
                key={index}
                className={`group cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-xl ${
                  isActive ? 'scale-105 shadow-xl' : 'hover:shadow-lg'
                } ${benefit.bgColor} ${benefit.borderColor} border-2`}
                    style={{
                      animationDelay: `${delay}ms`,
                      animation: isVisible ? `${animationType} 1.3s ease-out forwards` : 'none'
                    }}
                onClick={() => setActiveBenefit(index)}
              >
                <CardContent className="p-6 lg:p-8 text-center">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg mx-auto`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                    {benefit.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {benefit.description}
                  </p>

                  {/* Stats */}
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 text-sm font-semibold text-gray-800 shadow-sm">
                    {benefit.stats}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Stats Section */}
        <div className={`bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 lg:p-12 text-white text-center transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h3 className="text-2xl lg:text-3xl font-bold mb-8">
            Hasil Nyata yang Terbukti
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <div className="text-4xl lg:text-5xl font-bold">90%</div>
              <div className="text-blue-200">Pengurangan Waktu</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl lg:text-5xl font-bold">95%</div>
              <div className="text-blue-200">Tingkat Kepuasan</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl lg:text-5xl font-bold">24/7</div>
              <div className="text-blue-200">Monitoring</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl lg:text-5xl font-bold">100%</div>
              <div className="text-blue-200">Keamanan Data</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}