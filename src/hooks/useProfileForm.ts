import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { fetchProfile, updateProfile, ProfileData, UpdateProfileRequest } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

interface ProfileFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password?: string
  passwordConfirmation?: string
  address: string
  postcode: string
  position: string
  licence: string
  province: string
  gst?: string
  businessName?: string
  businessType?: string
  experience?: number
}

interface FormErrors {
  [key: string]: string | undefined
}

export function useProfileForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [formData, setFormData] = useState<ProfileFormData | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Initialize form data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true)
        console.log('🔄 Fetching profile data for form...')
        
        const response = await fetchProfile()
        console.log('📊 Profile API Response:', response)

        if (response.data) {
          console.log('✅ Profile data loaded for form:', response.data.first_name, response.data.last_name)
          setProfile(response.data)
          setFormData({
            firstName: response.data.first_name,
            lastName: response.data.last_name,
            email: response.data.email,
            phone: response.data.phone,
            address: response.data.address,
            postcode: response.data.postcode,
            position: response.data.position,
            licence: response.data.licence,
            province: response.data.province,
            gst: response.data.gst || '',
            businessName: response.data.business_name || '',
            businessType: response.data.business_type || '',
            experience: undefined
          })
        } else {
          console.error('❌ No profile data available')
          throw new Error('No profile data returned')
        }
      } catch (err) {
        console.error('💥 Error fetching profile for form:', err)
        const errorMessage = err instanceof Error ? err.message : 'Failed to load profile'
        
        // If authentication error, redirect to login
        if (errorMessage.includes('authentication') || errorMessage.includes('login')) {
          router.push('/login')
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
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

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image')
      }

      // Update local profile image
      if (profile && data.data?.image) {
        setProfile(prev => prev ? {
          ...prev,
          image: data.data.image
        } : null)
        
        toast({
          title: 'Success',
          description: 'Profile picture updated successfully',
        })
      }
    } catch (err) {
      console.error('Error uploading image:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image'
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
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
      // Prepare update data matching API requirements
      const updateData: UpdateProfileRequest = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        postcode: formData.postcode,
        position: formData.position,
        licence: formData.licence,
        province: formData.province
      }

      // Add password fields only if they're provided
      if (formData.password && formData.password.trim() !== '') {
        updateData.password = formData.password
        updateData.password_confirmation = formData.passwordConfirmation || formData.password
      }

      const response = await updateProfile(updateData)

      if (response.success) {
        toast({
          title: 'Success',
          description: response.message || 'Profile updated successfully',
        })
        
        // Refresh the page to re-fetch profile data
        setTimeout(() => {
          window.location.reload()
        }, 1000)
        
        return true
      }

      return false
    } catch (err) {
      console.error('Error updating profile:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile'
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
      
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