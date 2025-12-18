import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { changePassword, ChangePasswordRequest } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

interface PasswordFormData {
  oldPassword: string
  password: string
  passwordConfirmation: string
}

interface FormErrors {
  [key: string]: string | undefined
}

export function usePasswordForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState<PasswordFormData>({
    oldPassword: '',
    password: '',
    passwordConfirmation: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    password: false,
    passwordConfirmation: false
  })
  const [passwordStrength, setPasswordStrength] = useState(0)

  // Calculate password strength
  useEffect(() => {
    if (!formData.password) {
      setPasswordStrength(0)
      return
    }

    let strength = 0
    
    // Length check
    if (formData.password.length >= 8) strength += 20
    if (formData.password.length >= 12) strength += 10
    
    // Character variety checks
    if (/[a-z]/.test(formData.password)) strength += 20
    if (/[A-Z]/.test(formData.password)) strength += 20
    if (/\d/.test(formData.password)) strength += 15
    if (/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) strength += 15

    setPasswordStrength(Math.min(strength, 100))
  }, [formData.password])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Old Password validation
    if (!formData.oldPassword.trim()) {
      newErrors.oldPassword = 'Current password is required'
    } else if (formData.oldPassword.length < 8) {
      newErrors.oldPassword = 'Password must be at least 8 characters'
    }

    // New Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'New password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter'
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter'
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number'
    }

    // Password Confirmation validation
    if (!formData.passwordConfirmation.trim()) {
      newErrors.passwordConfirmation = 'Please confirm your new password'
    } else if (formData.password !== formData.passwordConfirmation) {
      newErrors.passwordConfirmation = 'Passwords do not match'
    }

    // Check if new password is same as old password
    if (formData.oldPassword === formData.password) {
      newErrors.password = 'New password must be different from current password'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof PasswordFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
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

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handleSubmit = async (): Promise<boolean> => {
    setIsSaving(true)

    try {
      // Prepare change password data matching API requirements
      const passwordData: ChangePasswordRequest = {
        old_password: formData.oldPassword,
        password: formData.password,
        password_confirmation: formData.passwordConfirmation
      }

      const response = await changePassword(passwordData)

      if (response.success) {
        toast({
          title: 'Success',
          description: response.message || 'Password updated successfully',
        })

        // Reset form on success
        setFormData({
          oldPassword: '',
          password: '',
          passwordConfirmation: ''
        })

        // Optional: Keep user logged in (based on product decision)
        // If you want to force re-login, uncomment the following lines:
        // clearAuth()
        // router.push('/login')

        return true
      }

      return false
    } catch (err) {
      console.error('Error updating password:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to update password'
      
      // Set error message
      setErrors({
        oldPassword: errorMessage
      })
      
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
    formData,
    errors,
    isLoading,
    isSaving,
    showPasswords,
    passwordStrength,
    handleInputChange,
    togglePasswordVisibility,
    validateForm,
    handleSubmit
  }
}