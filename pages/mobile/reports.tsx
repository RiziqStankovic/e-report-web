'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PhotoIcon,
  UserIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import { Report } from '@/types'
import { reportsApi } from '@/lib/api'
import { useApiError } from '@/hooks/useApiError'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { MobileTestSuite } from '@/components/testing/MobileTestSuite'

export default function MobileReportsPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [reports, setReports] = useState<Report[]>([])
  const [filteredReports, setFilteredReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [showTestSuite, setShowTestSuite] = useState(false)
  const { executeWithErrorHandling } = useApiError()

  // Fetch reports
  const fetchReports = useCallback(async () => {
    await executeWithErrorHandling(async () => {
      setLoading(true)
      try {
        const data = user?.role === 'ketua_kelas' 
          ? await reportsApi.getMyReports()
          : await reportsApi.getAll()
        setReports(data)
        setFilteredReports(data)
      } catch (error) {
        throw error
      } finally {
        setLoading(false)
      }
    }, 'Reports')
  }, [executeWithErrorHandling, user?.role])

  useEffect(() => {
    if (isAuthenticated) {
      fetchReports()
    }
  }, [isAuthenticated, user?.role, fetchReports])

  // Filter reports
  useEffect(() => {
    let filtered = reports

    if (searchQuery) {
      filtered = filtered.filter(report =>
        report.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.kelas.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.kategori.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter) {
      filtered = filtered.filter(report => report.status === statusFilter)
    }

    setFilteredReports(filtered)
  }, [reports, searchQuery, statusFilter])

  // Delete report
  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus laporan ini?')) return

    await executeWithErrorHandling(async () => {
      try {
        await reportsApi.delete(id)
        setReports(prev => prev.filter(report => report.id !== id))
        toast.success('Laporan berhasil dihapus')
      } catch (error) {
        throw error
      }
    }, 'Delete Report')
  }

  // Get status info
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'menunggu':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: ClockIcon,
          label: 'Menunggu'
        }
      case 'diproses':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: ExclamationTriangleIcon,
          label: 'Diproses'
        }
      case 'selesai':
        return {
          color: 'bg-green-100 text-green-800',
          icon: CheckCircleIcon,
          label: 'Selesai'
        }
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: ClockIcon,
          label: status
        }
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Akses Ditolak</h1>
          <p className="text-gray-600 mb-4">Silakan login terlebih dahulu</p>
          <Button onClick={() => router.push('/login')}>
            Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900">Laporan</h1>
              <p className="text-sm text-gray-600">
                {user?.role === 'ketua_kelas' ? 'Laporan Saya' : 'Semua Laporan'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTestSuite(!showTestSuite)}
              >
                Test
              </Button>
              {user?.role === 'ketua_kelas' && (
                <Button
                  size="sm"
                  onClick={() => router.push('/reports/create')}
                >
                  <PlusIcon className="w-4 h-4 mr-1" />
                  Buat
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="px-4 pb-3">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari laporan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FunnelIcon className="w-4 h-4" />
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-3 space-y-2">
              <div className="flex space-x-2 overflow-x-auto">
                <Button
                  variant={statusFilter === '' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('')}
                >
                  Semua
                </Button>
                <Button
                  variant={statusFilter === 'menunggu' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('menunggu')}
                >
                  Menunggu
                </Button>
                <Button
                  variant={statusFilter === 'diproses' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('diproses')}
                >
                  Diproses
                </Button>
                <Button
                  variant={statusFilter === 'selesai' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('selesai')}
                >
                  Selesai
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Test Suite */}
        {showTestSuite && (
          <MobileTestSuite className="mb-6" />
        )}

        {/* Reports List */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PhotoIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada laporan</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || statusFilter 
                ? 'Tidak ada laporan yang sesuai dengan filter'
                : 'Belum ada laporan yang dibuat'
              }
            </p>
            {user?.role === 'ketua_kelas' && (
              <Button onClick={() => router.push('/reports/create')}>
                <PlusIcon className="w-4 h-4 mr-2" />
                Buat Laporan Pertama
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReports.map((report) => {
              const statusInfo = getStatusInfo(report.status)
              const StatusIcon = statusInfo.icon

              return (
                <Card key={report.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={statusInfo.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            #{report.id.substring(0, 8)}
                          </span>
                        </div>
                        
                        <h3 className="font-medium text-gray-900 mb-1">
                          {report.kategori} - {report.kelas}
                        </h3>
                        
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {report.deskripsi}
                        </p>
                      </div>
                      
                      {report.foto && (
                        <div className="ml-3 flex-shrink-0">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <PhotoIcon className="w-6 h-6 text-gray-400" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <UserIcon className="w-3 h-3 mr-1" />
                          {report.user.name}
                        </div>
                        <div className="flex items-center">
                          <CalendarIcon className="w-3 h-3 mr-1" />
                          {formatDate(report.createdAt)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <div className="flex items-center">
                          <MapPinIcon className="w-3 h-3 mr-1" />
                          {report.ruangan}
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="w-3 h-3 mr-1" />
                          {report.shift}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/reports/${report.id}`)}
                        >
                          <EyeIcon className="w-4 h-4" />
                        </Button>
                        
                        {(user?.id === report.userId || user?.role === 'admin') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/reports/edit/${report.id}`)}
                          >
                            <PencilIcon className="w-4 h-4" />
                          </Button>
                        )}
                        
                        {(user?.role === 'admin' || user?.role === 'staff') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(report.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      {user?.role === 'ketua_kelas' && (
        <div className="fixed bottom-6 right-6 z-20">
          <Button
            size="lg"
            className="rounded-full w-14 h-14 shadow-lg"
            onClick={() => router.push('/reports/create')}
          >
            <PlusIcon className="w-6 h-6" />
          </Button>
        </div>
      )}
    </div>
  )
}
