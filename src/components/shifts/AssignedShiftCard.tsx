'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { acceptAssignedShift, cancelAcceptedShift } from '@/lib/api'
import { 
  Calendar,
  Clock,
  MapPin,
  Building,
  DollarSign,
  ChevronRight,
  CheckCircle,
  Loader2,
  XCircle
} from 'lucide-react'

interface AssignedShiftCardProps {
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
    accepted?: boolean
    cancelled?: boolean
  }
  onAcceptSuccess?: () => void
  onCancelSuccess?: () => void
}

export function AssignedShiftCard({ shift, onAcceptSuccess, onCancelSuccess }: AssignedShiftCardProps) {
  const { toast } = useToast()
  const [isAccepting, setIsAccepting] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [isAccepted, setIsAccepted] = useState(shift.accepted || false)
  const [isCancelled, setIsCancelled] = useState(shift.cancelled || false)

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

  const handleAcceptShift = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation when clicking button
    e.stopPropagation()

    setIsAccepting(true)

    try {
      const response = await acceptAssignedShift(shift.id)

      if (response.status) {
        setIsAccepted(true)
        toast({
          title: 'Shift Accepted Successfully',
          description: response.message || 'You have accepted this assigned shift.',
        })

        // Refresh the assigned shifts list
        if (onAcceptSuccess) {
          onAcceptSuccess()
        }
      } else {
        throw new Error(response.message || 'Failed to accept shift')
      }
    } catch (err) {
      console.error('Error accepting shift:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to accept shift'
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsAccepting(false)
    }
  }

  const handleCancelShift = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation when clicking button
    e.stopPropagation()

    setIsCancelling(true)

    try {
      const response = await cancelAcceptedShift(shift.id)

      if (response.status) {
        setIsCancelled(true)
        setIsAccepted(false) // Mark as no longer accepted
        toast({
          title: 'Shift Cancelled Successfully',
          description: response.message || 'You have cancelled this shift.',
        })

        // Refresh the assigned shifts list
        if (onCancelSuccess) {
          onCancelSuccess()
        }
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
      setIsCancelling(false)
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4">
        <Link href={`/shifts/${shift.id}`}>
          <div className="cursor-pointer">
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
                {isCancelled ? (
                  <Badge className="bg-red-100 text-red-800 border-red-200">
                    <XCircle className="h-3 w-3 mr-1" />
                    Cancelled
                  </Badge>
                ) : isAccepted ? (
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Accepted
                  </Badge>
                ) : (
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    Pending Acceptance
                  </Badge>
                )}
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
          </div>
        </Link>

        {/* Action Buttons */}
        {!isCancelled && (
          <div className="mt-4 pt-4 border-t">
            {!isAccepted ? (
              // Accept Button - Only shown if not accepted
              <Button
                onClick={handleAcceptShift}
                disabled={isAccepting}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {isAccepting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Accepting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accept Shift
                  </>
                )}
              </Button>
            ) : (
              // Cancel Button - Only shown if accepted
              <Button
                onClick={handleCancelShift}
                disabled={isCancelling}
                variant="destructive"
                className="w-full"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Shift
                  </>
                )}
              </Button>
            )}
          </div>
        )}

        {/* Cancelled Confirmation */}
        {isCancelled && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-center gap-2 text-red-700 bg-red-50 py-3 rounded-lg">
              <XCircle className="h-5 w-5" />
              <span className="font-medium">Shift Cancelled Successfully</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
