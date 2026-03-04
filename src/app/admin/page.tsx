"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  Users, 
  CreditCard, 
  TrendingUp, 
  AlertTriangle,
  Activity,
  DollarSign,
  Eye,
  ArrowRight
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalAlerts: number
  pendingPayments: number
  verifiedPayments: number
  totalRevenue: number
  riskySites: number
  monthlyRevenue: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalAlerts: 0,
    pendingPayments: 0,
    verifiedPayments: 0,
    totalRevenue: 0,
    riskySites: 0,
    monthlyRevenue: 0
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchAdminStats()
  }, [])

  const fetchAdminStats = async () => {
    setLoading(true)
    try {
      // Fetch users count
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      // Fetch active users (users with recent activity)
      const { count: activeUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('last_seen', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

      // Fetch alerts count
      const { count: totalAlerts } = await supabase
        .from('alerts')
        .select('*', { count: 'exact', head: true })

      // Fetch payment stats
      const { data: payments } = await supabase
        .from('payments')
        .select('status, amount, created_at')

      const pendingPayments = payments?.filter(p => p.status === 'pending').length || 0
      const verifiedPayments = payments?.filter(p => p.status === 'verified').length || 0
      const totalRevenue = payments?.filter(p => p.status === 'verified').reduce((sum, p) => sum + (p.amount || 0), 0) || 0
      
      // Monthly revenue
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      const monthlyRevenue = payments?.filter(p => {
        const paymentDate = new Date(p.created_at)
        return p.status === 'verified' && 
               paymentDate.getMonth() === currentMonth && 
               paymentDate.getFullYear() === currentYear
      }).reduce((sum, p) => sum + (p.amount || 0), 0) || 0

      // Fetch risky sites count
      const { count: riskySites } = await supabase
        .from('risky_sites')
        .select('*', { count: 'exact', head: true })

      setStats({
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalAlerts: totalAlerts || 0,
        pendingPayments,
        verifiedPayments,
        totalRevenue,
        riskySites: riskySites || 0,
        monthlyRevenue
      })
    } catch (error) {
      console.error('Error fetching admin stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    {
      title: 'Manage Users',
      description: 'View and manage all user accounts',
      icon: Users,
      href: '/admin/users',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Risky Sites',
      description: 'Control blocked websites and categories',
      icon: AlertTriangle,
      href: '/admin/risky-sites',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Payment Verification',
      description: 'Review and verify payment requests',
      icon: CreditCard,
      href: '/admin/payments',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Revenue Analytics',
      description: 'View earnings and financial reports',
      icon: TrendingUp,
      href: '/admin/revenue',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and manage Guardian Shield platform
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeUsers} active this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAlerts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              All security alerts
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingPayments}</div>
            <p className="text-xs text-muted-foreground">
              {stats.verifiedPayments} verified
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">৳{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              ৳{stats.monthlyRevenue} this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Card key={action.title} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${action.bgColor} flex items-center justify-center mb-3`}>
                  <action.icon className={`w-6 h-6 ${action.color}`} />
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(action.href)}
                  className="w-full"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest platform activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New user registration</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Payment verified</p>
                  <p className="text-xs text-gray-500">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">High-risk alert detected</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New risky site added</p>
                  <p className="text-xs text-gray-500">3 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>
              Platform performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Database Status</span>
                <Badge variant="default">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">API Response Time</span>
                <span className="text-sm text-green-600">45ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Connections</span>
                <span className="text-sm">127</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Storage Usage</span>
                <span className="text-sm">2.3GB / 10GB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Error Rate</span>
                <span className="text-sm text-green-600">0.1%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risky Sites Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Risky Sites Management</CardTitle>
          <CardDescription>
            Overview of blocked content categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">1,234</div>
              <p className="text-sm text-gray-600">Adult Content</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">567</div>
              <p className="text-sm text-gray-600">Gambling Sites</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">89</div>
              <p className="text-sm text-gray-600">Social Media</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" onClick={() => router.push('/admin/risky-sites')}>
              Manage All Sites
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
