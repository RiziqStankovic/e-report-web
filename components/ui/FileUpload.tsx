'use client'

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { uploadApi } from '@/lib/api'
import toast from 'react-hot-toast'

interface FileUploadProps {
  onFileSelect: (filename: string, fileUrl: string) => void
  onFileRemove: () => void
  currentFile?: string // filename or URL
  maxSize?: number // in MB
  className?: string
  disabled?: boolean
}

export function FileUpload({ 
  onFileSelect, 
  onFileRemove, 
  currentFile, 
  maxSize = 5,
  className = '',
  disabled = false
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [compressing, setCompressing] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  const compressImage = (file: File, maxSizeMB: number = 3): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new window.Image()
      
      img.onload = () => {
        // Calculate new dimensions (maintain aspect ratio)
        let { width, height } = img
        
        // If image is too large, scale it down
        const maxDimension = 1920 // Max width or height
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height * maxDimension) / width
            width = maxDimension
          } else {
            width = (width * maxDimension) / height
            height = maxDimension
          }
        }
        
        canvas.width = width
        canvas.height = height
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height)
        
        // Try different quality levels
        const tryCompress = (quality: number) => {
          canvas.toBlob((blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              })
              
              // If still too large and quality > 0.1, try lower quality
              if (compressedFile.size > maxSizeMB * 1024 * 1024 && quality > 0.1) {
                tryCompress(quality - 0.1)
              } else {
                resolve(compressedFile)
              }
            } else {
              resolve(file) // Fallback to original
            }
          }, 'image/jpeg', quality)
        }
        
        // Start with 0.8 quality
        tryCompress(0.8)
      }
      
      img.onerror = () => resolve(file) // Fallback to original
      img.src = URL.createObjectURL(file)
    })
  }

  const handleFileSelect = async (file: File) => {
    setError('')
    setUploading(true)
    
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('File harus berupa gambar')
        return
      }

      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        setError(`Ukuran file maksimal ${maxSize}MB`)
        return
      }

      let fileToUpload = file
      
      // Compress if file is larger than 3MB
      if (file.size > 3 * 1024 * 1024) {
        setCompressing(true)
        fileToUpload = await compressImage(file, 3)
        setCompressing(false)
      }

      // Upload file to server
      const response = await uploadApi.uploadFile(fileToUpload)
      
      // Use URL from response if available, otherwise construct it
      const fileUrl = response.url || uploadApi.getFileUrl(response.filename)
      
      // Call parent callback with filename and URL
      onFileSelect(response.filename, fileUrl)
      
      setError('')
      setRetryCount(0) // Reset retry count for new file
      toast.success('File berhasil diupload')
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Gagal mengupload file'
        : 'Gagal mengupload file'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleClick = () => {
    if (!disabled && !uploading && !compressing) {
      fileInputRef.current?.click()
    }
  }

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (currentFile) {
      try {
        // Extract filename from URL or use currentFile as filename
        const filename = currentFile.includes('/') 
          ? currentFile.split('/').pop() || currentFile
          : currentFile
        
        await uploadApi.deleteFile(filename)
        toast.success('File berhasil dihapus')
      } catch (error) {
        console.error('Failed to delete file:', error)
        // Continue with removal even if delete fails
      }
    }
    
    onFileRemove()
    setError('')
  }

  // Get file URL for display
  const getFileUrl = (file: string) => {
    if (!file) return ''
    
    // If it's already a full URL, return as is
    if (file.startsWith('http')) {
      return file
    }
    
    // If it's a relative path starting with /uploads/, add host
    if (file.startsWith('/uploads/')) {
      // Get base URL and remove /api suffix if present
      let baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081'
      if (baseUrl.endsWith('/api')) {
        baseUrl = baseUrl.replace('/api', '')
      }
      return `${baseUrl}${file}`
    }
    
    // If it's a filename, construct the URL
    return uploadApi.getFileUrl(file)
  }

  // Handle image load error
  const handleImageError = () => {
    const imageUrl = currentFile ? getFileUrl(currentFile) : ''
    console.error('Failed to load image preview for:', currentFile)
    console.error('Constructed URL:', imageUrl)
    
    // Retry up to 3 times with delay
    if (retryCount < 3) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1)
        setError('') // Clear error to retry
      }, 1000 * (retryCount + 1)) // Increasing delay: 1s, 2s, 3s
    } else {
      setError('Gagal memuat preview gambar')
    }
  }

  // Handle image load success
  const handleImageLoad = () => {
    setError('') // Clear any previous errors
    setRetryCount(0) // Reset retry count on success
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${disabled || uploading || compressing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
          ${currentFile ? 'border-green-300 bg-green-50' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled || uploading || compressing}
        />

        {uploading || compressing ? (
          <div className="space-y-2">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-blue-600 font-medium">
              {compressing ? 'Mengkompresi gambar...' : 'Mengupload file...'}
            </p>
          </div>
        ) : currentFile ? (
          <div className="space-y-2">
            <div className="relative inline-block">
              {error ? (
                <div className="w-48 h-32 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <PhotoIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">Preview tidak tersedia</p>
                  </div>
                </div>
              ) : (
                <Image
                  src={getFileUrl(currentFile)}
                  alt="Preview"
                  width={200}
                  height={128}
                  className="max-h-32 max-w-full rounded-lg object-cover"
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                />
              )}
              <button
                type="button"
                onClick={handleRemove}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                disabled={disabled || uploading || compressing}
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-green-600 font-medium">Gambar berhasil diupload</p>
            <p className="text-xs text-gray-500">Klik untuk mengganti gambar</p>
          </div>
        ) : (
          <div className="space-y-2">
            <PhotoIcon className="w-12 h-12 mx-auto text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {isDragging ? 'Lepaskan gambar di sini' : 'Klik atau drag gambar ke sini'}
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF hingga {maxSize}MB
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

// Component untuk menampilkan gambar dari file URL
interface FileImageProps {
  filename: string // Can be filename, relative path (/uploads/...), or full URL
  alt?: string
  className?: string
  fallback?: React.ReactNode
}

export function FileImage({ filename, alt = 'Image', className = '', fallback }: FileImageProps) {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Smart URL construction - handle both filename and full URL
  const getFileUrl = (file: string) => {
    if (!file) return ''
    
    // If it's already a full URL, return as is
    if (file.startsWith('http')) {
      return file
    }
    
    // If it's a relative path starting with /uploads/, add host
    if (file.startsWith('/uploads/')) {
      // Get base URL and remove /api suffix if present
      let baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081'
      
      if (baseUrl.endsWith('/api')) {
        baseUrl = baseUrl.replace('/api', '')
      }
      
      return `${baseUrl}${file}`
    }
    
    // If it's a filename, construct the URL (fallback for old data)
    return uploadApi.getFileUrl(file)
  }

  const fileUrl = getFileUrl(filename)
  
  console.log('[FileImage] Current state - isLoading:', isLoading, 'hasError:', hasError)

  const handleLoad = () => {
    console.log('[FileImage] Image loaded successfully, setting isLoading to false')
    setIsLoading(false)
    setHasError(false)
  }

  const handleError = () => {
    console.log('[FileImage] Image failed to load, setting isLoading to false and hasError to true')
    setIsLoading(false)
    setHasError(true)
    console.error('[FileImage] Failed to load file image:', filename)
    console.error('[FileImage] Failed URL:', fileUrl)
  }

  if (!filename) {
    return fallback || <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">Tidak ada foto</div>
  }

  if (hasError) {
    return fallback || <div className="w-full h-48 bg-red-100 rounded-lg flex items-center justify-center text-red-500">Gagal memuat foto</div>
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 rounded-lg flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      <Image
        src={fileUrl}
        alt={alt}
        width={400}
        height={300}
        priority={true}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  )
}
