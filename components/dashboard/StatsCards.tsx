'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { 
  ClipboardDocumentListIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { DashboardStats } from '@/types'

interface StatsCardsProps {
  stats: DashboardStats | null
  loading?: boolean
  error?: Error | null
}

export function StatsCards({ stats, loading = false, error }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Laporan',
      value: stats?.totalReports || 0,
      icon: ClipboardDocumentListIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Menunggu',
      value: stats?.pendingReports || 0,
      icon: ClockIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      title: 'Diproses',
      value: stats?.processedReports || 0,
      icon: ExclamationTriangleIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Selesai',
      value: stats?.completedReports || 0,
      icon: CheckCircleIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    }
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="border-l-4 border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-gray-50 animate-pulse">
                  <div className="w-6 h-6 bg-gray-200 rounded"></div>
                </div>
                <div className="ml-4 flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="col-span-full border-l-4 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-50">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Error Loading Stats</p>
                <p className="text-sm text-red-600">{error.message}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <Card key={index} className={`${card.borderColor} border-l-4 hover:shadow-lg transition-shadow`}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className={`text-2xl font-bold ${card.color}`}>
                  {card.value.toLocaleString('id-ID')}
                </p>
                {card.title === 'Selesai' && stats?.totalReports && stats.totalReports > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round((card.value / stats.totalReports) * 100)}% completion rate
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
