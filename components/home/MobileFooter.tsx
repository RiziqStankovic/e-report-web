'use client'

import React from 'react'
import Link from 'next/link'

export function MobileFooter() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Logo & Description */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L3 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold">E-Report</h3>
              <p className="text-xs text-gray-400">Sistem Laporan Kendala</p>
            </div>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed max-w-md mx-auto">
            Solusi pelaporan kendala pembelajaran yang cepat, efisien, dan terintegrasi dengan notifikasi WhatsApp untuk penanganan instan.
          </p>
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-4 text-center">Tautan Cepat</h4>
          <div className="grid grid-cols-2 gap-4">
            <Link href="#features" className="text-sm text-gray-400 hover:text-white transition-colors text-center py-2">
              Fitur
            </Link>
            <Link href="#benefits" className="text-sm text-gray-400 hover:text-white transition-colors text-center py-2">
              Manfaat
            </Link>
            <Link href="#about" className="text-sm text-gray-400 hover:text-white transition-colors text-center py-2">
              Tentang
            </Link>
            <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors text-center py-2">
              Masuk
            </Link>
          </div>
        </div>

        {/* Contact */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-4 text-center">Kontak</h4>
          <div className="space-y-2 text-sm text-gray-400 text-center">
            <p>Email: info@E-Report.com</p>
            <p>Telepon: (021) 1234-5678</p>
            <p>WhatsApp: +62 812-3456-7890</p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © 2024 Sistem Informasi Laporan Kendala. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
