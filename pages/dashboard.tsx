'use client'

import React, { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/router'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  ChartBarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  PlusIcon,
  EyeIcon,
  BellIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { CardSkeleton } from '@/components/ui/LoadingSkeleton'
import { useDashboardStats } from '@/hooks/useDashboardStats'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const { stats, loading: statsLoading, error: statsError, refreshStats } = useDashboardStats()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  const handleRefreshStats = () => {
    refreshStats()
    toast.success('Statistik berhasil diperbarui')
  }

  if (loading) {
    return (
      <Layout>
        <div className="space-y-4 sm:space-y-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </Layout>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const getWelcomeMessage = () => {
    switch (user?.role) {
      case 'admin':
        return 'Selamat datang, Admin!'
      case 'ketua_kelas':
        return 'Selamat datang, Ketua Kelas!'
      case 'staff':
        return 'Selamat datang, Staff!'
      case 'kepala_bagian':
        return 'Selamat datang, Kepala Bagian!'
      default:
        return 'Selamat datang!'
    }
  }

  const getQuickActions = () => {
    const actions = []

    if (user?.role === 'ketua_kelas') {
      actions.push(
        {
          title: 'Buat Laporan',
          description: 'Buat laporan kendala baru',
          icon: PlusIcon,
          href: '/reports/create',
          color: 'bg-blue-500'
        },
        {
          title: 'Laporan Saya',
          description: 'Lihat laporan yang saya buat',
          icon: DocumentTextIcon,
          href: '/reports/my',
          color: 'bg-green-500'
        }
      )
    }

    if (user?.role === 'staff' || user?.role === 'kepala_bagian') {
      actions.push(
        {
          title: 'Semua Laporan',
          description: 'Kelola semua laporan',
          icon: EyeIcon,
          href: '/reports',
          color: 'bg-blue-500'
        }
      )
    }

    if (user?.role === 'admin') {
      actions.push(
        {
          title: 'Kelola Pengguna',
          description: 'Manajemen pengguna sistem',
          icon: UserGroupIcon,
          href: '/users',
          color: 'bg-purple-500'
        },
        {
          title: 'Data Master',
          description: 'Kelola data master',
          icon: Cog6ToothIcon,
          href: '/master-data',
          color: 'bg-orange-500'
        },
        {
          title: 'Semua Laporan',
          description: 'Lihat semua laporan',
          icon: EyeIcon,
          href: '/reports',
          color: 'bg-blue-500'
        }
      )
    }

    return actions
  }

  const quickActions = getQuickActions()

  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6">
        {/* Welcome Header - Mobile First */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 leading-tight">
                {getWelcomeMessage()}
              </h1>
              <p className="text-blue-100 text-sm sm:text-base lg:text-lg">
                {user?.name} - {user?.role?.replace('_', ' ').toUpperCase()}
              </p>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-white/20 rounded-full flex items-center justify-center">
                <ChartBarIcon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions - Mobile First */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
              <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            Aksi Cepat
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 border border-gray-200 active:scale-95" onClick={() => router.push(action.href)}>
                  <CardContent className="p-3 sm:p-4 lg:p-6">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className={`p-3 sm:p-4 rounded-xl shadow-lg ${action.color} flex-shrink-0`}>
                        <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg leading-tight">{action.title}</h3>
                        <p className="text-gray-600 text-xs sm:text-sm leading-tight mt-1">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Stats Cards - Mobile First */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 flex items-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                <ChartBarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              Statistik
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshStats}
              disabled={statsLoading}
              className="flex items-center space-x-2"
            >
              <ArrowPathIcon className={`w-4 h-4 ${statsLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
          
          {statsLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {[...Array(4)].map((_, index) => (
                <Card key={index} className="border border-gray-200">
                  <CardContent className="p-3 sm:p-4 lg:p-6">
                    <div className="animate-pulse">
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <div className="w-12 h-12 bg-gray-200 rounded-xl mb-2 sm:mb-0 sm:mr-3"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-6 bg-gray-200 rounded mb-1"></div>
                          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : statsError ? (
            <div className="text-center py-8">
              <div className="text-red-500 mb-4">
                <ExclamationTriangleIcon className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm">Gagal memuat statistik</p>
                <p className="text-xs text-gray-500 mt-1">{statsError.message}</p>
              </div>
              <Button variant="outline" onClick={handleRefreshStats}>
                Coba Lagi
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-200 active:scale-95">
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg mb-2 sm:mb-0 sm:mr-3 w-fit">
                      <ChartBarIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Total Laporan</p>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                        {stats?.totalReports || 0}
                      </p>
                      <p className="text-xs text-green-600">Semua laporan</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-200 active:scale-95">
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <div className="p-2 sm:p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl shadow-lg mb-2 sm:mb-0 sm:mr-3 w-fit">
                      <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Menunggu</p>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                        {stats?.pendingReports || 0}
                      </p>
                      <p className="text-xs text-orange-600">Perlu perhatian</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-200 active:scale-95">
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl shadow-lg mb-2 sm:mb-0 sm:mr-3 w-fit">
                      <ExclamationTriangleIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Diproses</p>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                        {stats?.processedReports || 0}
                      </p>
                      <p className="text-xs text-blue-600">Dalam progres</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-200 active:scale-95">
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <div className="p-2 sm:p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg mb-2 sm:mb-0 sm:mr-3 w-fit">
                      <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Selesai</p>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                        {stats?.completedReports || 0}
                      </p>
                      <p className="text-xs text-green-600">
                        {stats?.totalReports ? Math.round((stats.completedReports / stats.totalReports) * 100) : 0}% completion rate
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Recent Activity - Mobile First */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
              <BellIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            Laporan Terbaru
          </h2>
          
          {statsLoading ? (
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-300 rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                  <div className="flex-1 min-w-0">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : statsError ? (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-4">
                <BellIcon className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm">Gagal memuat laporan terbaru</p>
              </div>
            </div>
          ) : stats?.recentReports && stats.recentReports.length > 0 ? (
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              {stats.recentReports.map((report, index) => {
                const getStatusColor = (status: string) => {
                  switch (status) {
                    case 'menunggu':
                      return {
                        bg: 'bg-gradient-to-r from-yellow-50 to-orange-50',
                        border: 'border-yellow-200',
                        dot: 'bg-yellow-500'
                      }
                    case 'diproses':
                      return {
                        bg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
                        border: 'border-blue-200',
                        dot: 'bg-blue-500'
                      }
                    case 'selesai':
                      return {
                        bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
                        border: 'border-green-200',
                        dot: 'bg-green-500'
                      }
                    default:
                      return {
                        bg: 'bg-gradient-to-r from-gray-50 to-gray-100',
                        border: 'border-gray-200',
                        dot: 'bg-gray-500'
                      }
                  }
                }
                
                const statusColors = getStatusColor(report.status)
                const timeAgo = formatDate(report.createdAt)
                
                return (
                  <div 
                    key={report.id}
                    className={`flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 ${statusColors.bg} rounded-lg sm:rounded-xl border ${statusColors.border} cursor-pointer hover:shadow-md transition-shadow`}
                    onClick={() => router.push(`/reports/${report.id}`)}
                  >
                    <div className={`w-2 h-2 sm:w-3 sm:h-3 ${statusColors.dot} rounded-full mt-2 flex-shrink-0 ${report.status === 'menunggu' ? 'animate-pulse' : ''}`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 font-medium text-sm sm:text-base leading-tight">
                        {report.kategori} - {report.kelas}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        Oleh {report.user.name} • {timeAgo}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {report.deskripsi}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        report.status === 'menunggu' ? 'bg-yellow-100 text-yellow-800' :
                        report.status === 'diproses' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-4">
                <BellIcon className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm">Belum ada laporan</p>
                <p className="text-xs text-gray-400 mt-1">Laporan yang dibuat akan muncul di sini</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}