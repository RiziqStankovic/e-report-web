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
  const { id } = req.query
  
  if (req.method === 'GET') {
    // Get notification by ID
    const notification = notifications.find(n => n.id === id)
    if (notification) {
      res.status(200).json(notification)
    } else {
      res.status(404).json({ message: 'Notification not found' })
    }
  } else if (req.method === 'PUT') {
    // Update notification
    const notification = notifications.find(n => n.id === id)
    if (notification) {
      const { title, message, type, read, actionUrl, data } = req.body
      
      if (title) notification.title = title
      if (message) notification.message = message
      if (type) notification.type = type
      if (read !== undefined) notification.read = read
      if (actionUrl) notification.actionUrl = actionUrl
      if (data) notification.data = data
      
      res.status(200).json(notification)
    } else {
      res.status(404).json({ message: 'Notification not found' })
    }
  } else if (req.method === 'DELETE') {
    // Delete notification
    const index = notifications.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.splice(index, 1)
      res.status(200).json({ message: 'Notification deleted' })
    } else {
      res.status(404).json({ message: 'Notification not found' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
