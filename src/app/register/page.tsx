import { Metadata } from 'next'
import Image from 'next/image'
import { HealthcareRegistration } from '@/components/healthcare/HealthcareRegistration'
import { EncryptionBadge } from '@/components/ui/trust-signals'

export const metadata: Metadata = {
  title: 'Healthcare Professional Registration',
  description: 'Join our network of verified healthcare professionals',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Image
                src="/logo.svg"
                alt="Alfa Relief Logo"
                width={64}
                height={64}
                priority
              />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              Create Your Professional Account
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Join 2,500+ verified healthcare professionals
            </p>
            <div className="flex justify-center">
              <EncryptionBadge />
            </div>
          </div>
          
          {/* Registration Form */}
          <HealthcareRegistration />
        </div>
      </div>
    </div>
  )
}
