'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/router'
import { Layout } from '@/components/layout/Layout'
import { MasterDataTable } from '@/components/admin/MasterDataTable'
import { ErrorHandler } from '@/components/ErrorHandler'
import { useApiError } from '@/hooks/useApiError'
import { CogIcon } from '@heroicons/react/24/outline'

export default function MasterDataPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<string>('kelas')
  const { error } = useApiError()

  const dataTypes = [
    { value: 'kelas', label: 'Kelas', icon: '🏫' },
    { value: 'shift', label: 'Shift', icon: '⏰' },
    { value: 'ruangan', label: 'Ruangan', icon: '🚪' },
    { value: 'kategori', label: 'Kategori', icon: '📋' }
  ]

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    } else if (user?.role === 'ketua_kelas') {
      router.push('/dashboard')
    }
  }, [isAuthenticated, user, router])





  if (!isAuthenticated) {
    return null
  }

  const currentType = dataTypes.find(type => type.value === selectedType)

  return (
    <Layout>
      <ErrorHandler error={error} />
      
      <div className="space-y-4 sm:space-y-6">
        {/* Header - Mobile First */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 leading-tight">Data Master</h1>
              <p className="text-purple-100 text-sm sm:text-base lg:text-lg">
                Kelola data master untuk sistem laporan
              </p>
            </div>
            
          </div>
        </div>

        {/* Data Type Selector - Mobile First */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
              <CogIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            Pilih Jenis Data
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {dataTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-300 active:scale-95 ${
                  selectedType === type.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:shadow-md'
                }`}
              >
                <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{type.icon}</div>
                <div className="font-medium text-sm sm:text-base">{type.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Master Data Table */}
        <MasterDataTable
          type={selectedType as 'kelas' | 'shift' | 'ruangan' | 'kategori'}
          title={currentType?.label || 'Data Master'}
        />

      </div>
    </Layout>
  )
}