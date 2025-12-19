'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar,
  Clock,
  MapPin,
  Building,
  DollarSign
} from 'lucide-react'

interface Shift {
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
  accepted?: boolean
}

interface GroupedShiftsRendererProps {
  shifts: Shift[]
}

export function GroupedShiftsRenderer({ shifts }: GroupedShiftsRendererProps) {
  // Group shifts by date
  const groupedShifts = shifts.reduce((acc, shift) => {
    if (!acc[shift.date]) {
      acc[shift.date] = []
    }
    acc[shift.date].push(shift)
    return acc
  }, {} as Record<string, Shift[]>)

  // Get all unique dates and sort them
  const sortedDates = Object.keys(groupedShifts).sort((a, b) => {
    // Parse YYYY-MM-DD format directly
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA.getTime() - dateB.getTime();
  })

  const formatDate = (dateString: string) => {
    // Parse YYYY-MM-DD format directly
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
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

  return (
    <div className="space-y-8">
      {sortedDates.map((date) => (
        <div key={date} className="space-y-4">
          {/* Date Header */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-100 rounded-lg">
                <Calendar className="h-5 w-5 text-teal-700" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {formatDate(date)}
                </h2>
                <p className="text-sm text-gray-600">
                  {groupedShifts[date].length} {groupedShifts[date].length === 1 ? 'shift' : 'shifts'} available
                </p>
              </div>
            </div>
          </div>
          
          {/* Shift Cards for this date */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedShifts[date].map((shift) => (
              <Card 
                key={shift.id} 
                className="group hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border-gray-200 overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50"
              >
                <div className="p-6 space-y-4">
                  {/* Pharmacy Info */}
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center border border-gray-200">
                        <Building className="h-6 w-6 text-teal-700" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 truncate text-base">
                        {shift.pharmacy_name}
                      </h4>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                        {shift.city}
                      </p>
                    </div>
                  </div>

                  {/* Time and Duration */}
                  <div className="flex items-center gap-2 text-gray-700">
                    <div className="p-1.5 bg-teal-50 rounded-lg">
                      <Clock className="h-4 w-4 text-teal-700" />
                    </div>
                    <span className="font-semibold text-base">
                      {formatTime(shift.from)} – {formatTime(shift.to)}
                    </span>
                    {shift.hours && (
                      <Badge variant="outline" className="ml-auto">
                        {shift.hours}h
                      </Badge>
                    )}
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-400" />
                    <span className="text-sm">{shift.pharmacy_address}</span>
                  </div>

                  {/* Financial Info */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 font-medium">Hourly Rate</p>
                      <p className="text-lg font-bold text-gray-900 flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {shift.earning / (shift.hours || 1)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 font-medium">Total Earning</p>
                      <p className="text-lg font-bold text-green-600 flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {shift.earning}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
