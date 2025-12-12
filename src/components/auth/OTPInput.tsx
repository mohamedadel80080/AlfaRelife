'use client'

import { useRef, useState, useEffect, KeyboardEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface OTPInputProps {
  value: string[]
  onChange: (value: string[]) => void
  length?: number
  error?: string
}

export function OTPInput({ value, onChange, length = 4, error }: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    // Auto-focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleChange = (index: number, inputValue: string) => {
    // Only allow single digit
    const digit = inputValue.replace(/\D/g, '').slice(-1)
    
    const newValue = [...value]
    newValue[index] = digit
    onChange(newValue)

    // Auto-focus next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus()
      } else {
        // Clear current input
        const newValue = [...value]
        newValue[index] = ''
        onChange(newValue)
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '')
    
    const newValue = [...value]
    for (let i = 0; i < Math.min(pastedData.length, length); i++) {
      newValue[i] = pastedData[i]
    }
    onChange(newValue)

    // Focus last filled input
    const lastFilledIndex = Math.min(pastedData.length, length) - 1
    inputRefs.current[lastFilledIndex]?.focus()
  }

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">
        Enter Verification Code
      </Label>
      
      <div className="flex gap-3 justify-center">
        {Array.from({ length }, (_, index) => (
          <Input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[index] || ''}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`
              w-14 h-14 text-center text-2xl font-bold rounded-xl
              border-2 transition-all duration-200
              ${value[index] ? 'border-teal-700 bg-teal-50' : 'border-gray-300'}
              ${isFocused ? 'ring-4 ring-teal-100' : ''}
              ${error ? 'border-red-500 bg-red-50' : ''}
              focus-visible:border-teal-700 focus-visible:ring-4 focus-visible:ring-teal-100
            `}
          />
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 text-center flex items-center justify-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-red-600"></span>
          {error}
        </p>
      )}

      {/* Helper Text */}
      {!error && (
        <p className="text-xs text-gray-500 text-center">
          We've sent a 4-digit code to your phone
        </p>
      )}
    </div>
  )
}
