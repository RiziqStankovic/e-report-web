'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import {
  HomeIcon,
  DocumentTextIcon,
  ChartBarIcon,
  UsersIcon,
  CogIcon,
  ClipboardDocumentListIcon,
  BuildingOfficeIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { user } = useAuth()

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon,
      roles: ['admin', 'staff', 'kepala_bagian']
    },
    {
      name: 'Laporan Saya',
      href: '/reports/my',
      icon: ClipboardDocumentListIcon,
      roles: ['ketua_kelas']
    },
    {
      name: 'Buat Laporan',
      href: '/reports/create',
      icon: DocumentTextIcon,
      roles: ['ketua_kelas']
    },
    {
      name: 'Kelola Laporan',
      href: '/reports',
      icon: ClipboardDocumentListIcon,
      roles: ['admin', 'staff', 'kepala_bagian']
    },
    {
      name: 'Analitik',
      href: '/analytics',
      icon: ChartBarIcon,
      roles: ['admin', 'staff', 'kepala_bagian']
    },
    {
      name: 'Data Master',
      href: '/master-data',
      icon: BuildingOfficeIcon,
      roles: ['admin']
    },
    {
      name: 'Kelola Pengguna',
      href: '/users',
      icon: UsersIcon,
      roles: ['admin']
    },
    {
      name: 'Pengaturan',
      href: '/settings',
      icon: CogIcon,
      roles: ['admin', 'staff', 'kepala_bagian', 'ketua_kelas']
    }
  ]

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role || '')
  )

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center space-x-3 px-6 py-4 border-b border-gray-200">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L3 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">E-Report</h2>
              <p className="text-xs text-gray-500">Sistem Laporan Kendala</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User info */}
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <UserGroupIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.role === 'admin' ? 'Admin' :
                   user?.role === 'ketua_kelas' ? 'Ketua Kelas' :
                   user?.role === 'staff' ? 'Staff' :
                   user?.role === 'kepala_bagian' ? 'Kepala Bagian' : user?.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
