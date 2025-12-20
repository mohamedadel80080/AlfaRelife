'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  User, 
  Edit, 
  Lock, 
  Settings, 
  Home,
  ChevronRight,
  CreditCard
} from 'lucide-react'

const profileNavItems = [
  {
    href: '/profile',
    label: 'View Profile',
    icon: User,
    description: 'View your profile information'
  },
  {
    href: '/profile/edit',
    label: 'Edit Profile',
    icon: Edit,
    description: 'Update your personal and professional details'
  },
  {
    href: '/profile/bank-account',
    label: 'Bank Account',
    icon: CreditCard,
    description: 'Manage your bank account information'
  },
  {
    href: '/profile/password',
    label: 'Change Password',
    icon: Lock,
    description: 'Update your account password'
  },
  {
    href: '/profile/settings',
    label: 'Account Settings',
    icon: Settings,
    description: 'Manage languages, skills, and preferences'
  }
]

export function ProfileNav() {
  const pathname = usePathname()

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile Management</h1>
            <p className="text-gray-600 mt-1">Manage your healthcare professional profile</p>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <nav className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {profileNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    'flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer',
                    isActive
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  )}
                >
                  <Icon className="h-6 w-6 mb-2" />
                  <span className="font-medium text-sm text-center">{item.label}</span>
                  <ChevronRight className={cn(
                    'h-4 w-4 mt-2 transition-transform duration-200',
                    isActive ? 'text-blue-600' : 'text-gray-400'
                  )} />
                </div>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}