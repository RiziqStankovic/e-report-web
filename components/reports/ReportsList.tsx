'use client'

import React from 'react'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import { Report } from '@/types'
import Link from 'next/link'
import { 
  EyeIcon, 
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import { TableSkeleton } from '@/components/ui/LoadingSkeleton'

interface ReportsListProps {
  reports: Report[]
  loading: boolean
  onUpdate: (id: string, updates: Record<string, unknown>) => Promise<void>
  userRole?: string
  showMyReports?: boolean
}

export function ReportsList({ reports, loading, showMyReports = false }: ReportsListProps) {
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

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Reports List - Mobile First */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
              <DocumentTextIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            {showMyReports ? 'Laporan Saya' : 'Daftar Laporan'}
            {reports && reports.length > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({reports.length} laporan)
              </span>
            )}
          </h2>
        </div>
        <div className="p-4 sm:p-6">
          {loading ? (
            <TableSkeleton rows={3} />
          ) : !reports || reports.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <DocumentTextIcon className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 text-sm sm:text-base font-medium">Tidak ada laporan ditemukan</p>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">Coba ubah filter atau buat laporan baru</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {reports && reports.map((report) => (
                <Link
                  key={report.id}
                  href={`/reports/${report.id}`}
                  className="block p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-3">
                        <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-2 sm:mb-0">
                          {report.kelas} - Shift {report.shift} - {report.ruangan}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant={getStatusVariant(report.status) as 'default' | 'info' | 'warning' | 'success' | 'danger'} className="text-xs">
                            {getStatusLabel(report.status)}
                          </Badge>
                          <Badge variant="default" className="text-xs">
                            {report.jenis === 'kendala' ? 'Kendala' : 'Kebutuhan'}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        <span className="font-semibold text-gray-900">Kategori:</span> {report.kategori}
                      </p>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {report.deskripsi}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(report.createdAt)} • Oleh {report.user.name}
                      </p>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-4 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center group-hover:bg-blue-700">
                      <EyeIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      <span className="text-sm font-medium">Lihat</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}