'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Bell,
  User,
  ChevronRight
} from 'lucide-react'

interface HeaderProps {
  userName?: string
  userRole?: string
  profileCompletion?: number
  onProfileClick?: () => void
  onSettingsClick?: () => void
  onLogoutClick?: () => void
}

export function Header({ 
  userName = 'Sarah Johnson',
  userRole = 'Pharmacist',
  profileCompletion = 85,
  onProfileClick,
  onSettingsClick,
  onLogoutClick 
}: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleLogout = () => {
    if (onLogoutClick) {
      onLogoutClick()
    }
    // In a real app, this would handle logout logic
    console.log('Logging out...')
    window.location.href = '/'
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Bell className="h-5 w-5 text-gray-600 cursor-pointer" />
                {showNotifications && (
                  <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                    3
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Welcome back, {userName}!
                </h1>
                <p className="text-sm text-gray-600">{userRole}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={onProfileClick}
              className="p-2"
            >
              <User className="h-4 w-4" />
              Profile
            </Button>
            <Button
              variant="ghost"
              onClick={onSettingsClick}
              className="p-2"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span className="text-sm text-gray-500">
                {currentTime.toLocaleString('en-US', { 
                  weekday: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="flex-1">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
              Profile {profileCompletion}% Complete
            </div>
          </div>
          <div className="flex-1 text-right">
            <Button
              variant="ghost"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}