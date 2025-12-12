import { Metadata } from 'next'
import { ShiftBookingPage } from '@/components/shifts/ShiftBookingPage'

export const metadata: Metadata = {
  title: 'Pharmacy Shifts - Healthcare Professional Portal',
  description: 'Browse and apply for pharmacy shifts in your area',
}

export default function ShiftsPage() {
  return <ShiftBookingPage />
}