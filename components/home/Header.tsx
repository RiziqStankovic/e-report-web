'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { 
  Bars3Icon, 
  XMarkIcon,
} from '@heroicons/react/24/outline'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200/50' 
        : 'bg-white/10 backdrop-blur-md'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <svg className="w-6 h-6 lg:w-7 lg:h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L3 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1 className={`text-lg lg:text-xl font-bold transition-colors duration-300 ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}>
                E-Report
              </h1>
              <p className={`text-xs transition-colors duration-300 ${
                isScrolled ? 'text-gray-500' : 'text-white/80'
              }`}>
                Sistem Laporan Kendala
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <button 
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className={`font-medium transition-all duration-300 hover:scale-105 ${
                isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/90 hover:text-white'
              }`}
            >
              Fitur
            </button>
            <button 
              onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })}
              className={`font-medium transition-all duration-300 hover:scale-105 ${
                isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/90 hover:text-white'
              }`}
            >
              Manfaat
            </button>
            <button 
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              className={`font-medium transition-all duration-300 hover:scale-105 ${
                isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/90 hover:text-white'
              }`}
            >
              Tentang
            </button>
            <Link href="/login">
              <Button 
                className={`px-6 py-2.5 font-semibold transition-all duration-300 hover:scale-105 ${
                  isScrolled 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl' 
                    : 'bg-white text-blue-600 hover:bg-gray-50 shadow-lg hover:shadow-xl'
                }`}
              >
                Masuk
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
              isScrolled 
                ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
                : 'text-white hover:text-white/80 hover:bg-white/10'
            }`}
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen 
            ? 'max-h-96 opacity-100' 
            : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 space-y-2">
            <button 
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
                setIsMobileMenuOpen(false)
              }}
              className={`block px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 w-full text-left ${
                isScrolled 
                  ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
                  : 'text-white hover:text-white/80 hover:bg-white/10'
              }`}
            >
              Fitur
            </button>
            <button 
              onClick={() => {
                document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })
                setIsMobileMenuOpen(false)
              }}
              className={`block px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 w-full text-left ${
                isScrolled 
                  ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
                  : 'text-white hover:text-white/80 hover:bg-white/10'
              }`}
            >
              Manfaat
            </button>
            <button 
              onClick={() => {
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
                setIsMobileMenuOpen(false)
              }}
              className={`block px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 w-full text-left ${
                isScrolled 
                  ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
                  : 'text-white hover:text-white/80 hover:bg-white/10'
              }`}
            >
              Tentang
            </button>
            <div className="px-4 pt-2">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 transition-all duration-300 hover:scale-105 shadow-lg">
                  Masuk
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

