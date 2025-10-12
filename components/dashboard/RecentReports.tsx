'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import { Report } from '@/types'
import Link from 'next/link'
import { EyeIcon } from '@heroicons/react/24/outline'

interface RecentReportsProps {
  reports: Report[]
}

export function RecentReports({ reports }: RecentReportsProps) {
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
    <Card>
      <CardHeader>
        <CardTitle>Laporan Terbaru</CardTitle>
      </CardHeader>
      <CardContent>
        {reports.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Belum ada laporan</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {report.kelas} - Shift {report.shift} - {report.ruangan}
                    </h4>
                    <Badge variant={getStatusVariant(report.status) as 'default' | 'info' | 'warning' | 'success' | 'danger'}>
                      {getStatusLabel(report.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Kategori:</span> {report.kategori}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {report.deskripsi}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDate(report.createdAt)} • Oleh {report.user.name}
                  </p>
                </div>
                <Link
                  href={`/reports/${report.id}`}
                  className="ml-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <EyeIcon className="w-5 h-5" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
