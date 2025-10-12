'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'
import { 
  CheckCircleIcon,
  CameraIcon,
  BellIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  UserGroupIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'

export function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const features = [
    {
      icon: CameraIcon,
      title: 'Pelaporan Terstruktur',
      description: 'Formulir input yang intuitif dengan pilihan terstruktur untuk kelas, shift, ruangan, dan kategori masalah.',
      details: [
        'Pilihan terstruktur: Kelas, Shift, Ruangan',
        'Kategori masalah: AC, Proyektor, Pengajar, dll.',
        'Unggah foto sebagai bukti pendukung'
      ],
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      icon: BellIcon,
      title: 'Notifikasi Real-time',
      description: 'Notifikasi WhatsApp otomatis untuk setiap laporan baru dengan format pesan yang terstruktur.',
      details: [
        'Notifikasi instan ke WhatsApp',
        'Format pesan yang terstruktur',
        'Status laporan real-time'
      ],
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      icon: ChartBarIcon,
      title: 'Dashboard Interaktif',
      description: 'Dashboard dengan statistik lengkap, grafik interaktif, dan analisis tren laporan.',
      details: [
        'Statistik real-time',
        'Grafik interaktif',
        'Analisis tren laporan'
      ],
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      icon: UserGroupIcon,
      title: 'Multi-Role Access',
      description: 'Sistem akses berdasarkan role: Admin, Staff, Kepala Bagian, dan Ketua Kelas.',
      details: [
        'Role-based access control',
        'Permission management',
        'Secure authentication'
      ],
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      icon: DocumentArrowDownIcon,
      title: 'Export & Reporting',
      description: 'Export laporan ke PDF, Excel, CSV dengan template yang dapat disesuaikan.',
      details: [
        'Export ke PDF, Excel, CSV',
        'Template yang dapat disesuaikan',
        'Print reports langsung'
      ],
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Keamanan Tinggi',
      description: 'JWT authentication, role-based security, dan enkripsi data untuk keamanan maksimal.',
      details: [
        'JWT authentication',
        'Role-based security',
        'Data encryption'
      ],
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
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
      setActiveFeature((prev) => (prev + 1) % features.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [features.length])

  return (
    <section ref={sectionRef} id="features" className="py-16 lg:py-24 bg-gradient-to-br from-white via-gray-50 to-blue-50 relative overflow-hidden">
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
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
            <CheckCircleIcon className="w-4 h-4 mr-2" />
            Fitur Unggulan
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Mengapa Memilih{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              E-Report?
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Solusi lengkap untuk manajemen laporan kendala pembelajaran dengan teknologi modern dan antarmuka yang user-friendly.
          </p>
        </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon
                const isActive = index === activeFeature
                const delay = index * 150
                
                // Variasi animasi berdasarkan posisi
                const animations = [
                  'slideInFromLeft',
                  'slideInFromRight', 
                  'zoomInRotate',
                  'bounceIn',
                  'flipInX',
                  'elasticIn'
                ]
                const animationType = animations[index % animations.length]

                return (
                  <Card 
                    key={index}
                    className={`group cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-xl ${
                      isActive ? 'scale-105 shadow-xl' : 'hover:shadow-lg'
                    } ${feature.bgColor} ${feature.borderColor} border-2`}
                    style={{
                      animationDelay: `${delay}ms`,
                      animation: isVisible ? `${animationType} 1.2s ease-out forwards` : 'none'
                    }}
                    onClick={() => setActiveFeature(index)}
                  >
                <CardContent className="p-6 lg:p-8">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Details */}
                  <ul className="space-y-3">
                    {feature.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start space-x-3">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Hover Arrow */}
                  {/* <div className="mt-6 flex items-center text-blue-600 font-medium group-hover:translate-x-2 transition-transform duration-300">
                    <span className="text-sm">Pelajari lebih lanjut</span>
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </div> */}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-xl border border-gray-200 max-w-4xl mx-auto">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Siap Meningkatkan Efisiensi Laporan?
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Bergabunglah dengan institusi yang sudah menggunakan E-Report untuk manajemen laporan yang lebih baik.
            </p>
            <div className="flex justify-center">
              <Link href="/login">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                  Mulai Sekarang
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}