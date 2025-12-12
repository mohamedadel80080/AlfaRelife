'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  MapPin, 
  Clock,
  DollarSign,
  Briefcase,
  CheckCircle
} from 'lucide-react'

interface Shift {
  id: string
  pharmacyName: string
  location: string
  date: string
  time: string
  hourlyRate: number
  status: 'available' | 'applied' | 'completed'
  hours: number
  description?: string
}

interface ShiftPreviewCardProps {
  shift: Shift
  onQuickApply?: () => void
}

export function ShiftPreviewCard({ shift, onQuickApply }: ShiftPreviewCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'applied':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'applied':
        return <Clock className="h-4 w-4 text-blue-600" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-gray-600" />
      default:
        return null
    }
  }

  const formatEarnings = (shift: Shift) => {
    if (shift.status === 'applied') {
      return (
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>Application Status:</strong> Your application is under review
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              {shift.pharmacyName}
            </h3>
            <div className="flex items-center space-x-2 text-gray-600 mb-1">
              <MapPin className="h-4 w-4" />
              <span>{shift.location}</span>
              <span className="mx-2">•</span>
              <Clock className="h-4 w-4" />
              <span>{shift.date}</span>
              <span className="mx-2">•</span>
              <span>{shift.time}</span>
            </div>
          </div>
          <div className="text-right">
            <Badge className={getStatusColor(shift.status)}>
              {getStatusIcon(shift.status)}
              <span className="ml-1">
                {shift.status.charAt(0).toUpperCase() + shift.status.slice(1)}
              </span>
            </Badge>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="text-gray-600">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span className="font-medium">${shift.hourlyRate}/hr</span>
              </div>
              <span className="text-sm text-gray-500">for {shift.hours} hours</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-semibold text-green-600">
                ${(shift.hourlyRate * shift.hours).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-gray-600">
              <div className="flex items-center space-x-2">
                <Briefcase className="h-4 w-4" />
                <span className="font-medium">Full-time</span>
              </div>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">40 hrs/week</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-semibold text-blue-600">
                ${((shift.hourlyRate * 40 * 52) / 12).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {shift.description && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-800">
              <strong>Notes:</strong> {shift.description}
            </p>
          </div>
        )}

        {formatEarnings(shift)}

        <div className="flex justify-end mt-4">
          {shift.status === 'available' && onQuickApply && (
            <Button
              onClick={onQuickApply}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Quick Apply
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}