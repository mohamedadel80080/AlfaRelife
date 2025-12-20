'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Calendar,
  Clock,
  MapPin,
  Building,
  DollarSign,
  AlertCircle,
  XCircle
} from 'lucide-react'
import { fetchUpcomingShifts, UpcomingShift, getAuthToken, cancelAcceptedShift } from '@/lib/api'
import { toast } from '@/hooks/use-toast'

interface UpcomingShiftsProps {
  className?: string
}

export function UpcomingShifts({ className = '' }: UpcomingShiftsProps) {
  const [shifts, setShifts] = useState<UpcomingShift[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancellingShiftId, setCancellingShiftId] = useState<number | null>(null)

  const fetchShifts = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Check if user is authenticated
      const token = getAuthToken()
      if (!token) {
        // Don't show error for unauthenticated users, just show empty state
        setShifts([])
        return
      }
      
      const response = await fetchUpcomingShifts()
      
      console.log('Homepage - Upcoming shifts API response:', response);
      
      // Handle both response formats: { status, data } or just { data }
      const shiftsData = response.data || (response as any).data;
      const hasData = Array.isArray(shiftsData) && shiftsData.length > 0;
      
      if (hasData) {
        console.log('Homepage - Raw upcoming shifts data:', shiftsData);
        
        // Filter for upcoming shifts based on:
        // 1. status (should be active/confirmed)
        // 2. date > now()
        // 3. assigned or applied flags
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Set to start of today for proper comparison
        
        const filteredShifts = shiftsData.filter((shift: any) => {
          // Check if date is in the future (including today)
          // Parse YYYY-MM-DD format directly
          const shiftDate = new Date(shift.date);
          shiftDate.setHours(0, 0, 0, 0); // Set to start of day for proper comparison
          const isFutureDate = shiftDate >= now;
          
          // Check if shift is assigned or applied
          const isAssignedOrApplied = shift.assigned > 0 || shift.applied;
          
          console.log(`Homepage - Shift ${shift.id}: date=${shift.date}, isFutureDate=${isFutureDate}, assigned=${shift.assigned}, applied=${shift.applied}`);
          
          return isFutureDate && isAssignedOrApplied;
        });
        
        console.log('Homepage - Filtered upcoming shifts:', filteredShifts);
        
        setShifts(filteredShifts)
      } else if (!response.status) {
        // Handle error status
        setShifts([])
        // Only show error message if there's a specific error
        if (response.message) {
          setError(response.message)
        } else {
          setError('Failed to load upcoming shifts')
        }
      } else {
        // Successful response but no data (empty shifts)
        setShifts([])
      }
    } catch (err) {
      console.error('Error fetching upcoming shifts:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to load upcoming shifts'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Check if user is authenticated initially
    const token = getAuthToken()
    if (token) {
      fetchShifts()
    } else {
      // If not authenticated, stop loading and show empty state
      setIsLoading(false)
    }
  }, [])

  const formatDate = (dateString: string) => {
    // Parse YYYY-MM-DD format directly
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

  const handleCancelShift = async (shiftId: number) => {
    setCancellingShiftId(shiftId)
    try {
      const response = await cancelAcceptedShift(shiftId)

      // Check for success - accept if status is true OR if message indicates success
      const isSuccess = response.status === true || 
                       (response.message && (
                         response.message.toLowerCase().includes('cancel') ||
                         response.message.toLowerCase().includes('success')
                       ))

      if (isSuccess) {
        toast({
          title: 'Success!',
          description: response.message || 'Shift cancelled successfully',
        })
        // Refresh the shifts list
        await fetchShifts()
      } else {
        throw new Error(response.message || 'Failed to cancel shift')
      }
    } catch (err) {
      console.error('Error cancelling shift:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel shift'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setCancellingShiftId(null)
    }
  }

  if (isLoading) {
    return (
      <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Your Upcoming Shifts</h3>
          <Button 
            variant="ghost" 
            onClick={fetchShifts}
            disabled={true}
            className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
          >
            Refreshing...
          </Button>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-700 mr-2"></div>
          <span className="text-gray-600">Loading upcoming shifts...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Your Upcoming Shifts</h3>
          <Button 
            variant="ghost" 
            onClick={fetchShifts}
            disabled={isLoading}
            className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
          >
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to Load Upcoming Shifts</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button 
            onClick={fetchShifts} 
            className="bg-teal-700 hover:bg-teal-800 text-white"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">Your Upcoming Shifts</h3>
        <Button 
          variant="ghost" 
          onClick={fetchShifts}
          disabled={isLoading}
          className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
      
      {shifts.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Shifts</h3>
          <p className="text-gray-600">You don't have any upcoming shifts scheduled at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {shifts.map((shift) => {
            // Get pharmacy name from either pharmacy or addres object
            const pharmacyName = shift.pharmacy || shift.addres?.title || 'N/A'
            const pharmacyAddress = shift.address || shift.addres?.address || 'N/A'
            const city = shift.addres?.city || 'N/A'
            
            return (
              <Card key={shift.id} className="border border-gray-200">
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
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      Upcoming
                    </Badge>
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

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Hourly Rate</p>
                          <p className="font-semibold text-gray-900 flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {parseFloat(shift.hour_rate.toString()).toFixed(2)}
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
                      <Button
                        onClick={() => handleCancelShift(shift.id)}
                        disabled={cancellingShiftId === shift.id}
                        variant="destructive"
                        size="sm"
                      >
                        {cancellingShiftId === shift.id ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                            Cancelling...
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Cancel
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
        </div>
      )}
    </div>
  )
}
