'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, MapPin, Building, Camera, FileText, User, Loader2 } from 'lucide-react'
import { fetchDistricts, type District } from '@/lib/api'

interface LocationBusinessFormProps {
  data: {
    address: string
    city: string
    districtId: string | number
    postcode: string
    position: string
    licence: string
    province: string
    licenceImage: File | null
    profileImage: File | null
    lat: number
    lng: number
    businessName: string
    gst: string
  }
  onNext: (data: any) => Promise<void> | void
  onBack: () => void
}

interface FormErrors {
  address?: string
  city?: string
  districtId?: string
  postcode?: string
  position?: string
  licence?: string
  province?: string
  licenceImage?: string
  profileImage?: string
  businessName?: string
  gst?: string
}

const POSITIONS = [
  'pharmacian'
]

const PROVINCES = [
  'Ontario',
  'British Columbia',
  'Alberta',
  'Quebec',
  'Manitoba',
  'Saskatchewan',
  'Nova Scotia',
  'New Brunswick',
  'Newfoundland and Labrador',
  'Prince Edward Island',
  'Northwest Territories',
  'Yukon',
  'Nunavut'
]

const DISTRICTS = [
  'District 1 - Toronto Central',
  'District 2 - Toronto Central West',
  'District 3 - Toronto Central East',
  'District 4 - Mississauga',
  'District 5 - Brampton',
  'District 6 - Oakville',
  'District 7 - Hamilton',
  'District 8 - Niagara',
  'District 9 - London',
  'District 10 - Ottawa',
  'District 11 - Other'
]

export function LocationBusinessForm({ data, onNext, onBack }: LocationBusinessFormProps) {
  const [districts, setDistricts] = useState<District[]>([])
  const [loadingDistricts, setLoadingDistricts] = useState(true)
  const [formData, setFormData] = useState({
    address: data.address,
    city: data.city,
    districtId: data.districtId,
    postcode: data.postcode,
    position: data.position,
    licence: data.licence,
    province: data.province,
    licenceImage: data.licenceImage,
    profileImage: data.profileImage,
    lat: data.lat,
    lng: data.lng,
    businessName: data.businessName,
    gst: data.gst
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  const licenceImageRef = useRef<HTMLInputElement>(null)
  const profileImageRef = useRef<HTMLInputElement>(null)

  // Fetch districts on component mount
  useEffect(() => {
    const loadDistricts = async () => {
      try {
        setLoadingDistricts(true)
        const response = await fetchDistricts()
        setDistricts(response.data)
      } catch (error) {
        console.error('Error fetching districts:', error)
        setErrors(prev => ({ ...prev, districtId: 'Failed to load districts' }))
      } finally {
        setLoadingDistricts(false)
      }
    }

    loadDistricts()
  }, [])

  const validatePostalCode = (postalCode: string) => {
    const canadianPostalCode = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/
    return canadianPostalCode.test(postalCode.replace(/\s/g, ''))
  }

  const validateGST = (gst: string) => {
    // GST should be "yes" or "no"
    return gst === 'yes' || gst === 'no'
  }

  const validateForm = () => {
    const newErrors: FormErrors = {}

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    }

    if (!formData.districtId) {
      newErrors.districtId = 'District is required'
    }

    if (!formData.postcode.trim()) {
      newErrors.postcode = 'Postal code is required'
    } else if (!validatePostalCode(formData.postcode)) {
      newErrors.postcode = 'Please enter a valid Canadian postal code (e.g., A1A 1A1)'
    }

    if (!formData.position) {
      newErrors.position = 'Position is required'
    }

    if (!formData.licence.trim()) {
      newErrors.licence = 'Licence number is required'
    }

    if (!formData.province) {
      newErrors.province = 'Province is required'
    }

    if (!formData.licenceImage) {
      newErrors.licenceImage = 'Licence image is required'
    }

    if (!formData.profileImage) {
      newErrors.profileImage = 'Profile picture is required'
    }

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required'
    }

    if (!formData.gst.trim()) {
      newErrors.gst = 'GST selection is required'
    } else if (!validateGST(formData.gst)) {
      newErrors.gst = 'Please select yes or no for GST'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const getCurrentLocation = () => {
    setIsGettingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }))
          setIsGettingLocation(false)
        },
        (error) => {
          console.error('Error getting location:', error)
          setIsGettingLocation(false)
          // Set default coordinates (Toronto)
          setFormData(prev => ({
            ...prev,
            lat: 43.6532,
            lng: -79.3832
          }))
        }
      )
    } else {
      setIsGettingLocation(false)
      // Set default coordinates
      setFormData(prev => ({
        ...prev,
        lat: 43.6532,
        lng: -79.3832
      }))
    }
  }

  const handleFileChange = (field: 'licenceImage' | 'profileImage', file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    
    try {
      await onNext(formData)
    } catch (error) {
      console.error('Registration error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Location Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Street Address *</Label>
            <Input
              id="address"
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="123 Main Street"
              className={errors.address ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Toronto"
                className={errors.city ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {errors.city && (
                <p className="text-sm text-red-500">{errors.city}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="postcode">Postal Code *</Label>
              <Input
                id="postcode"
                type="text"
                value={formData.postcode}
                onChange={(e) => handleInputChange('postcode', e.target.value.toUpperCase())}
                placeholder="A1A 1A1"
                className={errors.postcode ? 'border-red-500' : ''}
                disabled={isLoading}
                maxLength={7}
              />
              {errors.postcode && (
                <p className="text-sm text-red-500">{errors.postcode}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="province">Province *</Label>
              <Select value={formData.province} onValueChange={(value) => handleInputChange('province', value)}>
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

            <div className="space-y-2">
              <Label htmlFor="districtId">District *</Label>
              {loadingDistricts ? (
                <div className="flex items-center justify-center h-10 border rounded-md">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                </div>
              ) : (
                <Select 
                  value={formData.districtId?.toString()} 
                  onValueChange={(value) => handleInputChange('districtId', value)}
                >
                  <SelectTrigger className={errors.districtId ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((district) => (
                      <SelectItem key={district.id} value={district.id.toString()}>
                        {district.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {errors.districtId && (
                <p className="text-sm text-red-500">{errors.districtId}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={getCurrentLocation}
              disabled={isGettingLocation || isLoading}
            >
              <MapPin className="h-4 w-4 mr-2" />
              {isGettingLocation ? 'Getting Location...' : 'Use Current Location'}
            </Button>
            <span className="text-sm text-gray-500">
              {formData.lat && formData.lng && `Location: ${formData.lat.toFixed(4)}, ${formData.lng.toFixed(4)}`}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Professional Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <Select value={formData.position} onValueChange={(value) => handleInputChange('position', value)}>
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
                type="text"
                value={formData.licence}
                onChange={(e) => handleInputChange('licence', e.target.value)}
                placeholder="Enter your licence number"
                className={errors.licence ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {errors.licence && (
                <p className="text-sm text-red-500">{errors.licence}</p>
              )}
            </div>
          </div>

          {/* Image Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Licence Image *</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  ref={licenceImageRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange('licenceImage', e.target.files?.[0] || null)}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => licenceImageRef.current?.click()}
                  disabled={isLoading}
                  className="w-full"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {formData.licenceImage ? formData.licenceImage.name : 'Upload Licence Image'}
                </Button>
                {errors.licenceImage && (
                  <p className="text-sm text-red-500 mt-2">{errors.licenceImage}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Profile Picture *</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  ref={profileImageRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange('profileImage', e.target.files?.[0] || null)}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => profileImageRef.current?.click()}
                  disabled={isLoading}
                  className="w-full"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {formData.profileImage ? formData.profileImage.name : 'Upload Profile Picture'}
                </Button>
                {errors.profileImage && (
                  <p className="text-sm text-red-500 mt-2">{errors.profileImage}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Business Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name *</Label>
            <Input
              id="businessName"
              type="text"
              value={formData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              placeholder="Enter your business name"
              className={errors.businessName ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.businessName && (
              <p className="text-sm text-red-500">{errors.businessName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gst">Do you have a GST Number? *</Label>
            <Select value={formData.gst} onValueChange={(value) => handleInputChange('gst', value)}>
              <SelectTrigger className={errors.gst ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select yes or no" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
            {errors.gst && (
              <p className="text-sm text-red-500">{errors.gst}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isLoading}
        >
          Back
        </Button>
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating Account...
            </>
          ) : (
            'Create Account & Continue'
          )}
        </Button>
      </div>
    </form>
  )
}