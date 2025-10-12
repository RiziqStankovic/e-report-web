'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { CustomSelect } from '@/components/ui/CustomSelect'
import { Textarea } from '@/components/ui/Textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { CreateReportData } from '@/types'
import { reportsApi, masterDataApi } from '@/lib/api'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { DocumentIcon } from '@heroicons/react/24/outline'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { AddCategoryModal } from '@/components/reports/AddCategoryModal'

interface MasterData {
  id: string
  name: string
  type: string
  isActive: boolean
}

export function CreateReportForm() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [masterData, setMasterData] = useState<{
    kelas: MasterData[]
    shift: MasterData[]
    ruangan: MasterData[]
    kategori: MasterData[]
  }>({
    kelas: [],
    shift: [],
    ruangan: [],
    kategori: []
  })
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageMetadata, setImageMetadata] = useState<Record<string, unknown> | null>(null)
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<CreateReportData>()

  const jenis = watch('jenis')

  useEffect(() => {
    fetchMasterData()
  }, [])

  const fetchMasterData = async () => {
    try {
      const [kelas, shift, ruangan, kategori] = await Promise.all([
        masterDataApi.getKelas(),
        masterDataApi.getShift(),
        masterDataApi.getRuangan(),
        masterDataApi.getKategori()
      ])
      
      setMasterData({
        kelas: kelas.filter((item: MasterData) => item.isActive),
        shift: shift.filter((item: MasterData) => item.isActive),
        ruangan: ruangan.filter((item: MasterData) => item.isActive),
        kategori: kategori.filter((item: MasterData) => item.isActive)
      })
    } catch {
      toast.error('Gagal memuat data master')
    }
  }

  const handleImageSelect = async (base64: string) => {
    try {
      // Use image as is for now - optimization can be added later
      setSelectedImage(base64)
      
      // Get metadata
      const metadata = {
        size: base64.length * 0.75, // Approximate size
        type: base64.split(',')[0].split(':')[1].split(';')[0],
        originalName: 'uploaded-image'
      }
      setImageMetadata(metadata)
      
      toast.success('Gambar berhasil diupload')
    } catch (error) {
      console.error('Error processing image:', error)
      toast.error('Gagal memproses gambar')
    }
  }

  const handleImageRemove = () => {
    setSelectedImage(null)
    setImageMetadata(null)
  }

  const handleCategoryAdded = async () => {
    // Refresh kategori data
    try {
      const kategoriData = await masterDataApi.getKategori()
      setMasterData(prev => ({
        ...prev,
        kategori: kategoriData
      }))
    } catch (error) {
      console.error('Failed to refresh categories:', error)
    }
  }

  const onSubmit = async (data: CreateReportData) => {
    try {
      setLoading(true)
      
      const reportData: CreateReportData = {
        ...data,
        foto: selectedImage || undefined,
        fotoMetadata: imageMetadata ? {
          size: imageMetadata.size as number,
          type: imageMetadata.type as string,
          width: imageMetadata.width as number,
          height: imageMetadata.height as number,
          originalName: imageMetadata.originalName as string
        } : undefined
      }
      
      console.log('Creating report with data:', reportData)
      await reportsApi.create(reportData)
      console.log('Report created successfully')
      toast.success('Laporan berhasil dibuat!')
      router.push('/reports/my')
    } catch (error: unknown) {
      console.error('Error creating report:', error)
      toast.error( 'Gagal membuat laporan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-2xl border-0 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-xl">
          <CardTitle className="flex items-center space-x-3 text-xl">
            <div className="p-2 bg-white/20 rounded-lg">
              <DocumentIcon className="w-6 h-6" />
            </div>
            <span>Formulir Laporan</span>
          </CardTitle>
          <p className="text-blue-100 mt-2">
            Isi form di bawah ini dengan detail laporan Anda
          </p>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Kelas, Shift, Ruangan */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <CustomSelect
                label="Kelas"
                placeholder="Pilih kelas"
                options={masterData.kelas.map(item => ({
                  value: item.name,
                  label: item.name
                }))}
                value={watch('kelas')}
                onChange={(value) => setValue('kelas', value)}
                error={errors.kelas?.message}
              />
              
              <CustomSelect
                label="Shift"
                placeholder="Pilih shift"
                options={masterData.shift.map(item => ({
                  value: item.name,
                  label: item.name
                }))}
                value={watch('shift')}
                onChange={(value) => setValue('shift', value)}
                error={errors.shift?.message}
              />
              
              <CustomSelect
                label="Ruangan"
                placeholder="Pilih ruangan"
                options={masterData.ruangan.map(item => ({
                  value: item.name,
                  label: item.name
                }))}
                value={watch('ruangan')}
                onChange={(value) => setValue('ruangan', value)}
                error={errors.ruangan?.message}
              />
            </div>

            {/* Jenis Laporan */}
            <div>
              <label className="text-lg font-semibold text-gray-800 mb-4 block">
                Jenis Laporan
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <label className="relative group">
                  <input
                    type="radio"
                    value="kendala"
                    {...register('jenis', { required: 'Jenis laporan wajib dipilih' })}
                    className="sr-only"
                  />
                  <div className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-lg ${
                    jenis === 'kendala' 
                      ? 'border-red-500 bg-gradient-to-br from-red-50 to-red-100 shadow-lg scale-105' 
                      : 'border-gray-200 hover:border-red-300 bg-white hover:bg-red-50/50'
                  }`}>
                    <div className="text-center">
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center transition-all duration-300 ${
                        jenis === 'kendala' 
                          ? 'bg-red-500 shadow-lg' 
                          : 'bg-red-100 group-hover:bg-red-200'
                      }`}>
                        <span className={`text-lg font-bold transition-colors duration-300 ${
                          jenis === 'kendala' ? 'text-white' : 'text-red-600'
                        }`}>!</span>
                      </div>
                      <p className={`font-semibold text-lg transition-colors duration-300 ${
                        jenis === 'kendala' ? 'text-red-700' : 'text-gray-800'
                      }`}>Kendala</p>
                      <p className={`text-sm mt-1 transition-colors duration-300 ${
                        jenis === 'kendala' ? 'text-red-600' : 'text-gray-600'
                      }`}>Masalah yang perlu diperbaiki</p>
                    </div>
                  </div>
                </label>
                
                <label className="relative group">
                  <input
                    type="radio"
                    value="kebutuhan"
                    {...register('jenis', { required: 'Jenis laporan wajib dipilih' })}
                    className="sr-only"
                  />
                  <div className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-lg ${
                    jenis === 'kebutuhan' 
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg scale-105' 
                      : 'border-gray-200 hover:border-blue-300 bg-white hover:bg-blue-50/50'
                  }`}>
                    <div className="text-center">
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center transition-all duration-300 ${
                        jenis === 'kebutuhan' 
                          ? 'bg-blue-500 shadow-lg' 
                          : 'bg-blue-100 group-hover:bg-blue-200'
                      }`}>
                        <span className={`text-lg font-bold transition-colors duration-300 ${
                          jenis === 'kebutuhan' ? 'text-white' : 'text-blue-600'
                        }`}>+</span>
                      </div>
                      <p className={`font-semibold text-lg transition-colors duration-300 ${
                        jenis === 'kebutuhan' ? 'text-blue-700' : 'text-gray-800'
                      }`}>Kebutuhan</p>
                      <p className={`text-sm mt-1 transition-colors duration-300 ${
                        jenis === 'kebutuhan' ? 'text-blue-600' : 'text-gray-600'
                      }`}>Kebutuhan yang diperlukan</p>
                    </div>
                  </div>
                </label>
              </div>
              {errors.jenis && (
                <p className="text-sm text-red-600 mt-1">{errors.jenis.message}</p>
              )}
            </div>

            {/* Kategori */}
            <CustomSelect
              label="Kategori"
              placeholder="Pilih kategori"
              options={masterData.kategori.map(item => ({
                value: item.name,
                label: item.name
              }))}
              value={watch('kategori')}
              onChange={(value) => setValue('kategori', value)}
              error={errors.kategori?.message}
              showAddButton={user?.role === 'ketua_kelas' || user?.role === 'admin'}
              onAddNew={() => setShowAddCategoryModal(true)}
              addButtonText="Tambah Kategori"
            />

            {/* Deskripsi */}
            <Textarea
              {...register('deskripsi', { 
                required: 'Deskripsi wajib diisi',
                minLength: { value: 10, message: 'Deskripsi minimal 10 karakter' }
              })}
              label="Deskripsi"
              placeholder="Jelaskan detail laporan Anda..."
              rows={4}
              error={errors.deskripsi?.message}
            />

            {/* Upload Foto */}
            <div>
              <label className="text-lg font-semibold text-gray-800 mb-4 block">
                Foto Pendukung (Opsional)
              </label>
              <ImageUpload
                onImageSelect={handleImageSelect}
                onImageRemove={handleImageRemove}
                currentImage={selectedImage || undefined}
                maxSize={5}
                disabled={loading}
              />
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1 h-12 text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              >
                <span className="font-medium">Batal</span>
              </Button>
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
                className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Menyimpan...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <DocumentIcon className="w-5 h-5" />
                    <span>Buat Laporan</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={showAddCategoryModal}
        onClose={() => setShowAddCategoryModal(false)}
        onCategoryAdded={handleCategoryAdded}
      />
    </div>
  )
}
