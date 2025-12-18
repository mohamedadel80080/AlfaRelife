'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PersonalDataForm } from './PersonalDataForm'
import { LocationBusinessForm } from './LocationBusinessForm'
import { QuestionsForm } from './QuestionsForm'
import { LoginForm } from './LoginForm'
import { HomeScreen } from './HomeScreen'
import { Progress } from '@/components/ui/progress'
import { Shield, Building, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { register, type RegistrationData as ApiRegistrationData } from '@/lib/api'
import { Alert, AlertDescription } from '@/components/ui/alert'

type RegistrationStep = 'personal' | 'location' | 'questions' | 'login' | 'home'

interface RegistrationData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
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
  businessType?: string
}

export function HealthcareRegistration() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('personal')
  const [isRegistering, setIsRegistering] = useState(false)
  const [registrationError, setRegistrationError] = useState<string | null>(null)
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    city: '',
    districtId: '',
    postcode: '',
    position: '',
    licence: '',
    province: '',
    licenceImage: null,
    profileImage: null,
    lat: 0,
    lng: 0,
    businessName: '',
    gst: '',
    businessType: 'good'
  })

  const updateRegistrationData = (data: Partial<RegistrationData>) => {
    setRegistrationData(prev => ({ ...prev, ...data }))
  }

  const handleRegistration = async (data: RegistrationData) => {
    setIsRegistering(true)
    setRegistrationError(null)

    try {
      // Parse district ID if it's a string
      const districtId = typeof data.districtId === 'string' ? parseInt(data.districtId) : data.districtId

      // Prepare data for API submission
      const apiData: ApiRegistrationData = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        password_confirmation: data.password,
        address: data.address,
        city: data.city,
        district_id: districtId,
        postcode: data.postcode,
        position: data.position,
        licence: data.licence,
        province: data.province,
        lat: data.lat,
        lng: data.lng,
        business_name: data.businessName,
        gst: data.gst === 'yes' ? 'yes' : 'no',
        business_type: data.businessType || 'good',
        image: data.profileImage,
        licence_image: data.licenceImage
      }

      console.log('Submitting registration data with images:', {
        ...apiData,
        image: apiData.image ? apiData.image.name : 'none',
        licence_image: apiData.licence_image ? apiData.licence_image.name : 'none'
      })

      // Call registration API
      const response = await register(apiData)

      // Store access token
      if (response.access_token) {
        localStorage.setItem('auth_token', response.access_token)
        localStorage.setItem('token_type', response.token_type || 'bearer')
        localStorage.setItem('token_expires_in', response.expires_in?.toString() || '')
        console.log('✅ Registration successful! Token stored.')
      }

      // Move to questions step after successful registration
      setCurrentStep('questions')
    } catch (error) {
      console.error('Error submitting registration:', error)
      const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please try again.'
      setRegistrationError(errorMessage)
    } finally {
      setIsRegistering(false)
    }
  }

  const getProgress = () => {
    switch (currentStep) {
      case 'personal': return 33
      case 'location': return 66
      case 'questions': return 90
      case 'login': return 95
      case 'home': return 100
      default: return 0
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 'personal': return 'Personal Information'
      case 'location': return 'Location & Business Details'
      case 'questions': return 'Professional Questions'
      case 'login': return 'Verify Your Phone Number'
      case 'home': return 'Registration Complete!'
      default: return ''
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-12">
      {/* Registration Error */}
      {registrationError && (
        <Alert className="mb-6 border-red-500 bg-red-50">
          <AlertDescription className="text-red-800">
            {registrationError}
          </AlertDescription>
        </Alert>
      )}

      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">
              Step {currentStep === 'personal' ? 1 : currentStep === 'location' ? 2 : currentStep === 'questions' ? 3 : 3} of 3
            </p>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">{getStepTitle()}</h2>
          </div>
          {currentStep !== 'home' && (
            <span className="text-sm font-semibold text-teal-700">
              {getProgress()}% Complete
            </span>
          )}
        </div>
        <div className="relative">
          <div className="overflow-hidden h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-gradient-to-r from-teal-600 to-teal-700 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${getProgress()}%` }}
            />
          </div>
        </div>
      </div>

      {/* Form Content */}
      {currentStep === 'personal' && (
        <PersonalDataForm
          data={registrationData}
          onNext={(data) => {
            updateRegistrationData(data)
            setCurrentStep('location')
          }}
        />
      )}

      {currentStep === 'location' && (
        <LocationBusinessForm
          data={registrationData}
          onNext={async (data) => {
            updateRegistrationData(data)
            // Register the user after collecting all form data
            await handleRegistration({ ...registrationData, ...data })
          }}
          onBack={() => setCurrentStep('personal')}
        />
      )}

      {currentStep === 'questions' && (
        <QuestionsForm
          onComplete={() => {
            // Questions answered successfully, go to home
            setCurrentStep('home')
          }}
          onBack={() => setCurrentStep('location')}
        />
      )}

      {currentStep === 'login' && (
        <LoginForm
          phone={registrationData.phone}
          onSuccess={() => setCurrentStep('home')}
        />
      )}

      {currentStep === 'home' && (
        <div className="text-center py-12">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-teal-100 mb-6">
            <Shield className="h-8 w-8 text-teal-700" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Complete!</h2>
          <p className="text-gray-600 mb-8">
            Your account has been successfully created and you're now logged in.
            You can now browse and apply for available shifts.
          </p>
          <Button 
            onClick={() => router.push('/shifts')}
            className="bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-800 hover:to-teal-900 text-white px-8 py-3 rounded-xl shadow-lg shadow-teal-200"
          >
            <Building className="h-5 w-5 mr-2" />
            View Available Shifts
          </Button>
        </div>
      )}

      {/* Login Link - Show only on first step */}
      {currentStep === 'personal' && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center mb-3">
            Already have an account?
          </p>
          <Link href="/login">
            <Button
              variant="outline"
              className="w-full h-11 border-2 border-teal-700 text-teal-700 hover:bg-teal-50 rounded-xl font-semibold transition-all duration-200"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Sign In to Your Account
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}