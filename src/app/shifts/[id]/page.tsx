import { Metadata } from 'next'
import { ShiftDetailsPage } from '@/components/shifts/ShiftDetailsPage'

export const metadata: Metadata = {
  title: 'Shift Details - Healthcare Professional Portal',
  description: 'View detailed information about pharmacy shift',
}

export default function ShiftPage({ params }: { params: { id: string } }) {
  return <ShiftDetailsPage shiftId={params.id} />
}
