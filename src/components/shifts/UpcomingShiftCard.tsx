'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Calendar,
  Clock,
  MapPin,
  Building,
  DollarSign,
  ChevronRight
} from 'lucide-react'

interface UpcomingShiftCardProps {
  shift: {
    id: number
    date: string
    from: string
    to: string
    hours: number
    address: string
    lat: string
    lng: string
    pharmacy_id: number
    status: number
    hour_rate: number
    total: number
    created_at: string
    address_id: number
    applied_at: string | null
    applied: boolean
    applied_msg: string | null
    pharmacy?: {
      id: number
      title: string
      email: string
      phone: string
      address: string
      city: string
    }
    addres?: {
      id: number
      title: string
      phone: string
      lat: string
      lng: string
      address: string
      city: string
      postcode: string
      district_id: number
      pharmacy_id: number
    }
  }
}

export function UpcomingShiftCard({ shift }: UpcomingShiftCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString.split('-').reverse().join('-'))
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

  // Get pharmacy name from either pharmacy or addres object
  const pharmacyName = shift.pharmacy?.title || shift.addres?.title || 'N/A'
  const pharmacyAddress = shift.address || shift.addres?.address || 'N/A'
  const city = shift.pharmacy?.city || shift.addres?.city || 'N/A'

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
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                Upcoming
              </Badge>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2 mb-3">
            <div className="flex items-start gap-2">
              <Building className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {pharmacyName}
                </p>
                <p className="text-sm text-gray-600 truncate">
                  {pharmacyAddress}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">
                {city}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-xs text-gray-500">Hourly Rate</p>
                <p className="font-semibold text-gray-900 flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  {shift.hour_rate}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total</p>
                <p className="font-semibold text-green-600 flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  {shift.total}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
