'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Layout } from '@/components/layout/Layout'
import { ReportsList } from '@/components/reports/ReportsList'
import { CreateReportForm } from '@/components/reports/CreateReportForm'
import { Button } from '@/components/ui/Button'
import { ErrorHandler } from '@/components/ErrorHandler'
import { useApiError } from '@/hooks/useApiError'
import { PlusIcon, FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Report } from '@/types'
import { reportsApi } from '@/lib/api'

export default function ReportsPage() {
  const { user, isAuthenticated } = useAuth()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    jenis: '',
    kategori: '',
    kelas: '',
    shift: '',
    ruangan: ''
  })
  const { error, executeWithErrorHandling } = useApiError()

  const fetchReports = useCallback(async () => {
    await executeWithErrorHandling(async () => {
      setLoading(true)
      try {
        const data = await reportsApi.getAll()
        setReports(data)
      } catch {
        // No fallback data - use empty array
        setReports([])
      } finally {
        setLoading(false)
      }
    }, 'Reports')
  }, [executeWithErrorHandling])

  useEffect(() => {
    if (isAuthenticated) {
      fetchReports()
    }
  }, [isAuthenticated, fetchReports])

  const handleUpdateReport = async (id: string, updates: Record<string, unknown>) => {
    await executeWithErrorHandling(async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updatedReport = await reportsApi.update(id, updates as any)
        setReports(prev =>
          prev.map(report =>
            report.id === id ? updatedReport : report
          )
        )
      } catch (error) {
        throw error
      }
    }, 'Update Report')
  }

  const filteredReports = (reports || []).filter(report => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      const searchableText = [
        report.deskripsi || '',
        report.kategori || '',
        report.kelas || '',
        report.ruangan || '',
        report.user?.name || ''
      ].join(' ').toLowerCase()
      
      if (!searchableText.includes(searchTerm)) return false
    }
    
    // Other filters
    if (filters.status && report.status !== filters.status) return false
    if (filters.jenis && report.jenis !== filters.jenis) return false
    if (filters.kategori && report.kategori !== filters.kategori) return false
    if (filters.kelas && report.kelas !== filters.kelas) return false
    if (filters.shift && report.shift !== filters.shift) return false
    if (filters.ruangan && report.ruangan !== filters.ruangan) return false
    return true
  })

  if (!isAuthenticated) {
    return null
  }

  return (
    <Layout>
      <ErrorHandler error={error} onRetry={fetchReports} />
      
      <div className="space-y-4 sm:space-y-6">
        {/* Header - Mobile First */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 leading-tight">Laporan</h1>
              <p className="text-blue-100 text-sm sm:text-base lg:text-lg">
                {user?.role === 'ketua_kelas' 
                  ? 'Kelola laporan yang Anda buat'
                  : 'Kelola semua laporan yang masuk'
                }
              </p>
            </div>
            
            {user?.role === 'ketua_kelas' && (
              <Button
                onClick={() => setShowCreateForm(true)}
                className="mt-3 sm:mt-0 bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto"
              >
                <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="text-sm sm:text-base">Buat Laporan</span>
              </Button>
            )}
          </div>
        </div>

        {/* Search Container */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
              <MagnifyingGlassIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            Cari Laporan
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Cari berdasarkan judul, deskripsi, atau kategori..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              />
            </div>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <FunnelIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="text-sm sm:text-base">Filter</span>
            </Button>
          </div>
        </div>

        {/* Filters - Only show when toggled */}
        {showFilters && (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                <FunnelIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              Filter Laporan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                >
                  <option value="">Semua Status</option>
                  <option value="menunggu">Menunggu</option>
                  <option value="diproses">Diproses</option>
                  <option value="selesai">Selesai</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis
                </label>
                <select
                  value={filters.jenis}
                  onChange={(e) => setFilters(prev => ({ ...prev, jenis: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                >
                  <option value="">Semua Jenis</option>
                  <option value="kendala">Kendala</option>
                  <option value="kebutuhan">Kebutuhan</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <select
                  value={filters.kategori}
                  onChange={(e) => setFilters(prev => ({ ...prev, kategori: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                >
                  <option value="">Semua Kategori</option>
                  <option value="AC">AC</option>
                  <option value="Proyektor">Proyektor</option>
                  <option value="Pengajar">Pengajar</option>
                  <option value="Kebersihan">Kebersihan</option>
                  <option value="Furnitur">Furnitur</option>
                  <option value="Listrik">Listrik</option>
                  <option value="Internet">Internet</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Reports List */}
        <ReportsList
          reports={filteredReports}
          loading={loading}
          onUpdate={handleUpdateReport}
          userRole={user?.role}
        />

        {/* Create Report Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CreateReportForm />
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}