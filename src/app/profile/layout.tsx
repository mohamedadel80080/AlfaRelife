import { ReactNode } from 'react'
import { ProfileNav } from '@/components/profile/ProfileNav'

export default function ProfileLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <ProfileNav />
          <div className="mt-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}