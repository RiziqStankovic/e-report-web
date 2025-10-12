'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { 
  BellIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/contexts/AuthContext'
import { useApiError } from '@/hooks/useApiError'
import toast from 'react-hot-toast'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: string
  actionUrl?: string
  data?: Record<string, unknown>
}

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationCenter({ 
  isOpen, 
  onClose
}: NotificationCenterProps) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [ws, setWs] = useState<WebSocket | null>(null)
  const { executeWithErrorHandling } = useApiError()

  // WebSocket connection for real-time notifications
  useEffect(() => {
    if (!user || !isOpen) return

    const connectWebSocket = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const wsUrl = `${protocol}//${window.location.host}/ws/notifications?token=${localStorage.getItem('e-report-token')}`
      
      const websocket = new WebSocket(wsUrl)
      
      websocket.onopen = () => {
        console.log('WebSocket connected')
      }
      
      websocket.onmessage = (event) => {
        try {
          const notification = JSON.parse(event.data)
          setNotifications(prev => [notification, ...prev])
          
          // Show toast notification
          toast(notification.message, {
            icon: getNotificationIcon(notification.type),
            duration: 5000
          })
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }
      
      websocket.onclose = () => {
        console.log('WebSocket disconnected, attempting to reconnect...')
        setTimeout(connectWebSocket, 5000)
      }
      
      websocket.onerror = (error) => {
        console.error('WebSocket error:', error)
      }
      
      setWs(websocket)
    }

    connectWebSocket()

    return () => {
      if (ws) {
        ws.close()
      }
    }
  }, [user, isOpen, ws])

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    await executeWithErrorHandling(async () => {
      setLoading(true)
      try {
        // Mock data - replace with actual API call
        const data: Notification[] = []
        setNotifications(data)
      } catch {
        // No fallback data - use empty array
        setNotifications([])
      } finally {
        setLoading(false)
      }
    }, 'Notifications')
  }, [executeWithErrorHandling])

  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen, fetchNotifications])

  const markAsRead = async (id: string) => {
    await executeWithErrorHandling(async () => {
      try {
        // Mock API call - replace with actual API call
        // await notificationApi.markAsRead(id)
        setNotifications(prev =>
          prev.map(notification =>
            notification.id === id
              ? { ...notification, read: true }
              : notification
          )
        )
      } catch (error) {
        throw error
      }
    }, 'Mark Notification as Read')
  }

  const markAllAsRead = async () => {
    await executeWithErrorHandling(async () => {
      try {
        // Mock API call - replace with actual API call
        // await notificationApi.markAllAsRead()
        setNotifications(prev =>
          prev.map(notification => ({ ...notification, read: true }))
        )
        toast.success('Semua notifikasi ditandai sebagai dibaca')
      } catch (error) {
        throw error
      }
    }, 'Mark All Notifications as Read')
  }

  const deleteNotification = async (id: string) => {
    await executeWithErrorHandling(async () => {
      try {
        // Mock API call - replace with actual API call
        // await notificationApi.delete(id)
        setNotifications(prev =>
          prev.filter(notification => notification.id !== id)
        )
      } catch (error) {
        throw error
      }
    }, 'Delete Notification')
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
      case 'error':
        return <XCircleIcon className="w-5 h-5 text-red-500" />
      default:
        return <InformationCircleIcon className="w-5 h-5 text-blue-500" />
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <BellIcon className="w-5 h-5 mr-2" />
            Notifikasi
            {unreadCount > 0 && (
              <Badge variant="danger" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-5 h-5" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Filter Tabs */}
          <div className="border-b px-6 py-3">
            <div className="flex space-x-1">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Semua ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  filter === 'unread'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Belum Dibaca ({unreadCount})
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  filter === 'read'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sudah Dibaca ({notifications.length - unreadCount})
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BellIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Tidak ada notifikasi</p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </h4>
                          <div className="flex items-center space-x-2">
                            {!notification.read && (
                              <Badge variant="danger" className="text-xs">
                                Baru
                              </Badge>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="text-gray-400 hover:text-red-600"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {formatTime(notification.createdAt)}
                          </span>
                          
                          <div className="flex space-x-2">
                            {!notification.read && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs"
                              >
                                <CheckIcon className="w-3 h-3 mr-1" />
                                Tandai Dibaca
                              </Button>
                            )}
                            
                            {notification.actionUrl && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  window.location.href = notification.actionUrl!
                                  onClose()
                                }}
                                className="text-xs"
                              >
                                Lihat Detail
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          {notifications.length > 0 && (
            <div className="border-t px-6 py-3 bg-gray-50">
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                >
                  <CheckIcon className="w-4 h-4 mr-2" />
                  Tandai Semua Dibaca
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchNotifications}
                  loading={loading}
                >
                  Refresh
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
