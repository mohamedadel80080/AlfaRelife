import { Metadata } from 'next'
import { ChangePasswordForm } from '@/components/profile/ChangePasswordForm'

export const metadata: Metadata = {
  title: 'Change Password - Healthcare Professional Portal',
  description: 'Change your account password',
}

export default function ChangePasswordPage() {
  return <ChangePasswordForm />
}