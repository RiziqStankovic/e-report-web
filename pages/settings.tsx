'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/router'
import { Layout } from '@/components/layout/Layout'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ErrorHandler } from '@/components/ErrorHandler'
import { useApiError } from '@/hooks/useApiError'
import { 
  CogIcon, 
  BellIcon, 
  ShieldCheckIcon, 
  PaintBrushIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Settings {
  notifications: {
    email: boolean
    push: boolean
    whatsapp: boolean
  }
  appearance: {
    theme: 'light' | 'dark' | 'auto'
    language: 'id' | 'en'
  }
  privacy: {
    showEmail: boolean
    showPhone: boolean
  }
}

export default function SettingsPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [settings, setSettings] = useState<Settings>({
    notifications: {
      email: true,
      push: true,
      whatsapp: false
    },
    appearance: {
      theme: 'light',
      language: 'id'
    },
    privacy: {
      showEmail: true,
      showPhone: false
    }
  })
  const [loading, setLoading] = useState(true)
  const { error, executeWithErrorHandling } = useApiError()

  const loadSettings = useCallback(async () => {
    await executeWithErrorHandling(async () => {
      setLoading(true)
      try {
        // Load settings from localStorage or API
        const savedSettings = localStorage.getItem('e-report-settings')
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings))
        }
      } catch (error) {
        console.error('Error loading settings:', error)
      } finally {
        setLoading(false)
      }
    }, 'Settings')
  }, [executeWithErrorHandling])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    } else {
      loadSettings()
    }
  }, [isAuthenticated, router, loadSettings])

  const saveSettings = async (newSettings: Settings) => {
    await executeWithErrorHandling(async () => {
      try {
        setSettings(newSettings)
        localStorage.setItem('e-report-settings', JSON.stringify(newSettings))
        toast.success('Pengaturan berhasil disimpan!')
      } catch (error) {
        throw error
      }
    }, 'Save Settings')
  }

  const handleNotificationChange = (key: keyof Settings['notifications'], value: boolean) => {
    const newSettings = {
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: value
      }
    }
    saveSettings(newSettings)
  }

  const handleAppearanceChange = (key: keyof Settings['appearance'], value: string) => {
    const newSettings = {
      ...settings,
      appearance: {
        ...settings.appearance,
        [key]: value
      }
    }
    saveSettings(newSettings)
  }

  const handlePrivacyChange = (key: keyof Settings['privacy'], value: boolean) => {
    const newSettings = {
      ...settings,
      privacy: {
        ...settings.privacy,
        [key]: value
      }
    }
    saveSettings(newSettings)
  }

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <ErrorHandler error={error} onRetry={loadSettings} />
      
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
          <p className="text-gray-600">
            Kelola preferensi dan konfigurasi aplikasi
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BellIcon className="w-5 h-5 mr-2" />
                Notifikasi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Terima notifikasi via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={(e) => handleNotificationChange('email', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Push Notifications</h4>
                  <p className="text-sm text-gray-600">Terima notifikasi push di browser</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.push}
                    onChange={(e) => handleNotificationChange('push', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">WhatsApp Notifications</h4>
                  <p className="text-sm text-gray-600">Terima notifikasi via WhatsApp</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.whatsapp}
                    onChange={(e) => handleNotificationChange('whatsapp', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PaintBrushIcon className="w-5 h-5 mr-2" />
                Tampilan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tema
                </label>
                <select
                  value={settings.appearance.theme}
                  onChange={(e) => handleAppearanceChange('theme', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="light">Terang</option>
                  <option value="dark">Gelap</option>
                  <option value="auto">Otomatis</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bahasa
                </label>
                <select
                  value={settings.appearance.language}
                  onChange={(e) => handleAppearanceChange('language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="id">Bahasa Indonesia</option>
                  <option value="en">English</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShieldCheckIcon className="w-5 h-5 mr-2" />
                Privasi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Tampilkan Email</h4>
                  <p className="text-sm text-gray-600">Tampilkan email di profil</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.privacy.showEmail}
                    onChange={(e) => handlePrivacyChange('showEmail', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Tampilkan Nomor Telepon</h4>
                  <p className="text-sm text-gray-600">Tampilkan nomor telepon di profil</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.privacy.showPhone}
                    onChange={(e) => handlePrivacyChange('showPhone', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* System Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CogIcon className="w-5 h-5 mr-2" />
                Informasi Sistem
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex justify-between">
                  <span>Versi Aplikasi:</span>
                  <span className="font-medium">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span>Browser:</span>
                  <span className="font-medium">
                    {typeof window !== 'undefined' ? navigator.userAgent.split(' ')[0] : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Platform:</span>
                  <span className="font-medium">
                    {typeof window !== 'undefined' ? navigator.platform : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tanggal Terakhir Update:</span>
                  <span className="font-medium">
                    {new Date().toLocaleDateString('id-ID')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Aksi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  localStorage.removeItem('e-report-settings')
                  loadSettings()
                  toast.success('Pengaturan telah direset!')
                }}
              >
                Reset Pengaturan
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  const settingsData = JSON.stringify(settings, null, 2)
                  const blob = new Blob([settingsData], { type: 'application/json' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = 'e-report-settings.json'
                  a.click()
                  URL.revokeObjectURL(url)
                  toast.success('Pengaturan berhasil diekspor!')
                }}
              >
                Ekspor Pengaturan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}