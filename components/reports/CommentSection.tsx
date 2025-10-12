'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/Badge'
import { 
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UserIcon,
  ClockIcon,
  TrashIcon,
  PencilIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/contexts/AuthContext'
import { useApiError } from '@/hooks/useApiError'
import toast from 'react-hot-toast'

interface Comment {
  id: string
  reportId: string
  userId: string
  userName: string
  userRole: string
  content: string
  createdAt: string
  updatedAt: string
  isEdited?: boolean
}

interface CommentSectionProps {
  reportId: string
  comments: Comment[]
  onCommentsChange?: (comments: Comment[]) => void
  className?: string
}

export function CommentSection({ 
  reportId, 
  comments, 
  onCommentsChange,
  className 
}: CommentSectionProps) {
  const { user } = useAuth()
  const [newComment, setNewComment] = useState('')
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [loading, setLoading] = useState(false)
  const { executeWithErrorHandling } = useApiError()

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newComment.trim()) return

    await executeWithErrorHandling(async () => {
      setLoading(true)
      try {
        // Mock API call - replace with actual API call
        const comment: Comment = {
          id: Date.now().toString(),
          reportId,
          userId: user?.id || '',
          userName: user?.name || 'Anonymous',
          userRole: user?.role || 'user',
          content: newComment.trim(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        const updatedComments = [...comments, comment]
        onCommentsChange?.(updatedComments)
        setNewComment('')
        toast.success('Komentar berhasil ditambahkan')
      } catch (error) {
        throw error
      } finally {
        setLoading(false)
      }
    }, 'Add Comment')
  }

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return

    await executeWithErrorHandling(async () => {
      setLoading(true)
      try {
        // Mock API call - replace with actual API call
        const originalComment = comments.find(c => c.id === commentId)
        if (!originalComment) return
        
        const updatedComment: Comment = {
          ...originalComment,
          content: editContent.trim(),
          updatedAt: new Date().toISOString()
        }
        
        const updatedComments = comments.map(comment =>
          comment.id === commentId ? updatedComment : comment
        )
        onCommentsChange?.(updatedComments)
        setEditingComment(null)
        setEditContent('')
        toast.success('Komentar berhasil diperbarui')
      } catch (error) {
        throw error
      } finally {
        setLoading(false)
      }
    }, 'Update Comment')
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus komentar ini?')) return

    await executeWithErrorHandling(async () => {
      setLoading(true)
      try {
        // Mock API call - replace with actual API call
        // await reportsApi.deleteComment(reportId, commentId)
        
        const updatedComments = comments.filter(comment => comment.id !== commentId)
        onCommentsChange?.(updatedComments)
        toast.success('Komentar berhasil dihapus')
      } catch (error) {
        throw error
      } finally {
        setLoading(false)
      }
    }, 'Delete Comment')
  }

  const startEditing = (comment: Comment) => {
    setEditingComment(comment.id)
    setEditContent(comment.content)
  }

  const cancelEditing = () => {
    setEditingComment(null)
    setEditContent('')
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Baru saja'
    if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} jam yang lalu`
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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

  const canEditComment = (comment: Comment) => {
    return user?.id === comment.userId || user?.role === 'admin'
  }

  const canDeleteComment = (comment: Comment) => {
    return user?.id === comment.userId || user?.role === 'admin'
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
          Komentar ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Comment Form */}
        <form onSubmit={handleSubmitComment} className="space-y-3">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Tulis komentar Anda..."
            rows={3}
            disabled={loading}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!newComment.trim() || loading}
              loading={loading}
            >
              <PaperAirplaneIcon className="w-4 h-4 mr-2" />
              Kirim Komentar
            </Button>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Belum ada komentar</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="border-l-4 border-blue-200 pl-4 py-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <UserIcon className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-900">
                        {comment.userName}
                      </span>
                      <Badge className={getRoleColor(comment.userRole)}>
                        {getRoleDisplayName(comment.userRole)}
                      </Badge>
                      {comment.isEdited && (
                        <Badge variant="default" className="text-xs">
                          Diedit
                        </Badge>
                      )}
                    </div>
                    
                    {editingComment === comment.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={2}
                          className="text-sm"
                        />
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleEditComment(comment.id)}
                            disabled={!editContent.trim() || loading}
                            loading={loading}
                          >
                            Simpan
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={cancelEditing}
                            disabled={loading}
                          >
                            Batal
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-700 text-sm mb-2">
                        {comment.content}
                      </p>
                    )}
                    
                    <div className="flex items-center text-xs text-gray-500">
                      <ClockIcon className="w-3 h-3 mr-1" />
                      {formatTime(comment.createdAt)}
                    </div>
                  </div>
                  
                  {/* Comment Actions */}
                  {!editingComment && (
                    <div className="flex space-x-1 ml-4">
                      {canEditComment(comment) && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEditing(comment)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Button>
                      )}
                      {canDeleteComment(comment) && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
