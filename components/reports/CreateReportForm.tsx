'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { CustomSelect } from '@/components/ui/CustomSelect'
import { Textarea } from '@/components/ui/Textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { CreateReportData, FileMetadata } from '@/types'
import { reportsApi, masterDataApi } from '@/lib/api'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { DocumentIcon } from '@heroicons/react/24/outline'
import { FileUpload } from '@/components/ui/FileUpload'
import { AddCategoryModal } from '@/components/reports/AddCategoryModal'

interface MasterData {
  id: string
  name: string
  type: string
  isActive: boolean
}

export function CreateReportForm() {
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
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [fileMetadata, setFileMetadata] = useState<FileMetadata | null>(null)
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    setError,
    clearErrors
  } = useForm<CreateReportData>({
    mode: 'onChange'
  })

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

  const handleFileSelect = (filename: string, fileUrl: string) => {
    setSelectedFile(filename)
    
    // Get metadata
    const metadata = {
      filename: filename,
      url: fileUrl,
      uploadedAt: new Date().toISOString()
    }
    
    setFileMetadata(metadata)
  }

  const handleFileRemove = () => {
    setSelectedFile(null)
    setFileMetadata(null)
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
    // Validasi manual untuk memastikan semua field required sudah diisi
    const validationErrors: string[] = []
    
    if (!data.kelas || data.kelas.trim() === '') {
      validationErrors.push('Kelas wajib dipilih')
      setError('kelas', { type: 'required', message: 'Kelas wajib dipilih' })
    }
    
    if (!data.shift || data.shift.trim() === '') {
      validationErrors.push('Shift wajib dipilih')
      setError('shift', { type: 'required', message: 'Shift wajib dipilih' })
    }
    
    if (!data.ruangan || data.ruangan.trim() === '') {
      validationErrors.push('Ruangan wajib dipilih')
      setError('ruangan', { type: 'required', message: 'Ruangan wajib dipilih' })
    }
    
    if (!data.kategori || data.kategori.trim() === '') {
      validationErrors.push('Kategori wajib dipilih')
      setError('kategori', { type: 'required', message: 'Kategori wajib dipilih' })
    }
    
    if (!data.jenis || data.jenis.trim() === '') {
      validationErrors.push('Jenis laporan wajib dipilih')
      setError('jenis', { type: 'required', message: 'Jenis laporan wajib dipilih' })
    }
    
    if (!data.deskripsi || data.deskripsi.trim() === '') {
      validationErrors.push('Deskripsi wajib diisi')
      setError('deskripsi', { type: 'required', message: 'Deskripsi wajib diisi' })
    }
    
    // Jika ada error validasi, tampilkan pesan dan stop submit
    if (validationErrors.length > 0) {
      toast.error(`Mohon lengkapi semua field yang wajib diisi:\n${validationErrors.join('\n')}`)
      return
    }
    
    try {
      setLoading(true)
      
      const reportData: CreateReportData = {
        ...data,
        foto: selectedFile || undefined,
        fotoMetadata: fileMetadata || undefined
      }
      
      await reportsApi.create(reportData)
      toast.success('Laporan berhasil dibuat!')
      router.push('/reports/my')
    } catch (error: unknown) {
      console.error('Error creating report:', error)
      toast.error('Gagal membuat laporan')
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
                onChange={(value) => {
                  setValue('kelas', value)
                  if (value) {
                    clearErrors('kelas')
                  } else {
                    setError('kelas', { type: 'required', message: 'Kelas wajib dipilih' })
                  }
                }}
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
                onChange={(value) => {
                  setValue('shift', value)
                  if (value) {
                    clearErrors('shift')
                  } else {
                    setError('shift', { type: 'required', message: 'Shift wajib dipilih' })
                  }
                }}
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
                onChange={(value) => {
                  setValue('ruangan', value)
                  if (value) {
                    clearErrors('ruangan')
                  } else {
                    setError('ruangan', { type: 'required', message: 'Ruangan wajib dipilih' })
                  }
                }}
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
              onChange={(value) => {
                setValue('kategori', value)
                if (value) {
                  clearErrors('kategori')
                } else {
                  setError('kategori', { type: 'required', message: 'Kategori wajib dipilih' })
                }
              }}
              error={errors.kategori?.message}
              showAddButton={false}
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
              <FileUpload
                onFileSelect={handleFileSelect}
                onFileRemove={handleFileRemove}
                currentFile={selectedFile || undefined}
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
