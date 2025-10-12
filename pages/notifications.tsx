'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/router'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ErrorHandler } from '@/components/ErrorHandler'
import { useApiError } from '@/hooks/useApiError'
import { 
  BellIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

interface Notification {
  id: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  createdAt: string
  read: boolean
  actionUrl?: string
}

export default function NotificationsPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const { error, executeWithErrorHandling } = useApiError()

  const fetchNotifications = useCallback(async () => {
    await executeWithErrorHandling(async () => {
      setLoading(true)
      try {
        // No fallback data - use empty array
        setNotifications([])
      } catch (error) {
        console.error('Error fetching notifications:', error)
      } finally {
        setLoading(false)
      }
    }, 'Notifications')
  }, [executeWithErrorHandling])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    } else {
      fetchNotifications()
    }
  }, [isAuthenticated, router, fetchNotifications])

  const markAsRead = async (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = async () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const deleteNotification = async (id: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    )
  }

  const deleteAllRead = async () => {
    setNotifications(prev =>
      prev.filter(notification => !notification.read)
    )
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
      case 'error':
        return <XMarkIcon className="w-5 h-5 text-red-500" />
      default:
        return <InformationCircleIcon className="w-5 h-5 text-blue-500" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500 bg-green-50'
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50'
      case 'error':
        return 'border-l-red-500 bg-red-50'
      default:
        return 'border-l-blue-500 bg-blue-50'
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Baru saja'
    if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} jam yang lalu`
    return `${Math.floor(diffInMinutes / 1440)} hari yang lalu`
  }

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read
    if (filter === 'read') return notification.read
    return true
  })

  const unreadCount = notifications.filter(n => !n.read).length

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <ErrorHandler error={error} onRetry={fetchNotifications} />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifikasi</h1>
            <p className="text-gray-600">
              Kelola notifikasi dan pesan sistem
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                onClick={markAllAsRead}
                size="sm"
              >
                <CheckIcon className="w-4 h-4 mr-2" />
                Tandai Semua Dibaca
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={deleteAllRead}
              size="sm"
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              Hapus yang Dibaca
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <Card>
          <CardContent className="p-4">
            <div className="flex space-x-1">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Semua ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'unread'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Belum Dibaca ({unreadCount})
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'read'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sudah Dibaca ({notifications.length - unreadCount})
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <BellIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'all' ? 'Tidak ada notifikasi' : 
                 filter === 'unread' ? 'Tidak ada notifikasi yang belum dibaca' : 
                 'Tidak ada notifikasi yang sudah dibaca'}
              </h3>
              <p className="text-gray-500">
                {filter === 'all' ? 'Anda akan menerima notifikasi di sini ketika ada aktivitas baru.' :
                 filter === 'unread' ? 'Semua notifikasi telah dibaca.' :
                 'Belum ada notifikasi yang dibaca.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  notification.read ? 'opacity-60' : ''
                }`}
                onClick={() => {
                  if (!notification.read) {
                    markAsRead(notification.id)
                  }
                  if (notification.actionUrl) {
                    router.push(notification.actionUrl)
                  }
                }}
              >
                <CardContent className="p-4">
                  <div className={`p-3 rounded-lg border-l-4 ${getNotificationColor(notification.type)}`}>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatTime(notification.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.read && (
                          <Badge variant="danger" className="text-xs">
                            Baru
                          </Badge>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNotification(notification.id)
                          }}
                          className="p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
