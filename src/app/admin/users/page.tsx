"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Mail, 
  Calendar,
  Shield,
  Crown,
  User,
  Activity,
  AlertTriangle,
  CheckCircle,
  ArrowUp
} from 'lucide-react'

interface UserProfile {
  id: string
  email: string
  full_name?: string
  role: 'admin' | 'moderator' | 'user'
  plan: 'free' | 'family' | 'school'
  status: 'active' | 'inactive' | 'suspended'
  created_at: string
  last_seen: string
  children_count?: number
  alerts_count?: number
  payment_status?: 'pending' | 'verified' | 'none'
}

export default function UsersManagement() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [planFilter, setPlanFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [showPromotionModal, setShowPromotionModal] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError)
        return
      }

      // Enrich profiles with additional data
      const enrichedUsers = await Promise.all(
        (profiles || []).map(async (profile) => {
          // Count children
          const { count: childrenCount } = await supabase
            .from('children')
            .select('*', { count: 'exact', head: true })
            .eq('parent_id', profile.id)

          // Count alerts
          const { count: alertsCount } = await supabase
            .from('alerts')
            .select('*', { count: 'exact', head: true })
            .eq('parent_id', profile.id)

          // Check payment status
          const { data: payments } = await supabase
            .from('payments')
            .select('status')
            .eq('user_id', profile.id)
            .order('created_at', { ascending: false })
            .limit(1)

          return {
            ...profile,
            children_count: childrenCount || 0,
            alerts_count: alertsCount || 0,
            payment_status: payments?.[0]?.status || 'none'
          }
        })
      )

      setUsers(enrichedUsers)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesPlan = planFilter === 'all' || user.plan === planFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    
    return matchesSearch && matchesRole && matchesPlan && matchesStatus
  })

  const handlePromoteUser = async (userId: string, newPlan: 'family' | 'school') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ plan: newPlan })
        .eq('id', userId)

      if (error) {
        console.error('Error promoting user:', error)
        return
      }

      // Create payment record for admin promotion
      await supabase
        .from('payments')
        .insert({
          user_id: userId,
          amount: newPlan === 'family' ? 500 : 2000,
          plan: newPlan,
          status: 'verified',
          payment_method: 'admin_promotion',
          created_at: new Date().toISOString()
        })

      fetchUsers()
      setShowPromotionModal(false)
      setSelectedUser(null)
    } catch (error) {
      console.error('Error promoting user:', error)
    }
  }

  const handleSuspendUser = async (userId: string) => {
    if (!confirm('Are you sure you want to suspend this user?')) return

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'suspended' })
        .eq('id', userId)

      if (error) {
        console.error('Error suspending user:', error)
        return
      }

      fetchUsers()
    } catch (error) {
      console.error('Error suspending user:', error)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-red-600" />
      case 'moderator':
        return <Shield className="w-4 h-4 text-blue-600" />
      default:
        return <User className="w-4 h-4 text-gray-600" />
    }
  }

  const getPlanColor = (plan: string) => {
    const colors = {
      free: 'bg-gray-500',
      family: 'bg-green-500',
      school: 'bg-purple-500'
    }
    return colors[plan as keyof typeof colors] || 'bg-gray-500'
  }

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-500',
      inactive: 'bg-yellow-500',
      suspended: 'bg-red-500'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-500'
  }

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    byRole: {
      admin: users.filter(u => u.role === 'admin').length,
      moderator: users.filter(u => u.role === 'moderator').length,
      user: users.filter(u => u.role === 'user').length
    },
    byPlan: {
      free: users.filter(u => u.plan === 'free').length,
      family: users.filter(u => u.plan === 'family').length,
      school: users.filter(u => u.plan === 'school').length
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
          <p className="text-muted-foreground">
            View and manage all user accounts
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.active} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Crown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.byRole.admin}</div>
            <p className="text-xs text-muted-foreground">
              {stats.byRole.moderator} moderators
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Family Plans</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.byPlan.family}</div>
            <p className="text-xs text-muted-foreground">
              {stats.byPlan.school} school plans
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Free Users</CardTitle>
            <User className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.byPlan.free}</div>
            <p className="text-xs text-muted-foreground">
              Can be upgraded
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by email or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
              <option value="user">User</option>
            </select>
            
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Plans</option>
              <option value="free">Free</option>
              <option value="family">Family</option>
              <option value="school">School</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>
            Manage user accounts and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No users found</h3>
              <p className="text-muted-foreground">
                {searchTerm || roleFilter !== 'all' || planFilter !== 'all' || statusFilter !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'No users registered yet'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">User</th>
                    <th className="text-left p-3 font-medium">Role</th>
                    <th className="text-left p-3 font-medium">Plan</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Activity</th>
                    <th className="text-left p-3 font-medium">Joined</th>
                    <th className="text-left p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/50">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-600">
                              {user.email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{user.full_name || user.email}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(user.role)}
                          <Badge variant="outline" className="capitalize">
                            {user.role}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${getPlanColor(user.plan)}`}></div>
                          {user.plan}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(user.status)}`}></div>
                          {user.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-gray-400" />
                            <span>{user.children_count || 0} children</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-gray-400" />
                            <span>{user.alerts_count || 0} alerts</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-sm">
                          <div>{new Date(user.created_at).toLocaleDateString()}</div>
                          <div className="text-gray-500">
                            Last seen: {new Date(user.last_seen).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          
                          {user.plan === 'free' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user)
                                setShowPromotionModal(true)
                              }}
                            >
                              <ArrowUp className="w-4 h-4" />
                            </Button>
                          )}
                          
                          {user.status === 'active' && user.role !== 'admin' && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleSuspendUser(user.id)}
                            >
                              <AlertTriangle className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Promotion Modal */}
      {showPromotionModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Promote User</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">User</p>
                  <div className="font-medium">{selectedUser.email}</div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-2">Current Plan</p>
                  <Badge variant="outline">{selectedUser.plan}</Badge>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-2">Select New Plan</p>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handlePromoteUser(selectedUser.id, 'family')}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>Family Plan</span>
                        <span className="text-sm text-gray-500">৳500/year</span>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handlePromoteUser(selectedUser.id, 'school')}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>School Plan</span>
                        <span className="text-sm text-gray-500">৳2000/year</span>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowPromotionModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
