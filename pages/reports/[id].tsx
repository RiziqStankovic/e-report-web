'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { Layout } from '@/components/layout/Layout'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { FileImage } from '@/components/ui/FileUpload'
import { 
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  PhotoIcon,
  UserIcon,
  CalendarIcon,
  MapPinIcon,
  TagIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { Report } from '@/types'
import { reportsApi } from '@/lib/api'
import { useApiError } from '@/hooks/useApiError'
import toast from 'react-hot-toast'
import Image from 'next/image'
// import { ImagePreviewModal } from '@/components/ui/ImageUpload'


export default function ReportDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const { user, isAuthenticated } = useAuth()
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [showImagePreview, setShowImagePreview] = useState(false)
  const [previewImageUrl, setPreviewImageUrl] = useState('')
  const { error, executeWithErrorHandling } = useApiError()

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showImagePreview) {
        setShowImagePreview(false)
      }
    }

    if (showImagePreview) {
      document.addEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'hidden' // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'unset'
    }
  }, [showImagePreview])

  // Fetch report details
  const fetchReport = useCallback(async () => {
    if (!id || typeof id !== 'string') return

    await executeWithErrorHandling(async () => {
      setLoading(true)
      try {
        const data = await reportsApi.getById(id)
        setReport(data)
      } catch (error: unknown) {
        console.error('Error fetching report:', error)
        
        // If it's a network error, show a more helpful message
        if (error && typeof error === 'object' && 'code' in error && error.code === 'NETWORK_ERROR') {
          throw new Error('Backend server tidak berjalan. Silakan jalankan backend terlebih dahulu dengan perintah: cd e-report-be && go run main.go')
        }
        
        if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string' && error.message.includes('Network connection failed')) {
          throw new Error('Backend server tidak berjalan. Silakan jalankan backend terlebih dahulu dengan perintah: cd e-report-be && go run main.go')
        }
        
        throw error
      } finally {
        setLoading(false)
      }
    }, 'Report Details')
  }, [id, executeWithErrorHandling])

  useEffect(() => {
    if (isAuthenticated && id) {
      fetchReport()
    }
  }, [isAuthenticated, id, fetchReport])

  // Update report status
  const updateStatus = async (newStatus: string) => {
    if (!report) return

    await executeWithErrorHandling(async () => {
      setUpdating(true)
      try {
        const updatedReport = await reportsApi.update(report.id, {
          status: newStatus as 'menunggu' | 'diproses' | 'selesai'
        })
        setReport(updatedReport)
        toast.success('Status laporan berhasil diperbarui')
      } catch (error) {
        throw error
      } finally {
        setUpdating(false)
      }
    }, 'Update Status')
  }

  // Delete report
  const deleteReport = async () => {
    if (!report) return

    if (!confirm('Apakah Anda yakin ingin menghapus laporan ini?')) return

    await executeWithErrorHandling(async () => {
      try {
        await reportsApi.delete(report.id)
        toast.success('Laporan berhasil dihapus')
        router.push('/reports')
      } catch (error) {
        throw error
      }
    }, 'Delete Report')
  }

  // Handle image preview
  const handleImagePreview = (url: string) => {
    // Convert relative path to full URL if needed
    let fullUrl = url
    if (url.startsWith('/uploads/')) {
      const isDevelopment = process.env.NODE_ENV !== 'production'
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || (isDevelopment ? 'https://be-ereport.cloudfren.id' : 'https://be-ereport.cloudfren.id')
      const cleanBaseUrl = baseUrl.endsWith('/api') ? baseUrl.replace('/api', '') : baseUrl
      fullUrl = `${cleanBaseUrl}${url}`
    }
    
    
    setPreviewImageUrl(fullUrl)
    setShowImagePreview(true)
  }

  // Get status color and icon
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
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Check if user can edit/delete
  const canEdit = user?.id === report?.userId || user?.role === 'admin'
  const canDelete = user?.role === 'admin' || user?.role === 'staff'

  if (!isAuthenticated) {
    return <Layout><div className="text-center py-8 text-red-500">Silakan login terlebih dahulu.</div></Layout>
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    )
  }

  if (!report) {
    return (
      <Layout>
        <div className="text-center py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <div className="text-red-600 text-lg font-semibold mb-2">
              Laporan tidak ditemukan
            </div>
            <p className="text-red-500 text-sm mb-4">
              {error?.message || 'Terjadi kesalahan saat memuat laporan.'}
            </p>
            <div className="space-y-2">
              <button
                onClick={() => fetchReport()}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
              >
                Coba Lagi
              </button>
              <button
                onClick={() => router.push('/reports')}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors ml-2"
              >
                Kembali ke Daftar Laporan
              </button>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  const statusInfo = getStatusInfo(report.status)
  const StatusIcon = statusInfo.icon

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Kembali
            </Button>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Detail Laporan #{report.id.substring(0, 8)}
              </h1>
              <p className="text-gray-600">
                Dibuat oleh {report.user.name} • {formatDate(report.createdAt)}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {canEdit && (
              <Button
                variant="outline"
                onClick={() => router.push(`/reports/edit/${report.id}`)}
              >
                <PencilIcon className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
            
            {canDelete && (
              <Button
                variant="danger"
                onClick={deleteReport}
              >
                <TrashIcon className="w-4 h-4 mr-2" />
                Hapus
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Details */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Informasi Laporan</CardTitle>
                  <Badge className={statusInfo.color}>
                    <StatusIcon className="w-4 h-4 mr-1" />
                    {statusInfo.label}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <UserIcon className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Pelapor</p>
                      <p className="font-semibold text-gray-900">{report.user.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <CalendarIcon className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Tanggal</p>
                      <p className="font-semibold text-gray-900">{formatDate(report.createdAt)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPinIcon className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Kelas</p>
                      <p className="font-semibold text-gray-900">{report.kelas}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <ClockIcon className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Shift</p>
                      <p className="font-semibold text-gray-900">{report.shift}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPinIcon className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Ruangan</p>
                      <p className="font-semibold text-gray-900">{report.ruangan}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <TagIcon className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Kategori</p>
                      <p className="font-semibold text-gray-900">{report.kategori}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-base font-semibold text-gray-900 mb-3">Deskripsi</h4>
                  <p className="text-gray-800 bg-gray-50 p-4 rounded-lg text-sm leading-relaxed">
                    {report.deskripsi}
                  </p>
                </div>

                {/* Photos */}
                <div>
                  <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                    <PhotoIcon className="w-5 h-5 mr-2" />
                    Foto Laporan
                  </h4>
                  {report.foto && report.foto.trim() !== '' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative group">
                        <div onClick={() => handleImagePreview(report.foto!)}>
                          <FileImage
                            filename={report.foto}
                            alt="Foto laporan"
                            className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                            fallback={
                              <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                                <PhotoIcon className="w-12 h-12 text-gray-400" />
                                <p className="text-gray-500 text-sm ml-2">Gagal memuat foto</p>
                              </div>
                            }
                          />
                        </div>
                        {/* Temporarily disabled overlay for debugging */}
                        {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                          <EyeIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </div> */}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gray-100 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                      <PhotoIcon className="w-12 h-12 text-gray-400 mb-2" />
                      <p className="text-gray-500 text-sm">Tidak ada foto</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Actions */}
            {(user?.role === 'staff' || user?.role === 'kepala_bagian' || user?.role === 'admin') && (
              <Card>
                <CardHeader>
                  <CardTitle>Update Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant={report.status === 'menunggu' ? 'primary' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => updateStatus('menunggu')}
                    disabled={updating}
                  >
                    <ClockIcon className="w-4 h-4 mr-2" />
                    Menunggu
                  </Button>
                  
                  <Button
                    variant={report.status === 'diproses' ? 'primary' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => updateStatus('diproses')}
                    disabled={updating}
                  >
                    <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                    Diproses
                  </Button>
                  
                  <Button
                    variant={report.status === 'selesai' ? 'primary' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => updateStatus('selesai')}
                    disabled={updating}
                  >
                    <CheckCircleIcon className="w-4 h-4 mr-2" />
                    Selesai
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Report Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Statistik</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Durasi</span>
                  <span className="font-semibold text-gray-900">
                    {Math.floor((Date.now() - new Date(report.createdAt).getTime()) / (1000 * 60 * 60 * 24))} hari
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Terakhir Diupdate</span>
                  <span className="font-semibold text-gray-900 text-xs">
                    {formatDate(report.updatedAt || report.createdAt)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Image Preview Modal */}
        {showImagePreview && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowImagePreview(false)}
          >
            <div 
              className="bg-white rounded-lg p-4 max-w-4xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Foto Laporan</h3>
                <button
                  onClick={() => setShowImagePreview(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                >
                  ✕
                </button>
              </div>
              <div className="flex justify-center">
                <Image
                  src={previewImageUrl}
                  alt="Preview Foto Laporan"
                  width={800}
                  height={600}
                  unoptimized={true}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg"
                  onError={() => {
                    console.error('[ImagePreview] Failed to load image:', previewImageUrl)
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}