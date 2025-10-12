'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { 
  UserGroupIcon,
  EyeIcon,
  BellIcon,
  CogIcon
} from '@heroicons/react/24/outline'

export function MobileRoles() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

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

  const roles = [
    {
      icon: UserGroupIcon,
      title: 'Ketua Kelas',
      description: 'Melaporkan kendala dan kebutuhan kelas dengan mudah dan cepat.',
      color: 'blue'
    },
    {
      icon: EyeIcon,
      title: 'Staff',
      description: 'Melihat dan menindaklanjuti laporan yang masuk sesuai kewenangan.',
      color: 'green'
    },
    {
      icon: BellIcon,
      title: 'Kepala Bagian',
      description: 'Menerima notifikasi instan dan memonitor semua laporan yang masuk.',
      color: 'purple'
    },
    {
      icon: CogIcon,
      title: 'Admin',
      description: 'Mengelola sistem, pengguna, dan data master untuk kelancaran operasional.',
      color: 'red'
    }
  ]

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 text-blue-600'
      case 'green':
        return 'bg-green-100 text-green-600'
      case 'purple':
        return 'bg-purple-100 text-purple-600'
      case 'red':
        return 'bg-red-100 text-red-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <section ref={sectionRef} className="py-16 bg-gradient-to-br from-white via-gray-50 to-blue-50 relative overflow-hidden">
      {/* Gradient Overlay untuk smooth transition */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-12 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-10'
        }`}>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Dirancang untuk Setiap Peran
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Memudahkan koordinasi dan pelaporan untuk semua pihak yang terlibat.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {roles.map((role, index) => {
            const delay = index * 150
            return (
              <Card 
                key={index} 
                className="text-center hover:shadow-lg transition-all duration-500 hover:scale-105 border-0 shadow-md mobile-card"
                style={{
                  animationDelay: `${delay}ms`,
                  animation: isVisible ? 'bounceIn 1.5s ease-out forwards' : 'none'
                }}
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center ${getColorClasses(role.color)}`}>
                    <role.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {role.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {role.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
