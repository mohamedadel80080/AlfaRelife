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
import { Phone, CheckCircle2, AlertCircle } from 'lucide-react'

interface EnhancedPhoneInputProps {
  value: string
  onChange: (value: string) => void
  countryCode: string
  onCountryCodeChange: (code: string) => void
  error?: string
  disabled?: boolean
  onBlur?: () => void
}

const countryCodes = [
  { code: '+1', country: 'US', flag: '🇺🇸', name: 'United States' },
  { code: '+44', country: 'UK', flag: '🇬🇧', name: 'United Kingdom' },
  { code: '+91', country: 'IN', flag: '🇮🇳', name: 'India' },
  { code: '+971', country: 'AE', flag: '🇦🇪', name: 'UAE' },
  { code: '+966', country: 'SA', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: '+20', country: 'EG', flag: '🇪🇬', name: 'Egypt' },
  { code: '+961', country: 'LB', flag: '🇱🇧', name: 'Lebanon' },
  { code: '+962', country: 'JO', flag: '🇯🇴', name: 'Jordan' },
  { code: '+974', country: 'QA', flag: '🇶🇦', name: 'Qatar' },
  { code: '+965', country: 'KW', flag: '🇰🇼', name: 'Kuwait' },
]

export function EnhancedPhoneInput({
  value,
  onChange,
  countryCode,
  onCountryCodeChange,
  error,
  disabled,
  onBlur,
}: EnhancedPhoneInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [isValid, setIsValid] = useState(false)

  const formatPhoneNumber = (input: string) => {
    // Remove all non-digit characters
    const cleaned = input.replace(/\D/g, '')
    
    // Format based on US pattern for display
    if (countryCode === '+1' && cleaned.length > 0) {
      if (cleaned.length <= 3) return cleaned
      if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`
    }
    
    return cleaned
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, '')
    
    // Limit to 15 digits
    if (cleaned.length <= 15) {
      onChange(cleaned)
      
      // Validate phone number length
      if (cleaned.length >= 10) {
        setIsValid(true)
      } else {
        setIsValid(false)
      }
    }
  }

  const selectedCountry = countryCodes.find(c => c.code === countryCode)

  return (
    <div className="space-y-2">
      <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Phone className="h-4 w-4" />
        Phone Number <span className="text-red-500">*</span>
      </Label>
      
      <div className="relative">
        <div
          className={`flex gap-2 rounded-xl border-2 overflow-hidden transition-all duration-200 ${
            disabled
              ? 'bg-gray-100 border-gray-200'
              : isFocused
              ? 'border-teal-700 ring-4 ring-teal-100'
              : error
              ? 'border-red-500 ring-4 ring-red-100'
              : isValid && value
              ? 'border-green-500 ring-4 ring-green-100'
              : 'border-gray-300'
          }`}
        >
          {/* Country Code Selector */}
          <Select 
            value={countryCode} 
            onValueChange={onCountryCodeChange}
            disabled={disabled}
          >
            <SelectTrigger className="w-[140px] border-0 focus:ring-0 bg-gray-50 rounded-none border-r-2 border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-lg">{selectedCountry?.flag}</span>
                <span className="font-medium">{countryCode}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              {countryCodes.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{country.flag}</span>
                    <span className="font-medium">{country.code}</span>
                    <span className="text-gray-500 text-sm">{country.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Phone Input */}
          <div className="flex-1 flex items-center gap-2 px-4">
            <Input
              id="phone"
              type="tel"
              inputMode="numeric"
              value={formatPhoneNumber(value)}
              onChange={handlePhoneChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setIsFocused(false)
                onBlur?.()
              }}
              placeholder={countryCode === '+1' ? '(555) 123-4567' : '1234567890'}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-base h-12"
              disabled={disabled}
            />
            
            {/* Success/Error Icon */}
            {value && !error && isValid && (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            )}
            {error && (
              <AlertCircle className="h-5 w-5 text-red-500" />
            )}
          </div>
        </div>
      </div>

      {/* Helper/Error Text */}
      {error ? (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      ) : isValid && value ? (
        <p className="text-sm text-green-600 flex items-center gap-1">
          <CheckCircle2 className="h-4 w-4" />
          Phone number looks good!
        </p>
      ) : (
        <p className="text-xs text-gray-500">
          Used for account recovery and shift notifications
        </p>
      )}
    </div>
  )
}
