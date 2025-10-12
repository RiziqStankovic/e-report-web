'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { 
  Bars3Icon, 
} from '@heroicons/react/24/outline'

export function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L3 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">E-Report</h1>
              <p className="text-xs text-gray-500">Sistem Laporan Kendala</p>
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="#features" 
                className="text-gray-600 hover:text-gray-900 transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Fitur
              </Link>
              <Link 
                href="#benefits" 
                className="text-gray-600 hover:text-gray-900 transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Manfaat
              </Link>
              <Link 
                href="#about" 
                className="text-gray-600 hover:text-gray-900 transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Tentang
              </Link>
              <Link href="/login" className="px-2 py-1">
                <Button className="w-full mobile-btn">
                  Masuk
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
