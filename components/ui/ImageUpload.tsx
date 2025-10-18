'use client'

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface ImageUploadProps {
  onImageSelect: (base64: string) => void
  onImageRemove: () => void
  currentImage?: string
  maxSize?: number // in MB
  className?: string
  disabled?: boolean
}

export function ImageUpload({ 
  onImageSelect, 
  onImageRemove, 
  currentImage, 
  maxSize = 5,
  className = '',
  disabled = false
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')

  const handleFileSelect = (file: File) => {
    setError('')
    
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

    // Convert to base64
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target?.result as string
      onImageSelect(base64)
    }
    reader.onerror = () => {
      setError('Gagal membaca file')
    }
    reader.readAsDataURL(file)
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
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onImageRemove()
    setError('')
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
          ${currentImage ? 'border-green-300 bg-green-50' : ''}
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
          disabled={disabled}
        />

        {currentImage ? (
          <div className="space-y-2">
            <div className="relative inline-block">
              <Image
                src={currentImage}
                alt="Preview"
                width={200}
                height={128}
                unoptimized={true}
                className="max-h-32 max-w-full rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                disabled={disabled}
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

// Component untuk menampilkan gambar base64
interface Base64ImageProps {
  base64: string
  alt?: string
  className?: string
  fallback?: React.ReactNode
}

export function Base64Image({ base64, alt = 'Image', className = '', fallback }: Base64ImageProps) {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Normalize base64 string
  const normalizedBase64 = React.useMemo(() => {
    if (!base64) return null
    
    // If already has data: prefix, return as is
    if (base64.startsWith('data:')) {
      return base64
    }
    
    // If it's a pure base64 string, add data:image/jpeg;base64, prefix
    return `data:image/jpeg;base64,${base64}`
  }, [base64])

  const handleLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    console.error('Failed to load base64 image:', base64?.substring(0, 50) + '...')
  }

  if (!normalizedBase64) {
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
        src={normalizedBase64}
        alt={alt}
        width={400}
        height={300}
        unoptimized={true}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  )
}

// Component untuk menampilkan multiple gambar
interface ImageGalleryProps {
  images: string[]
  onRemove?: (index: number) => void
  className?: string
  maxHeight?: string
}

export function ImageGallery({ images, onRemove, className = '' }: ImageGalleryProps) {
  if (images.length === 0) {
    return null
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 ${className}`}>
      {images.map((image, index) => (
        <div key={index} className="relative group">
          <Base64Image
            base64={image}
            alt={`Image ${index + 1}`}
            className="w-full h-24 object-cover rounded-lg border border-gray-200"
            fallback={
              <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                <PhotoIcon className="w-8 h-8 text-gray-400" />
              </div>
            }
          />
          {onRemove && (
            <button
              onClick={() => onRemove(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <XMarkIcon className="w-3 h-3" />
            </button>
          )}
        </div>
      ))}
    </div>
  )
}