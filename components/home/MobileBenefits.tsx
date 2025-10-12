'use client'

import React from 'react'
import { 
  RocketLaunchIcon,
  BellIcon,
  DocumentTextIcon,
  ChartBarIcon,
  HeartIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

export function MobileBenefits() {
  const benefits = [
    {
      icon: RocketLaunchIcon,
      title: 'Proses Cepat & Efisien',
      description: 'Mengurangi waktu pelaporan manual dan mempercepat alur informasi.'
    },
    {
      icon: BellIcon,
      title: 'Laporan Langsung Diterima',
      description: 'Notifikasi WhatsApp memastikan pihak terkait segera mengetahui adanya laporan baru.'
    },
    {
      icon: DocumentTextIcon,
      title: 'Data Rapi & Terdokumentasi',
      description: 'Semua laporan tersimpan secara digital, rapi, dan mudah diakses kembali.'
    },
    {
      icon: ChartBarIcon,
      title: 'Memudahkan Evaluasi',
      description: 'Data historis membantu dalam evaluasi dan pengambilan keputusan strategis.'
    },
    {
      icon: HeartIcon,
      title: 'Transparansi Antar Pihak',
      description: 'Semua pihak dapat memantau status laporan sesuai dengan perannya masing-masing.'
    },
    {
      icon: EyeIcon,
      title: 'Monitoring Real-time',
      description: 'Pantau perkembangan laporan secara real-time dan dapatkan insight yang akurat.'
    }
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Manfaat Utama Sistem
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Meningkatkan efisiensi operasional dan transparansi di lingkungan belajar.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg mobile-card">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
