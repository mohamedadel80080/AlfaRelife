'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/dashboard/Header'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { AvailableShifts } from '@/components/dashboard/AvailableShifts'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Home,
  TrendingUp,
  Users,
  Calendar,
  DollarSign
} from 'lucide-react'

interface HomeScreenProps {
  userName?: string
  userRole?: string
  profileCompletion?: number
}

export default function HomeScreen({ 
  userName = 'Sarah Johnson',
  userRole = 'Pharmacist',
  profileCompletion = 85
}: HomeScreenProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'shifts' | 'activity'>('overview')

  // Mock data for the dashboard
  const [stats, setStats] = useState({
    activeShifts: 5,
    applicationsSent: 3,
    profileCompletion: 85
  })

  const [activities, setActivities] = useState([])

  const handleProfileClick = () => {
    setActiveTab('overview')
  }

  const handleShiftsClick = () => {
    setActiveTab('shifts')
  }

  const handleActivityClick = () => {
    setActiveTab('activity')
  }

  const handleLogout = () => {
    // In a real app, this would handle logout
    console.log('Logging out...')
    window.location.href = '/'
  }

  if (activeTab === 'overview') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          userName={userName}
          userRole={userRole}
          profileCompletion={profileCompletion}
          onProfileClick={handleProfileClick}
          onSettingsClick={() => {}}
          onLogoutClick={handleLogout}
        />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Welcome Section */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-blue-900 mb-2">
                    Welcome back, {userName}! 👋
                  </h1>
                  <p className="text-gray-600 mb-4">
                    Here's what's happening with your professional profile and shift applications today.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <StatsCard
                title="Active Shifts"
                value={stats.activeShifts}
                icon={<Users className="h-6 w-6" />}
                color="text-blue-600"
                trend="up"
              />
              <StatsCard
                title="Applications Sent"
                value={stats.applicationsSent}
                icon={<Calendar className="h-6 w-6" />}
                color="text-green-600"
                trend="up"
              />
              <StatsCard
                title="Profile Completion"
                value={`${stats.profileCompletion}%`}
                icon={<DollarSign className="h-6 w-6" />}
                color="text-purple-600"
                trend="up"
              />
            </div>

            {/* Quick Actions */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <QuickActions
                  onProfileClick={handleProfileClick}
                  onSettingsClick={() => {}}
                  onLogoutClick={handleLogout}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (activeTab === 'shifts') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          userName={userName}
          userRole={userRole}
          profileCompletion={profileCompletion}
          onProfileClick={handleProfileClick}
          onSettingsClick={() => {}}
          onLogoutClick={handleLogout}
        />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <AvailableShifts onQuickApply={(shiftId) => {
              console.log('Quick apply to shift:', shiftId)
            }} />
          </div>
        </div>
      </div>
    )
  }

  if (activeTab === 'activity') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          userName={userName}
          userRole={userRole}
          profileCompletion={profileCompletion}
          onProfileClick={handleProfileClick}
          onSettingsClick={() => {}}
          onLogoutClick={handleLogout}
        />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <ActivityFeed activities={activities} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        userName={userName}
        userRole={userRole}
        profileCompletion={profileCompletion}
        onProfileClick={handleProfileClick}
        onSettingsClick={() => {}}
        onLogoutClick={handleLogout}
      />
        
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-lg shadow-sm p-1 inline-flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-l-lg font-medium transition-colors ${
                  activeTab === 'overview' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <Home className="h-4 w-4 mr-2" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('shifts')}
                className={`px-4 py-2 rounded-l-lg font-medium transition-colors ${
                  activeTab === 'shifts' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Shifts
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`px-4 py-2 rounded-l-lg font-medium transition-colors ${
                  activeTab === 'activity' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Activity
              </button>
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <StatsCard
                  title="Active Shifts"
                  value={stats.activeShifts}
                  icon={<Users className="h-6 w-6" />}
                  color="text-blue-600"
                  trend="up"
                />
                <StatsCard
                  title="Applications Sent"
                  value={stats.applicationsSent}
                  icon={<Calendar className="h-6 w-6" />}
                  color="text-green-600"
                  trend="up"
                />
                <StatsCard
                  title="Profile Completion"
                  value={`${stats.profileCompletion}%`}
                  icon={<DollarSign className="h-6 w-6" />}
                  color="text-purple-600"
                  trend="up"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <StatsCard
                  title="Total Earnings"
                  value="$12,450"
                  icon={<DollarSign className="h-6 w-6" />}
                  color="text-green-600"
                  trend="up"
                />
                <StatsCard
                  title="Hours Worked"
                  value="156"
                  icon={<Calendar className="h-6 w-6" />}
                  color="text-blue-600"
                />
                <StatsCard
                  title="Avg Hourly Rate"
                  value="$65.50"
                  icon={<DollarSign className="h-6 w-6" />}
                  color="text-purple-600"
                />
              </div>

              <QuickActions
                onProfileClick={handleProfileClick}
                onSettingsClick={() => {}}
                onLogoutClick={handleLogout}
              />
            </div>
          </div>
        )}

        {activeTab === 'shifts' && (
          <AvailableShifts onQuickApply={(shiftId) => {
              console.log('Quick apply to shift:', shiftId)
            }} />
        )}

        {activeTab === 'activity' && (
          <ActivityFeed activities={activities} />
        )}
      </div>
    </div>
  )
}