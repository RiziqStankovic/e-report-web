'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  DocumentArrowDownIcon,
  DocumentTextIcon,
  TableCellsIcon,
  PrinterIcon,
  ShareIcon
} from '@heroicons/react/24/outline'
import { exportToPDF, exportToExcel, exportToCSV, printReport } from '@/lib/export-utils'
import toast from 'react-hot-toast'

interface ExportButtonProps {
  data: Record<string, unknown>[]
  type: 'reports' | 'dashboard' | 'users' | 'master-data'
  filename?: string
  className?: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export function ExportButton({ 
  data, 
  type, 
  filename, 
  className,
  variant = 'outline',
  size = 'md'
}: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [exporting, setExporting] = useState(false)

  const handleExport = async (format: 'pdf' | 'excel' | 'csv' | 'print') => {
    if (!data || data.length === 0) {
      toast.error('Tidak ada data untuk diekspor')
      return
    }

    setExporting(true)
    setIsOpen(false)

    try {
      const defaultFilename = `${type}-${new Date().toISOString().split('T')[0]}`
      const exportFilename = filename || defaultFilename

      switch (format) {
        case 'pdf':
          await exportToPDF(data, type, exportFilename)
          toast.success('File PDF berhasil diekspor')
          break
        case 'excel':
          await exportToExcel(data, type, exportFilename)
          toast.success('File Excel berhasil diekspor')
          break
        case 'csv':
          await exportToCSV(data, type, exportFilename)
          toast.success('File CSV berhasil diekspor')
          break
        case 'print':
          await printReport(data, type)
          toast.success('Dokumen siap untuk dicetak')
          break
      }
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Gagal mengekspor data')
    } finally {
      setExporting(false)
    }
  }

  const getExportOptions = () => {
    const baseOptions = [
      {
        id: 'pdf',
        label: 'Export PDF',
        description: 'Dokumen PDF dengan format yang rapi',
        icon: DocumentTextIcon,
        color: 'text-red-600'
      },
      {
        id: 'excel',
        label: 'Export Excel',
        description: 'File Excel untuk analisis data',
        icon: TableCellsIcon,
        color: 'text-green-600'
      },
      {
        id: 'csv',
        label: 'Export CSV',
        description: 'File CSV untuk import ke sistem lain',
        icon: DocumentArrowDownIcon,
        color: 'text-blue-600'
      },
      {
        id: 'print',
        label: 'Cetak',
        description: 'Cetak langsung ke printer',
        icon: PrinterIcon,
        color: 'text-gray-600'
      }
    ]

    return baseOptions
  }

  const exportOptions = getExportOptions()

  return (
    <div className="relative">
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsOpen(!isOpen)}
        loading={exporting}
        className={className}
      >
        <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
        {exporting ? 'Mengekspor...' : 'Export'}
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border z-20">
            <Card className="border-0 shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Pilih Format Export</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {exportOptions.map((option) => {
                    const IconComponent = option.icon
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleExport(option.id as 'pdf' | 'excel' | 'csv' | 'print')}
                        className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <IconComponent className={`w-5 h-5 mr-3 ${option.color}`} />
                        <div>
                          <p className="font-medium text-sm text-gray-900">
                            {option.label}
                          </p>
                          <p className="text-xs text-gray-500">
                            {option.description}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

// Bulk Export Component
interface BulkExportProps {
  data: Record<string, unknown>[]
  type: 'reports' | 'dashboard' | 'users' | 'master-data'
  selectedItems?: Record<string, unknown>[]
  onExport?: (format: string, items: Record<string, unknown>[]) => void
  className?: string
}

export function BulkExport({ 
  data, 
  type, 
  selectedItems = [], 
  onExport,
  className 
}: BulkExportProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'excel' | 'csv' | 'print'>('pdf')

  const handleBulkExport = async () => {
    const itemsToExport = selectedItems.length > 0 ? selectedItems : data
    
    if (itemsToExport.length === 0) {
      toast.error('Tidak ada data yang dipilih untuk diekspor')
      return
    }

    setExporting(true)
    setIsOpen(false)

    try {
      if (onExport) {
        onExport(selectedFormat, itemsToExport)
      } else {
        const filename = `${type}-bulk-${new Date().toISOString().split('T')[0]}`
        
        switch (selectedFormat) {
          case 'pdf':
            await exportToPDF(itemsToExport, type, filename)
            break
          case 'excel':
            await exportToExcel(itemsToExport, type, filename)
            break
          case 'csv':
            await exportToCSV(itemsToExport, type, filename)
            break
          case 'print':
            await printReport(itemsToExport, type)
            break
        }
      }
      
      toast.success(`Berhasil mengekspor ${itemsToExport.length} item`)
    } catch (error) {
      console.error('Bulk export error:', error)
      toast.error('Gagal mengekspor data')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className={className}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        loading={exporting}
        disabled={data.length === 0}
      >
        <ShareIcon className="w-4 h-4 mr-2" />
        Export {selectedItems.length > 0 ? `(${selectedItems.length})` : `(${data.length})`}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Bulk Export</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Format Export
                </label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value as 'pdf' | 'excel' | 'csv' | 'print')}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                  <option value="print">Print</option>
                </select>
              </div>

              <div className="text-sm text-gray-600">
                <p>Data yang akan diekspor:</p>
                <p className="font-medium">
                  {selectedItems.length > 0 
                    ? `${selectedItems.length} item terpilih` 
                    : `${data.length} item total`
                  }
                </p>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  onClick={handleBulkExport}
                  loading={exporting}
                >
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
