'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { formatDate } from '@/lib/utils'
import { Report, UpdateReportData } from '@/types'
import { reportsApi } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'
import { 
  ArrowLeftIcon,
  PhotoIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import { FileImage } from '@/components/ui/FileUpload'

interface ReportDetailProps {
  reportId: string
}

export function ReportDetail({ reportId }: ReportDetailProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [status, setStatus] = useState('')
  const [catatan, setCatatan] = useState('')

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true)
      const data = await reportsApi.getById(reportId)
      setReport(data)
      setStatus(data.status)
      setCatatan(data.catatan || '')
    } catch {
      toast.error('Gagal memuat detail laporan')
      router.push('/reports')
    } finally {
      setLoading(false)
    }
  }, [reportId, router])

  useEffect(() => {
    fetchReport()
  }, [fetchReport])

  const handleUpdateStatus = async () => {
    try {
      setUpdating(true)
      const updateData: UpdateReportData = {
        status: status as 'menunggu' | 'diproses' | 'selesai',
        catatan: catatan || undefined
      }
      
      await reportsApi.update(reportId, updateData)
      toast.success('Status laporan berhasil diperbarui')
      fetchReport()
    } catch {
      toast.error('Gagal memperbarui status laporan')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Laporan tidak ditemukan</p>
      </div>
    )
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'menunggu':
        return 'warning'
      case 'diproses':
        return 'info'
      case 'selesai':
        return 'success'
      default:
        return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'menunggu':
        return 'Menunggu'
      case 'diproses':
        return 'Diproses'
      case 'selesai':
        return 'Selesai'
      default:
        return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'menunggu':
        return <ClockIcon className="w-5 h-5" />
      case 'diproses':
        return <CheckCircleIcon className="w-5 h-5" />
      case 'selesai':
        return <XCircleIcon className="w-5 h-5" />
      default:
        return <ClockIcon className="w-5 h-5" />
    }
  }

  const canUpdateStatus = user?.role === 'admin' || user?.role === 'staff' || user?.role === 'kepala_bagian'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center space-x-2"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Kembali</span>
        </Button>
      </div>

      {/* Report Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3">
              <span>Laporan #{report.id.slice(-8)}</span>
              <Badge variant={getStatusVariant(report.status) as 'default' | 'info' | 'warning' | 'success' | 'danger'}>
                {getStatusIcon(report.status)}
                <span className="ml-1">{getStatusLabel(report.status)}</span>
              </Badge>
            </CardTitle>
            <Badge variant="default">
              {report.jenis === 'kendala' ? 'Kendala' : 'Kebutuhan'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Kelas</label>
              <p className="text-sm text-gray-900">{report.kelas}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Shift</label>
              <p className="text-sm text-gray-900">{report.shift}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Ruangan</label>
              <p className="text-sm text-gray-900">{report.ruangan}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Kategori</label>
            <p className="text-sm text-gray-900">{report.kategori}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Deskripsi</label>
            <p className="text-sm text-gray-900 whitespace-pre-wrap">{report.deskripsi}</p>
          </div>

          {/* Photo */}
          {report.foto && (
            <div>
              <label className="text-sm font-medium text-gray-500">Foto Pendukung</label>
              <div className="mt-2">
                <FileImage
                  filename={report.foto}
                  alt="Foto laporan"
                  className="w-full max-w-md h-64 object-cover rounded-lg border border-gray-200"
                  fallback={
                    <div className="w-full max-w-md h-64 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                      <PhotoIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  }
                />
              </div>
            </div>
          )}

          {/* Report Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="text-sm font-medium text-gray-500">Dibuat oleh</label>
              <p className="text-sm text-gray-900">{report.user.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Tanggal Dibuat</label>
              <p className="text-sm text-gray-900">{formatDate(report.createdAt)}</p>
            </div>
          </div>

          {/* Catatan */}
          {report.catatan && (
            <div>
              <label className="text-sm font-medium text-gray-500">Catatan</label>
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{report.catatan}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Update Status (for staff/admin) */}
      {canUpdateStatus && (
        <Card>
          <CardHeader>
            <CardTitle>Update Status Laporan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { value: 'menunggu', label: 'Menunggu' },
                { value: 'diproses', label: 'Diproses' },
                { value: 'selesai', label: 'Selesai' }
              ]}
            />
            
            <Textarea
              label="Catatan (Opsional)"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Tambahkan catatan untuk laporan ini..."
              rows={3}
            />
            
            <Button
              onClick={handleUpdateStatus}
              loading={updating}
              disabled={updating || status === report.status}
            >
              {updating ? 'Memperbarui...' : 'Perbarui Status'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
