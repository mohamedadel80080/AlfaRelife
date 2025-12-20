import { Metadata } from 'next'
import { BankAccountForm } from '@/components/profile/BankAccountForm'

export const metadata: Metadata = {
  title: 'Bank Account - Profile',
  description: 'Manage your bank account information',
}

export default function BankAccountPage() {
  return <BankAccountForm />
}
