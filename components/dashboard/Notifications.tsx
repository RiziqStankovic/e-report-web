'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { 
  BellIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

interface Notification {
  id: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  createdAt: string
  read?: boolean
}

interface NotificationsProps {
  notifications: Notification[]
}

export function Notifications({ notifications }: NotificationsProps) {
  const [localNotifications, setLocalNotifications] = useState<Notification[]>(notifications)
  const [showAll, setShowAll] = useState(false)

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

  const markAsRead = (id: string) => {
    setLocalNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setLocalNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const unreadCount = localNotifications.filter(n => !n.read).length
  const displayNotifications = showAll ? localNotifications : localNotifications.slice(0, 3)

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Baru saja'
    if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} jam yang lalu`
    return `${Math.floor(diffInMinutes / 1440)} hari yang lalu`
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <BellIcon className="w-5 h-5 mr-2" />
            Notifikasi
            {unreadCount > 0 && (
              <Badge variant="danger" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              <CheckIcon className="w-4 h-4 mr-1" />
              Tandai Semua
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {displayNotifications.length === 0 ? (
          <div className="text-center py-8">
            <BellIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Tidak ada notifikasi</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border-l-4 ${getNotificationColor(notification.type)} ${
                  notification.read ? 'opacity-60' : ''
                }`}
              >
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
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="flex-shrink-0 ml-2 p-1 rounded-full hover:bg-gray-200"
                    >
                      <CheckIcon className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {localNotifications.length > 3 && (
              <div className="text-center pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? 'Tampilkan Lebih Sedikit' : `Lihat Semua (${localNotifications.length})`}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
