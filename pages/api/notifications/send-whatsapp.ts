import { NextApiRequest, NextApiResponse } from 'next'

interface WhatsAppMessage {
  message: string
  recipients: string[]
  reportId?: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { message, recipients, reportId }: WhatsAppMessage = req.body
    
    // Validate input
    if (!message || !recipients || recipients.length === 0) {
      return res.status(400).json({ 
        message: 'Message and recipients are required' 
      })
    }
    
    // TODO: Implement actual WhatsApp API integration
    console.log('WhatsApp notification would be sent:', {
      message,
      recipients,
      reportId,
      timestamp: new Date().toISOString()
    })
    
    // Return success response
    res.status(200).json({
      message: 'WhatsApp notification sent successfully',
      recipients: recipients.length,
      reportId,
      timestamp: new Date().toISOString()
    })
    
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
