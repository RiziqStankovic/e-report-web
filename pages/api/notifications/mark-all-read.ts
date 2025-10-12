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
  if (req.method === 'PUT') {
    // Mark all notifications as read
    notifications.forEach(notification => {
      notification.read = true
    })
    
    res.status(200).json({
      message: 'All notifications marked as read',
      count: notifications.length
    })
  } else {
    res.setHeader('Allow', ['PUT'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
