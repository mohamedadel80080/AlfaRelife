'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Clock,
  CheckCircle,
  TrendingUp,
  Users,
  Briefcase,
  AlertCircle,
  RefreshCw
} from 'lucide-react'

interface Activity {
  id: string
  type: 'application' | 'profile_update' | 'registration_complete' | 'shift_applied'
  title: string
  description: string
  timestamp: string
  icon: React.ReactNode
}

interface ActivityFeedProps {
  activities?: Activity[]
}

export function ActivityFeed({ activities = [] }: ActivityFeedProps) {
  const [isLoading, setIsLoading] = useState(false)

  // Mock activities data
  const mockActivities: Activity[] = [
    {
      id: '1',
      type: 'application',
      title: 'Applied for Downtown Pharmacy shift',
      description: 'Submitted application for evening shift position',
      timestamp: '2024-01-15T14:30:00Z',
      icon: <Briefcase className="h-4 w-4" />
    },
    {
      id: '2',
      type: 'profile_update',
      title: 'Profile information updated',
      description: 'Updated professional license and contact information',
      timestamp: '2024-01-14T09:15:00Z',
      icon: <Users className="h-4 w-4" />
    },
    {
      id: '3',
      type: 'registration_complete',
      title: 'Registration completed successfully',
      description: 'Completed all registration steps and profile setup',
      timestamp: '2024-01-13T16:45:00Z',
      icon: <CheckCircle className="h-4 w-4 text-green-600" />
    },
    {
      id: '4',
      type: 'shift_applied',
      title: 'Applied for Rivershore Medical Clinic',
      description: 'Quick application submitted for morning shift',
      timestamp: '2024-01-16T08:00:00Z',
      icon: <Briefcase className="h-4 w-4" />
    },
    {
      id: '5',
      type: 'application',
      title: 'Applied for General Hospital',
      description: 'Applied for afternoon shift with premium rate',
      timestamp: '2024-01-16T14:30:00Z',
      icon: <Briefcase className="h-4 w-4" />
    }
  ]

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      if (activities.length === 0) {
        setIsLoading(true)
        setTimeout(() => {
          // In real app, this would be an API call
          // For now, just set the mock data
          activities.unshift(...mockActivities)
          setIsLoading(false)
        }, 1000)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [activities])

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'application':
        return <Briefcase className="h-4 w-4 text-blue-600" />
      case 'profile_update':
        return <Users className="h-4 w-4 text-green-600" />
      case 'registration_complete':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'shift_applied':
        return <Briefcase className="h-4 w-4 text-orange-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'application':
        return 'border-blue-200 bg-blue-50'
      case 'profile_update':
        return 'border-green-200 bg-green-50'
      case 'registration_complete':
        return 'border-green-200 bg-green-50'
      case 'shift_applied':
        return 'border-orange-200 bg-orange-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading activity...</span>
      </div>
    )
  }

  const displayActivities = activities.length > 0 ? activities : mockActivities

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
          <Badge variant="secondary" className="ml-2">
            {displayActivities.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayActivities.map((activity, index) => (
            <div
              key={activity.id}
              className={`p-4 border rounded-lg ${getActivityColor(activity.type)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {displayActivities.length === 0 && (
          <div className="text-center py-8">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <AlertCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Activity</h3>
              <p className="text-gray-600 mb-4">
                Your recent activities will appear here once you start applying for shifts and updating your profile.
              </p>
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                className="mt-4"
              >
                Refresh
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}