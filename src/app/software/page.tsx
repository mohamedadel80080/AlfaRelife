import { Metadata } from 'next'
import { SoftwarePage } from '@/components/registration/SoftwarePage'

export const metadata: Metadata = {
  title: 'Software - Healthcare Professional Registration',
  description: 'Select software you are experienced with',
}

export default function SoftwarePage() {
  return <SoftwarePage />
}