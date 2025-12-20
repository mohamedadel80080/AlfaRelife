'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { CreditCard, Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { updateBankAccount } from '@/lib/api'

interface FormData {
  transit: string
  institution: string
  account: string
  business_name: string
  business_number: string
}

interface FormErrors {
  transit?: string
  institution?: string
  account?: string
  business_name?: string
  business_number?: string
}

export function BankAccountForm() {
  const [formData, setFormData] = useState<FormData>({
    transit: '',
    institution: '',
    account: '',
    business_name: '',
    business_number: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Just set loading to false - no need to fetch existing data
    // Users will fill in fresh data each time
    setIsLoading(false)
  }, [])

  // Removed loadBankAccount function - not needed since we're only updating

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.transit.trim()) {
      newErrors.transit = 'Transit number is required'
    } else if (!/^\d{5}$/.test(formData.transit)) {
      newErrors.transit = 'Transit number must be 5 digits'
    }

    if (!formData.institution.trim()) {
      newErrors.institution = 'Institution number is required'
    } else if (!/^\d{3}$/.test(formData.institution)) {
      newErrors.institution = 'Institution number must be 3 digits'
    }

    if (!formData.account.trim()) {
      newErrors.account = 'Account number is required'
    } else if (!/^\d{7,12}$/.test(formData.account)) {
      newErrors.account = 'Account number must be 7-12 digits'
    }

    if (!formData.business_name.trim()) {
      newErrors.business_name = 'Business name is required'
    }

    if (!formData.business_number.trim()) {
      newErrors.business_number = 'Business number is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors before submitting',
        variant: 'destructive',
      })
      return
    }

    setIsSaving(true)

    try {
      const response = await updateBankAccount(formData)

      // Check for success - the API returns "success" as a string message
      const isSuccess = response.success || response.status === true

      if (isSuccess) {
        const successMessage = typeof response.success === 'string' 
          ? response.success 
          : response.message || 'Bank account information updated successfully'

        toast({
          title: 'Success!',
          description: successMessage,
        })
        setErrors({})

        // Redirect to Stripe remediation link if provided
        if (response.remediation_link) {
          toast({
            title: 'Redirecting to Stripe',
            description: 'You will be redirected to complete your bank account setup...',
          })
          
          // Redirect after a short delay to allow the user to see the success message
          setTimeout(() => {
            window.location.href = response.remediation_link!
          }, 1500)
        }
      } else {
        throw new Error(response.message || 'Failed to update bank account')
      }
    } catch (err) {
      console.error('Error updating bank account:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to update bank account information'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading bank account information...</span>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Bank Account Information
        </CardTitle>
        <CardDescription>
          Add your bank account information to receive payments via Stripe
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Transit Number */}
            <div className="space-y-2">
              <Label htmlFor="transit">
                Transit Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="transit"
                type="text"
                placeholder="12345"
                maxLength={5}
                value={formData.transit}
                onChange={(e) => handleInputChange('transit', e.target.value.replace(/\D/g, ''))}
                className={errors.transit ? 'border-red-500' : ''}
              />
              {errors.transit && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.transit}
                </p>
              )}
              <p className="text-xs text-gray-500">5-digit branch transit number</p>
            </div>

            {/* Institution Number */}
            <div className="space-y-2">
              <Label htmlFor="institution">
                Institution Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="institution"
                type="text"
                placeholder="001"
                maxLength={3}
                value={formData.institution}
                onChange={(e) => handleInputChange('institution', e.target.value.replace(/\D/g, ''))}
                className={errors.institution ? 'border-red-500' : ''}
              />
              {errors.institution && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.institution}
                </p>
              )}
              <p className="text-xs text-gray-500">3-digit bank institution number</p>
            </div>
          </div>

          {/* Account Number */}
          <div className="space-y-2">
            <Label htmlFor="account">
              Account Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="account"
              type="text"
              placeholder="1234567890"
              maxLength={12}
              value={formData.account}
              onChange={(e) => handleInputChange('account', e.target.value.replace(/\D/g, ''))}
              className={errors.account ? 'border-red-500' : ''}
            />
            {errors.account && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.account}
              </p>
            )}
            <p className="text-xs text-gray-500">7-12 digit account number</p>
          </div>

          {/* Business Name */}
          <div className="space-y-2">
            <Label htmlFor="business_name">
              Business Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="business_name"
              type="text"
              placeholder="Enter your business name"
              value={formData.business_name}
              onChange={(e) => handleInputChange('business_name', e.target.value)}
              className={errors.business_name ? 'border-red-500' : ''}
            />
            {errors.business_name && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.business_name}
              </p>
            )}
            <p className="text-xs text-gray-500">Legal name of your business</p>
          </div>

          {/* Business Number */}
          <div className="space-y-2">
            <Label htmlFor="business_number">
              Business Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="business_number"
              type="text"
              placeholder="Enter your business number"
              value={formData.business_number}
              onChange={(e) => handleInputChange('business_number', e.target.value)}
              className={errors.business_number ? 'border-red-500' : ''}
            />
            {errors.business_number && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.business_number}
              </p>
            )}
            <p className="text-xs text-gray-500">Your business registration number</p>
          </div>

          {/* Account Format Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Canadian Bank Account Format</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>Transit Number: 5 digits (branch number)</li>
                  <li>Institution Number: 3 digits (bank identification)</li>
                  <li>Account Number: 7-12 digits</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-4">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Bank Account
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
