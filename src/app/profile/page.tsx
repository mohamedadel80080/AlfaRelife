import { Metadata } from 'next'
import { ProfileView } from '@/components/profile/ProfileView'

export const metadata: Metadata = {
  title: 'Profile - Healthcare Professional Portal',
  description: 'View and manage your healthcare professional profile',
}

export default function ProfilePage() {
  return <ProfileView />
}