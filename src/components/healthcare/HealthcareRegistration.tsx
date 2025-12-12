'use client'

import { useState } from 'react'
import { PersonalDataForm } from './PersonalDataForm'
import { LocationBusinessForm } from './LocationBusinessForm'
import { QuestionsForm } from './QuestionsForm'
import { LoginForm } from './LoginForm'
import { HomeScreen } from './HomeScreen'
import { Progress } from '@/components/ui/progress'

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
      case 'home': return 'Welcome!'
      default: return ''
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-gray-800">{getStepTitle()}</h2>
          <span className="text-sm text-gray-500">
            {currentStep !== 'home' && `${getProgress()}% Complete`}
          </span>
        </div>
        <Progress value={getProgress()} className="h-2" />
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
        <HomeScreen
          firstName={registrationData.firstName}
          position={registrationData.position}
          businessName={registrationData.businessName}
        />
      )}
    </div>
  )
}