'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { getSvgPattern } from '@/lib/svg-patterns'
import { 
  ChartBarIcon,
  UserGroupIcon,
  BellIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentFeature, setCurrentFeature] = useState(0)

  const features = [
    { icon: BellIcon, title: 'Notifikasi Real-time', desc: 'WhatsApp & Push Notification' },
    { icon: ChartBarIcon, title: 'Dashboard Interaktif', desc: 'Analisis & Statistik Lengkap' },
    { icon: UserGroupIcon, title: 'Multi-Role Access', desc: 'Admin, Staff, Ketua Kelas' },
    { icon: ShieldCheckIcon, title: 'Keamanan Tinggi', desc: 'JWT & Role-based Security' }
  ]

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [features.length])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${getSvgPattern('DOTS')})`,
            backgroundSize: '40px 40px',
            backgroundRepeat: 'repeat',
            animation: 'float 20s ease-in-out infinite'
          }}
        ></div>
        
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-400/30 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-indigo-400/30 rounded-full blur-xl animate-pulse delay-2000"></div>
        
        {/* Gradient Overlay untuk smooth transition */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
              <div className={`text-center lg:text-left transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{
                animation: isVisible ? 'slideInFromLeft 1.6s ease-out forwards' : 'none'
              }}>
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6">
              <CheckCircleIcon className="w-4 h-4 mr-2" />
              Solusi Terintegrasi & Modern
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight">
              Sistem Laporan Kendala{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Pembelajaran
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Solusi pelaporan kendala kelas yang cepat, efisien, dan terintegrasi langsung dengan notifikasi WhatsApp untuk penanganan instan.
            </p>

            {/* Interactive Tags */}
            <div className="flex flex-wrap items-center gap-4 mb-8 justify-center lg:justify-start">
              <button 
                onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium hover:bg-white/20 hover:scale-105 transition-all duration-300"
              >
                <span className="mr-2">📊</span>
                Manfaat
              </button>
              <button 
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium hover:bg-white/20 hover:scale-105 transition-all duration-300"
              >
                <span className="mr-2">ℹ️</span>
                Tentang
              </button>
              <button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium hover:bg-white/20 hover:scale-105 transition-all duration-300"
              >
                <span className="mr-2">⚡</span>
                Fitur
              </button>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center lg:justify-start mb-12">
              <Link href="/login">
                <Button 
                  size="lg" 
                  className="px-8 py-4 text-lg font-semibold bg-white text-blue-600 hover:bg-gray-50 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl group"
                >
                  Mulai Sekarang
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Feature Carousel */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white/90 mb-4">Fitur Unggulan:</h3>
              <div className="space-y-3">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon
                  const isActive = index === currentFeature
                  return (
                    <div 
                      key={index}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-500 ${
                        isActive 
                          ? 'bg-white/20 backdrop-blur-sm scale-105' 
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className={`p-2 rounded-lg transition-all duration-300 ${
                        isActive ? 'bg-white/30' : 'bg-white/10'
                      }`}>
                        <IconComponent className={`w-5 h-5 transition-colors duration-300 ${
                          isActive ? 'text-white' : 'text-white/70'
                        }`} />
                      </div>
                      <div>
                        <div className={`font-medium transition-colors duration-300 ${
                          isActive ? 'text-white' : 'text-white/80'
                        }`}>
                          {feature.title}
                        </div>
                        <div className={`text-sm transition-colors duration-300 ${
                          isActive ? 'text-white/90' : 'text-white/60'
                        }`}>
                          {feature.desc}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

              {/* Right Visual - Mobile Dashboard Preview */}
              <div className={`relative transition-all duration-1000 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{
                animation: isVisible ? 'slideInFromRight 1.8s ease-out forwards' : 'none'
              }}>
            {/* Main Dashboard Card */}
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 lg:p-8 border border-white/20 transform hover:scale-105 transition-all duration-500">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <ChartBarIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Dashboard</h3>
                    <p className="text-sm text-gray-500">Live Updates</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500">Online</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600 mb-1">24</div>
                  <div className="text-sm text-blue-700 font-medium">Total Laporan</div>
                  <div className="text-xs text-blue-600">+12% dari bulan lalu</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                  <div className="text-2xl font-bold text-green-600 mb-1">18</div>
                  <div className="text-sm text-green-700 font-medium">Selesai</div>
                  <div className="text-xs text-green-600">75% completion rate</div>
                </div>
              </div>

              {/* Chart Section */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">Laporan per Kategori</h4>
                <div className="space-y-3">
                  {[
                    { name: 'AC', value: 75, color: 'bg-blue-500' },
                    { name: 'Proyektor', value: 50, color: 'bg-red-500' },
                    { name: 'Lainnya', value: 30, color: 'bg-green-500' }
                  ].map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
                          <span className="text-sm font-medium text-gray-700">{item.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">{item.value}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${item.color} transition-all duration-1000 delay-${index * 200}`}
                          style={{ width: `${item.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div 
              className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-xl"
              style={{
                animation: isVisible ? 'elasticIn 2s ease-out forwards' : 'none',
                animationDelay: '2.5s'
              }}
            >
              <BellIcon className="w-8 h-8 text-white" />
            </div>
            <div 
              className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center shadow-xl"
              style={{
                animation: isVisible ? 'zoomInRotate 2.2s ease-out forwards' : 'none',
                animationDelay: '2.7s'
              }}
            >
              <UserGroupIcon className="w-6 h-6 text-white" />
            </div>
            <div 
              className="absolute top-1/2 -right-8 w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg"
              style={{
                animation: isVisible ? 'bounceIn 2.4s ease-out forwards' : 'none',
                animationDelay: '2.9s'
              }}
            >
              <ShieldCheckIcon className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}
