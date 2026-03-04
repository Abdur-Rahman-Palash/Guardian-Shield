"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User, Phone, Calendar, Edit, Trash2, Shield, AlertTriangle } from 'lucide-react'

interface Child {
  id: string
  name: string
  age: number
  phone: string
  profilePicture?: string
  lastActive?: string
  alertsCount?: number
}

interface ChildProfileCardProps {
  child: Child
  onEdit?: (child: Child) => void
  onDelete?: (childId: string) => void
  showActions?: boolean
  compact?: boolean
}

export function ChildProfileCard({ 
  child, 
  onEdit, 
  onDelete, 
  showActions = true,
  compact = false
}: ChildProfileCardProps) {
  const getAgeBadge = (age: number) => {
    if (age < 7) return { label: 'Young Child', variant: 'secondary' as const }
    if (age < 13) return { label: 'Child', variant: 'default' as const }
    if (age < 16) return { label: 'Teen', variant: 'outline' as const }
    return { label: 'Young Adult', variant: 'destructive' as const }
  }

  const ageBadge = getAgeBadge(child.age)
  
  const getStatusColor = () => {
    if (child.alertsCount && child.alertsCount > 5) return 'text-red-600'
    if (child.alertsCount && child.alertsCount > 0) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getStatusText = () => {
    if (child.alertsCount && child.alertsCount > 5) return 'High Risk'
    if (child.alertsCount && child.alertsCount > 0) return 'Some Alerts'
    return 'Protected'
  }

  if (compact) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            {/* Profile Picture */}
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
              {child.profilePicture ? (
                <img 
                  src={child.profilePicture} 
                  alt={child.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            
            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{child.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Age {child.age}</span>
                <span>•</span>
                <span className={getStatusColor()}>{getStatusText()}</span>
              </div>
            </div>

            {/* Actions */}
            {showActions && (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit?.(child)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete?.(child.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            {/* Profile Picture */}
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              {child.profilePicture ? (
                <img 
                  src={child.profilePicture} 
                  alt={child.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            
            {/* Basic Info */}
            <div>
              <CardTitle className="text-lg">{child.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={ageBadge.variant} className="text-xs">
                  {ageBadge.label}
                </Badge>
                <span className="text-sm text-muted-foreground">Age {child.age}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit?.(child)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete?.(child.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Contact Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span>{child.phone}</span>
          </div>
          
          {child.lastActive && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Last active: {new Date(child.lastActive).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Protection Status */}
        <div className="border-t pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Protection Status</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${getStatusColor()}`}>
                {getStatusText()}
              </span>
              {child.alertsCount && child.alertsCount > 0 && (
                <Badge variant="outline" className="text-xs">
                  {child.alertsCount} alerts
                </Badge>
              )}
            </div>
          </div>
          
          {child.alertsCount && child.alertsCount > 0 && (
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-center gap-2 text-sm text-yellow-800">
                <AlertTriangle className="w-4 h-4" />
                <span>
                  {child.alertsCount} security alerts detected. 
                  {child.alertsCount > 5 ? ' Immediate attention required.' : ' Review recommended.'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            View Activity
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
