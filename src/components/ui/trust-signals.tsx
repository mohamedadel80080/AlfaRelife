'use client'

import { Shield, CheckCircle2, Users, Lock } from 'lucide-react'

export function TrustSignals() {
  const signals = [
    {
      icon: Shield,
      title: 'Bank-level encryption',
      description: 'Your data is protected with AES-256 encryption',
      color: 'teal',
    },
    {
      icon: CheckCircle2,
      title: 'HIPAA compliant',
      description: 'We follow strict healthcare privacy standards',
      color: 'teal',
    },
    {
      icon: Users,
      title: 'Verified professionals only',
      description: 'All licenses are manually verified by our team',
      color: 'teal',
    },
  ]

  return (
    <div className="space-y-3">
      {signals.map((signal) => {
        const Icon = signal.icon
        return (
          <div
            key={signal.title}
            className="flex items-start gap-3 p-3 rounded-lg bg-teal-50 border border-teal-100 transition-all duration-200 hover:bg-teal-100"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm flex-shrink-0">
              <Icon className="h-5 w-5 text-teal-700" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-teal-900">{signal.title}</p>
              <p className="text-xs text-teal-700 mt-0.5">{signal.description}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function EncryptionBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-full">
      <Lock className="h-3.5 w-3.5 text-teal-700" />
      <span className="text-xs font-medium text-teal-900">Your data is encrypted and secure</span>
    </div>
  )
}
