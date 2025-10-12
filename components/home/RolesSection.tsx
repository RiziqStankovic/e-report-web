    'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { MobileRoles } from './MobileRoles'
import { 
  UserGroupIcon,
  EyeIcon,
  BellIcon,
  CogIcon
} from '@heroicons/react/24/outline'

export function RolesSection() {
  return (
    <>
      {/* Mobile Version */}
      <div className="lg:hidden">
        <MobileRoles />
      </div>

      {/* Desktop Version */}
      <div className="hidden lg:block">
        <DesktopRoles />
      </div>
    </>
  )
}

function DesktopRoles() {
  const roles = [
    {
      icon: UserGroupIcon,
      title: 'Ketua Kelas',
      description: 'Melaporkan kendala dan kebutuhan kelas dengan mudah dan cepat.',
      color: 'blue'
    },
    {
      icon: EyeIcon,
      title: 'Staff',
      description: 'Melihat dan menindaklanjuti laporan yang masuk sesuai kewenangan.',
      color: 'green'
    },
    {
      icon: BellIcon,
      title: 'Kepala Bagian',
      description: 'Menerima notifikasi instan dan memonitor semua laporan yang masuk.',
      color: 'purple'
    },
    {
      icon: CogIcon,
      title: 'Admin',
      description: 'Mengelola sistem, pengguna, dan data master untuk kelancaran operasional.',
      color: 'red'
    }
  ]

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 text-blue-600'
      case 'green':
        return 'bg-green-100 text-green-600'
      case 'purple':
        return 'bg-purple-100 text-purple-600'
      case 'red':
        return 'bg-red-100 text-red-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-blue-50 relative overflow-hidden">
      {/* Gradient Overlay untuk smooth transition */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Dirancang untuk Setiap Peran
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Memudahkan koordinasi dan pelaporan untuk semua pihak yang terlibat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {roles.map((role, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardContent className="p-8">
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center ${getColorClasses(role.color)}`}>
                  <role.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {role.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {role.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
