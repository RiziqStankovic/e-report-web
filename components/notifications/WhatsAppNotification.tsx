'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/Badge'
import { 
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import { useAuth } from '@/contexts/AuthContext'
import { useApiError } from '@/hooks/useApiError'
import toast from 'react-hot-toast'

interface WhatsAppNotificationProps {
  reportId?: string
  reportData?: Record<string, unknown>
  onSend?: (message: string, recipients: string[]) => void
  className?: string
}

interface WhatsAppTemplate {
  id: string
  name: string
  content: string
  variables: string[]
}

interface WhatsAppRecipient {
  id: string
  name: string
  phone: string
  role: string
  isSelected: boolean
}

const WHATSAPP_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: 'new_report',
    name: 'Laporan Baru',
    content: '📋 *Laporan Baru*\\n\\nPelapor: {pelapor}\\nKelas: {kelas}\\nKategori: {kategori}\\nDeskripsi: {deskripsi}\\n\\nSilakan segera ditindaklanjuti.\\n\\n_E-Report System_',
    variables: ['pelapor', 'kelas', 'kategori', 'deskripsi']
  },
  {
    id: 'status_update',
    name: 'Update Status',
    content: '🔄 *Update Status Laporan*\\n\\nID Laporan: {id_laporan}\\nStatus: {status}\\nPelapor: {pelapor}\\n\\nLaporan telah {status}.\\n\\n_E-Report System_',
    variables: ['id_laporan', 'status', 'pelapor']
  },
  {
    id: 'reminder',
    name: 'Pengingat',
    content: '⏰ *Pengingat Laporan*\\n\\nID Laporan: {id_laporan}\\nKategori: {kategori}\\nDurasi: {durasi}\\n\\nLaporan ini sudah {durasi} dan belum ditindaklanjuti.\\n\\n_E-Report System_',
    variables: ['id_laporan', 'kategori', 'durasi']
  },
  {
    id: 'custom',
    name: 'Pesan Kustom',
    content: 'Pesan kustom Anda di sini...',
    variables: []
  }
]

export function WhatsAppNotification({ 
  reportData, 
  onSend,
  className 
}: WhatsAppNotificationProps) {
  const { } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplate>(WHATSAPP_TEMPLATES[0])
  const [customMessage, setCustomMessage] = useState('')
  const [recipients, setRecipients] = useState<WhatsAppRecipient[]>([])
  const [sending, setSending] = useState(false)
  const { executeWithErrorHandling } = useApiError()

  // Load recipients from API
  useEffect(() => {
    const loadRecipients = async () => {
      try {
        // This would be replaced with actual API call
        // const data = await userApi.getWhatsAppRecipients()
        // setRecipients(data)
        setRecipients([])
      } catch (error) {
        console.error('Error loading recipients:', error)
        setRecipients([])
      }
    }
    
    loadRecipients()
  }, [])

  // Update message when template changes
  useEffect(() => {
    if (selectedTemplate.id === 'custom') {
      setCustomMessage('')
    } else {
      let message = selectedTemplate.content
      
      if (reportData) {
        // Replace variables with actual data
        message = message
          .replace(/{pelapor}/g, (reportData.user_name as string) || 'N/A')
          .replace(/{kelas}/g, (reportData.kelas as string) || 'N/A')
          .replace(/{kategori}/g, (reportData.kategori as string) || 'N/A')
          .replace(/{deskripsi}/g, (reportData.deskripsi as string) || 'N/A')
          .replace(/{id_laporan}/g, (reportData.id as string)?.substring(0, 8) || 'N/A')
          .replace(/{status}/g, (reportData.status as string) || 'N/A')
          .replace(/{durasi}/g, (reportData.durasi as string) || 'N/A')
      }
      
      setCustomMessage(message)
    }
  }, [selectedTemplate, reportData])

  const handleTemplateChange = (template: WhatsAppTemplate) => {
    setSelectedTemplate(template)
  }

  const handleRecipientToggle = (recipientId: string) => {
    setRecipients(prev =>
      prev.map(recipient =>
        recipient.id === recipientId
          ? { ...recipient, isSelected: !recipient.isSelected }
          : recipient
      )
    )
  }

  const handleSelectAll = () => {
    const allSelected = recipients.every(r => r.isSelected)
    setRecipients(prev =>
      prev.map(recipient => ({ ...recipient, isSelected: !allSelected }))
    )
  }

  const handleSend = async () => {
    const selectedRecipients = recipients.filter(r => r.isSelected)
    
    if (selectedRecipients.length === 0) {
      toast.error('Pilih minimal satu penerima')
      return
    }

    if (!customMessage.trim()) {
      toast.error('Pesan tidak boleh kosong')
      return
    }

    await executeWithErrorHandling(async () => {
      setSending(true)
      try {
        // Mock WhatsApp API call
        // In real implementation, call WhatsApp API

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))

        // In real implementation, call WhatsApp API
        // await notificationApi.sendWhatsApp({
        //   message: customMessage,
        //   recipients: selectedRecipients.map(r => r.phone),
        //   reportId
        // })

        toast.success(`Pesan berhasil dikirim ke ${selectedRecipients.length} penerima`)
        
        if (onSend) {
          onSend(customMessage, selectedRecipients.map(r => r.phone))
        }
        
        setIsOpen(false)
      } catch (error) {
        throw error
      } finally {
        setSending(false)
      }
    }, 'WhatsApp Notification')
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800'
      case 'ketua_kelas':
        return 'bg-green-100 text-green-800'
      case 'staff':
        return 'bg-blue-100 text-blue-800'
      case 'kepala_bagian':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleDisplayName = (role: string) => {
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

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className={className}
        variant="outline"
      >
        <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
        Kirim WhatsApp
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
              Kirim Notifikasi WhatsApp
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <XCircleIcon className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Template Selection */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Pilih Template</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {WHATSAPP_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateChange(template)}
                  className={`p-3 text-left rounded-lg border transition-colors ${
                    selectedTemplate.id === template.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-medium text-sm">{template.name}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {template.variables.length} variabel
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Message Preview */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Preview Pesan</h4>
            <Textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={6}
              placeholder="Tulis pesan WhatsApp Anda..."
              className="font-mono text-sm"
            />
            <div className="text-xs text-gray-500 mt-1">
              {customMessage.length} karakter
            </div>
          </div>

          {/* Recipients Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-900">Pilih Penerima</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
              >
                {recipients.every(r => r.isSelected) ? 'Batal Pilih Semua' : 'Pilih Semua'}
              </Button>
            </div>
            
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {recipients.map((recipient) => (
                <div
                  key={recipient.id}
                  className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={recipient.isSelected}
                    onChange={() => handleRecipientToggle(recipient.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">{recipient.name}</span>
                      <Badge className={getRoleColor(recipient.role)}>
                        {getRoleDisplayName(recipient.role)}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <PhoneIcon className="w-3 h-3 mr-1" />
                      {recipient.phone}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-xs text-gray-500 mt-2">
              {recipients.filter(r => r.isSelected).length} dari {recipients.length} penerima dipilih
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Batal
            </Button>
            <Button
              onClick={handleSend}
              loading={sending}
              disabled={recipients.filter(r => r.isSelected).length === 0 || !customMessage.trim()}
            >
              <PaperAirplaneIcon className="w-4 h-4 mr-2" />
              Kirim
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// WhatsApp Status Component
interface WhatsAppStatusProps {
  reportId: string
  className?: string
}

export function WhatsAppStatus({ className }: WhatsAppStatusProps) {
  const [status, setStatus] = useState<'sent' | 'delivered' | 'read' | 'failed' | 'pending'>('pending')
  const [lastSent, setLastSent] = useState<Date | null>(null)

  useEffect(() => {
    // Mock status updates
    const timer = setTimeout(() => {
      setStatus('sent')
      setLastSent(new Date())
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const getStatusIcon = () => {
    switch (status) {
      case 'sent':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />
      case 'delivered':
        return <CheckCircleIcon className="w-4 h-4 text-blue-500" />
      case 'read':
        return <CheckCircleIcon className="w-4 h-4 text-purple-500" />
      case 'failed':
        return <XCircleIcon className="w-4 h-4 text-red-500" />
      default:
        return <ClockIcon className="w-4 h-4 text-yellow-500" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'sent':
        return 'Terkirim'
      case 'delivered':
        return 'Diterima'
      case 'read':
        return 'Dibaca'
      case 'failed':
        return 'Gagal'
      default:
        return 'Menunggu'
    }
  }

  return (
    <div className={`flex items-center space-x-2 text-sm ${className}`}>
      {getStatusIcon()}
      <span className="text-gray-600">{getStatusText()}</span>
      {lastSent && (
        <span className="text-gray-400">
          • {lastSent.toLocaleTimeString('id-ID')}
        </span>
      )}
    </div>
  )
}
