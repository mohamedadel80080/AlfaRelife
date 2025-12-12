import { Metadata } from 'next'
import { ShiftBookingPage } from '@/components/shifts/ShiftBookingPage'

export const metadata: Metadata = {
  title: 'Alfa Relief - Healthcare Professional Portal',
  description: 'Browse and apply for Alfa Relief shifts in your area',
}

export default function ShiftsPage() {
  return <ShiftBookingPage />
}