'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { User } from '@/types'
import { usersApi } from '@/lib/api'
import toast from 'react-hot-toast'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { formatDate } from '@/lib/utils'

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingData, setEditingData] = useState<Partial<User>>({})
  const [newUser, setNewUser] = useState<Partial<User>>({
    username: '',
    name: '',
    email: '',
    phone: '',
    role: 'ketua_kelas'
  })
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await usersApi.getAll()
      setUsers(data)
    } catch {
      toast.error('Gagal memuat data pengguna')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!newUser.username || !newUser.name) {
      toast.error('Username dan nama wajib diisi')
      return
    }

    try {
      await usersApi.create({
        username: newUser.username!,
        name: newUser.name!,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role as 'admin' | 'ketua_kelas' | 'staff' | 'kepala_bagian'
      })
      toast.success('Pengguna berhasil ditambahkan')
      setNewUser({
        username: '',
        name: '',
        email: '',
        phone: '',
        role: 'ketua_kelas'
      })
      setShowAddForm(false)
      fetchUsers()
    } catch {
      toast.error('Gagal menambahkan pengguna')
    }
  }

  const handleEdit = (user: User) => {
    setEditingId(user.id)
    setEditingData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    })
  }

  const handleSaveEdit = async () => {
    if (!editingData.name) {
      toast.error('Nama wajib diisi')
      return
    }

    try {
      await usersApi.update(editingId!, editingData)
      toast.success('Data pengguna berhasil diperbarui')
      setEditingId(null)
      setEditingData({})
      fetchUsers()
    } catch {
      toast.error('Gagal memperbarui data pengguna')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingData({})
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      return
    }

    try {
      await usersApi.delete(id)
      toast.success('Pengguna berhasil dihapus')
      fetchUsers()
    } catch {
      toast.error('Gagal menghapus pengguna')
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Admin'
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

  const getRoleVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'danger'
      case 'ketua_kelas':
        return 'info'
      case 'staff':
        return 'warning'
      case 'kepala_bagian':
        return 'success'
      default:
        return 'default'
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Kelola Pengguna</CardTitle>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            size="sm"
            className="flex items-center space-x-2"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Tambah Pengguna</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari pengguna..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="font-medium text-gray-900 mb-4">Tambah Pengguna Baru</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                placeholder="Username"
                value={newUser.username}
                onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
              />
              <Input
                placeholder="Nama Lengkap"
                value={newUser.name}
                onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
              />
              <Input
                placeholder="Email (opsional)"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
              />
              <Input
                placeholder="No. Telepon (opsional)"
                value={newUser.phone}
                onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
              />
              <Select
                value={newUser.role}
                        onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as 'admin' | 'ketua_kelas' | 'staff' | 'kepala_bagian' }))}
                options={[
                  { value: 'ketua_kelas', label: 'Ketua Kelas' },
                  { value: 'staff', label: 'Staff' },
                  { value: 'kepala_bagian', label: 'Kepala Bagian' },
                  { value: 'admin', label: 'Admin' }
                ]}
              />
            </div>
            <div className="flex items-center space-x-2 mt-4">
              <Button
                onClick={handleAdd}
                size="sm"
                className="flex items-center space-x-1"
              >
                <CheckIcon className="w-4 h-4" />
                <span>Simpan</span>
              </Button>
              <Button
                onClick={() => {
                  setShowAddForm(false)
                  setNewUser({
                    username: '',
                    name: '',
                    email: '',
                    phone: '',
                    role: 'ketua_kelas'
                  })
                }}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                <XMarkIcon className="w-4 h-4" />
                <span>Batal</span>
              </Button>
            </div>
          </div>
        )}

        {/* Users List */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Tidak ada pengguna ditemukan</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  {editingId === user.id ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Input
                        placeholder="Nama Lengkap"
                        value={editingData.name}
                        onChange={(e) => setEditingData(prev => ({ ...prev, name: e.target.value }))}
                      />
                      <Input
                        placeholder="Email"
                        type="email"
                        value={editingData.email}
                        onChange={(e) => setEditingData(prev => ({ ...prev, email: e.target.value }))}
                      />
                      <Input
                        placeholder="No. Telepon"
                        value={editingData.phone}
                        onChange={(e) => setEditingData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                      <Select
                        value={editingData.role}
                        onChange={(e) => setEditingData(prev => ({ ...prev, role: e.target.value as 'admin' | 'ketua_kelas' | 'staff' | 'kepala_bagian' }))}
                        options={[
                          { value: 'ketua_kelas', label: 'Ketua Kelas' },
                          { value: 'staff', label: 'Staff' },
                          { value: 'kepala_bagian', label: 'Kepala Bagian' },
                          { value: 'admin', label: 'Admin' }
                        ]}
                      />
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-gray-900">{user.name}</h4>
                        <Badge variant={getRoleVariant(user.role) as 'default' | 'info' | 'warning' | 'success' | 'danger'}>
                          {getRoleLabel(user.role)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">@{user.username}</p>
                      {user.email && (
                        <p className="text-sm text-gray-500">{user.email}</p>
                      )}
                      {user.phone && (
                        <p className="text-sm text-gray-500">{user.phone}</p>
                      )}
                      <p className="text-xs text-gray-400">
                        Dibuat: {formatDate(user.createdAt)}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {editingId === user.id ? (
                    <>
                      <Button
                        onClick={handleSaveEdit}
                        size="sm"
                        className="flex items-center space-x-1"
                      >
                        <CheckIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => handleEdit(user)}
                        variant="ghost"
                        size="sm"
                        className="flex items-center space-x-1"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(user.id)}
                        variant="ghost"
                        size="sm"
                        className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
