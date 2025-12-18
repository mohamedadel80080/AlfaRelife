'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PhoneInput } from './PhoneInput'
import { OTPInput } from './OTPInput'
import { ArrowLeft, Shield, CheckCircle2, UserPlus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { sendOTP, loginWithOTP } from '@/lib/api'

type LoginStep = 'phone' | 'otp'

export function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()

  // State
  const [step, setStep] = useState<LoginStep>('phone')
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState('+1')
  const [otp, setOtp] = useState<string[]>(['', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [phoneError, setPhoneError] = useState('')
  const [otpError, setOtpError] = useState('')
  const [resendTimer, setResendTimer] = useState(0)

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const validatePhone = () => {
    if (!phone) {
      setPhoneError('Phone number is required')
      return false
    }
    if (phone.length < 7) {
      setPhoneError('Please enter a valid phone number')
      return false
    }
    setPhoneError('')
    return true
  }

  const handleSendOTP = async () => {
    if (!validatePhone()) return

    setIsLoading(true)
    setPhoneError('')
    
    try {
      await sendOTP(phone)
      
      setStep('otp')
      setResendTimer(60)
      toast({
        title: 'OTP Sent!',
        description: `Verification code sent to ${phone}`,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send OTP'
      setPhoneError(errorMessage)
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    const otpCode = otp.join('')
    
    if (otpCode.length !== 4) {
      setOtpError('Please enter complete OTP')
      return
    }

    setIsLoading(true)
    setOtpError('')

    try {
      const response = await loginWithOTP(phone, otpCode)

      // Store authentication data
      if (response.access_token) {
        localStorage.setItem('auth_token', response.access_token)
        localStorage.setItem('token_type', response.token_type || 'bearer')
        localStorage.setItem('token_expires_in', response.expires_in?.toString() || '')
        localStorage.setItem('phone_verified', response.phone_verified?.toString() || 'false')
        localStorage.setItem('completed', response.completed?.toString() || 'false')
        localStorage.setItem('user_status', response.status?.toString() || '')
      }

      toast({
        title: 'Login Successful!',
        description: 'Welcome back to Alfa Relief',
      })

      // Redirect based on status
      const status = typeof response.status === 'number' ? response.status : parseInt(response.status || '0')
      
      if (status === 1) {
        // Active account - redirect to home
        router.push('/shifts')
      } else if (status === 0) {
        // Account under review
        router.push('/account-review')
      } else {
        // Unknown status - redirect to home
        router.push('/shifts')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid OTP. Please try again.'
      setOtpError(errorMessage)
      setOtp(['', '', '', ''])
      toast({
        title: 'Verification Failed',
        description: errorMessage,
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (resendTimer > 0) return
    
    setIsLoading(true)
    setOtpError('')
    
    try {
      await sendOTP(phone)
      
      setResendTimer(60)
      setOtp(['', '', '', ''])
      toast({
        title: 'OTP Resent!',
        description: 'A new code has been sent to your phone',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to resend OTP',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="/logo.svg"
              alt="Alfa Relief Logo"
              width={80}
              height={80}
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">
            {step === 'phone' 
              ? 'Enter your phone number to get started' 
              : 'Verify your phone number'}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          {step === 'phone' ? (
            // Phone Input Step
            <div className="space-y-6">
              <PhoneInput
                value={phone}
                onChange={setPhone}
                countryCode={countryCode}
                onCountryCodeChange={setCountryCode}
                error={phoneError}
              />

              <Button
                onClick={handleSendOTP}
                disabled={isLoading}
                className="w-full h-12 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-semibold text-base transition-all duration-200 shadow-lg shadow-teal-200"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Sending OTP...
                  </div>
                ) : (
                  'Send OTP'
                )}
              </Button>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 pt-4">
                <Shield className="h-4 w-4" />
                <span>Your information is secure</span>
              </div>
            </div>
          ) : (
            // OTP Verification Step
            <div className="space-y-6">
              {/* Back Button */}
              <button
                onClick={() => {
                  setStep('phone')
                  setOtp(['', '', '', ''])
                  setOtpError('')
                }}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Change phone number</span>
              </button>

              {/* Phone Display */}
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600 mb-1">Code sent to</p>
                <p className="text-lg font-semibold text-gray-900">
                  {countryCode} {phone}
                </p>
              </div>

              <OTPInput
                value={otp}
                onChange={setOtp}
                error={otpError}
              />

              <Button
                onClick={handleVerifyOTP}
                disabled={isLoading || otp.join('').length !== 4}
                className="w-full h-12 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-semibold text-base transition-all duration-200 shadow-lg shadow-teal-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Verifying...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Verify OTP
                  </div>
                )}
              </Button>

              {/* Resend OTP */}
              <div className="text-center pt-4">
                {resendTimer > 0 ? (
                  <p className="text-sm text-gray-500">
                    Resend code in <span className="font-semibold text-teal-700">{resendTimer}s</span>
                  </p>
                ) : (
                  <button
                    onClick={handleResendOTP}
                    disabled={isLoading}
                    className="text-sm font-medium text-teal-700 hover:text-teal-800 transition-colors disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 space-y-4">
          <p className="text-sm text-gray-500">
            By continuing, you agree to our{' '}
            <a href="#" className="text-teal-700 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-teal-700 hover:underline">Privacy Policy</a>
          </p>
          
          {/* Register Link */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">
              Don't have an account?
            </p>
            <Link href="/register">
              <Button
                variant="outline"
                className="w-full h-11 border-2 border-teal-700 text-teal-700 hover:bg-teal-50 rounded-xl font-semibold transition-all duration-200"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Create New Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
