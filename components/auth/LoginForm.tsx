'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import toast from 'react-hot-toast'

interface LoginFormData {
  username: string
  password: string
}

export function LoginForm() {
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>()

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true)
      await login(data.username, data.password)
      toast.success('Berhasil masuk!')
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
                size="lg"
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Memproses...' : 'Masuk'}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Demo Credentials:
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center py-1 px-2 bg-white rounded border">
                  <span className="font-medium text-gray-700">Admin:</span>
                  <span className="text-gray-600 font-mono">admin / admin123</span>
                </div>
                <div className="flex justify-between items-center py-1 px-2 bg-white rounded border">
                  <span className="font-medium text-gray-700">Ketua Kelas:</span>
                  <span className="text-gray-600 font-mono">ketua / ketua123</span>
                </div>
                <div className="flex justify-between items-center py-1 px-2 bg-white rounded border">
                  <span className="font-medium text-gray-700">Staff:</span>
                  <span className="text-gray-600 font-mono">staff / staff123</span>
                </div>
                <div className="flex justify-between items-center py-1 px-2 bg-white rounded border">
                  <span className="font-medium text-gray-700">Kepala Bagian:</span>
                  <span className="text-gray-600 font-mono">kabag / kabag123</span>
                </div>
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
