'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, Mail, Phone, CheckCircle, ArrowLeft } from 'lucide-react'
import { clearAuth } from '@/lib/api'

export default function AccountReviewPage() {
  const router = useRouter()

  const handleLogout = () => {
    clearAuth()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
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
        </div>

        {/* Main Card */}
        <Card className="shadow-xl border-2">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="w-10 h-10 text-yellow-600" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900">
              Account Under Review
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
              <p className="text-center text-gray-700 text-lg leading-relaxed">
                Thank you for registering! Your account is currently being reviewed by our team. 
                We'll notify you once your account is approved.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 text-lg">What happens next?</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-teal-700 font-semibold">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Verification</p>
                    <p className="text-sm text-gray-600">Our team is verifying your credentials and documentation</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-teal-700 font-semibold">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Approval</p>
                    <p className="text-sm text-gray-600">You'll receive a notification once approved (usually within 1-2 business days)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-teal-700 font-semibold">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Get Started</p>
                    <p className="text-sm text-gray-600">Access your account and start browsing available shifts</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6 space-y-4">
              <h3 className="font-semibold text-gray-900">Need help?</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="w-5 h-5 text-teal-600" />
                  <span className="text-sm">support@alfarelief.com</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone className="w-5 h-5 text-teal-600" />
                  <span className="text-sm">1-800-ALFA-RELIEF</span>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full h-12 border-2 border-gray-300 hover:bg-gray-50 rounded-xl font-semibold"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
