'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar,
  Clock,
  MapPin,
  Building,
  DollarSign,
  ChevronRight
} from 'lucide-react'

interface ShiftCardProps {
  shift: {
    id: number
    date: string
    from: string
    to: string
    hours?: number
    pharmacy_name: string
    pharmacy_address: string
    city: string
    district: string
    total: number
    earning: number
    status: string
  }
}

export function ShiftCard({ shift }: ShiftCardProps) {
  const formatDate = (dateString: string) => {
    // Parse YYYY-MM-DD format correctly
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour)
    return `${displayHour}:${minutes} ${period}`
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'assigned':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'upcoming':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'cancel':
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'assigned':
        return 'Assigned'
      case 'upcoming':
        return 'Upcoming'
      case 'cancel':
      case 'cancelled':
        return 'Cancelled'
      default:
        return status
    }
  }

  return (
    <Link href={`/shifts/${shift.id}`}>
      <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="font-semibold text-gray-900">
                  {formatDate(shift.date)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>
                  {formatTime(shift.from)} - {formatTime(shift.to)}
                  {shift.hours && ` (${shift.hours}h)`}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(shift.status)}>
                {getStatusLabel(shift.status)}
              </Badge>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2 mb-3">
            <div className="flex items-start gap-2">
              <Building className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {shift.pharmacy_name}
                </p>
                <p className="text-sm text-gray-600 truncate">
                  {shift.pharmacy_address}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">
                {shift.city}, {shift.district}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-xs text-gray-500">Total</p>
                <p className="font-semibold text-gray-900 flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  {shift.total}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Earning</p>
                <p className="font-semibold text-green-600 flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  {shift.earning}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
