"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Shield,
  Globe,
  Ban,
  CheckCircle
} from 'lucide-react'

interface RiskySite {
  id: string
  url: string
  domain: string
  category: 'porn' | 'gambling' | 'social' | 'other'
  severity: 'low' | 'medium' | 'high'
  reason: string
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
  added_by: string
}

export default function RiskySitesManagement() {
  const [sites, setSites] = useState<RiskySite[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingSite, setEditingSite] = useState<RiskySite | null>(null)
  const [newSite, setNewSite] = useState({
    url: '',
    category: 'other' as const,
    severity: 'medium' as const,
    reason: ''
  })

  const supabase = createClient()

  useEffect(() => {
    fetchRiskySites()
  }, [])

  const fetchRiskySites = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('risky_sites')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching risky sites:', error)
        return
      }

      setSites(data || [])
    } catch (error) {
      console.error('Error fetching risky sites:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSites = sites.filter(site => {
    const matchesSearch = 
      site.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.reason.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || site.category === categoryFilter
    const matchesSeverity = severityFilter === 'all' || site.severity === severityFilter
    
    return matchesSearch && matchesCategory && matchesSeverity
  })

  const handleAddSite = async () => {
    if (!newSite.url.trim()) return

    try {
      const { error } = await supabase
        .from('risky_sites')
        .insert({
          url: newSite.url,
          domain: new URL(newSite.url).hostname,
          category: newSite.category,
          severity: newSite.severity,
          reason: newSite.reason,
          status: 'active'
        })

      if (error) {
        console.error('Error adding risky site:', error)
        return
      }

      setNewSite({ url: '', category: 'other', severity: 'medium', reason: '' })
      setShowAddModal(false)
      fetchRiskySites()
    } catch (error) {
      console.error('Error adding risky site:', error)
    }
  }

  const handleUpdateSite = async (site: RiskySite) => {
    try {
      const { error } = await supabase
        .from('risky_sites')
        .update({
          category: site.category,
          severity: site.severity,
          reason: site.reason,
          status: site.status
        })
        .eq('id', site.id)

      if (error) {
        console.error('Error updating risky site:', error)
        return
      }

      setEditingSite(null)
      fetchRiskySites()
    } catch (error) {
      console.error('Error updating risky site:', error)
    }
  }

  const handleDeleteSite = async (siteId: string) => {
    if (!confirm('Are you sure you want to delete this risky site?')) return

    try {
      const { error } = await supabase
        .from('risky_sites')
        .delete()
        .eq('id', siteId)

      if (error) {
        console.error('Error deleting risky site:', error)
        return
      }

      fetchRiskySites()
    } catch (error) {
      console.error('Error deleting risky site:', error)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      porn: 'bg-red-500',
      gambling: 'bg-yellow-500',
      social: 'bg-blue-500',
      other: 'bg-gray-500'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-500'
  }

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: 'bg-green-500',
      medium: 'bg-yellow-500',
      high: 'bg-red-500'
    }
    return colors[severity as keyof typeof colors] || 'bg-gray-500'
  }

  const stats = {
    total: sites.length,
    active: sites.filter(s => s.status === 'active').length,
    byCategory: {
      porn: sites.filter(s => s.category === 'porn').length,
      gambling: sites.filter(s => s.category === 'gambling').length,
      social: sites.filter(s => s.category === 'social').length,
      other: sites.filter(s => s.category === 'other').length
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
          <h1 className="text-3xl font-bold tracking-tight">Risky Sites Management</h1>
          <p className="text-muted-foreground">
            Manage blocked websites and content categories
          </p>
        </div>
        
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Site
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sites</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">Adult Content</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.byCategory.porn}</div>
            <p className="text-xs text-muted-foreground">Blocked sites</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gambling</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.byCategory.gambling}</div>
            <p className="text-xs text-muted-foreground">Blocked sites</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Social Media</CardTitle>
            <AlertTriangle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.byCategory.social}</div>
            <p className="text-xs text-muted-foreground">Blocked sites</p>
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
                  placeholder="Search by URL, domain, or reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Categories</option>
              <option value="porn">Adult Content</option>
              <option value="gambling">Gambling</option>
              <option value="social">Social Media</option>
              <option value="other">Other</option>
            </select>
            
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Severities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Sites Table */}
      <Card>
        <CardHeader>
          <CardTitle>Risky Sites ({filteredSites.length})</CardTitle>
          <CardDescription>
            Manage blocked websites and content categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredSites.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No risky sites found</h3>
              <p className="text-muted-foreground">
                {searchTerm || categoryFilter !== 'all' || severityFilter !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'No risky sites have been added yet'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">URL</th>
                    <th className="text-left p-3 font-medium">Category</th>
                    <th className="text-left p-3 font-medium">Severity</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Added</th>
                    <th className="text-left p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSites.map((site) => (
                    <tr key={site.id} className="border-b hover:bg-muted/50">
                      <td className="p-3">
                        <div>
                          <div className="font-medium text-sm truncate max-w-xs">{site.url}</div>
                          <div className="text-xs text-gray-500">{site.domain}</div>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className="flex items-center gap-1 w-fit">
                          <div className={`w-2 h-2 rounded-full ${getCategoryColor(site.category)}`}></div>
                          {site.category}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className="flex items-center gap-1 w-fit">
                          <div className={`w-2 h-2 rounded-full ${getSeverityColor(site.severity)}`}></div>
                          {site.severity}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant={site.status === 'active' ? 'default' : 'secondary'}>
                          {site.status === 'active' ? (
                            <><CheckCircle className="w-3 h-3 mr-1" />Active</>
                          ) : (
                            <><Ban className="w-3 h-3 mr-1" />Inactive</>
                          )}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="text-sm">
                          <div>{new Date(site.created_at).toLocaleDateString()}</div>
                          <div className="text-gray-500">{new Date(site.created_at).toLocaleTimeString()}</div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingSite(site)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(site.url, '_blank')}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteSite(site.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
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

      {/* Add Site Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Add Risky Site</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">URL</label>
                  <Input
                    placeholder="https://example.com"
                    value={newSite.url}
                    onChange={(e) => setNewSite({ ...newSite, url: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={newSite.category}
                    onChange={(e) => setNewSite({ ...newSite, category: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="porn">Adult Content</option>
                    <option value="gambling">Gambling</option>
                    <option value="social">Social Media</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Severity</label>
                  <select
                    value={newSite.severity}
                    onChange={(e) => setNewSite({ ...newSite, severity: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Reason</label>
                  <textarea
                    placeholder="Why should this site be blocked?"
                    value={newSite.reason}
                    onChange={(e) => setNewSite({ ...newSite, reason: e.target.value })}
                    rows={3}
                    className="w-full p-2 border rounded-md resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <Button onClick={handleAddSite} className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Site
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Site Modal */}
      {editingSite && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Edit Risky Site</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">URL</label>
                  <Input value={editingSite.url} disabled />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={editingSite.category}
                    onChange={(e) => setEditingSite({ ...editingSite, category: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="porn">Adult Content</option>
                    <option value="gambling">Gambling</option>
                    <option value="social">Social Media</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Severity</label>
                  <select
                    value={editingSite.severity}
                    onChange={(e) => setEditingSite({ ...editingSite, severity: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={editingSite.status}
                    onChange={(e) => setEditingSite({ ...editingSite, status: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Reason</label>
                  <textarea
                    value={editingSite.reason}
                    onChange={(e) => setEditingSite({ ...editingSite, reason: e.target.value })}
                    rows={3}
                    className="w-full p-2 border rounded-md resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <Button onClick={() => handleUpdateSite(editingSite)} className="flex-1">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Update
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingSite(null)}
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
