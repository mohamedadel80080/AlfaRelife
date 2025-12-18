'use client'

import { CheckCircle2, Circle } from 'lucide-react'
import { useEffect, useState } from 'react'

interface PasswordStrengthProps {
  password: string
  showRequirements?: boolean
}

interface Requirement {
  id: string
  label: string
  met: boolean
}

type StrengthLevel = 'weak' | 'fair' | 'good' | 'strong'

export function PasswordStrength({ password, showRequirements = true }: PasswordStrengthProps) {
  const [strength, setStrength] = useState<StrengthLevel>('weak')
  const [requirements, setRequirements] = useState<Requirement[]>([])

  useEffect(() => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }

    // Calculate strength
    let score = 0
    if (checks.length) score++
    if (checks.uppercase) score++
    if (checks.lowercase) score++
    if (checks.number) score++
    if (checks.special) score++

    if (score <= 2) setStrength('weak')
    else if (score === 3) setStrength('fair')
    else if (score === 4) setStrength('good')
    else setStrength('strong')

    // Update requirements
    setRequirements([
      { id: 'length', label: 'At least 8 characters', met: checks.length },
      { id: 'uppercase', label: 'One uppercase letter (A-Z)', met: checks.uppercase },
      { id: 'lowercase', label: 'One lowercase letter (a-z)', met: checks.lowercase },
      { id: 'number', label: 'One number (0-9)', met: checks.number },
      { id: 'special', label: 'One special character (!@#$...)', met: checks.special },
    ])
  }, [password])

  if (!password) return null

  const strengthConfig = {
    weak: { width: '25%', color: 'bg-red-500', label: 'Weak', textColor: 'text-red-700' },
    fair: { width: '50%', color: 'bg-orange-500', label: 'Fair', textColor: 'text-orange-700' },
    good: { width: '75%', color: 'bg-yellow-500', label: 'Good', textColor: 'text-yellow-700' },
    strong: { width: '100%', color: 'bg-green-500', label: 'Strong', textColor: 'text-green-700' },
  }

  const config = strengthConfig[strength]

  return (
    <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Strength Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-700">Password strength:</span>
          <span className={`text-xs font-semibold ${config.textColor}`}>
            {config.label}
          </span>
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${config.color} transition-all duration-500 ease-out rounded-full`}
            style={{ width: config.width }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      {showRequirements && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-gray-700 mb-2">Requirements:</p>
          {requirements.map((req) => (
            <div
              key={req.id}
              className="flex items-center gap-2 text-xs transition-colors duration-200"
            >
              {req.met ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
              ) : (
                <Circle className="h-3.5 w-3.5 text-gray-300 flex-shrink-0" />
              )}
              <span className={req.met ? 'text-green-700 font-medium' : 'text-gray-500'}>
                {req.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
