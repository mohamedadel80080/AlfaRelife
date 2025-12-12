'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  User, 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  Shield, 
  LogOut,
  Edit,
  Eye,
  Settings,
  FileText,
  Award,
  Briefcase
} from 'lucide-react'

interface HomeScreenProps {
  firstName: string
  position: string
  businessName: string
}

export function HomeScreen({ firstName, position, businessName }: HomeScreenProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'shifts' | 'profile' | 'settings'>('overview')

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'shifts', label: 'View Shifts', icon: Building },
    { id: 'profile', label: 'View Profile', icon: Eye },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const handleLogout = () => {
    // In a real app, this would handle logout logic
    console.log('Logging out...')
    window.location.reload()
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Welcome back, {firstName}! 👋
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Your healthcare professional registration is complete and verified.
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Profile Status</p>
                      <p className="text-2xl font-bold text-green-600">Active</p>
                    </div>
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Registration</p>
                      <p className="text-2xl font-bold text-blue-600">Complete</p>
                    </div>
                    <Award className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Verification</p>
                      <p className="text-2xl font-bold text-purple-600">Verified</p>
                    </div>
                    <FileText className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/my-shifts">
                    <Button variant="default" className="w-full justify-start">
                      <Briefcase className="h-4 w-4 mr-2" />
                      My Shifts
                    </Button>
                  </Link>
                  <Link href="/shifts">
                    <Button variant="default" className="w-full justify-start">
                      <Building className="h-4 w-4 mr-2" />
                      View Available Shifts
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <Button variant="outline" className="w-full justify-start">
                      <Eye className="h-4 w-4 mr-2" />
                      View Full Profile
                    </Button>
                  </Link>
                  <Link href="/profile/edit">
                    <Button variant="outline" className="w-full justify-start">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </Link>
                  <Link href="/profile/password">
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                  </Link>
                  <Link href="/profile/settings">
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Account Settings
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'shifts':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Available Shifts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Browse and apply for available pharmacy shifts in your area.
                </p>
                <Link href="/shifts">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Building className="h-4 w-4 mr-2" />
                    View All Shifts
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )

      case 'profile':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/api/placeholder/80/80" alt="Profile" />
                    <AvatarFallback className="text-lg">
                      {firstName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{firstName} (Last Name)</h3>
                    <p className="text-gray-600">{position}</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Photo
                    </Button>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </p>
                    <p className="text-gray-800">email@example.com</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone
                    </p>
                    <p className="text-gray-800">(555) 123-4567</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Business
                    </p>
                    <p className="text-gray-800">{businessName}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location
                    </p>
                    <p className="text-gray-800">Toronto, Ontario</p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'settings':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-gray-600">Receive updates about your account</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Privacy Settings</h4>
                      <p className="text-sm text-gray-600">Manage your data and privacy</p>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Security</h4>
                      <p className="text-sm text-gray-600">Password and authentication</p>
                    </div>
                    <Button variant="outline" size="sm">Update</Button>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    variant="destructive" 
                    onClick={handleLogout}
                    className="w-full"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex-1 justify-center ${
                activeTab === item.id 
                  ? "bg-blue-600 text-white hover:bg-blue-700" 
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {item.label}
            </Button>
          )
        })}
      </div>

      {/* Content Area */}
      {renderContent()}
    </div>
  )
}