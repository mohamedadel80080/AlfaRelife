import { Metadata } from 'next'
import { HealthcareRegistration } from '@/components/healthcare/HealthcareRegistration'

export const metadata: Metadata = {
  title: 'Healthcare Professional Registration',
  description: 'Join our network of verified healthcare professionals',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-900 mb-2">
              Healthcare Professional Registration
            </h1>
            <p className="text-gray-600">
              Join our network of verified healthcare professionals
            </p>
          </div>
          <HealthcareRegistration />
        </div>
      </div>
    </div>
  )
}
