'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar,
  Plus,
  Filter,
  RefreshCw,
  Search
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

interface AvailableShiftsProps {
  onQuickApply: (shiftId: string) => void
}

export function AvailableShifts({ onQuickApply }: AvailableShiftsProps) {
  const [shifts, setShifts] = useState<Shift[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all')

  // Mock shifts data
  const mockShifts: Shift[] = [
    {
      id: '1',
      pharmacyName: 'Downtown Pharmacy',
      location: 'Toronto, ON',
      date: '2024-01-15',
      time: '19:00 - 23:00',
      hourlyRate: 55,
      status: 'available',
      hours: 8,
      description: 'Evening shift available for experienced pharmacists'
    },
    {
      id: '2',
      pharmacyName: 'Riverside Medical Clinic',
      location: 'Toronto, ON',
      date: '2024-01-16',
      time: '09:00 - 17:00',
      hourlyRate: 60,
      status: 'applied',
      hours: 8,
      description: 'Applied for morning shift'
    },
    {
      id: '3',
      pharmacyName: 'Community Health Center',
      location: 'Mississauga, ON',
      date: '2024-01-17',
      time: '23:00 - 07:00',
      hourlyRate: 58,
      status: 'completed',
      hours: 8,
      description: 'Completed night shift - great experience!'
    },
    {
      id: '4',
      pharmacyName: 'General Hospital',
      location: 'Toronto, ON',
      date: '2024-01-18',
      time: '15:00 - 23:00',
      hourlyRate: 62,
      status: 'available',
      hours: 8,
      description: 'Afternoon shift - flexible hours available'
    },
    {
      id: '5',
      pharmacyName: 'Senior Care Pharmacy',
      location: 'Oakville, ON',
      date: '2024-01-19',
      time: '07:00 - 15:00',
      hourlyRate: 65,
      status: 'available',
      hours: 8,
      description: 'Weekend shift - premium rate'
    }
  ]

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setShifts(mockShifts)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const filteredShifts = shifts.filter(shift => {
    if (filter === 'all') return true
    if (filter === 'week') {
      const shiftDate = new Date(shift.date)
      const today = new Date()
      const weekFromToday = new Date(today.setDate(today.getDate() - 7))
      return shiftDate >= weekFromToday
    }
    if (filter === 'month') {
      const shiftDate = new Date(shift.date)
      const today = new Date()
      const monthFromToday = new Date(today.setMonth(today.getMonth() - 1))
      return shiftDate >= monthFromToday
    }
    return true
  })

  const handleQuickApply = (shiftId: string) => {
    console.log('Quick applying to shift:', shiftId)
    // In a real app, this would make an API call
    // For now, just show a success message
    alert('Application submitted successfully! You will be contacted soon.')
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800">Available</Badge>
      case 'applied':
        return <Badge className="bg-blue-100 text-blue-800">Applied</Badge>
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-800">Completed</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'applied':
        return <Calendar className="h-4 w-4 text-blue-600" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-gray-600" />
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading available shifts...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center text-red-600 mb-4">
              <RefreshCw className="h-8 w-8" />
              <span className="ml-2">Error loading shifts</span>
            </div>
            <p className="text-red-700">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const availableCount = filteredShifts.filter(s => s.status === 'available').length
  const appliedCount = filteredShifts.filter(s => s.status === 'applied').length
  const completedCount = filteredShifts.filter(s => s.status === 'completed').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Available Shifts
            <Badge variant="secondary" className="ml-2">
              {availableCount} Available
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={filter === 'week' ? 'default' : 'outline'}
                onClick={() => setFilter('week')}
                size="sm"
              >
                This Week
              </Button>
              <Button
                variant={filter === 'month' ? 'default' : 'outline'}
                onClick={() => setFilter('month')}
                size="sm"
              >
                This Month
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search shifts..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{availableCount}</div>
          <p className="text-sm text-gray-600">Available Shifts</p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{appliedCount}</div>
          <p className="text-sm text-gray-600">Applications Sent</p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-600 mb-2">{completedCount}</div>
          <p className="text-sm text-gray-600">Completed</p>
        </div>
      </div>

      {/* Shifts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredShifts.map((shift) => (
          <ShiftPreviewCard
            key={shift.id}
            shift={shift}
            onQuickApply={() => handleQuickApply(shift.id)}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Actions</h3>
            <div className="flex space-x-3">
              <Button variant="outline" className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Browse All Shifts
              </Button>
              <Button variant="outline" className="flex-1">
                <Filter className="h-4 w-4 mr-2" />
                Filter Shifts
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}