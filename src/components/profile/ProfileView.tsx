'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Building, 
  Calendar,
  Edit,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Lock,
  Settings
} from 'lucide-react'
import { HealthcareProfessional } from '@/types/profile'
import { useProfile } from '@/hooks/useProfile'
import { format } from 'date-fns'

export function ProfileView() {
  const { profile, isLoading, error } = useProfile()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading profile...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Profile</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <div className="space-y-2">
          <Button onClick={refetch} className="bg-blue-600 hover:bg-blue-700 text-white">
            <User className="h-4 w-4 mr-2" />
            Retry Loading Profile
          </Button>
          <Button variant="outline" onClick={clearError} className="ml-2">
            Dismiss Error
          </Button>
        </div>
        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left">
          <h4 className="font-medium text-gray-900 mb-2">Troubleshooting Tips:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Check your internet connection</li>
            <li>• Try refreshing the page</li>
            <li>• Clear your browser cache</li>
            <li>• Contact support if the issue persists</li>
          </ul>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Profile Found</h3>
        <p className="text-gray-600">Please complete your registration first.</p>
      </div>
    )
  }

  const formatDate = (date: Date | string | null | undefined, fallback: string = 'N/A') => {
    if (!date) return fallback
    
    try {
      const dateObj = new Date(date)
      // Check if date is valid
      if (isNaN(dateObj.getTime())) {
        return fallback
      }
      return format(dateObj, 'MMMM dd, yyyy')
    } catch (error) {
      console.error('Date formatting error:', error)
      return fallback
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800"><Clock className="h-3 w-3 mr-1" />Inactive</Badge>
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="h-3 w-3 mr-1" />Suspended</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage 
                  src={profile?.profileImage || '/api/placeholder/80/80'} 
                  alt="Profile" 
                  onError={(e) => {
                    console.error('Profile image failed to load:', e)
                    const target = e.target as HTMLImageElement
                    target.src = '/api/placeholder/80/80'
                  }}
                />
                <AvatarFallback className="text-lg">
                  {profile?.firstName?.charAt(0).toUpperCase() || 'P'}
                  {profile?.lastName?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile?.firstName || 'Unknown'} {profile?.lastName || 'User'}
                </h2>
                <p className="text-gray-600">{profile?.position || 'Not specified'}</p>
                <div className="flex items-center gap-2 mt-2">
                  {getStatusBadge(profile?.status || 'inactive')}
                  {profile?.isVerified && (
                    <Badge className="bg-blue-100 text-blue-800">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" asChild>
                <a href="/profile/edit">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <p className="text-gray-900">
                  {profile?.firstName || 'Unknown'} {profile?.lastName || 'User'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email Address</label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <p className="text-gray-900">{profile?.email || 'Not provided'}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone Number</label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <p className="text-gray-900">{profile?.phone || 'Not provided'}</p>
                  {profile.phoneVerified && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Address</label>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <p className="text-gray-900">{profile.address}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">City & Province</label>
                <p className="text-gray-900">{profile.city}, {profile.province}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Postal Code</label>
                <p className="text-gray-900">{profile.postcode}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Professional Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Position</label>
                <p className="text-gray-900">{profile.position}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Licence Number</label>
                <p className="text-gray-900">{profile.licence}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Years of Experience</label>
                <p className="text-gray-900">{profile.experience || 'Not specified'}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Business Name</label>
                <p className="text-gray-900">{profile?.businessName || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Business Type</label>
                <p className="text-gray-900">{profile.businessType || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">GST Number</label>
                <p className="text-gray-900">{profile.gst || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Member Since</label>
                <p className="text-gray-900">
                  {formatDate(profile.created_at, 'January 1, 2024')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <p className="text-gray-900">
                  {formatDate(profile.updated_at, 'January 1, 2024')}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Profile Completion</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${profile.completed ? 100 : 75}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{profile.completed ? '100%' : '75%'}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Account Status</label>
                <div className="flex items-center gap-2">
                  {getStatusBadge(profile.status)}
                  {profile.isVerified && (
                    <span className="text-sm text-gray-600">• Verified Professional</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" asChild className="justify-start">
              <a href="/profile/edit">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </a>
            </Button>
            <Button variant="outline" asChild className="justify-start">
              <a href="/profile/password">
                <Lock className="h-4 w-4 mr-2" />
                Change Password
              </a>
            </Button>
            <Button variant="outline" asChild className="justify-start">
              <a href="/profile/settings">
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}