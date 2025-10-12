/**
 * Utility functions for handling base64 images
 */

export interface ImageMetadata {
  base64: string
  size: number
  type: string
  width?: number
  height?: number
}

/**
 * Convert file to base64 with metadata
 */
export async function fileToBase64(file: File): Promise<ImageMetadata> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const base64 = e.target?.result as string
      if (!base64) {
        reject(new Error('Failed to convert file to base64'))
        return
      }

      // Get image dimensions
      const img = new Image()
      img.onload = () => {
        resolve({
          base64,
          size: file.size,
          type: file.type,
          width: img.width,
          height: img.height
        })
      }
      img.onerror = () => {
        // If we can't get dimensions, still return the base64
        resolve({
          base64,
          size: file.size,
          type: file.type
        })
      }
      img.src = base64
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    
    reader.readAsDataURL(file)
  })
}

/**
 * Compress base64 image
 */
export async function compressBase64Image(
  base64: string, 
  quality: number = 0.8, 
  maxWidth: number = 1920, 
  maxHeight: number = 1080
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'))
        return
      }

      // Calculate new dimensions
      let { width, height } = img
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width *= ratio
        height *= ratio
      }

      canvas.width = width
      canvas.height = height

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height)
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality)
      
      resolve(compressedBase64)
    }
    
    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }
    
    img.src = base64
  })
}

/**
 * Validate base64 image
 */
export function validateBase64Image(base64: string): boolean {
  try {
    // Check if it's a valid base64 string
    const base64Regex = /^data:image\/(png|jpeg|jpg|gif|webp);base64,/
    return base64Regex.test(base64)
  } catch {
    return false
  }
}

/**
 * Get base64 size in bytes
 */
export function getBase64Size(base64: string): number {
  try {
    // Remove data URL prefix
    const base64Data = base64.split(',')[1]
    if (!base64Data) return 0
    
    // Calculate size (base64 is ~33% larger than binary)
    return Math.floor(base64Data.length * 0.75)
  } catch {
    return 0
  }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Generate thumbnail from base64
 */
export async function generateThumbnail(
  base64: string, 
  size: number = 150
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'))
        return
      }

      canvas.width = size
      canvas.height = size

      // Draw image centered and cropped
      const scale = Math.max(size / img.width, size / img.height)
      const x = (size - img.width * scale) / 2
      const y = (size - img.height * scale) / 2
      
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale)
      
      resolve(canvas.toDataURL('image/jpeg', 0.8))
    }
    
    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }
    
    img.src = base64
  })
}

/**
 * Check if base64 is too large
 */
export function isBase64TooLarge(base64: string, maxSizeMB: number = 5): boolean {
  const sizeBytes = getBase64Size(base64)
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return sizeBytes > maxSizeBytes
}

/**
 * Extract image type from base64
 */
export function getImageTypeFromBase64(base64: string): string {
  const match = base64.match(/^data:image\/([a-zA-Z]+);base64,/)
  return match ? match[1] : 'unknown'
}

/**
 * Create optimized base64 for database storage
 */
export async function optimizeForDatabase(
  base64: string,
  options: {
    maxWidth?: number
    maxHeight?: number
    quality?: number
    maxSizeMB?: number
  } = {}
): Promise<string> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    maxSizeMB = 5
  } = options

  try {
    // First compress the image
    let optimized = await compressBase64Image(base64, quality, maxWidth, maxHeight)
    
    // Check if still too large
    if (isBase64TooLarge(optimized, maxSizeMB)) {
      // Further reduce quality
      const newQuality = Math.max(0.3, quality * 0.7)
      optimized = await compressBase64Image(base64, newQuality, maxWidth, maxHeight)
    }
    
    return optimized
  } catch (error) {
    console.error('Failed to optimize image:', error)
    return base64
  }
}
