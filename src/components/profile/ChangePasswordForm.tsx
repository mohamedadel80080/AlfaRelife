'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle,
  Shield,
  Key
} from 'lucide-react'
import { PasswordFormData, FormErrors } from '@/types/profile'
import { usePasswordForm } from '@/hooks/usePasswordForm'

export function ChangePasswordForm() {
  const {
    formData,
    errors,
    isLoading,
    isSaving,
    showPasswords,
    passwordStrength,
    handleInputChange,
    togglePasswordVisibility,
    validateForm,
    handleSubmit
  } = usePasswordForm()

  const getPasswordStrengthColor = (strength: number) => {
    if (strength <= 25) return 'bg-red-500'
    if (strength <= 50) return 'bg-orange-500'
    if (strength <= 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getPasswordStrengthText = (strength: number) => {
    if (strength <= 25) return 'Weak'
    if (strength <= 50) return 'Fair'
    if (strength <= 75) return 'Good'
    return 'Strong'
  }

  const getPasswordRequirements = (password: string) => {
    const requirements = [
      { label: 'At least 8 characters', met: password.length >= 8 },
      { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
      { label: 'Contains lowercase letter', met: /[a-z]/.test(password) },
      { label: 'Contains number', met: /\d/.test(password) },
      { label: 'Contains special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) }
    ]
    return requirements
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    await handleSubmit()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Shield className="h-5 w-5" />
            Change Password
          </CardTitle>
          <p className="text-gray-600">
            Update your account password to keep your profile secure
          </p>
        </CardHeader>
      </Card>

      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Current Password */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Key className="h-5 w-5" />
              Current Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="oldPassword">Current Password *</Label>
              <div className="relative">
                <Input
                  id="oldPassword"
                  type={showPasswords.oldPassword ? 'text' : 'password'}
                  value={formData.oldPassword}
                  onChange={(e) => handleInputChange('oldPassword', e.target.value)}
                  placeholder="Enter your current password"
                  className={errors.oldPassword ? 'border-red-500 pr-10' : 'pr-10'}
                  disabled={isSaving}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('oldPassword')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isSaving}
                >
                  {showPasswords.oldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.oldPassword && (
                <p className="text-sm text-red-500">{errors.oldPassword}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* New Password */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">New Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPasswords.password ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your new password"
                  className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                  disabled={isSaving}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('password')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isSaving}
                >
                  {showPasswords.password ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Password Strength</Label>
                  <span className={`text-sm font-medium ${
                    passwordStrength <= 25 ? 'text-red-600' :
                    passwordStrength <= 50 ? 'text-orange-600' :
                    passwordStrength <= 75 ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {getPasswordStrengthText(passwordStrength)}
                  </span>
                </div>
                <Progress value={passwordStrength} className="h-2" />
              </div>
            )}

            {/* Password Requirements */}
            {formData.password && (
              <div className="space-y-2">
                <Label className="text-sm">Password Requirements:</Label>
                <div className="space-y-1">
                  {getPasswordRequirements(formData.password).map((req, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      {req.met ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={req.met ? 'text-green-700' : 'text-gray-600'}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Confirm Password */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Confirm New Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="passwordConfirmation">Confirm New Password *</Label>
              <div className="relative">
                <Input
                  id="passwordConfirmation"
                  type={showPasswords.passwordConfirmation ? 'text' : 'password'}
                  value={formData.passwordConfirmation}
                  onChange={(e) => handleInputChange('passwordConfirmation', e.target.value)}
                  placeholder="Confirm your new password"
                  className={errors.passwordConfirmation ? 'border-red-500 pr-10' : 'pr-10'}
                  disabled={isSaving}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('passwordConfirmation')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isSaving}
                >
                  {showPasswords.passwordConfirmation ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.passwordConfirmation && (
                <p className="text-sm text-red-500">{errors.passwordConfirmation}</p>
              )}
            </div>

            {/* Password Match Indicator */}
            {formData.password && formData.passwordConfirmation && (
              <div className="flex items-center gap-2">
                {formData.password === formData.passwordConfirmation ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-700">Passwords match</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-700">Passwords do not match</span>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Tips */}
        <Alert>
          <Lock className="h-4 w-4" />
          <AlertDescription>
            <strong>Security Tips:</strong> Choose a strong password that you don't use for other accounts. 
            Avoid using personal information like your name, birthday, or phone number.
          </AlertDescription>
        </Alert>

        {/* Form Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating Password...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Update Password
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}