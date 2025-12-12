import { Metadata } from 'next'
import { EditProfileForm } from '@/components/profile/EditProfileForm'

export const metadata: Metadata = {
  title: 'Edit Profile - Healthcare Professional Portal',
  description: 'Edit your healthcare professional profile information',
}

export default function EditProfilePage() {
  return <EditProfileForm />
}