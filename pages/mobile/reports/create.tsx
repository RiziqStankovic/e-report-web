'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { 
  ArrowLeftIcon,
  PhotoIcon,
  UserIcon,
  TagIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { useForm } from 'react-hook-form'
import { CreateReportData, MasterData } from '@/types'
import { reportsApi, masterDataApi } from '@/lib/api'
import { useApiError } from '@/hooks/useApiError'
import { useRouter } from 'next/router'
import Image from 'next/image'
import toast from 'react-hot-toast'

export default function MobileCreateReportPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateReportData>()
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [masterData, setMasterData] = useState<{
    kelas: MasterData[]
    shift: MasterData[]
    ruangan: MasterData[]
    kategori: MasterData[]
  }>({ kelas: [], shift: [], ruangan: [], kategori: [] })
  const [loading, setLoading] = useState(false)
  const { executeWithErrorHandling } = useApiError()

  // Fetch master data
  const fetchMasterData = useCallback(async () => {
    await executeWithErrorHandling(async () => {
      try {
        const [kelas, shift, ruangan, kategori] = await Promise.all([
          masterDataApi.getKelas(),
          masterDataApi.getShift(),
          masterDataApi.getRuangan(),
          masterDataApi.getKategori()
        ])
        setMasterData({ kelas, shift, ruangan, kategori })
      } catch (error) {
        throw error
      }
    }, 'Master Data')
  }, [executeWithErrorHandling])

  useEffect(() => {
    if (isAuthenticated && user?.role === 'ketua_kelas') {
      fetchMasterData()
    } else if (isAuthenticated && user?.role !== 'ketua_kelas') {
      router.push('/mobile/reports')
    }
  }, [isAuthenticated, user?.role, router, fetchMasterData])


  // Submit form
  const onSubmit = async (data: CreateReportData) => {
    await executeWithErrorHandling(async () => {
      setLoading(true)
      try {
        const reportData = {
          kelas: data.kelas,
          shift: data.shift,
          ruangan: data.ruangan,
          jenis: data.jenis,
          kategori: data.kategori,
          deskripsi: data.deskripsi,
          foto: data.foto?.[0] ? await new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.readAsDataURL(data.foto![0] as unknown as File)
          }) : undefined
        }

        await reportsApi.create(reportData)
        toast.success('Laporan berhasil dibuat!')
        reset()
        setImagePreview(null)
        router.push('/mobile/reports')
      } catch (error) {
        throw error
      } finally {
        setLoading(false)
      }
    }, 'Create Report')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Akses Ditolak</h1>
          <p className="text-gray-600 mb-4">Silakan login terlebih dahulu</p>
          <Button onClick={() => router.push('/login')}>
            Login
          </Button>
        </div>
      </div>
    )
  }

  if (user?.role !== 'ketua_kelas') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Akses Ditolak</h1>
          <p className="text-gray-600 mb-4">Hanya Ketua Kelas yang dapat membuat laporan</p>
          <Button onClick={() => router.push('/mobile/reports')}>
            Kembali
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="mr-3"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Buat Laporan</h1>
              <p className="text-sm text-gray-600">Formulir laporan kendala</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PhotoIcon className="w-5 h-5 mr-2" />
              Form Laporan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900 flex items-center">
                  <UserIcon className="w-4 h-4 mr-2" />
                  Informasi Dasar
                </h3>
                
                <Select
                  label="Kelas"
                  {...register('kelas', { required: 'Kelas wajib diisi' })}
                  error={errors.kelas?.message}
                  options={masterData.kelas.map(item => ({ value: item.name, label: item.name }))}
                />
                
                <Select
                  label="Shift"
                  {...register('shift', { required: 'Shift wajib diisi' })}
                  error={errors.shift?.message}
                  options={masterData.shift.map(item => ({ value: item.name, label: item.name }))}
                />
                
                <Select
                  label="Ruangan"
                  {...register('ruangan', { required: 'Ruangan wajib diisi' })}
                  error={errors.ruangan?.message}
                  options={masterData.ruangan.map(item => ({ value: item.name, label: item.name }))}
                />
              </div>

              {/* Report Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900 flex items-center">
                  <TagIcon className="w-4 h-4 mr-2" />
                  Detail Laporan
                </h3>
                
                <Select
                  label="Jenis Laporan"
                  {...register('jenis', { required: 'Jenis laporan wajib diisi' })}
                  error={errors.jenis?.message}
                  options={[
                    { value: 'kebutuhan', label: 'Kebutuhan' },
                    { value: 'kendala', label: 'Kendala' },
                  ]}
                />
                
                <Select
                  label="Kategori"
                  {...register('kategori', { required: 'Kategori wajib diisi' })}
                  error={errors.kategori?.message}
                  options={masterData.kategori.map(item => ({ value: item.name, label: item.name }))}
                />
                
                <Textarea
                  label="Deskripsi"
                  {...register('deskripsi', { 
                    required: 'Deskripsi wajib diisi',
                    minLength: { value: 10, message: 'Deskripsi minimal 10 karakter' }
                  })}
                  error={errors.deskripsi?.message}
                  placeholder="Jelaskan kendala atau kebutuhan Anda secara detail..."
                  rows={4}
                />
              </div>

              {/* Photo Upload */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900 flex items-center">
                  <PhotoIcon className="w-4 h-4 mr-2" />
                  Foto (Opsional)
                </h3>
                
                <ImageUpload
                  onImageSelect={setImagePreview}
                  onImageRemove={() => setImagePreview(null)}
                  currentImage={imagePreview || undefined}
                  maxSize={5}
                />
                
                {imagePreview && (
                  <div className="mt-4">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={400}
                      height={192}
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full"
                  loading={loading}
                  disabled={loading}
                  size="lg"
                >
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  {loading ? 'Mengirim...' : 'Kirim Laporan'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Tips:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Jelaskan kendala dengan detail dan jelas</li>
            <li>• Sertakan foto jika memungkinkan</li>
            <li>• Pilih kategori yang sesuai</li>
            <li>• Laporan akan diproses dalam 1-2 hari kerja</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
