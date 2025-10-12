'use client'

import React from 'react'
import { 
  CheckCircleIcon,
  CameraIcon,
  BellIcon,
  ChartBarIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'

export function MobileFeatures() {
  const features = [
    {
      title: 'Pelaporan Kendala yang Terstruktur',
      description: 'Formulir input yang intuitif memungkinkan pelaporan kendala dengan detail lengkap, mulai dari kelas, shift, ruangan, hingga kategori masalah. Tambahkan deskripsi dan foto untuk laporan yang lebih akurat.',
      features: [
        'Pilihan terstruktur: Kelas, Shift, Ruangan',
        'Kategori masalah: AC, Proyektor, Pengajar, dll.',
        'Unggah foto sebagai bukti pendukung (opsional)'
      ],
      visual: 'structured'
    },
    {
      title: 'Notifikasi WhatsApp Real-time',
      description: 'Setiap laporan baru yang masuk akan secara otomatis mengirimkan notifikasi ke Kepala Bagian melalui WhatsApp. Tidak ada lagi laporan yang terlewat atau terlambat ditangani.',
      features: [
        'Notifikasi instan ke WhatsApp',
        'Format pesan yang terstruktur',
        'Status laporan real-time'
      ],
      visual: 'whatsapp'
    },
    {
      title: 'Dashboard & Rekapitulasi Data',
      description: 'Pantau dan analisis semua laporan melalui dashboard interaktif. Gunakan filter untuk menyaring data berdasarkan kelas, status, atau tanggal, dan lihat ringkasannya dalam bentuk tabel dan grafik.',
      features: [
        'Filter laporan yang komprehensif',
        'Visualisasi data dengan grafik ringkasan',
        'Ekspor data laporan ke format PDF atau Excel'
      ],
      visual: 'dashboard'
    }
  ]

  const renderVisual = (type: string) => {
    switch (type) {
      case 'structured':
        return (
          <div className="relative">
            <div className="grid grid-cols-3 gap-2 w-32 h-32 mx-auto">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-lg ${
                    i % 3 === 0 ? 'bg-red-200' :
                    i % 3 === 1 ? 'bg-blue-200' :
                    'bg-gray-200'
                  } ${i === 4 ? 'bg-blue-300' : ''}`}
                />
              ))}
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <CameraIcon className="w-3 h-3 text-white" />
            </div>
          </div>
        )
      
      case 'whatsapp':
        return (
          <div className="relative">
            <div className="bg-gray-800 rounded-2xl p-3 w-48 mx-auto">
              <div className="bg-white rounded-xl p-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <BellIcon className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs font-medium">WhatsApp</span>
                </div>
                <div className="bg-green-100 rounded-lg p-2">
                  <div className="text-xs font-bold text-green-800 mb-1">Laporan Baru Masuk!</div>
                  <div className="text-xs text-gray-700 space-y-0.5">
                    <div>Kelas: Quran</div>
                    <div>Shift: 2</div>
                    <div>Ruangan: 203</div>
                    <div>Jenis: Kendala</div>
                    <div>Kategori: AC</div>
                    <div>Deskripsi: AC mati</div>
                    <div>Status: Menunggu</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'dashboard':
        return (
          <div className="relative">
            <div className="bg-white rounded-xl shadow-lg p-4 w-48 mx-auto">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <ChartBarIcon className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-900">Dashboard</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">AC</span>
                    <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div className="w-3/4 h-full bg-blue-500"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Proyektor</span>
                    <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div className="w-1/2 h-full bg-red-500"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Lainnya</span>
                    <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div className="w-1/3 h-full bg-green-500"></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <FunnelIcon className="w-3 h-3" />
                  <span>Filter & Export</span>
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {features.map((feature, index) => (
          <div key={index} className="mb-16 last:mb-0">
            <div className="text-center">
              {/* Visual */}
              <div className="mb-6">
                {renderVisual(feature.visual)}
              </div>

              {/* Content */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                <div className="space-y-2">
                  {feature.features.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start space-x-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
