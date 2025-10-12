'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L3 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">E-Report</h2>
                <p className="text-xs text-gray-500">Sistem Laporan Kendala</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 py-6 space-y-4">
            <Link 
              href="#features" 
              className="block py-3 text-gray-600 hover:text-gray-900 transition-colors border-b border-gray-100"
              onClick={onClose}
            >
              Fitur
            </Link>
            <Link 
              href="#benefits" 
              className="block py-3 text-gray-600 hover:text-gray-900 transition-colors border-b border-gray-100"
              onClick={onClose}
            >
              Manfaat
            </Link>
            <Link 
              href="#about" 
              className="block py-3 text-gray-600 hover:text-gray-900 transition-colors border-b border-gray-100"
              onClick={onClose}
            >
              Tentang
            </Link>
          </nav>

          {/* Actions */}
          <div className="p-6 border-t border-gray-200 space-y-4">
            <Link href="/login" onClick={onClose}>
              <Button className="w-full">
                Masuk
              </Button>
            </Link>
            <Link href="/register" onClick={onClose}>
              <Button variant="outline" className="w-full">
                Daftar
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
