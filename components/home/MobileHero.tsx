'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'
import { getSvgPattern } from '@/lib/svg-patterns'
import { 
  ChartBarIcon,
  BellIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

export function MobileHero() {
  return (
    <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `url(${getSvgPattern('DOTS')})`,
          backgroundSize: '60px 60px',
          backgroundRepeat: 'repeat'
        }}
      ></div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L3 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">E-Report</h1>
            <p className="text-gray-600">Sistem Laporan Kendala Pembelajaran</p>
          </div>

          {/* Main Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
            Sistem Laporan Kendala Pembelajaran
          </h2>
          
          {/* Description */}
          <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Solusi pelaporan kendala kelas yang cepat, efisien, dan terintegrasi langsung dengan notifikasi WhatsApp untuk penanganan instan.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="px-8 py-4 text-lg mobile-btn">
              Mulai Sekarang
            </Button>
            {/* <Button variant="outline" size="lg" className="px-8 py-4 text-lg mobile-btn">
              Pelajari Lebih Lanjut
            </Button> */}
          </div>

          {/* Mobile Dashboard Preview */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200 max-w-sm mx-auto">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ChartBarIcon className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-900 text-sm">Dashboard</span>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-lg font-bold text-blue-600">24</div>
                  <div className="text-xs text-gray-600">Total Laporan</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-lg font-bold text-green-600">18</div>
                  <div className="text-xs text-gray-600">Selesai</div>
                </div>
              </div>

              {/* Chart */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-700">Laporan per Kategori</div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-xs text-gray-600">AC</span>
                    </div>
                    <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div className="w-3/4 h-full bg-blue-500"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-xs text-gray-600">Proyektor</span>
                    </div>
                    <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div className="w-1/2 h-full bg-red-500"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-600">Lainnya</span>
                    </div>
                    <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div className="w-1/3 h-full bg-green-500"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 right-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mobile-gpu">
            <BellIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div className="absolute bottom-20 left-4 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mobile-gpu">
            <UserGroupIcon className="w-5 h-5 text-green-600" />
          </div>
        </div>
      </div>
    </div>
  )
}
