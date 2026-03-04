"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Bell, 
  X, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  ChevronRight,
  Volume2,
  VolumeX
} from 'lucide-react'
import { trackingService, TrackingAlert } from '@/lib/trackingService'

interface NotificationSystemProps {
  className?: string
}

export default function NotificationSystem({ className }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<TrackingAlert[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Listen for new alerts
    trackingService.on('newAlert', (alert: TrackingAlert) => {
      addNotification(alert)
      if (soundEnabled) {
        playNotificationSound(alert.severity)
      }
    })

    // Initialize with existing alerts
    const existingAlerts = trackingService.getAlerts().slice(0, 5)
    setNotifications(existingAlerts)
    setUnreadCount(existingAlerts.filter(a => !a.acknowledged).length)

    return () => {
      trackingService.off('newAlert', () => {})
    }
  }, [soundEnabled])

  const addNotification = (alert: TrackingAlert) => {
    setNotifications(prev => [alert, ...prev.slice(0, 4)]) // Keep only 5 most recent
    setUnreadCount(prev => prev + 1)
    
    // Auto-show notification panel for high severity alerts
    if (alert.severity === 'high' || alert.severity === 'critical') {
      setIsVisible(true)
    }
  }

  const playNotificationSound = (severity: string) => {
    if (!soundEnabled) return

    try {
      const audio = new Audio()
      switch (severity) {
        case 'critical':
          audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT' // Critical alert sound
          break
        case 'high':
          audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT' // High alert sound
          break
        default:
          audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT' // Default notification sound
      }
      audio.volume = 0.3
      audio.play().catch(() => {
        // Ignore audio play errors (browser may block autoplay)
      })
    } catch (error) {
      // Ignore audio errors
    }
  }

  const acknowledgeNotification = (alertId: string) => {
    trackingService.acknowledgeAlert(alertId)
    setNotifications(prev => prev.map(n => 
      n.id === alertId ? { ...n, acknowledged: true } : n
    ))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const acknowledgeAll = () => {
    notifications.forEach(notification => {
      if (!notification.acknowledged) {
        trackingService.acknowledgeAlert(notification.id)
      }
    })
    setNotifications(prev => prev.map(n => ({ ...n, acknowledged: true })))
    setUnreadCount(0)
  }

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />
      case 'medium':
        return <Info className="w-5 h-5 text-yellow-600" />
      default:
        return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-200 bg-red-50'
      case 'high':
        return 'border-orange-200 bg-orange-50'
      case 'medium':
        return 'border-yellow-200 bg-yellow-50'
      default:
        return 'border-blue-200 bg-blue-50'
    }
  }

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'critical': return 'Critical'
      case 'high': return 'High'
      case 'medium': return 'Medium'
      default: return 'Low'
    }
  }

  return (
    <div className={className}>
      {/* Notification Bell */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(!isVisible)}
          className="relative hover:bg-blue-50"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center p-0 animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>

        {/* Sound Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="hover:bg-blue-50"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </Button>
      </div>

      {/* Notification Panel */}
      {isVisible && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={acknowledgeAll}
                  className="text-xs"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto max-h-80">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No notifications</p>
                <p className="text-sm text-gray-400 mt-1">You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`border-0 shadow-none ${getAlertColor(notification.severity)} ${
                      !notification.acknowledged ? 'border-l-4' : ''
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getAlertIcon(notification.severity)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">
                              {notification.childName}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {getSeverityText(notification.severity)}
                            </Badge>
                            {!notification.acknowledged && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {new Date(notification.timestamp).toLocaleString()}
                            </span>
                            {!notification.acknowledged && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => acknowledgeNotification(notification.id)}
                                className="text-xs"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Acknowledge
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-sm"
              asChild
            >
              <a href="/dashboard/alerts" className="flex items-center justify-center">
                View all alerts
                <ChevronRight className="w-4 h-4 ml-1" />
              </a>
            </Button>
          </div>
        </div>
      )}

      {/* Overlay */}
      {isVisible && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsVisible(false)}
        />
      )}
    </div>
  )
}
