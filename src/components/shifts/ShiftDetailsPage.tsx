'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { 
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  Building,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  CheckCircle,
  Send
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { acceptPharmacyOffer, sendPharmacistOffer, cancelAcceptedShift } from '@/lib/api'
import { ShiftLocationMap } from '@/components/maps/ShiftLocationMap'

interface ShiftDetailsPageProps {
  shiftId: string
}

interface Shift {
  id: number
  date: string
  from: string
  to: string
  hours: number
  address: string
  lat: string
  lng: string
  city: string
  district_id: number
  district: {
    id: number
    name: string
    tax: number
  }
  pharmacy_id: number
  pharmacy: {
    id: number
    title: string
    email: string
    phone: string
    address: string
    logo: string
    cover: string
    city: string
  }
  hour_rate: number
  mileage: number
  house: number
  earning: number
  profit: number
  tax: number
  total: number
  comments: string | null
  applied: boolean
  applied_at: string | null
  applied_msg: string | null
  languages: Array<{ id: number; title: string; selected: boolean }>
  skills: Array<{ id: number; title: string; selected: boolean }>
  softwares: Array<{ id: number; title: string; selected: boolean }>
  addres: {
    id: number
    title: string
    phone: string
    city: string
    postcode: string
  }
}

export function ShiftDetailsPage({ shiftId }: ShiftDetailsPageProps) {
  const router = useRouter()
  const [shift, setShift] = useState<Shift | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAccepting, setIsAccepting] = useState(false)
  const [isSendingOffer, setIsSendingOffer] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false)
  
  const [offerData, setOfferData] = useState({
    mileage: '',
    house: '',
    hour_rate: '',
    comment: ''
  })

  useEffect(() => {
    fetchShiftDetails()
  }, [shiftId])

  const fetchShiftDetails = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/shifts/${shiftId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch shift details')
      }

      if (data.success && data.data) {
        setShift(data.data)
      }
    } catch (err) {
      console.error('Error fetching shift details:', err)
      setError('Failed to load shift details')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAcceptPharmacyOffer = async () => {
    if (!shift) return

    setIsAccepting(true)
    try {
      const response = await acceptPharmacyOffer(shift.id)

      if (response.success) {
        toast({
          title: 'Success!',
          description: response.message || 'Pharmacy offer accepted successfully',
        })
        // Refresh shift details
        fetchShiftDetails()
      } else {
        throw new Error(response.message || 'Failed to accept offer')
      }
    } catch (err) {
      console.error('Error accepting offer:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to accept pharmacy offer'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsAccepting(false)
    }
  }

  const handleSendPharmacistOffer = async () => {
    if (!shift) return

    setIsSendingOffer(true)
    try {
      // Parse and prepare offer data - only include fields that have values
      const offerPayload: {
        mileage?: number
        house?: number
        hour_rate?: number
        comment?: string
      } = {}

      if (offerData.mileage && offerData.mileage.trim() !== '') {
        offerPayload.mileage = parseFloat(offerData.mileage)
      }
      if (offerData.house && offerData.house.trim() !== '') {
        offerPayload.house = parseFloat(offerData.house)
      }
      if (offerData.hour_rate && offerData.hour_rate.trim() !== '') {
        offerPayload.hour_rate = parseFloat(offerData.hour_rate)
      }
      if (offerData.comment && offerData.comment.trim() !== '') {
        offerPayload.comment = offerData.comment
      }

      const response = await sendPharmacistOffer(shift.id, offerPayload)

      if (response.success) {
        toast({
          title: 'Success!',
          description: response.message || 'Your offer has been sent to the pharmacy',
        })
        setIsOfferDialogOpen(false)
        setOfferData({ mileage: '', house: '', hour_rate: '', comment: '' })
        // Refresh shift details
        fetchShiftDetails()
      } else {
        throw new Error(response.message || 'Failed to send offer')
      }
    } catch (err) {
      console.error('Error sending offer:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to send your offer'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsSendingOffer(false)
    }
  }

  const handleCancelShift = async () => {
    if (!shift) return

    setIsCancelling(true)
    try {
      const response = await cancelAcceptedShift(shift.id)

      if (response.status) {
        toast({
          title: 'Success!',
          description: response.message || 'Shift cancelled successfully',
        })
        // Refresh shift details
        fetchShiftDetails()
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
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour)
    return `${displayHour}:${minutes} ${period}`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading shift details...</span>
      </div>
    )
  }

  if (error || !shift) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Shift</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Button variant="outline" onClick={() => router.back()} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shifts
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Shift Details</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shift Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Shift Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Date</p>
                      <p className="text-lg font-semibold">{formatDate(shift.date)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Time</p>
                      <p className="text-lg font-semibold">
                        {formatTime(shift.from)} - {formatTime(shift.to)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Duration</p>
                      <p className="text-lg font-semibold">{shift.hours} hours</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">City</p>
                      <p className="text-lg font-semibold">{shift.city}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium text-gray-600 mb-2">Address</p>
                    <p className="text-gray-800">{shift.address}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Pharmacy Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Pharmacy Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4 mb-4">
                    {shift.pharmacy.logo && (
                      <img 
                        src={shift.pharmacy.logo} 
                        alt={shift.pharmacy.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{shift.pharmacy.title}</h3>
                      <p className="text-gray-600">{shift.pharmacy.city}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">{shift.pharmacy.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">{shift.pharmacy.email}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium text-gray-600 mb-1">Address</p>
                    <p className="text-gray-800">{shift.pharmacy.address}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Map Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ShiftLocationMap 
                    lat={shift.lat} 
                    lng={shift.lng} 
                    address={shift.address}
                  />
                </CardContent>
              </Card>

              {/* Requirements Cards */}
              {shift.languages.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Required Languages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {shift.languages.map((lang) => (
                        <Badge key={lang.id} variant="secondary">
                          {lang.title}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {shift.skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Required Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {shift.skills.map((skill) => (
                        <Badge key={skill.id} variant="secondary">
                          {skill.title}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {shift.softwares.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Required Software</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {shift.softwares.map((software) => (
                        <Badge key={software.id} variant="secondary">
                          {software.title}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Earnings Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Earnings Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hour Rate:</span>
                    <span className="font-semibold">${shift.hour_rate}/hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mileage:</span>
                    <span className="font-semibold">${shift.mileage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">House:</span>
                    <span className="font-semibold">${shift.house}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Earning:</span>
                    <span className="font-semibold">${shift.earning}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Profit:</span>
                    <span className="font-semibold">${shift.profit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-semibold">${shift.tax}</span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Total:</span>
                      <span className="text-2xl font-bold text-blue-600">${shift.total}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {!shift.applied ? (
                    // Pharmacist has NOT submitted an offer - show default buttons
                    <>
                      <Button 
                        onClick={handleAcceptPharmacyOffer}
                        disabled={isAccepting}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        {isAccepting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Accepting...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Accept Pharmacy Offer
                          </>
                        )}
                      </Button>

                      <Dialog open={isOfferDialogOpen} onOpenChange={setIsOfferDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full">
                            <Send className="h-4 w-4 mr-2" />
                            Send Pharmacist Offer
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Send Your Offer</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="mileage">Mileage</Label>
                              <Input
                                id="mileage"
                                type="number"
                                placeholder="0"
                                value={offerData.mileage}
                                onChange={(e) => setOfferData({ ...offerData, mileage: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="house">House</Label>
                              <Input
                                id="house"
                                type="number"
                                placeholder="0"
                                value={offerData.house}
                                onChange={(e) => setOfferData({ ...offerData, house: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="hour_rate">Hour Rate</Label>
                              <Input
                                id="hour_rate"
                                type="number"
                                placeholder="0"
                                value={offerData.hour_rate}
                                onChange={(e) => setOfferData({ ...offerData, hour_rate: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="comment">Comment (Optional)</Label>
                              <Textarea
                                id="comment"
                                placeholder="Add any comments..."
                                value={offerData.comment}
                                onChange={(e) => setOfferData({ ...offerData, comment: e.target.value })}
                                rows={3}
                              />
                            </div>
                            <Button 
                              onClick={handleSendPharmacistOffer}
                              disabled={isSendingOffer}
                              className="w-full"
                            >
                              {isSendingOffer ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Sending...
                                </>
                              ) : (
                                <>
                                  <Send className="h-4 w-4 mr-2" />
                                  Send Offer
                                </>
                              )}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </>
                  ) : (
                    // Pharmacist has submitted an offer - show Cancel Shift button
                    <Button 
                      onClick={handleCancelShift}
                      disabled={isCancelling}
                      variant="destructive"
                      className="w-full"
                    >
                      {isCancelling ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Cancel Shift
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* District Info */}
              <Card>
                <CardHeader>
                  <CardTitle>District Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">District:</span>
                      <span className="font-semibold">{shift.district.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax Rate:</span>
                      <span className="font-semibold">{shift.district.tax}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
