'use client'

import Link from 'next/link'
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
  AlertCircle,
  Eye
} from 'lucide-react'
import { FilterBar } from './FilterBar'
import { format } from 'date-fns'

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
  success: boolean
  data: Shift[]
  error?: string
}

export function ShiftBookingPage() {
  const [shifts, setShifts] = useState<Shift[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
  const [isApplying, setIsApplying] = useState<number | null>(null)
  const [applicationMessage, setApplicationMessage] = useState<string>('')

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

  // Filter shifts by date range
  const filteredShifts = shifts.filter(shift => {
    if (!dateFrom && !dateTo) return true
    
    const shiftDate = new Date(shift.date.split('-').reverse().join('-'))
    
    if (dateFrom && shiftDate < dateFrom) return false
    if (dateTo && shiftDate > dateTo) return false
    
    return true
  })

  // Group shifts by date
  const groupedShifts = filteredShifts.reduce((acc, shift) => {
    if (!acc[shift.date]) {
      acc[shift.date] = []
    }
    acc[shift.date].push(shift)
    return acc
  }, {} as Record<string, Shift[]>)

  // Get all unique dates and sort them
  const sortedDates = Object.keys(groupedShifts).sort((a, b) => {
    const dateA = new Date(a.split('-').reverse().join('-'))
    const dateB = new Date(b.split('-').reverse().join('-'))
    return dateA.getTime() - dateB.getTime()
  })

  // Calculate pagination
  const totalItems = filteredShifts.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  
  // Get shifts for current page
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const shiftsForCurrentPage = filteredShifts.slice(startIndex, endIndex)

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value)
    setCurrentPage(1) // Reset to first page when changing items per page
  }

  const handleDateChange = (from: Date | undefined, to: Date | undefined) => {
    setDateFrom(from)
    setDateTo(to)
    setCurrentPage(1) // Reset to first page when changing date range
  }

  const handleClearFilters = () => {
    setDateFrom(undefined)
    setDateTo(undefined)
    setItemsPerPage(10)
    setCurrentPage(1)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString.split('-').reverse().join('-'))
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
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Pharmacy Shifts</h1>
                <p className="text-gray-600">Browse and apply for available shifts in your area</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/my-shifts'}
                  className="w-full sm:w-auto"
                >
                  My Shifts
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/register'}
                  className="w-full sm:w-auto"
                >
                  Register
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/profile'}
                  className="w-full sm:w-auto"
                >
                  Profile
                </Button>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <FilterBar
            shiftsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
            dateFrom={dateFrom}
            dateTo={dateTo}
            onDateChange={handleDateChange}
            onClearFilters={handleClearFilters}
          />

          {/* Status Summary */}
          <Card className="mb-6">
            <CardContent className="py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Available Shifts
                  </h2>
                  <p className="text-sm text-gray-600">
                    Showing {shiftsForCurrentPage.length} of {filteredShifts.length} shifts · Page {currentPage} of {totalPages}
                  </p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">
                  {filteredShifts.length} shifts found
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Shifts by Date */}
          {sortedDates.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No shifts found in this date range</h3>
                <p className="text-gray-600">Try adjusting your filters or expanding the date range</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {sortedDates.map(date => (
                <div key={date}>
                  {/* Date Header */}
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-900">
                      {formatDate(date)}
                    </h2>
                  </div>
                  
                  {/* Shift Cards for this date */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupedShifts[date].map((shift) => (
                      <Card key={shift.id} className="hover:shadow-lg transition-shadow duration-200">
                        <CardContent className="p-6">
                          {/* Time and Hours */}
                          <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {formatTime(shift.from)} – {formatTime(shift.to)} · {shift.hours} hours
                            </h3>
                          </div>
                          
                          {/* Address and City */}
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900">{shift.addres.title} · {shift.pharmacy_city}</h4>
                            <p className="text-sm text-gray-600 truncate">
                              {shift.address}
                            </p>
                          </div>
                          
                          {/* Meta Information */}
                          <div className="flex justify-between items-center mb-4">
                            <div className="text-sm">
                              <span className="font-medium">Hour rate:</span> ${shift.hour_rate}/hour
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Total:</span> ${shift.total}
                            </div>
                            <Badge className={shift.applied ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                              {shift.applied ? "Applied" : "Open"}
                            </Badge>
                          </div>
                          
                          {/* Applied State or Action Button */}
                          {shift.applied ? (
                            <div className="border-t pt-4">
                              <Badge className="bg-green-100 text-green-800 mb-2 w-full justify-center">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Already sent PID
                              </Badge>
                              {shift.applied_at && (
                                <p className="text-sm text-gray-600 mt-2">
                                  <span className="font-medium">Applied at:</span> {new Date(shift.applied_at).toLocaleString()}
                                </p>
                              )}
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Applied:</span> {shift.applied.toString()}
                              </p>
                              {shift.applied_msg && (
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Message:</span> {shift.applied_msg}
                                </p>
                              )}
                            </div>
                          ) : (
                            <div className="border-t pt-4 space-y-2">
                              <Link href={`/shifts/${shift.id}`}>
                                <Button variant="outline" className="w-full">
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Button>
                              </Link>
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
                                    Send PID
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Application Message */}
          {applicationMessage && (
            <Card className="mt-6">
              <CardContent className="text-center py-6">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Application Successful!</h3>
                <p className="text-gray-600">{applicationMessage}</p>
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} shifts
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show first, last, current, and surrounding pages
                    let pageNum: number
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === currentPage ? "default" : "outline"}
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-10 h-10 p-0"
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}