'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

interface LoginFormData {
  username: string
  password: string
}

export default function LoginPage() {
  const { login, isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on user role
      switch (user.role) {
        case 'admin':
          router.push('/dashboard')
          break
        case 'ketua_kelas':
          router.push('/reports/my')
          break
        case 'staff':
        case 'kepala_bagian':
          router.push('/reports')
          break
        default:
          router.push('/dashboard')
      }
    }
  }, [isAuthenticated, user, router])

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true)
      await login(data.username, data.password)
      toast.success('Berhasil masuk!')
      
      // Redirect will be handled by useEffect
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : 'Gagal masuk. Periksa kredensial Anda.'
      toast.error(errorMessage || 'Gagal masuk. Periksa kredensial Anda.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L3 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">E-Report</h1>
          <p className="text-gray-600">Sistem Laporan Kendala Pembelajaran</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Masuk ke Akun</CardTitle>
            <CardDescription>
              Masukkan kredensial Anda untuk mengakses sistem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                {...register('username', { 
                  required: 'Username wajib diisi',
                  minLength: { value: 3, message: 'Username minimal 3 karakter' }
                })}
                label="Username"
                placeholder="Masukkan username"
                error={errors.username?.message}
                autoComplete="username"
              />
              
              <Input
                {...register('password', { 
                  required: 'Password wajib diisi',
                  minLength: { value: 6, message: 'Password minimal 6 karakter' }
                })}
                type="password"
                label="Password"
                placeholder="Masukkan password"
                error={errors.password?.message}
                autoComplete="current-password"
              />

              <Button
                type="submit"
                className="w-full"
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Memproses...' : 'Masuk'}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Demo Credentials:</h4>
              <div className="space-y-1 text-xs text-gray-600">
                <p><strong>Admin:</strong> admin / admin123</p>
                <p><strong>Ketua Kelas:</strong> ketua / ketua123</p>
                <p><strong>Staff:</strong> staff / staff123</p>
                <p><strong>Kepala Bagian:</strong> kabag / kabag123</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2024 Sistem Informasi Laporan Kendala. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
