'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { 
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  CalendarIcon,
  UserIcon,
  TagIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface FilterOptions {
  search: string
  status: string[]
  jenis: string[]
  kategori: string[]
  kelas: string[]
  shift: string[]
  ruangan: string[]
  dateFrom: string
  dateTo: string
  userRole: string[]
}

interface ReportFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void
  onSearch: (query: string) => void
  className?: string
}

const STATUS_OPTIONS = [
  { value: 'menunggu', label: 'Menunggu', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'diproses', label: 'Diproses', color: 'bg-blue-100 text-blue-800' },
  { value: 'selesai', label: 'Selesai', color: 'bg-green-100 text-green-800' }
]

const JENIS_OPTIONS = [
  { value: 'kendala', label: 'Kendala', color: 'bg-red-100 text-red-800' },
  { value: 'kebutuhan', label: 'Kebutuhan', color: 'bg-blue-100 text-blue-800' }
]

const KATEGORI_OPTIONS = [
  { value: 'AC', label: 'AC' },
  { value: 'Proyektor', label: 'Proyektor' },
  { value: 'Pengajar', label: 'Pengajar' },
  { value: 'Kebersihan', label: 'Kebersihan' },
  { value: 'Furnitur', label: 'Furnitur' },
  { value: 'Listrik', label: 'Listrik' },
  { value: 'Internet', label: 'Internet' },
  { value: 'Lainnya', label: 'Lainnya' }
]

const KELAS_OPTIONS = [
  { value: 'Quran', label: 'Quran' },
  { value: 'Tahfidz', label: 'Tahfidz' },
  { value: 'Bahasa Arab', label: 'Bahasa Arab' },
  { value: 'Fiqih', label: 'Fiqih' },
  { value: 'Aqidah', label: 'Aqidah' }
]

const SHIFT_OPTIONS = [
  { value: 'Pagi', label: 'Pagi' },
  { value: 'Siang', label: 'Siang' },
  { value: 'Sore', label: 'Sore' },
  { value: 'Malam', label: 'Malam' }
]

const RUANGAN_OPTIONS = [
  { value: '101', label: '101' },
  { value: '102', label: '102' },
  { value: '103', label: '103' },
  { value: '201', label: '201' },
  { value: '202', label: '202' },
  { value: '203', label: '203' },
  { value: '301', label: '301' },
  { value: '302', label: '302' },
  { value: '303', label: '303' }
]

const USER_ROLE_OPTIONS = [
  { value: 'admin', label: 'Admin', color: 'bg-red-100 text-red-800' },
  { value: 'ketua_kelas', label: 'Ketua Kelas', color: 'bg-green-100 text-green-800' },
  { value: 'staff', label: 'Staff', color: 'bg-blue-100 text-blue-800' },
  { value: 'kepala_bagian', label: 'Kepala Bagian', color: 'bg-purple-100 text-purple-800' }
]

export function ReportFilters({ onFiltersChange, onSearch, className }: ReportFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    status: [],
    jenis: [],
    kategori: [],
    kelas: [],
    shift: [],
    ruangan: [],
    dateFrom: '',
    dateTo: '',
    userRole: []
  })
  
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, onSearch])

  // Update filters when they change
  useEffect(() => {
    onFiltersChange(filters)
  }, [filters, onFiltersChange])

  const handleFilterChange = (key: keyof FilterOptions, value: unknown) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleArrayFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => {
      const currentArray = prev[key] as string[]
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value]
      
      return {
        ...prev,
        [key]: newArray
      }
    })
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      status: [],
      jenis: [],
      kategori: [],
      kelas: [],
      shift: [],
      ruangan: [],
      dateFrom: '',
      dateTo: '',
      userRole: []
    })
    setSearchQuery('')
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.status.length > 0) count++
    if (filters.jenis.length > 0) count++
    if (filters.kategori.length > 0) count++
    if (filters.kelas.length > 0) count++
    if (filters.shift.length > 0) count++
    if (filters.ruangan.length > 0) count++
    if (filters.userRole.length > 0) count++
    if (filters.dateFrom || filters.dateTo) count++
    return count
  }

  const renderFilterGroup = (
    title: string,
    key: keyof FilterOptions,
    options: Array<{ value: string; label: string; color?: string }>,
    icon: React.ComponentType<{ className?: string }>
  ) => {
    const IconComponent = icon
    const currentValues = filters[key] as string[]
    
    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-900 flex items-center">
          <IconComponent className="w-4 h-4 mr-2" />
          {title}
        </h4>
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleArrayFilterChange(key, option.value)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                currentValues.includes(option.value)
                  ? option.color || 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <FunnelIcon className="w-5 h-5 mr-2" />
            Filter & Pencarian
            {getActiveFiltersCount() > 0 && (
              <Badge variant="danger" className="ml-2">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={clearFilters}
              disabled={getActiveFiltersCount() === 0}
            >
              <XMarkIcon className="w-4 h-4 mr-2" />
              Reset
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Sembunyikan' : 'Tampilkan'} Filter
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Cari laporan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="space-y-6 pt-4 border-t">
            {/* Status Filter */}
            {renderFilterGroup('Status', 'status', STATUS_OPTIONS, ClockIcon)}
            
            {/* Jenis Filter */}
            {renderFilterGroup('Jenis', 'jenis', JENIS_OPTIONS, TagIcon)}
            
            {/* Kategori Filter */}
            {renderFilterGroup('Kategori', 'kategori', KATEGORI_OPTIONS, TagIcon)}
            
            {/* Kelas Filter */}
            {renderFilterGroup('Kelas', 'kelas', KELAS_OPTIONS, UserIcon)}
            
            {/* Shift Filter */}
            {renderFilterGroup('Shift', 'shift', SHIFT_OPTIONS, ClockIcon)}
            
            {/* Ruangan Filter */}
            {renderFilterGroup('Ruangan', 'ruangan', RUANGAN_OPTIONS, MapPinIcon)}
            
            {/* User Role Filter */}
            {renderFilterGroup('Role Pengguna', 'userRole', USER_ROLE_OPTIONS, UserIcon)}
            
            {/* Date Range Filter */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900 flex items-center">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Rentang Tanggal
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Dari Tanggal</label>
                  <Input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Sampai Tanggal</label>
                  <Input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Summary */}
        {getActiveFiltersCount() > 0 && (
          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Filter Aktif:</h4>
            <div className="flex flex-wrap gap-2">
              {filters.status.map((status) => {
                const option = STATUS_OPTIONS.find(opt => opt.value === status)
                return (
                  <Badge key={status} className={option?.color}>
                    Status: {option?.label}
                    <button
                      onClick={() => handleArrayFilterChange('status', status)}
                      className="ml-1 hover:text-red-600"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </Badge>
                )
              })}
              
              {filters.jenis.map((jenis) => {
                const option = JENIS_OPTIONS.find(opt => opt.value === jenis)
                return (
                  <Badge key={jenis} className={option?.color}>
                    Jenis: {option?.label}
                    <button
                      onClick={() => handleArrayFilterChange('jenis', jenis)}
                      className="ml-1 hover:text-red-600"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </Badge>
                )
              })}
              
              {filters.kategori.map((kategori) => (
                <Badge key={kategori} variant="default">
                  Kategori: {kategori}
                  <button
                    onClick={() => handleArrayFilterChange('kategori', kategori)}
                    className="ml-1 hover:text-red-600"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              
              {filters.kelas.map((kelas) => (
                <Badge key={kelas} variant="default">
                  Kelas: {kelas}
                  <button
                    onClick={() => handleArrayFilterChange('kelas', kelas)}
                    className="ml-1 hover:text-red-600"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              
              {filters.shift.map((shift) => (
                <Badge key={shift} variant="default">
                  Shift: {shift}
                  <button
                    onClick={() => handleArrayFilterChange('shift', shift)}
                    className="ml-1 hover:text-red-600"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              
              {filters.ruangan.map((ruangan) => (
                <Badge key={ruangan} variant="default">
                  Ruangan: {ruangan}
                  <button
                    onClick={() => handleArrayFilterChange('ruangan', ruangan)}
                    className="ml-1 hover:text-red-600"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              
              {filters.userRole.map((role) => {
                const option = USER_ROLE_OPTIONS.find(opt => opt.value === role)
                return (
                  <Badge key={role} className={option?.color}>
                    Role: {option?.label}
                    <button
                      onClick={() => handleArrayFilterChange('userRole', role)}
                      className="ml-1 hover:text-red-600"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </Badge>
                )
              })}
              
              {(filters.dateFrom || filters.dateTo) && (
                <Badge variant="default">
                  Tanggal: {filters.dateFrom || 'Awal'} - {filters.dateTo || 'Akhir'}
                  <button
                    onClick={() => {
                      handleFilterChange('dateFrom', '')
                      handleFilterChange('dateTo', '')
                    }}
                    className="ml-1 hover:text-red-600"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
