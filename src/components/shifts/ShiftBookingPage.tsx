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
  Eye,
  Activity,
  UserCircle
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-700"></div>
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
        <Button onClick={fetchShifts} className="bg-teal-700 hover:bg-teal-800 text-white">
          Retry Loading Shifts
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/30 to-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              {/* Logo and Title */}
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-teal-700 to-teal-800 rounded-xl shadow-lg shadow-teal-200">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Pharmacy Shifts</h1>
                  <p className="text-sm text-gray-600">Find your next opportunity</p>
                </div>
              </div>

              {/* Navigation Tabs - Segmented Control */}
              <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
                <Link href="/my-shifts">
                  <Button 
                    variant="ghost" 
                    className="rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200"
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    My Shifts
                  </Button>
                </Link>
                <Link href="/register">
                  <Button 
                    variant="ghost" 
                    className="rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200"
                  >
                    <UserCircle className="h-4 w-4 mr-2" />
                    Register
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button 
                    variant="ghost" 
                    className="rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">

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
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Available Shifts
                </h2>
                <p className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages} · {shiftsForCurrentPage.length} shifts on this page
                </p>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-4 py-2 text-base shadow-md shadow-teal-200">
                  {filteredShifts.length} shifts found
                </Badge>
              </div>
            </div>
          </div>

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
                <div key={date} className="relative">
                  {/* Date Header - Sticky with gradient background */}
                  <div className="sticky top-20 z-40 -mx-4 px-4 py-4 mb-6 bg-gradient-to-r from-gray-50 to-teal-50 backdrop-blur-sm border-y border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
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
                        <CardContent className="p-0">
                          {/* Card Header with Pharmacy Avatar */}
                          <div className="p-6 pb-4 bg-gradient-to-r from-teal-50 to-teal-100 border-b border-gray-100">
                            <div className="flex items-start gap-3">
                              {/* Pharmacy Avatar */}
                              <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center border border-gray-200">
                                  <Briefcase className="h-6 w-6 text-teal-700" />
                                </div>
                              </div>
                              
                              {/* Pharmacy Info */}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-gray-900 truncate text-base">
                                  {shift.addres.title}
                                </h4>
                                <p className="text-sm text-gray-600 flex items-center gap-1 mt-0.5">
                                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                                  {shift.pharmacy_city}
                                </p>
                              </div>

                              {/* Status Badge */}
                              <Badge 
                                className={`${
                                  shift.applied 
                                    ? 'bg-green-100 text-green-700 border-green-200' 
                                    : 'bg-teal-100 text-teal-700 border-teal-200'
                                } shadow-sm`}
                              >
                                {shift.applied ? 'Applied' : 'Open'}
                              </Badge>
                            </div>
                          </div>

                          {/* Card Body */}
                          <div className="p-6 space-y-4">
                            {/* Time and Duration */}
                            <div className="flex items-center gap-2 text-gray-700">
                              <div className="p-1.5 bg-teal-50 rounded-lg">
                                <Clock className="h-4 w-4 text-teal-700" />
                              </div>
                              <span className="font-semibold text-base">
                                {formatTime(shift.from)} – {formatTime(shift.to)}
                              </span>
                              <Badge variant="outline" className="ml-auto">
                                {shift.hours}h
                              </Badge>
                            </div>

                            {/* Address */}
                            <div className="flex items-start gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <p className="text-gray-600 line-clamp-2">
                                {shift.address}
                              </p>
                            </div>

                            {/* Financial Info - Grid Layout */}
                            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                              <div className="space-y-1">
                                <p className="text-xs text-gray-500 font-medium">Hourly Rate</p>
                                <p className="text-lg font-bold text-gray-900 flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  {shift.hour_rate}
                                </p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs text-gray-500 font-medium">Total Earning</p>
                                <p className="text-lg font-bold text-green-600 flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  {shift.total}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Card Footer - Actions */}
                          <div className="px-6 pb-6">
                            {shift.applied ? (
                              <div className="space-y-3">
                                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <span className="font-semibold text-green-900">Application Sent</span>
                                  </div>
                                  {shift.applied_at && (
                                    <p className="text-xs text-green-700">
                                      {new Date(shift.applied_at).toLocaleString()}
                                    </p>
                                  )}
                                  {shift.applied_msg && (
                                    <p className="text-sm text-green-800 mt-2">
                                      {shift.applied_msg}
                                    </p>
                                  )}
                                </div>
                                <Link href={`/shifts/${shift.id}`} className="block">
                                  <Button variant="outline" className="w-full hover:bg-gray-50">
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </Button>
                                </Link>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <Link href={`/shifts/${shift.id}`} className="block">
                                  <Button 
                                    variant="outline" 
                                    className="w-full hover:bg-gray-50 hover:border-gray-300 transition-colors"
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </Button>
                                </Link>
                                <Button
                                  onClick={() => applyForShift(shift.id)}
                                  disabled={isApplying === shift.id}
                                  className="w-full bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-800 hover:to-teal-900 text-white shadow-lg shadow-teal-200 hover:shadow-xl transition-all duration-200"
                                >
                                  {isApplying === shift.id ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                      Applying...
                                    </>
                                  ) : (
                                    <>
                                      <Send className="h-4 w-4 mr-2" />
                                      Send PID
                                    </>
                                  )}
                                </Button>
                              </div>
                            )}
                          </div>
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
            <div className="bg-white rounded-2xl border border-green-200 shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Application Successful!</h3>
                <p className="text-gray-700">{applicationMessage}</p>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-gray-600 font-medium">
                  Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} shifts
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="hover:bg-gray-50 transition-colors"
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
                          className={`w-10 h-10 p-0 transition-all duration-200 ${
                            pageNum === currentPage 
                              ? 'bg-gradient-to-r from-teal-700 to-teal-800 text-white shadow-md' 
                              : 'hover:bg-gray-50'
                          }`}
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
                    className="hover:bg-gray-50 transition-colors"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}