'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/router'
import { Layout } from '@/components/layout/Layout'
import { ReportsList } from '@/components/reports/ReportsList'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { CustomSelect } from '@/components/ui/CustomSelect'
import { ErrorHandler } from '@/components/ErrorHandler'
import { useApiError } from '@/hooks/useApiError'
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { Report } from '@/types'
import { reportsApi } from '@/lib/api'

export default function MyReportsPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: '',
    jenis: '',
    kategori: ''
  })
  const { error, executeWithErrorHandling } = useApiError()

  const fetchMyReports = useCallback(async () => {
    await executeWithErrorHandling(async () => {
      setLoading(true)
      try {
        const data = await reportsApi.getMyReports()
        setReports(data)
      } catch (error) {
        console.error('Error fetching reports:', error)
        // No fallback data - use empty array
        setReports([])
      } finally {
        setLoading(false)
      }
    }, 'My Reports')
  }, [executeWithErrorHandling])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    } else {
      fetchMyReports()
    }
  }, [isAuthenticated, user, router, fetchMyReports])

  const filteredReports = reports.filter(report => {
    if (filters.status && report.status !== filters.status) return false
    if (filters.jenis && report.jenis !== filters.jenis) return false
    if (filters.kategori && report.kategori !== filters.kategori) return false
    return true
  })

  const getStatusCounts = () => {
    const counts = {
      total: reports.length,
      menunggu: reports.filter(r => r.status === 'menunggu').length,
      diproses: reports.filter(r => r.status === 'diproses').length,
      selesai: reports.filter(r => r.status === 'selesai').length
    }
    return counts
  }

  const statusCounts = getStatusCounts()

  if (!isAuthenticated) {
    return null
  }

  return (
    <Layout>
      <ErrorHandler error={error} onRetry={fetchMyReports} />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Laporan Saya</h1>
            <p className="text-gray-600">
              Kelola laporan yang telah Anda buat
            </p>
          </div>
          
          <Button
            onClick={() => router.push('/reports/create')}
            className="mt-4 sm:mt-0"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Buat Laporan Baru
          </Button>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Laporan</p>
                  <p className="text-2xl font-bold text-gray-900">{statusCounts.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Menunggu</p>
                  <p className="text-2xl font-bold text-gray-900">{statusCounts.menunggu}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Diproses</p>
                  <p className="text-2xl font-bold text-gray-900">{statusCounts.diproses}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Selesai</p>
                  <p className="text-2xl font-bold text-gray-900">{statusCounts.selesai}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FunnelIcon className="w-5 h-5 mr-2" />
              Filter Laporan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <CustomSelect
                label="Status"
                placeholder="Semua Status"
                options={[
                  { value: '', label: 'Semua Status' },
                  { value: 'menunggu', label: 'Menunggu' },
                  { value: 'diproses', label: 'Diproses' },
                  { value: 'selesai', label: 'Selesai' }
                ]}
                value={filters.status}
                onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
              />
              
              <CustomSelect
                label="Jenis"
                placeholder="Semua Jenis"
                options={[
                  { value: '', label: 'Semua Jenis' },
                  { value: 'kendala', label: 'Kendala' },
                  { value: 'kebutuhan', label: 'Kebutuhan' }
                ]}
                value={filters.jenis}
                onChange={(value) => setFilters(prev => ({ ...prev, jenis: value }))}
              />
              
              <CustomSelect
                label="Kategori"
                placeholder="Semua Kategori"
                options={[
                  { value: '', label: 'Semua Kategori' },
                  { value: 'AC', label: 'AC' },
                  { value: 'Proyektor', label: 'Proyektor' },
                  { value: 'Pengajar', label: 'Pengajar' },
                  { value: 'Kebersihan', label: 'Kebersihan' },
                  { value: 'Furnitur', label: 'Furnitur' },
                  { value: 'Listrik', label: 'Listrik' },
                  { value: 'Internet', label: 'Internet' },
                  { value: 'Lainnya', label: 'Lainnya' }
                ]}
                value={filters.kategori}
                onChange={(value) => setFilters(prev => ({ ...prev, kategori: value }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        <ReportsList
          reports={filteredReports}
          loading={loading}
          onUpdate={async () => {}}
          userRole="ketua_kelas"
          showMyReports={true}
        />
      </div>
    </Layout>
  )
}