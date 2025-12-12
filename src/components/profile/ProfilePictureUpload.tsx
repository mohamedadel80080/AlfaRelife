'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Upload, 
  Camera, 
  X, 
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  Loader2,
  User
} from 'lucide-react'

interface ProfilePictureUploadProps {
  currentImage?: string
  onImageChange: (file: File | null) => void
  isUploading?: boolean
  uploadProgress?: number
  maxSize?: number // in MB
  acceptedTypes?: string[]
}

export function ProfilePictureUpload({
  currentImage,
  onImageChange,
  isUploading = false,
  uploadProgress = 0,
  maxSize = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp']
}: ProfilePictureUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      setError(`Invalid file type. Please upload ${acceptedTypes.map(type => type.split('/')[1]).join(', ')} files only.`)
      return false
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`)
      return false
    }

    return true
  }

  const handleFileSelect = (file: File) => {
    setError(null)
    
    if (!validateFile(file)) {
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    onImageChange(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleRemoveImage = () => {
    setPreview(null)
    onImageChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const displayImage = preview || currentImage

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileInput}
        className="hidden"
        disabled={isUploading}
      />

      {/* Image Preview */}
      <div className="flex items-center justify-center">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
            {displayImage ? (
              <img
                src={displayImage}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <User className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>

          {/* Upload Status Overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-6 w-6 animate-spin text-white mb-2" />
                <p className="text-white text-xs">Uploading...</p>
              </div>
            </div>
          )}

          {/* Remove Button */}
          {displayImage && !isUploading && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && uploadProgress > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Upload Progress</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {/* Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={!isUploading ? triggerFileInput : undefined}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Upload className="h-8 w-8 text-gray-400 mb-4" />
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">
              {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-gray-500">
              {acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')} files only
            </p>
            <p className="text-xs text-gray-500">
              Maximum file size: {maxSize}MB
            </p>
          </div>
          {!isUploading && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={(e) => {
                e.stopPropagation()
                triggerFileInput()
              }}
            >
              <Camera className="h-4 w-4 mr-2" />
              Choose File
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Success Message */}
      {preview && !isUploading && !error && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            Profile picture updated successfully! Click "Save Changes" to apply.
          </AlertDescription>
        </Alert>
      )}

      {/* Tips */}
      <Alert>
        <ImageIcon className="h-4 w-4" />
        <AlertDescription>
          <strong>Tip:</strong> For best results, use a square image with at least 200x200 pixels. 
          Professional headshots work best for profile pictures.
        </AlertDescription>
      </Alert>
    </div>
  )
}