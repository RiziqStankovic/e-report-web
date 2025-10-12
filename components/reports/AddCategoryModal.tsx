'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { masterDataApi } from '@/lib/api'
import toast from 'react-hot-toast'
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline'

interface AddCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onCategoryAdded: () => void
}

export function AddCategoryModal({ isOpen, onClose, onCategoryAdded }: AddCategoryModalProps) {
  const [categoryName, setCategoryName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!categoryName.trim()) {
      toast.error('Nama kategori tidak boleh kosong')
      return
    }

    try {
      setLoading(true)
      await masterDataApi.create({
        name: categoryName.trim(),
        type: 'kategori',
        isActive: true
      })
      
      toast.success('Kategori berhasil ditambahkan!')
      setCategoryName('')
      onCategoryAdded()
      onClose()
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Gagal menambahkan kategori'
        : 'Gagal menambahkan kategori'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setCategoryName('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-xl">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <div className="p-2 bg-white/20 rounded-lg">
                  <PlusIcon className="w-5 h-5" />
                </div>
                <span>Tambah Kategori Baru</span>
              </CardTitle>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <p className="text-green-100 text-sm mt-1">
              Tambahkan kategori baru untuk laporan
            </p>
          </CardHeader>
          
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nama Kategori"
                placeholder="Masukkan nama kategori baru"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
                disabled={loading}
              />
              
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                  disabled={loading}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  {loading ? 'Menambahkan...' : 'Tambah Kategori'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
