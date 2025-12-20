'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ShiftCard } from './ShiftCard'
import { AssignedShiftCard } from './AssignedShiftCard'
import { GroupedShiftsRenderer } from './GroupedShiftsRenderer'
import { fetchAssignedRequests, AssignedShift, fetchUpcomingShifts, UpcomingShift } from '@/lib/api'
import { 
  Briefcase,
  Calendar,
  XCircle,
  AlertCircle,
  Loader2
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

type ShiftStatus = 'assigned' | 'upcoming' | 'cancel'

export function MyShiftsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<ShiftStatus>('assigned')
  const [shifts, setShifts] = useState<Record<ShiftStatus, Shift[]>>({
    assigned: [],
    upcoming: [],
    cancel: []
  })
  const [isLoading, setIsLoading] = useState<Record<ShiftStatus, boolean>>({
    assigned: true,
    upcoming: false,
    cancel: false
  })
  const [error, setError] = useState<Record<ShiftStatus, string | null>>({
    assigned: null,
    upcoming: null,
    cancel: null
  })

  useEffect(() => {
    fetchShifts(activeTab)
  }, [activeTab])

  const fetchShifts = async (status: ShiftStatus) => {
    // Skip if already loaded
    if (shifts[status].length > 0 && !error[status]) {
      return
    }

    setIsLoading(prev => ({ ...prev, [status]: true }))
    setError(prev => ({ ...prev, [status]: null }))

    try {
      // Use new API for assigned shifts
      if (status === 'assigned') {
        const response = await fetchAssignedRequests()

        if (response.data && Array.isArray(response.data)) {
          // Transform API data to match Shift interface
          const transformedShifts: Shift[] = response.data.map((shift: AssignedShift) => ({
            id: shift.id,
            date: shift.date,
            from: shift.from,
            to: shift.to,
            hours: shift.hours,
            pharmacy_name: shift.pharmacy || shift.addres?.title || 'N/A',
            pharmacy_address: shift.address || shift.addres?.address || 'N/A',
            city: shift.addres?.city || 'N/A',
            district: 'N/A', // District info not in assigned API response
            total: shift.total,
            earning: shift.total, // Using total as earning
            status: 'assigned',
            accepted: shift.applied || false // Track acceptance status
          }))

          setShifts(prev => ({
            ...prev,
            [status]: transformedShifts
          }))
        } else {
          // Empty response - no assigned shifts
          setShifts(prev => ({
            ...prev,
            [status]: []
          }))
        }
      } else if (status === 'upcoming') {
        // Use new API for upcoming shifts
        const response = await fetchUpcomingShifts()

        console.log('Upcoming shifts API response:', response);

        // Handle both response formats: { status, data } or just { data }
        const shiftsData = response.data || (response as any).data;
        const hasData = Array.isArray(shiftsData) && shiftsData.length > 0;

        if (hasData) {
          console.log('Raw upcoming shifts data:', shiftsData);
          
          // Filter for upcoming shifts based on:
          // 1. status (should be active/confirmed)
          // 2. date > now()
          // 3. assigned or applied flags
          const now = new Date();
          now.setHours(0, 0, 0, 0); // Set to start of today for proper comparison
          
          const filteredShifts = shiftsData.filter((shift: UpcomingShift) => {
            // Check if date is in the future (including today)
            // Parse YYYY-MM-DD format directly
            const shiftDate = new Date(shift.date);
            shiftDate.setHours(0, 0, 0, 0); // Set to start of day for proper comparison
            const isFutureDate = shiftDate >= now;
            
            // Check if shift is assigned or applied
            const isAssignedOrApplied = shift.assigned > 0 || shift.applied;
            
            console.log(`Shift ${shift.id}: date=${shift.date}, isFutureDate=${isFutureDate}, assigned=${shift.assigned}, applied=${shift.applied}, isAssignedOrApplied=${isAssignedOrApplied}`);
            
            return isFutureDate && isAssignedOrApplied;
          });

          console.log('Filtered upcoming shifts:', filteredShifts);

          // Transform API data to match Shift interface
          const transformedShifts: Shift[] = filteredShifts.map((shift: UpcomingShift) => ({
            id: shift.id,
            date: shift.date,
            from: shift.from,
            to: shift.to,
            hours: shift.hours,
            pharmacy_name: shift.pharmacy || shift.addres?.title || 'N/A',
            pharmacy_address: shift.address || shift.addres?.address || 'N/A',
            city: shift.addres?.city || 'N/A',
            district: 'N/A', // District info not in upcoming API response
            total: shift.total,
            earning: shift.total, // Using total as earning
            status: 'upcoming'
          }))

          console.log('Transformed upcoming shifts:', transformedShifts);

          setShifts(prev => ({
            ...prev,
            [status]: transformedShifts
          }))
        } else {
          console.log('No upcoming shifts data or invalid response');
          // Empty response - no upcoming shifts
          setShifts(prev => ({
            ...prev,
            [status]: []
          }))
        }
      } else {
        // Use existing mock API for cancel tab
        const response = await fetch(`/api/shifts/my-shifts?status=${status}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch shifts')
        }

        if (data.success) {
          setShifts(prev => ({
            ...prev,
            [status]: data.data || []
          }))
        }
      }
    } catch (err) {
      console.error(`Error fetching ${status} shifts:`, err)
      const errorMessage = err instanceof Error ? err.message : `Failed to load ${status} shifts`
      
      // Check if it's an authentication error
      if (errorMessage.includes('authentication') || errorMessage.includes('login')) {
        // Redirect to login handled by apiRequest in api.ts
        setError(prev => ({
          ...prev,
          [status]: 'Please login to view your shifts'
        }))
      } else {
        setError(prev => ({
          ...prev,
          [status]: errorMessage
        }))
      }
    } finally {
      setIsLoading(prev => ({ ...prev, [status]: false }))
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value as ShiftStatus)
  }

  const renderEmptyState = (status: ShiftStatus) => {
    const emptyStateConfig = {
      assigned: {
        icon: Briefcase,
        title: 'No Assigned Shifts',
        description: 'You don\'t have any assigned shifts at the moment.'
      },
      upcoming: {
        icon: Calendar,
        title: 'No Upcoming Shifts',
        description: 'You don\'t have any upcoming shifts scheduled.'
      },
      cancel: {
        icon: XCircle,
        title: 'No Cancelled Shifts',
        description: 'You don\'t have any cancelled shifts.'
      }
    }

    const config = emptyStateConfig[status]
    const Icon = config.icon

    return (
      <Card className="text-center py-12">
        <CardContent>
          <Icon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{config.title}</h3>
          <p className="text-gray-600">{config.description}</p>
        </CardContent>
      </Card>
    )
  }

  const renderErrorState = (status: ShiftStatus) => {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <AlertCircle className="h-16 w-16 text-red-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Shifts</h3>
          <p className="text-gray-600 mb-4">{error[status]}</p>
          <Button onClick={() => fetchShifts(status)} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  const renderLoadingState = () => {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading shifts...</span>
      </div>
    )
  }

  const renderShifts = (status: ShiftStatus) => {
    if (isLoading[status]) {
      return renderLoadingState()
    }

    if (error[status]) {
      return renderErrorState(status)
    }

    if (shifts[status].length === 0) {
      return renderEmptyState(status)
    }

    // For upcoming tab, render grouped shifts
    if (status === 'upcoming') {
      return <GroupedShiftsRenderer shifts={shifts[status]} />;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shifts[status].map((shift) => (
          status === 'assigned' ? (
            <AssignedShiftCard 
              key={shift.id} 
              shift={shift}
              onAcceptSuccess={() => fetchShifts('assigned')}
              onCancelSuccess={() => fetchShifts('assigned')}
            />
          ) : (
            <ShiftCard key={shift.id} shift={shift} />
          )
        ))}
      </div>
    )
  }

  const getTabCount = (status: ShiftStatus) => {
    return shifts[status].length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Shifts</h1>
            <p className="text-gray-600">Manage and view all your pharmacy shifts</p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
              <TabsTrigger value="assigned" className="relative">
                Assigned
                {getTabCount('assigned') > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {getTabCount('assigned')}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="relative">
                Upcoming
                {getTabCount('upcoming') > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    {getTabCount('upcoming')}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="cancel" className="relative">
                Cancelled
                {getTabCount('cancel') > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                    {getTabCount('cancel')}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="assigned" className="mt-6">
              {renderShifts('assigned')}
            </TabsContent>

            <TabsContent value="upcoming" className="mt-6">
              {renderShifts('upcoming')}
            </TabsContent>

            <TabsContent value="cancel" className="mt-6">
              {renderShifts('cancel')}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
