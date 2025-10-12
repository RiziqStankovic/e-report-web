'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  PlusIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  UserGroupIcon,
  BellIcon
} from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'

interface QuickActionsProps {
  userRole?: string
}

export function QuickActions({ userRole }: QuickActionsProps) {
  const router = useRouter()

  const getActionsForRole = (role: string) => {
    switch (role) {
      case 'admin':
        return [
          {
            title: 'Kelola Pengguna',
            description: 'Tambah, edit, atau hapus pengguna',
            icon: UserGroupIcon,
            href: '/users',
            color: 'bg-blue-500 hover:bg-blue-600'
          },
          {
            title: 'Data Master',
            description: 'Kelola kelas, shift, ruangan, kategori',
            icon: CogIcon,
            href: '/master-data',
            color: 'bg-green-500 hover:bg-green-600'
          },
          {
            title: 'Analitik',
            description: 'Lihat laporan dan statistik lengkap',
            icon: ChartBarIcon,
            href: '/analytics',
            color: 'bg-purple-500 hover:bg-purple-600'
          }
        ]
      
      case 'ketua_kelas':
        return [
          {
            title: 'Buat Laporan',
            description: 'Laporkan kendala atau kebutuhan',
            icon: PlusIcon,
            href: '/reports/create',
            color: 'bg-blue-500 hover:bg-blue-600'
          },
          {
            title: 'Laporan Saya',
            description: 'Lihat status laporan yang diajukan',
            icon: DocumentTextIcon,
            href: '/reports/my',
            color: 'bg-green-500 hover:bg-green-600'
          }
        ]
      
      case 'staff':
      case 'kepala_bagian':
        return [
          {
            title: 'Kelola Laporan',
            description: 'Lihat dan proses laporan masuk',
            icon: DocumentTextIcon,
            href: '/reports',
            color: 'bg-blue-500 hover:bg-blue-600'
          },
          {
            title: 'Notifikasi',
            description: 'Lihat notifikasi terbaru',
            icon: BellIcon,
            href: '/notifications',
            color: 'bg-yellow-500 hover:bg-yellow-600'
          },
          {
            title: 'Analitik',
            description: 'Lihat statistik laporan',
            icon: ChartBarIcon,
            href: '/analytics',
            color: 'bg-purple-500 hover:bg-purple-600'
          }
        ]
      
      default:
        return []
    }
  }

  const actions = getActionsForRole(userRole || '')

  if (actions.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Aksi Cepat
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action, index) => {
            const IconComponent = action.icon
            return (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start text-left hover:shadow-md transition-shadow"
                onClick={() => router.push(action.href)}
              >
                <div className="flex items-center w-full mb-2">
                  <div className={`p-2 rounded-lg ${action.color} text-white mr-3`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{action.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-gray-600 text-left">{action.description}</p>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
