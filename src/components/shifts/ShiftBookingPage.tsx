'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  User,
  Briefcase,
  Send,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface Shift {
  id: number
  date: string
  from: string
  to: string
  hours: number
  address: string
  pharmacy_id: number
  pharmacy_name: string
  pharmacy_phone: string
  pharmacy_city: string
  pharmacy_province: string
  pharmacy_postcode: string
  hour_rate: number
  total: number
  applied: boolean
  applied_at: string | null
  applied_msg: string | null
  addres: {
    id: number
    title: string
    phone: string
    city: string
    postcode: string
  }
}

interface ShiftsResponse {
  status: boolean
  data: Shift[]
}

export function ShiftBookingPage() {
  const [shifts, setShifts] = useState<Shift[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    pharmacyId: '',
    city: '',
    province: ''
  })
  const [isApplying, setIsApplying] = useState<number | null>(null)
  const [applicationMessage, setApplicationMessage] = useState<string>('')

  const shiftsPerPage = 10

  useEffect(() => {
    fetchShifts()
  }, [])

  const fetchShifts = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/shifts')
      const data: ShiftsResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch shifts')
      }

      if (data.success && data.data) {
        setShifts(data.data)
      }
    } catch (err) {
      console.error('Error fetching shifts:', err)
      setError('Failed to load shifts')
    } finally {
      setIsLoading(false)
    }
  }

  const applyForShift = async (shiftId: number) => {
    setIsApplying(shiftId)
    setApplicationMessage('')

    try {
      // Mock API call to apply for shift
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update the shift in local state
      setShifts(prev => 
        prev.map(shift => 
          shift.id === shiftId 
            ? { ...shift, applied: true, applied_at: new Date().toISOString(), applied_msg: 'Application sent successfully' }
            : shift
        )
      )

      setApplicationMessage('Application sent successfully! You will be contacted by the pharmacy.')
      
      // Clear applying state after 2 seconds
      setTimeout(() => {
        setIsApplying(null)
      }, 2000)
      
    } catch (err) {
      console.error('Error applying for shift:', err)
      setApplicationMessage('Failed to send application')
      setIsApplying(null)
    }
  }

  const filteredShifts = shifts.filter(shift => {
    if (filters.dateFrom && new Date(shift.date) < new Date(filters.dateFrom)) return false
    if (filters.dateTo && new Date(shift.date) > new Date(filters.dateTo)) return false
    if (filters.pharmacyId && shift.pharmacy_id !== parseInt(filters.pharmacyId)) return false
    if (filters.city && shift.pharmacy_city.toLowerCase() !== filters.city.toLowerCase()) return false
    if (filters.province && shift.pharmacy_province.toLowerCase() !== filters.province.toLowerCase()) return false
    return true
  })

  const paginatedShifts = filteredShifts.slice(
    (currentPage - 1) * shiftsPerPage,
    currentPage * shiftsPerPage
  )

  const totalPages = Math.ceil(filteredShifts.length / shiftsPerPage)

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }))
    setCurrentPage(1)
  }

  const formatDate = (dateString: string) => {
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
    const displayHour = hour > 12 ? hour - 12 : hour
    return `${displayHour}:${minutes} ${period}`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading shifts...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Shifts</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={fetchShifts} className="bg-blue-600 hover:bg-blue-700 text-white">
          Retry Loading Shifts
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Pharmacy Shifts</h1>
            <p className="text-gray-600">Browse and apply for available shifts in your area</p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Date From</label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Date To</label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Pharmacy</label>
                  <select
                    value={filters.pharmacyId}
                    onChange={(e) => handleFilterChange('pharmacyId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Pharmacies</option>
                    <option value="7">ABC Pharmacy</option>
                    <option value="8">XYZ Pharmacy</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    placeholder="Enter city name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Province</label>
                  <input
                    type="text"
                    value={filters.province}
                    onChange={(e) => handleFilterChange('province', e.target.value)}
                    placeholder="Enter province name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2 lg:col-span-5">
                  <Button
                    onClick={() => setFilters({ dateFrom: '', dateTo: '', pharmacyId: '', city: '', province: '' })}
                    variant="outline"
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Summary */}
          <Card className="mb-6">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Available Shifts
                  </h2>
                  <p className="text-sm text-gray-600">
                    Showing {paginatedShifts.length} of {filteredShifts.length} shifts · Page {currentPage} of {totalPages}
                  </p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">
                  {filteredShifts.length} shifts found
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Shifts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedShifts.map((shift) => (
              <Card key={shift.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  {/* Shift Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {formatDate(shift.date)}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(shift.from)} - {formatTime(shift.to)}</span>
                        <span className="ml-2">· {shift.hours} hours</span>
                      </div>
                    </div>
                    <div className="text-right">
                      {shift.applied ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Applied
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">
                          Available
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Pharmacy Info */}
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="h-5 w-5 text-gray-400" />
                      <div>
                        <h4 className="font-medium text-gray-900">{shift.pharmacy_name}</h4>
                        <p className="text-sm text-gray-600">ID: {shift.pharmacy_id}</p>
                      </div>
                    </div>
                  <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">{shift.pharmacy_city}, {shift.pharmacy_province}</p>
                        <p className="text-xs text-gray-500">{shift.address}</p>
                      </div>
                    </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">{shift.pharmacy_phone}</p>
                        <p className="text-xs text-gray-500">{shift.pharmacy_postcode}</p>
                      </div>
                    </div>
                  </div>
                </div>

                  {/* Shift Details */}
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Hourly Rate:</span>
                        <span className="ml-2">${shift.hour_rate}/hour</span>
                      </div>
                      <div>
                        <span className="font-medium">Total Shift:</span>
                        <span className="ml-2">${shift.total}</span>
                      </div>
                    </div>
                  </div>

                  {/* Address for Application */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Application Address</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>
                        <strong>{shift.addres.title}</strong>
                        <p>{shift.addres.phone} · {shift.addres.city}, {shift.addres.postcode}</p>
                      </div>
                    </div>
                  </div>

                  {/* Apply Button */}
                  <div className="border-t pt-4">
                    {shift.applied ? (
                      <div className="text-center">
                        <Badge className="bg-green-100 text-green-800 mb-2">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Application Sent
                        </Badge>
                        {shift.applied_msg && (
                          <p className="text-sm text-green-700 mt-2">{shift.applied_msg}</p>
                        )}
                      </div>
                    ) : (
                      <Button
                        onClick={() => applyForShift(shift.id)}
                        disabled={isApplying === shift.id}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                      >
                        {isApplying === shift.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Applying...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Send Application
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}}
          </div>

          {/* Application Message */}
          {applicationMessage && (
            <Card className="mt-6">
              <CardContent className="text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Application Successful!</h3>
                <p className="text-gray-600">{applicationMessage}</p>
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2"
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
              
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}