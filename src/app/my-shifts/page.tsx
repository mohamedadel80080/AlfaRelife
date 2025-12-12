import { Metadata } from 'next'
import { MyShiftsPage } from '@/components/shifts/MyShiftsPage'

export const metadata: Metadata = {
  title: 'My Shifts - Healthcare Professional Portal',
  description: 'View and manage your pharmacy shifts',
}

export default function MyShifts() {
  return <MyShiftsPage />
}
