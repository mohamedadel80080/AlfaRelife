'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Phone, MessageSquare, Shield, ArrowLeft } from 'lucide-react'

interface LoginFormProps {
  phone: string
  onSuccess: () => void
}

export function LoginForm({ phone, onSuccess }: LoginFormProps) {
  const [currentStep, setCurrentStep] = useState<'phone' | 'otp'>('phone')
  const [phoneNumber, setPhoneNumber] = useState(phone)
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/\D/g, '')
    if (phoneNumber.length <= 3) {
      return phoneNumber
    } else if (phoneNumber.length <= 6) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`
    } else {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`
    }
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
    return phoneRegex.test(phone)
  }

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validatePhone(phoneNumber)) {
      setErrors({ phone: 'Please enter a valid phone number' })
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      // Simulate API call to send OTP
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock OTP code generation
      const mockOTP = '123456'
      console.log('Mock OTP code:', mockOTP) // In real app, this would be sent via SMS
      
      setCurrentStep('otp')
      setTimeLeft(60) // 60 seconds countdown
    } catch (error) {
      console.error('Error sending OTP:', error)
      setErrors({ phone: 'Failed to send OTP. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return // Only allow single digit
    
    const newOTP = [...otpCode]
    newOTP[index] = value
    setOtpCode(newOTP)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement
      if (nextInput) {
        nextInput.focus()
      }
    }

    // Clear error when user starts typing
    if (errors.otp) {
      setErrors({ ...errors, otp: undefined })
    }
  }

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement
      if (prevInput) {
        prevInput.focus()
      }
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const otpString = otpCode.join('')
    if (otpString.length !== 6) {
      setErrors({ otp: 'Please enter all 6 digits' })
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      // Simulate API call to verify OTP
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock verification - in real app, this would verify against backend
      if (otpString === '123456') {
        onSuccess()
      } else {
        setErrors({ otp: 'Invalid OTP code. Please try again.' })
      }
    } catch (error) {
      console.error('Error verifying OTP:', error)
      setErrors({ otp: 'Verification failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (timeLeft > 0) return

    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setTimeLeft(60)
      console.log('OTP resent to:', phoneNumber)
    } catch (error) {
      console.error('Error resending OTP:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToPhone = () => {
    setCurrentStep('phone')
    setOtpCode(['', '', '', '', '', ''])
    setTimeLeft(0)
    setErrors({})
  }

  if (currentStep === 'phone') {
    return (
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Phone className="h-5 w-5" />
              Verify Your Phone Number
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6">
              <AlertDescription>
                We'll send a verification code to your phone number to complete your registration.
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value)
                    setPhoneNumber(formatted)
                    if (errors.phone) {
                      setErrors({ ...errors, phone: undefined })
                    }
                  }}
                  placeholder="(555) 123-4567"
                  className={errors.phone ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send OTP'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Enter Verification Code
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <AlertDescription>
              We've sent a 6-digit verification code to <strong>{phoneNumber}</strong>
            </AlertDescription>
          </Alert>

          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-center block">Enter 6-digit code</Label>
              <div className="flex justify-center gap-2">
                {otpCode.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => handleOTPKeyDown(index, e)}
                    className={`w-12 h-12 text-center text-lg font-semibold ${
                      errors.otp ? 'border-red-500' : ''
                    }`}
                    disabled={isLoading}
                  />
                ))}
              </div>
              {errors.otp && (
                <p className="text-sm text-red-500 text-center">{errors.otp}</p>
              )}
            </div>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={handleResendOTP}
                disabled={timeLeft > 0 || isLoading}
                className="text-blue-600 hover:text-blue-700"
              >
                {timeLeft > 0 
                  ? `Resend code in ${timeLeft}s` 
                  : 'Resend code'
                }
              </Button>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleBackToPhone}
                disabled={isLoading}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Shield className="h-4 w-4 mr-2 animate-pulse" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Verify
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}