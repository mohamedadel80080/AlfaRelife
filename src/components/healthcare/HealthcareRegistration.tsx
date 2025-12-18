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

type RegistrationStep = 'personal' | 'location' | 'questions' | 'login' | 'home'

interface RegistrationData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  address: string
  city: string
  districtId: string
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

export function HealthcareRegistration() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('personal')
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
    gst: ''
  })

  const updateRegistrationData = (data: Partial<RegistrationData>) => {
    setRegistrationData(prev => ({ ...prev, ...data }))
  }

  const getProgress = () => {
    switch (currentStep) {
      case 'personal': return 25
      case 'location': return 50
      case 'questions': return 75
      case 'login': return 90
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
      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">
              Step {getProgress() / 25} of 4
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
          onNext={(data) => {
            updateRegistrationData(data)
            setCurrentStep('questions')
          }}
          onBack={() => setCurrentStep('personal')}
        />
      )}

      {currentStep === 'questions' && (
        <QuestionsForm
          onComplete={() => setCurrentStep('login')}
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
            Your healthcare professional registration is complete and verified.
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