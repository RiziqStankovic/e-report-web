import { NextApiRequest, NextApiResponse } from 'next'

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

// Empty notifications data - will be populated from database
const notifications: Notification[] = []

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Get all notifications
    res.status(200).json(notifications)
  } else if (req.method === 'POST') {
    // Create new notification
    const { title, message, type, actionUrl, data } = req.body
    
    const newNotification: Notification = {
      id: Date.now().toString(),
      title,
      message,
      type: type || 'info',
      read: false,
      createdAt: new Date().toISOString(),
      actionUrl,
      data
    }
    
    notifications.unshift(newNotification)
    res.status(201).json(newNotification)
  } else if (req.method === 'PUT') {
    // Mark notification as read
    const { id } = req.body
    
    const notification = notifications.find(n => n.id === id)
    if (notification) {
      notification.read = true
      res.status(200).json(notification)
    } else {
      res.status(404).json({ message: 'Notification not found' })
    }
  } else if (req.method === 'DELETE') {
    // Delete notification
    const { id } = req.query
    
    const index = notifications.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.splice(index, 1)
      res.status(200).json({ message: 'Notification deleted' })
    } else {
      res.status(404).json({ message: 'Notification not found' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
