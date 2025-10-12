'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'
import { 
  HeartIcon,
  RocketLaunchIcon,
  GlobeAltIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

export function AboutSection() {
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

  return (
    <section ref={sectionRef} id="about" className="py-16 lg:py-24 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      
      {/* Gradient Overlay untuk smooth transition */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-10'
        }`}>
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6">
            <GlobeAltIcon className="w-4 h-4 mr-2" />
            Tentang Kami
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Membangun Masa Depan{' '}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Pendidikan
            </span>{' '}
            yang Lebih Baik
          </h2>
          <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto">
            E-Report lahir dari visi untuk menciptakan ekosistem pendidikan yang lebih efisien, 
            transparan, dan responsif terhadap kebutuhan semua pihak.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className={`transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}>
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                  <RocketLaunchIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Misi Kami</h3>
                <p className="text-white/90 leading-relaxed">
                  Menyediakan solusi teknologi yang inovatif untuk meningkatkan efisiensi 
                  manajemen laporan kendala pembelajaran, sehingga proses pendidikan dapat 
                  berjalan lebih lancar dan efektif.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className={`transition-all duration-1000 delay-400 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}>
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
                  <HeartIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Visi Kami</h3>
                <p className="text-white/90 leading-relaxed">
                  Menjadi platform terdepan dalam transformasi digital pendidikan di Indonesia, 
                  dengan fokus pada kemudahan penggunaan, keamanan data, dan dampak positif 
                  yang berkelanjutan.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          {/* <h3 className="text-2xl lg:text-3xl font-bold text-center mb-12">
            Nilai-Nilai Kami
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon
              const delay = index * 100

              return (
                <div
                  key={index}
                  className={`text-center transition-all duration-1000 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ 
                    animationDelay: `${delay}ms`,
                    animation: isVisible ? 'slideInFromRight 1.4s ease-out forwards' : 'none'
                  }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">{value.title}</h4>
                  <p className="text-white/80 text-sm leading-relaxed">{value.description}</p>
                </div>
              )
            })}
          </div> */}
        </div>

        {/* Team */}
        <div className="mb-16">
          {/* <h3 className="text-2xl lg:text-3xl font-bold text-center mb-12">
            Tim di Balik E-Report
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => {
              const delay = index * 200

              return (
                <Card
                  key={index}
                  className={`bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-1000 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ 
                    animationDelay: `${delay}ms`,
                    animation: isVisible ? 'slideInFromRight 1.4s ease-out forwards' : 'none'
                  }}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <UsersIcon className="w-10 h-10 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">{member.name}</h4>
                    <p className="text-blue-200 text-sm font-medium mb-3">{member.role}</p>
                    <p className="text-white/80 text-sm leading-relaxed">{member.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div> */}
        </div>

        {/* CTA */}
        <div className={`text-center transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20 max-w-4xl mx-auto">
            <CardContent className="p-8 lg:p-12">
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                Bergabunglah dengan Perjalanan Kami
              </h3>
              <p className="text-white/90 text-lg mb-8">
                Mari bersama-sama membangun ekosistem pendidikan yang lebih baik untuk masa depan Indonesia.
              </p>
              <div className="flex justify-center">
                <Link href="/login">
                  <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center">
                    Mulai Sekarang
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                  </button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
