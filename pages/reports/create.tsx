'use client'

import React, { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/router'
import { Layout } from '@/components/layout/Layout'
import { CreateReportForm } from '@/components/reports/CreateReportForm'
import { ErrorHandler } from '@/components/ErrorHandler'
import { useApiError } from '@/hooks/useApiError'

export default function CreateReportPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const { error } = useApiError()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])


  if (!isAuthenticated) {
    return null
  }

  return (
    <Layout>
      <ErrorHandler error={error} />
      
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200 group"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Kembali</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Buat Laporan Baru
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Laporkan kendala atau kebutuhan yang Anda temukan untuk perbaikan yang lebih baik
            </p>
          </div>
        </div>

        <CreateReportForm />
      </div>
    </Layout>
  )
}