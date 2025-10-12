'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  HeartIcon,
  ArrowUpIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'

export function Footer() {
  const [isBackToTop, setIsBackToTop] = useState(false)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleScroll = () => {
    setIsBackToTop(window.scrollY > 300)
  }

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Floating Orbs */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L3 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">E-Report</h3>
                  <p className="text-blue-200 text-sm">Sistem Laporan Kendala Pembelajaran</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed mb-8 max-w-md">
                Solusi pelaporan kendala pembelajaran yang cepat, efisien, dan terintegrasi dengan notifikasi WhatsApp untuk penanganan instan.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-300">
                  <EnvelopeIcon className="w-5 h-5 text-blue-400" />
                  <span>support@E-Report.com</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <PhoneIcon className="w-5 h-5 text-blue-400" />
                  <span>+62 812-3456-7890</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <MapPinIcon className="w-5 h-5 text-blue-400" />
                  <span>Jakarta, Indonesia</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Tautan Cepat</h4>
              <ul className="space-y-4">
                <li>
                  <Link href="#features" className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                    Fitur
                  </Link>
                </li>
                <li>
                  <Link href="#benefits" className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                    Manfaat
                  </Link>
                </li>
                <li>
                  <Link href="#about" className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                    Tentang
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                    Masuk
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Dukungan</h4>
              <ul className="space-y-4">
                <li>
                  <Link href="/help" className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                    Bantuan
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                    Dokumentasi
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                    Kontak
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                    Privasi
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-gray-400">
              <span>© 2024 E-Report. Dibuat dengan</span>
              <HeartIcon className="w-4 h-4 text-red-500 animate-pulse" />
              <span>di Indonesia</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <span className="text-gray-400 text-sm">Versi 1.0.0</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-400 text-sm">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {isBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 flex items-center justify-center"
        >
          <ArrowUpIcon className="w-6 h-6" />
        </button>
      )}
    </footer>
  )
}