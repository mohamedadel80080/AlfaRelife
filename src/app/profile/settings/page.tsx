import { Metadata } from 'next'
import { SettingsForm } from '@/components/profile/SettingsForm'

export const metadata: Metadata = {
  title: 'Account Settings - Healthcare Professional Portal',
  description: 'Manage your account settings and preferences',
}

export default function SettingsPage() {
  return <SettingsForm />
}