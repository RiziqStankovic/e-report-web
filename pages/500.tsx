'use client'

import React from 'react'
import { useRouter } from 'next/router'
import { Button } from '@/components/ui/Button'
import { 
  ExclamationCircleIcon,
  HomeIcon,
  ArrowLeftIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

export default function Custom500() {
  const router = useRouter()

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <ExclamationCircleIcon className="w-24 h-24 text-red-400 mx-auto mb-4" />
          <h1 className="text-6xl font-bold text-gray-900 mb-2">500</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Terjadi Kesalahan Server</h2>
          <p className="text-gray-600 mb-8">
            Maaf, terjadi kesalahan pada server. 
            Tim kami telah diberitahu dan sedang memperbaiki masalah ini.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleRefresh}
            className="w-full"
          >
            <ArrowPathIcon className="w-5 h-5 mr-2" />
            Coba Lagi
          </Button>
          
          <Button
            variant="outline"
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
          <p className="mt-2">
            <strong>Error ID:</strong> {Date.now().toString(36)}
          </p>
        </div>
      </div>
    </div>
  )
}
