'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Phone } from 'lucide-react'

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  countryCode: string
  onCountryCodeChange: (code: string) => void
  error?: string
}

const countryCodes = [
  { code: '+1', country: 'US', flag: '🇺🇸' },

]

export function PhoneInput({
  value,
  onChange,
  countryCode,
  onCountryCodeChange,
  error,
}: PhoneInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  const formatPhoneNumber = (input: string) => {
    // Remove all non-digit characters
    const cleaned = input.replace(/\D/g, '')
    return cleaned
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    // Limit to 15 digits
    if (formatted.length <= 15) {
      onChange(formatted)
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
        Phone Number
      </Label>
      <div
        className={`flex gap-2 rounded-xl border-2 p-1 transition-all duration-200 ${
          isFocused
            ? 'border-teal-700 ring-4 ring-teal-100'
            : error
            ? 'border-red-500'
            : 'border-gray-300'
        }`}
      >
        {/* Country Code Selector */}
        <Select value={countryCode} onValueChange={onCountryCodeChange}>
          <SelectTrigger className="w-[120px] border-0 focus:ring-0 bg-gray-50 rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {countryCodes.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                <div className="flex items-center gap-2">
                  <span>{country.flag}</span>
                  <span className="font-medium">{country.code}</span>
                  <span className="text-gray-500 text-xs">{country.country}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Phone Input */}
        <div className="flex-1 flex items-center gap-2 px-3">
          <Phone className="h-4 w-4 text-gray-400" />
          <Input
            id="phone"
            type="tel"
            value={value}
            onChange={handlePhoneChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="123 456 7890"
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-base"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-red-600"></span>
          {error}
        </p>
      )}

      {/* Helper Text */}
      {!error && (
        <p className="text-xs text-gray-500">
          Enter your phone number to receive a verification code
        </p>
      )}
    </div>
  )
}
