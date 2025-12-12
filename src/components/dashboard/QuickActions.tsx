'use client'

import { Button } from '@/components/ui/button'
import { 
  Home,
  User,
  Settings,
  LogOut,
  ExternalLink
} from 'lucide-react'

interface QuickActionsProps {
  onProfileClick?: () => void
  onSettingsClick?: () => void
  onLogoutClick?: () => void
}

export function QuickActions({ 
  onProfileClick, 
  onSettingsClick, 
  onLogoutClick 
}: QuickActionsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Button
        variant="outline"
        onClick={onProfileClick}
        className="w-full justify-start"
      >
        <User className="h-4 w-4 mr-2" />
        View Profile
      </Button>
      
      <Button
        variant="outline"
        onClick={onSettingsClick}
        className="w-full justify-start"
      >
        <Settings className="h-4 w-4 mr-2" />
        Settings
      </Button>
      
      <Button
        variant="outline"
        onClick={onLogoutClick}
        className="w-full justify-start text-red-600 hover:text-red-700"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
      
      <Button
        variant="outline"
        className="w-full justify-start"
      >
        <ExternalLink className="h-4 w-4 mr-2" />
        Browse Shifts
      </Button>
    </div>
  )
}