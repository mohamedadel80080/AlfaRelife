'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff, User, Mail, CheckCircle2, AlertCircle } from 'lucide-react'
import { EnhancedPhoneInput } from './EnhancedPhoneInput'
import { PasswordStrength } from '@/components/ui/password-strength'
import { TrustSignals } from '@/components/ui/trust-signals'
import Link from 'next/link'

interface PersonalDataFormProps {
  data: {
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
  }
  onNext: (data: any) => void
}

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  password?: string
  confirmPassword?: string
}

export function PersonalDataForm({ data, onNext }: PersonalDataFormProps) {
  const [formData, setFormData] = useState({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    password: data.password,
    confirmPassword: ''
  })
  const [countryCode, setCountryCode] = useState('+1')
  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [consentGiven, setConsentGiven] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
    return phoneRegex.test(phone)
  }

  const validatePassword = (password: string) => {
    return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password)
  }

  const validateForm = () => {
    const newErrors: FormErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and numbers'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onNext({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      })
    } catch (error) {
      console.error('Registration error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Let's start with the basics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="firstName" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            First Name *
          </Label>
          <Input
            id="firstName"
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            placeholder="Enter your first name"
            className={errors.firstName ? 'border-red-500' : ''}
            disabled={isLoading}
          />
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            placeholder="Enter your last name"
            className={errors.lastName ? 'border-red-500' : ''}
            disabled={isLoading}
          />
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName}</p>
          )}
        </div>
      </div>
      </div>

      {/* Contact Details Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">How can we reach you?</h3>

        {/* Email */}
        <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Mail className="h-4 w-4" />
          Email Address <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            onBlur={() => setTouched({ ...touched, email: true })}
            placeholder="john.doe@hospital.com"
            className={`h-12 rounded-xl border-2 ${
              errors.email && touched.email
                ? 'border-red-500 ring-4 ring-red-100'
                : touched.email && formData.email
                ? 'border-green-500 ring-4 ring-green-100'
                : 'border-gray-300 focus:border-teal-700 focus:ring-4 focus:ring-teal-100'
            }`}
            disabled={isLoading}
          />
          {touched.email && formData.email && !errors.email && (
            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
          )}
          {errors.email && touched.email && (
            <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
          )}
        </div>
        {errors.email && touched.email ? (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors.email}
          </p>
        ) : touched.email && formData.email && !errors.email ? (
          <p className="text-sm text-green-600 flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" />
            Email looks good!
          </p>
        ) : (
          <p className="text-xs text-gray-500">
            We'll send a verification code to this email
          </p>
        )}
      </div>

        {/* Phone */}
        <EnhancedPhoneInput
          value={formData.phone}
          onChange={(value) => handleInputChange('phone', value)}
          countryCode={countryCode}
          onCountryCodeChange={setCountryCode}
          error={errors.phone && touched.phone ? errors.phone : undefined}
          disabled={isLoading}
          onBlur={() => setTouched({ ...touched, phone: true })}
        />
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Secure Your Account</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Create Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                onBlur={() => setTouched({ ...touched, password: true })}
                placeholder="Enter a strong password"
                className={`h-12 rounded-xl border-2 pr-10 ${
                  errors.password && touched.password
                    ? 'border-red-500'
                    : 'border-gray-300 focus:border-teal-700 focus:ring-4 focus:ring-teal-100'
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && touched.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Confirm Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                onBlur={() => setTouched({ ...touched, confirmPassword: true })}
                placeholder="Re-enter your password"
                className={`h-12 rounded-xl border-2 pr-10 ${
                  errors.confirmPassword && touched.confirmPassword
                    ? 'border-red-500'
                    : touched.confirmPassword && formData.confirmPassword === formData.password && formData.password
                    ? 'border-green-500'
                    : 'border-gray-300 focus:border-teal-700 focus:ring-4 focus:ring-teal-100'
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword && touched.confirmPassword ? (
              <p className="text-sm text-red-600">{errors.confirmPassword}</p>
            ) : touched.confirmPassword && formData.confirmPassword === formData.password && formData.password ? (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" />
                Passwords match!
              </p>
            ) : null}
          </div>
        </div>

        {/* Password Strength Meter */}
        <PasswordStrength password={formData.password} />
      </div>

      {/* Trust Signals */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Why you can trust us</h3>
        <TrustSignals />
      </div>

      {/* Consent Checkbox */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <label className="flex items-start gap-3 cursor-pointer">
          <Checkbox
            id="consent"
            checked={consentGiven}
            onCheckedChange={(checked) => setConsentGiven(checked as boolean)}
            className="mt-0.5"
          />
          <div className="text-sm text-gray-700">
            <p>
              I agree to the{' '}
              <Link href="/terms" className="text-teal-700 underline font-medium">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-teal-700 underline font-medium">
                Privacy Policy
              </Link>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              We'll use your information to verify your professional credentials and match you with healthcare facilities.
            </p>
          </div>
        </label>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full h-12 bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-800 hover:to-teal-900 text-white rounded-xl font-semibold text-base shadow-lg shadow-teal-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        disabled={isLoading || !consentGiven}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Processing...
          </div>
        ) : (
          'Continue to Location Details →'
        )}
      </Button>
      
      {!consentGiven && (
        <p className="text-xs text-center text-gray-500">
          Please agree to the Terms and Privacy Policy to continue
        </p>
      )}
    </form>
  )
}