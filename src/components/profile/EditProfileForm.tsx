'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Building, 
  MapPin, 
  Save, 
  Eye, 
  EyeOff,
  AlertCircle,
  CheckCircle,
  Lock
} from 'lucide-react'
import { POSITIONS, PROVINCES, BUSINESS_TYPES } from '@/types/profile'
import { useProfileForm } from '@/hooks/useProfileForm'
import { ProfilePictureUpload } from './ProfilePictureUpload'

export function EditProfileForm() {
  const {
    profile,
    formData,
    errors,
    isLoading,
    isSaving,
    isUploading,
    showPassword,
    showConfirmPassword,
    handleInputChange,
    handleSelectChange,
    handleFileChange,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    validateForm,
    handleSubmit,
    setFormData
  } = useProfileForm()

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useEffect(() => {
    if (formData) {
      setHasUnsavedChanges(true)
    }
  }, [formData])

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const success = await handleSubmit()
    if (success) {
      setHasUnsavedChanges(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading profile...</span>
      </div>
    )
  }

  if (!profile || !formData) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Profile</h3>
        <p className="text-gray-600">Unable to load your profile information.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {/* Profile Picture Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfilePictureUpload
            currentImage={profile.image}
            onImageChange={handleFileChange}
            isUploading={isUploading}
          />
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Enter your first name"
                className={errors.firstName ? 'border-red-500' : ''}
                disabled={isSaving}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Enter your last name"
                className={errors.lastName ? 'border-red-500' : ''}
                disabled={isSaving}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email address"
                className={errors.email ? 'border-red-500' : ''}
                disabled={isSaving}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
                className={errors.phone ? 'border-red-500' : ''}
                disabled={isSaving}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password (optional)</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password || ''}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter new password"
                  disabled={isSaving}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-500">Leave blank to keep current password</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="passwordConfirmation">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="passwordConfirmation"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.passwordConfirmation || ''}
                  onChange={(e) => handleInputChange('passwordConfirmation', e.target.value)}
                  placeholder="Confirm new password"
                  disabled={isSaving}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter your street address"
              className={errors.address ? 'border-red-500' : ''}
              disabled={isSaving}
              rows={3}
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postcode">Postal Code *</Label>
              <Input
                id="postcode"
                value={formData.postcode}
                onChange={(e) => handleInputChange('postcode', e.target.value.toUpperCase())}
                placeholder="A1A 1A1"
                className={errors.postcode ? 'border-red-500' : ''}
                disabled={isSaving}
                maxLength={10}
              />
              {errors.postcode && (
                <p className="text-sm text-red-500">{errors.postcode}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="province">Province *</Label>
              <Select value={formData.province} onValueChange={(value) => handleSelectChange('province', value)}>
                <SelectTrigger className={errors.province ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select province" />
                </SelectTrigger>
                <SelectContent>
                  {PROVINCES.map((province) => (
                    <SelectItem key={province} value={province}>
                      {province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.province && (
                <p className="text-sm text-red-500">{errors.province}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Professional Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <Select value={formData.position} onValueChange={(value) => handleSelectChange('position', value)}>
                <SelectTrigger className={errors.position ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  {POSITIONS.map((position) => (
                    <SelectItem key={position} value={position}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.position && (
                <p className="text-sm text-red-500">{errors.position}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="licence">Licence Number *</Label>
              <Input
                id="licence"
                value={formData.licence}
                onChange={(e) => handleInputChange('licence', e.target.value)}
                placeholder="Enter your licence number"
                className={errors.licence ? 'border-red-500' : ''}
                disabled={isSaving}
              />
              {errors.licence && (
                <p className="text-sm text-red-500">{errors.licence}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={formData.businessName || ''}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                placeholder="Enter your business name"
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type</Label>
              <Select value={formData.businessType || ''} onValueChange={(value) => handleSelectChange('businessType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gst">GST Number</Label>
              <Input
                id="gst"
                value={formData.gst || ''}
                onChange={(e) => handleInputChange('gst', e.target.value.replace(/\D/g, ''))}
                placeholder="123456789"
                disabled={isSaving}
                maxLength={9}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                min="0"
                max="50"
                value={formData.experience || ''}
                onChange={(e) => handleInputChange('experience', parseInt(e.target.value) || undefined)}
                placeholder="Enter years of experience"
                disabled={isSaving}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              {hasUnsavedChanges && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You have unsaved changes. Don't forget to save your profile.
                  </AlertDescription>
                </Alert>
              )}
            </div>
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}