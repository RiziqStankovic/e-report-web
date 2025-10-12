'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/router'
import { Button } from '@/components/ui/Button'
import { PageTransition } from '@/components/ui/PageTransition'
import { 
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  DocumentTextIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  UserIcon
} from '@heroicons/react/24/outline'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const getNavigationItems = () => {
    const items = [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: HomeIcon,
        roles: ['admin', 'ketua_kelas', 'staff', 'kepala_bagian']
      },
      {
        name: 'Laporan Saya',
        href: '/reports/my',
        icon: DocumentTextIcon,
        roles: ['ketua_kelas']
      },
      {
        name: 'Semua Laporan',
        href: '/reports',
        icon: DocumentTextIcon,
        roles: ['admin', 'staff', 'kepala_bagian']
      },
      {
        name: 'Buat Laporan',
        href: '/reports/create',
        icon: DocumentTextIcon,
        roles: ['ketua_kelas']
      },
      {
        name: 'Pengguna',
        href: '/users',
        icon: UserGroupIcon,
        roles: ['admin']
      },
      {
        name: 'Data Master',
        href: '/master-data',
        icon: Cog6ToothIcon,
        roles: ['admin', 'staff', 'kepala_bagian']
      }
    ]

    return items.filter(item => 
      user?.role && item.roles.includes(user.role)
    )
  }

  const navigationItems = getNavigationItems()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-2xl">
            <div className="flex h-16 items-center justify-between px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
              <h1 className="text-lg font-semibold text-white">E-Report</h1>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => setSidebarOpen(false)}
              >
                <XMarkIcon className="w-5 h-5" />
              </Button>
            </div>
            <nav className="flex-1 space-y-1 px-2 py-4 bg-white">
              {navigationItems.map((item) => {
                const IconComponent = item.icon
                const isActive = router.pathname === item.href
                return (
                  <Button
                    key={item.name}
                    variant={isActive ? 'primary' : 'ghost'}
                    className={`w-full justify-start transition-all duration-200 ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                    onClick={() => {
                      router.push(item.href)
                      setSidebarOpen(false)
                    }}
                  >
                    <IconComponent className="w-5 h-5 mr-3" />
                    {item.name}
                  </Button>
                )
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-grow flex-col overflow-y-auto bg-white border-r border-gray-200 shadow-xl">
          <div className="flex h-16 items-center px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
            <h1 className="text-lg font-semibold text-white">E-Report</h1>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4 bg-white">
            {navigationItems.map((item) => {
              const IconComponent = item.icon
              const isActive = router.pathname === item.href
              return (
                <Button
                  key={item.name}
                  variant={isActive ? 'primary' : 'ghost'}
                  className={`w-full justify-start transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                  onClick={() => router.push(item.href)}
                >
                  <IconComponent className="w-5 h-5 mr-3" />
                  {item.name}
                </Button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Fixed Top bar */}
        <div className="fixed top-0 right-0 left-0 lg:left-64 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white/95 backdrop-blur-lg px-4 shadow-lg sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-gray-700 hover:bg-blue-50"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="w-5 h-5" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                <BellIcon className="w-5 h-5" />
              </Button>

              {/* User menu */}
              <div className="flex items-center gap-x-2">
                <div className="flex items-center gap-x-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                    <UserIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-700 hover:bg-red-50 hover:text-red-600"
                  onClick={handleLogout}
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content with top padding for fixed header */}
        <main className="pt-16 pb-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <PageTransition>
              {children}
            </PageTransition>
          </div>
        </main>
      </div>
    </div>
  )
}