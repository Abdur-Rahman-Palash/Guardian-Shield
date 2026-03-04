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
  Settings,
  Menu,
  X,
  LogOut,
  User
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface AdminUser {
  id: string
  email: string
  role: 'admin' | 'moderator' | 'user'
  created_at: string
}

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  current?: boolean
  requiredRole?: 'admin' | 'moderator'
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  // Navigation items with role requirements
  const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/admin', icon: Shield, current: true, requiredRole: 'admin' },
    { name: 'Users', href: '/admin/users', icon: Users, requiredRole: 'admin' },
    { name: 'Risky Sites', href: '/admin/risky-sites', icon: AlertTriangle, requiredRole: 'admin' },
    { name: 'Payments', href: '/admin/payments', icon: CreditCard, requiredRole: 'moderator' },
    { name: 'Revenue', href: '/admin/revenue', icon: TrendingUp, requiredRole: 'admin' },
    { name: 'Settings', href: '/admin/settings', icon: Settings, requiredRole: 'admin' }
  ]

  // Check admin authentication and role
  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      // Check user role from metadata
      const userRole = user.user_metadata?.role || 'user'
      
      if (userRole === 'user') {
        router.push('/dashboard')
        return
      }

      setAdminUser({
        id: user.id,
        email: user.email || '',
        role: userRole as 'admin' | 'moderator',
        created_at: user.created_at
      })
    } catch (error) {
      console.error('Error checking admin access:', error)
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Filter navigation based on user role
  const filteredNavigation = navigation.filter(item => {
    if (!item.requiredRole) return true
    if (!adminUser) return false
    
    if (adminUser.role === 'admin') return true
    if (adminUser.role === 'moderator' && item.requiredRole === 'moderator') return true
    
    return false
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-red-600">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the admin dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/dashboard')} className="w-full">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/25" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-red-600" />
            <span className="text-xl font-bold text-gray-900">Admin Panel</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {filteredNavigation.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    item.current
                      ? 'bg-red-50 text-red-600 border-r-2 border-red-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Admin Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {adminUser.email}
                </p>
                <Badge variant={adminUser.role === 'admin' ? 'destructive' : 'secondary'}>
                  {adminUser.role}
                </Badge>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>

            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
              <Badge variant="destructive">
                {adminUser.role}
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-red-600" />
                <span>Guardian Shield Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
