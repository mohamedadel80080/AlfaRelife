import { useState, useEffect } from 'react'
import { HealthcareProfessional, ProfileFormData, FormErrors, ApiResponse } from '@/types/profile'

export function useProfileForm() {
  const [profile, setProfile] = useState<HealthcareProfessional | null>(null)
  const [formData, setFormData] = useState<ProfileFormData | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Initialize form data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        console.log('🔄 Fetching profile data for form...')
        
        const response = await fetch('/api/user/profile')
        const data: ApiResponse<HealthcareProfessional> = await response.json()

        console.log('📊 Profile API Response:', data)

        if (!response.ok) {
          console.error('❌ Profile API Error:', response.status, data.error)
          throw new Error(data.error || 'Failed to fetch profile')
        }

        if (data.success && data.data) {
          console.log('✅ Profile data loaded for form:', data.data.firstName, data.data.lastName)
          setProfile(data.data)
          setFormData({
            firstName: data.data.firstName,
            lastName: data.data.lastName,
            email: data.data.email,
            phone: data.data.phone,
            address: data.data.address,
            postcode: data.data.postcode,
            position: data.data.position,
            licence: data.data.licence,
            province: data.data.province,
            gst: data.data.gst || '',
            businessName: data.data.businessName || '',
            businessType: data.data.businessType || '',
            experience: data.data.experience || undefined
          })
        } else {
          console.error('❌ No profile data available')
          // Set empty form data when no profile exists
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            address: '',
            postcode: '',
            position: '',
            licence: '',
            province: '',
            gst: '',
            businessName: '',
            businessType: '',
            experience: undefined
          })
        }
      } catch (err) {
        console.error('💥 Error fetching profile for form:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const validateForm = (): boolean => {
    if (!formData) return false

    const newErrors: FormErrors = {}

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    } else if (formData.firstName.length < 2 || formData.firstName.length > 50) {
      newErrors.firstName = 'First name must be between 2 and 50 characters'
    } else if (!/^[a-zA-Z\s]+$/.test(formData.firstName)) {
      newErrors.firstName = 'First name can only contain letters and spaces'
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    } else if (formData.lastName.length < 2 || formData.lastName.length > 50) {
      newErrors.lastName = 'Last name must be between 2 and 50 characters'
    } else if (!/^[a-zA-Z\s]+$/.test(formData.lastName)) {
      newErrors.lastName = 'Last name can only contain letters and spaces'
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    } else if (formData.address.length < 5 || formData.address.length > 200) {
      newErrors.address = 'Address must be between 5 and 200 characters'
    }

    // Postal Code validation
    if (!formData.postcode.trim()) {
      newErrors.postcode = 'Postal code is required'
    } else if (formData.postcode.length < 5 || formData.postcode.length > 10) {
      newErrors.postcode = 'Postal code must be between 5 and 10 characters'
    }

    // Position validation
    if (!formData.position.trim()) {
      newErrors.position = 'Position is required'
    }

    // Licence validation
    if (!formData.licence.trim()) {
      newErrors.licence = 'Licence number is required'
    } else if (formData.licence.length < 5 || formData.licence.length > 50) {
      newErrors.licence = 'Licence number must be between 5 and 50 characters'
    }

    // Province validation
    if (!formData.province.trim()) {
      newErrors.province = 'Province is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof ProfileFormData, value: any) => {
    if (!formData) return

    setFormData(prev => ({
      ...prev!,
      [field]: value
    }))

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const handleSelectChange = (field: keyof ProfileFormData, value: string) => {
    if (!formData) return

    setFormData(prev => ({
      ...prev!,
      [field]: value
    }))

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const handleFileChange = async (file: File | null) => {
    if (!file) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/user/profile/picture', {
        method: 'POST',
        body: formData
      })

      const data: ApiResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image')
      }

      // Update local profile image
      if (profile && data.data?.profileImage) {
        setProfile(prev => prev ? {
          ...prev,
          profileImage: data.data.profileImage
        } : null)
      }
    } catch (err) {
      console.error('Error uploading image:', err)
    } finally {
      setIsUploading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const handleSubmit = async (): Promise<boolean> => {
    if (!formData) return false

    setIsSaving(true)

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data: ApiResponse<HealthcareProfessional> = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile')
      }

      if (data.success && data.data) {
        setProfile(data.data)
        return true
      }

      return false
    } catch (err) {
      console.error('Error updating profile:', err)
      return false
    } finally {
      setIsSaving(false)
    }
  }

  return {
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
  }
}