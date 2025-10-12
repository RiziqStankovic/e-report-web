'use client'

import React from 'react'
import { useRouter } from 'next/router'
import { Button } from '@/components/ui/Button'
import { 
  ExclamationTriangleIcon,
  HomeIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'

export default function Custom404() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <ExclamationTriangleIcon className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Halaman Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-8">
            Maaf, halaman yang Anda cari tidak dapat ditemukan. 
            Mungkin halaman tersebut telah dipindahkan atau dihapus.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => router.push('/')}
            className="w-full"
          >
            <HomeIcon className="w-5 h-5 mr-2" />
            Kembali ke Beranda
          </Button>
          
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="w-full"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Kembali ke Halaman Sebelumnya
          </Button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Jika masalah ini berlanjut, silakan hubungi administrator.</p>
        </div>
      </div>
    </div>
  )
}
