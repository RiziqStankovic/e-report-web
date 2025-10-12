'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { MasterData } from '@/types'
import { masterDataApi } from '@/lib/api'
import toast from 'react-hot-toast'
import { TableSkeleton } from '@/components/ui/LoadingSkeleton'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

interface MasterDataTableProps {
  type: 'kelas' | 'shift' | 'ruangan' | 'kategori'
  title: string
}

export function MasterDataTable({ type, title }: MasterDataTableProps) {
  const [data, setData] = useState<MasterData[]>([])
  const [filteredData, setFilteredData] = useState<MasterData[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [newName, setNewName] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      let response
      switch (type) {
        case 'kelas':
          response = await masterDataApi.getKelas()
          break
        case 'shift':
          response = await masterDataApi.getShift()
          break
        case 'ruangan':
          response = await masterDataApi.getRuangan()
          break
        case 'kategori':
          response = await masterDataApi.getKategori()
          break
      }
      setData(response || [])
      setFilteredData(response || [])
    } catch {
      toast.error('Gagal memuat data')
      setData([])
      setFilteredData([])
    } finally {
      setLoading(false)
    }
  }, [type])

  useEffect(() => {
    fetchData()
  }, [type, fetchData])

  useEffect(() => {
    if (searchTerm) {
      const filtered = data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredData(filtered)
    } else {
      setFilteredData(data)
    }
  }, [searchTerm, data])

  const handleAdd = async () => {
    if (!newName.trim()) {
      toast.error('Nama tidak boleh kosong')
      return
    }

    try {
      await masterDataApi.create({
        name: newName.trim(),
        type,
        isActive: true
      })
      toast.success('Data berhasil ditambahkan')
      setNewName('')
      setShowAddForm(false)
      fetchData()
    } catch {
      toast.error('Gagal menambahkan data')
    }
  }

  const handleEdit = (item: MasterData) => {
    setEditingId(item.id)
    setEditingName(item.name)
  }

  const handleSaveEdit = async () => {
    if (!editingName.trim()) {
      toast.error('Nama tidak boleh kosong')
      return
    }

    try {
      await masterDataApi.update(editingId!, {
        name: editingName.trim()
      })
      toast.success('Data berhasil diperbarui')
      setEditingId(null)
      setEditingName('')
      fetchData()
    } catch {
      toast.error('Gagal memperbarui data')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingName('')
  }

  const handleToggleActive = async (item: MasterData) => {
    try {
      await masterDataApi.update(item.id, {
        isActive: !item.isActive
      })
      toast.success('Status berhasil diperbarui')
      fetchData()
    } catch {
      toast.error('Gagal memperbarui status')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      return
    }

    try {
      await masterDataApi.delete(id)
      toast.success('Data berhasil dihapus')
      fetchData()
    } catch {
      toast.error('Gagal menghapus data')
    }
  }

  if (loading) {
    return <TableSkeleton rows={5} />
  }

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-0">
            {title || 'Data Master'}
          </h2>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
          >
            <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            <span className="text-sm sm:text-base">Tambah</span>
          </Button>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        {/* Search Container - Mobile First */}
        <div className="mb-6 p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
              <MagnifyingGlassIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            Cari Data
          </h3>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder={`Cari ${title?.toLowerCase() || 'data'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-gray-900 placeholder-gray-500"
            />
          </div>
          {searchTerm && (
            <p className="text-xs text-gray-600 mt-2">
              Menampilkan {filteredData.length} dari {data.length} data
            </p>
          )}
        </div>

        {/* Add Form - Mobile First */}
        {showAddForm && (
          <div className="mb-6 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-4">Tambah {title || 'Data'} Baru</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder={`Masukkan ${title?.toLowerCase() || 'data'} baru`}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1 text-gray-900 placeholder-gray-500"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleAdd}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex-1 sm:flex-none"
                >
                  <CheckIcon className="w-4 h-4 mr-2" />
                  <span className="text-sm">Simpan</span>
                </Button>
                <Button
                  onClick={() => {
                    setShowAddForm(false)
                    setNewName('')
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex-1 sm:flex-none"
                >
                  <XMarkIcon className="w-4 h-4 mr-2" />
                  <span className="text-sm">Batal</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Data Table - Mobile First */}
        {filteredData.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <PlusIcon className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 text-sm sm:text-base font-medium">
              {searchTerm ? 'Data tidak ditemukan' : 'Belum ada data'}
            </p>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">
              {searchTerm ? 'Coba kata kunci lain' : 'Klik "Tambah" untuk menambahkan data baru'}
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredData.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl hover:shadow-lg"
              >
                {editingId === item.id ? (
                  <div className="space-y-4">
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="w-full text-gray-900 placeholder-gray-500"
                      placeholder="Masukkan nama baru"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveEdit}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex-1"
                      >
                        <CheckIcon className="w-4 h-4 mr-2" />
                        <span className="text-sm">Simpan</span>
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex-1"
                      >
                        <XMarkIcon className="w-4 h-4 mr-2" />
                        <span className="text-sm">Batal</span>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1 min-w-0 mb-3 sm:mb-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                        <h4 className="text-sm sm:text-base font-bold text-gray-900 truncate mb-2 sm:mb-0">
                          {item.name}
                        </h4>
                        <Badge 
                          variant={item.isActive ? 'success' : 'default'}
                          className="w-fit text-xs"
                        >
                          {item.isActive ? 'Aktif' : 'Tidak Aktif'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(item)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-2 rounded-lg flex-1 sm:flex-none"
                      >
                        <PencilIcon className="w-3 h-3 mr-1" />
                        <span className="text-xs">Edit</span>
                      </Button>
                      <Button
                        onClick={() => handleToggleActive(item)}
                        className={`px-2 py-2 rounded-lg flex-1 sm:flex-none ${
                          item.isActive 
                            ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      >
                        <span className="text-xs">
                          {item.isActive ? 'Nonaktif' : 'Aktif'}
                        </span>
                      </Button>
                      <Button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-2 py-2 rounded-lg flex-1 sm:flex-none"
                      >
                        <TrashIcon className="w-3 h-3 mr-1" />
                        <span className="text-xs">Hapus</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
