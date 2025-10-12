'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/router'
import { Layout } from '@/components/layout/Layout'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { ErrorHandler } from '@/components/ErrorHandler'
import { useApiError } from '@/hooks/useApiError'
import { UserIcon, KeyIcon } from '@heroicons/react/24/outline'
import { User } from '@/types'
import { usersApi } from '@/lib/api'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const { error, executeWithErrorHandling } = useApiError()

  const fetchProfile = useCallback(async () => {
    await executeWithErrorHandling(async () => {
      setLoading(true)
      try {
        const data = await usersApi.getById(user?.id || '')
        setProfile(data)
        setFormData({
          name: data.name,
          email: data.email || '',
          phone: data.phone || ''
        })
      } catch {
        // Fallback to current user data
        if (user) {
          setProfile(user)
          setFormData({
            name: user.name,
            email: user.email || '',
            phone: user.phone || ''
          })
        }
      } finally {
        setLoading(false)
      }
    }, 'Profile')
  }, [executeWithErrorHandling, user])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    } else {
      fetchProfile()
    }
  }, [isAuthenticated, router, fetchProfile])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    await executeWithErrorHandling(async () => {
      try {
        const updatedUser = await usersApi.update(user?.id || '', formData)
        setProfile(updatedUser)
        // updateUser(updatedUser) // Commented out as updateUser is not available
        setEditing(false)
        toast.success('Profil berhasil diperbarui!')
      } catch (error) {
        throw error
      }
    }, 'Update Profile')
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Password baru dan konfirmasi password tidak sama!')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password minimal 6 karakter!')
      return
    }

    await executeWithErrorHandling(async () => {
      try {
        await usersApi.update(user?.id || '', {
          password: passwordData.newPassword
        } as Record<string, unknown>)
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        setShowPasswordForm(false)
        toast.success('Password berhasil diubah!')
      } catch (error) {
        throw error
      }
    }, 'Change Password')
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrator'
      case 'ketua_kelas':
        return 'Ketua Kelas'
      case 'staff':
        return 'Staff'
      case 'kepala_bagian':
        return 'Kepala Bagian'
      default:
        return role
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800'
      case 'ketua_kelas':
        return 'bg-green-100 text-green-800'
      case 'staff':
        return 'bg-blue-100 text-blue-800'
      case 'kepala_bagian':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
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
      <ErrorHandler error={error} onRetry={fetchProfile} />
      
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1>
          <p className="text-gray-600">
            Kelola informasi profil dan keamanan akun Anda
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <UserIcon className="w-5 h-5 mr-2" />
                    Informasi Profil
                  </CardTitle>
                  {!editing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditing(true)}
                    >
                      Edit Profil
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {editing ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <Input
                      label="Nama Lengkap"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                    
                    <Input
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                    
                    <Input
                      label="Nomor Telepon"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                    
                    <div className="flex justify-end space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditing(false)
                          setFormData({
                            name: profile?.name || '',
                            email: profile?.email || '',
                            phone: profile?.phone || ''
                          })
                        }}
                      >
                        Batal
                      </Button>
                      <Button type="submit">
                        Simpan Perubahan
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Lengkap
                      </label>
                      <p className="text-gray-900">{profile?.name}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                      </label>
                      <p className="text-gray-900">{profile?.username}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <p className="text-gray-900">{profile?.email || '-'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nomor Telepon
                      </label>
                      <p className="text-gray-900">{profile?.phone || '-'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(profile?.role || '')}`}>
                        {getRoleDisplayName(profile?.role || '')}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Account Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <KeyIcon className="w-5 h-5 mr-2" />
                  Keamanan Akun
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setShowPasswordForm(true)}
                >
                  <KeyIcon className="w-4 h-4 mr-2" />
                  Ubah Password
                </Button>
                
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Informasi Akun</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Bergabung: {new Date(profile?.createdAt || '').toLocaleDateString('id-ID')}</p>
                    <p>Terakhir diupdate: {new Date(profile?.updatedAt || '').toLocaleDateString('id-ID')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Change Password Modal */}
        {showPasswordForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Ubah Password
                </h3>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <Input
                    label="Password Saat Ini"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    required
                  />
                  
                  <Input
                    label="Password Baru"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    required
                    minLength={6}
                  />
                  
                  <Input
                    label="Konfirmasi Password Baru"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                    minLength={6}
                  />
                  
                  <div className="flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowPasswordForm(false)
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        })
                      }}
                    >
                      Batal
                    </Button>
                    <Button type="submit">
                      Ubah Password
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
