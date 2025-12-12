import { Metadata } from 'next'
import { LanguagesPage } from '@/components/registration/LanguagesPage'

export const metadata: Metadata = {
  title: 'Languages - Healthcare Professional Registration',
  description: 'Select languages you speak',
}

export default function LanguagesPage() {
  return <LanguagesPage />
}