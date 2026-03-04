"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import LiveMap from '@/components/LiveMap'
import { trackingService, ChildLocation, TrackingAlert } from '@/lib/trackingService'
import { 
  Users, 
  AlertTriangle, 
  CreditCard, 
  Shield,
  Clock,
  TrendingUp,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Camera,
  Navigation,
  Activity,
  MapPin
} from 'lucide-react'
import PaymentWhatsAppButton from '@/components/PaymentWhatsAppButton'
import { paymentUtils } from '@/components/PaymentWhatsAppButton'

interface Alert {
  id: string
  childName: string
  url: string
  domain: string
  screenshot?: string
  timestamp: string
  status: 'new' | 'read' | 'archived'
  category?: 'porn' | 'gambling' | 'other'
  severity?: 'low' | 'medium' | 'high'
}

interface Child {
  id: string
  name: string
  age: number
  status: 'active' | 'inactive'
  lastSeen: string
}

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  current?: boolean
}

export default function GuardianDashboard() {
  const [alerts, setAlerts] = useState<TrackingAlert[]>([])
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0)
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false)
  const [childLocations, setChildLocations] = useState<ChildLocation[]>([])
  const [isTracking, setIsTracking] = useState(false)

  const supabase = createClient()

  // Check subscription status
  useEffect(() => {
    setHasActiveSubscription(paymentUtils.hasActiveSubscription())
  }, [])

  // Fetch data
  useEffect(() => {
    fetchDashboardData()
    initializeTracking()
    
    return () => {
      trackingService.stopRealTimeTracking()
    }
  }, [])

  const initializeTracking = () => {
    // Set up tracking service listeners
    trackingService.on('locationUpdate', (location: ChildLocation) => {
      setChildLocations(prev => {
        const filtered = prev.filter(loc => loc.childId !== location.childId)
        return [...filtered, location]
      })
    })

    trackingService.on('newAlert', (alert: TrackingAlert) => {
      setAlerts(prev => [alert, ...prev.slice(0, 9)]) // Keep only 10 most recent
    })

    // Start real-time tracking
    trackingService.startRealTimeTracking()
    setIsTracking(true)
  }

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // Get initial data from tracking service
      const trackingAlerts = trackingService.getAlerts()
      setAlerts(trackingAlerts.slice(0, 10))

      // Initialize with some children data
      setChildren([
        { id: '1', name: 'Ahmed', age: 12, status: 'active', lastSeen: 'Active now' },
        { id: '2', name: 'Sara', age: 8, status: 'active', lastSeen: '2 minutes ago' },
        { id: '3', name: 'Mohammed', age: 15, status: 'active', lastSeen: '5 minutes ago' }
      ])

      // Get initial locations
      const initialLocations: ChildLocation[] = []
      for (const child of ['1', '2', '3']) {
        const location = await trackingService.getCurrentLocation(child)
        const childLocation: ChildLocation = {
          childId: child,
          location,
          isWithinGeofence: false,
          speed: Math.random() * 20,
          heading: Math.random() * 360
        }
        initialLocations.push(childLocation)
      }
      setChildLocations(initialLocations)

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats
  const stats = {
    totalAlerts: alerts.length,
    activeChildren: children.filter(child => child.status === 'active').length,
    planStatus: hasActiveSubscription ? 'Family Plan' : 'Free Plan',
    thisMonthAlerts: alerts.filter(alert => {
      const alertDate = new Date(alert.timestamp)
      const now = new Date()
      return alertDate.getMonth() === now.getMonth() && alertDate.getFullYear() === now.getFullYear()
    }).length
  }

  // Alert carousel navigation
  const nextAlert = () => {
    setCurrentAlertIndex((prev) => (prev + 1) % Math.min(alerts.length, 5))
  }

  const prevAlert = () => {
    setCurrentAlertIndex((prev) => (prev - 1 + Math.min(alerts.length, 5)) % Math.min(alerts.length, 5))
  }

  // Get severity color
  const getSeverityColor = (severity?: string) => {
    const colors = {
      high: 'bg-red-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500'
    }
    return colors[severity as keyof typeof colors] || 'bg-gray-500'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content */}
      <div>
        {/* Top navigation */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                <span>Guardian Shield</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="p-4 sm:p-6 lg:p-8 pt-20">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Welcome to Guardian Shield</h2>
              <p className="text-blue-100 mb-4">
                Your family's digital safety companion. Monitor, protect, and guide your children online.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{stats.activeChildren} Active Children</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>{stats.totalAlerts} Total Alerts</span>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {loading ? (
                // Skeleton loading states
                Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-4 rounded-full" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-16 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </CardContent>
                  </Card>
                ))
              ) : (
                <>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
                      <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalAlerts}</div>
                      <p className="text-xs text-muted-foreground">All time alerts</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Children</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.activeChildren}</div>
                      <p className="text-xs text-muted-foreground">Currently monitored</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Plan Status</CardTitle>
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.planStatus}</div>
                      <p className="text-xs text-muted-foreground">
                        {hasActiveSubscription ? 'Active subscription' : 'Upgrade available'}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">This Month</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.thisMonthAlerts}</div>
                      <p className="text-xs text-muted-foreground">Alerts this month</p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {/* Plan Upgrade Banner */}
            {!hasActiveSubscription && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">
                        Upgrade to Family Plan
                      </h3>
                      <p className="text-blue-700 mb-4">
                        Get unlimited alerts, monitor up to 5 children, and access premium features for just ৳500/year.
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                          <Shield className="w-4 h-4" />
                          <span>Unlimited alerts</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                          <Users className="w-4 h-4" />
                          <span>5 children</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                          <Camera className="w-4 h-4" />
                          <span>Screenshot proof</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <PaymentWhatsAppButton />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Live Map - takes 2 columns */}
              <div className="lg:col-span-2">
                <LiveMap childLocations={childLocations} />
              </div>

              {/* Recent Alerts - takes 1 column */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recent Alerts</CardTitle>
                      <CardDescription>
                        Latest security alerts from your children's devices
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isTracking ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                      <span className="text-xs text-gray-500">
                        {isTracking ? 'Live' : 'Offline'}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <Skeleton className="w-10 h-10 rounded-full" />
                          <div className="flex-1">
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : alerts.length === 0 ? (
                    <div className="text-center py-8">
                      <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No alerts at this time</p>
                      <p className="text-sm text-gray-400 mt-1">Your children are safe</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {alerts.slice(0, 5).map((alert) => (
                        <div key={alert.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getSeverityColor(alert.severity)}`}>
                              <span className="text-white font-medium text-sm">
                                {alert.childName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900">{alert.childName}</span>
                              <Badge variant={alert.acknowledged ? 'secondary' : 'destructive'}>
                                {alert.acknowledged ? 'Acknowledged' : 'New'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 truncate">{alert.message}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {new Date(alert.timestamp).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <Button variant="outline" size="sm" asChild>
                              <a href="/dashboard/alerts">
                                View <ArrowRight className="w-3 h-3 ml-1" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Usage Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Usage Analytics</CardTitle>
                <CardDescription>
                  Monitor your family's online activity patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-40 w-full" />
                    <div className="grid gap-4 sm:grid-cols-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="text-center">
                          <Skeleton className="h-8 w-16 mx-auto mb-2" />
                          <Skeleton className="h-3 w-20 mx-auto" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Simple chart representation */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Alerts This Month</h4>
                        <span className="text-sm text-gray-600">{stats.thisMonthAlerts} total</span>
                      </div>
                      <div className="space-y-2">
                        {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((week, i) => (
                          <div key={week} className="flex items-center gap-4">
                            <span className="text-sm text-gray-600 w-12">{week}</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                              <div 
                                className="bg-blue-600 h-6 rounded-full flex items-center justify-end pr-2"
                                style={{ width: `${Math.random() * 80 + 10}%` }}
                              >
                                <span className="text-xs text-white font-medium">
                                  {Math.floor(Math.random() * 10 + 1)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Alert type breakdown */}
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {alerts.filter(a => a.type === 'geofence breach').length}
                        </div>
                        <p className="text-sm text-gray-600">Geofence Alerts</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          {alerts.filter(a => a.type === 'suspicious activity').length}
                        </div>
                        <p className="text-sm text-gray-600">Web Activity</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {alerts.filter(a => a.type === 'device offline').length}
                        </div>
                        <p className="text-sm text-gray-600">Device Issues</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
