'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  DollarSign
} from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color: string
  trend?: 'up' | 'down'
}

export function StatsCard({ title, value, icon, color, trend }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-full ${color}`}>
              {icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
          {trend && (
            <div className="flex items-center space-x-1">
              <TrendingUp className={`h-4 w-4 ${color === 'up' ? 'text-green-600' : 'text-red-600'}`} />
              <span className={`text-sm ${color === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trend === 'up' ? '+' : '-'} 12%
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}