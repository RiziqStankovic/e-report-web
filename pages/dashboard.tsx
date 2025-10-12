'use client'

import React, { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/router'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent } from '@/components/ui/Card'
import { 
  ChartBarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  PlusIcon,
  EyeIcon,
  BellIcon
} from '@heroicons/react/24/outline'
import { CardSkeleton } from '@/components/ui/LoadingSkeleton'

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

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
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
              <ChartBarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            Statistik
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-200 active:scale-95">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg mb-2 sm:mb-0 sm:mr-3 w-fit">
                    <ChartBarIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Total Laporan</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">24</p>
                    <p className="text-xs text-green-600">+12% dari bulan lalu</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-200 active:scale-95">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className="p-2 sm:p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl shadow-lg mb-2 sm:mb-0 sm:mr-3 w-fit">
                    <DocumentTextIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Menunggu</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">8</p>
                    <p className="text-xs text-orange-600">Perlu perhatian</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-200 active:scale-95">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl shadow-lg mb-2 sm:mb-0 sm:mr-3 w-fit">
                    <Cog6ToothIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Diproses</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">12</p>
                    <p className="text-xs text-blue-600">Dalam progres</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-200 active:scale-95">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className="p-2 sm:p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg mb-2 sm:mb-0 sm:mr-3 w-fit">
                    <ChartBarIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Selesai</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">4</p>
                    <p className="text-xs text-green-600">75% completion rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity - Mobile First */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
              <BellIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            Aktivitas Terbaru
          </h2>
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl border border-blue-200">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full animate-pulse mt-2 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 font-medium text-sm sm:text-base leading-tight">Laporan baru dari Ketua Kelas Quran</p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">2 menit yang lalu</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg sm:rounded-xl border border-green-200">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 font-medium text-sm sm:text-base leading-tight">Laporan AC Ruangan 101 telah selesai</p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">1 jam yang lalu</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg sm:rounded-xl border border-yellow-200">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 font-medium text-sm sm:text-base leading-tight">Laporan Proyektor sedang diproses</p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">3 jam yang lalu</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}