"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  AlertTriangle, 
  CheckCircle, 
  Archive, 
  Download, 
  Eye, 
  Filter,
  Search,
  Calendar,
  Shield,
  Clock
} from 'lucide-react'

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

interface ColumnDef {
  id: string
  header: string
  accessorKey: keyof Alert
  cell?: (row: Alert) => React.ReactNode
  sortable?: boolean
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [showScreenshotModal, setShowScreenshotModal] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const [sortConfig, setSortConfig] = useState({
    key: 'timestamp' as keyof Alert,
    direction: 'desc' as 'asc' | 'desc'
  })

  const supabase = createClient()

  // Fetch alerts from Supabase
  useEffect(() => {
    fetchAlerts()
    
    // Set up real-time subscription
    const channel = supabase
      .channel('alerts')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'alerts' },
        (payload) => {
          const newAlert = payload.new as Alert
          setAlerts(prev => [newAlert, ...prev])
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  const fetchAlerts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .order('timestamp', { ascending: false })

      if (error) {
        console.error('Error fetching alerts:', error)
        return
      }

      setAlerts(data || [])
      setPagination(prev => ({
        ...prev,
        total: data?.length || 0,
        totalPages: Math.ceil((data?.length || 0) / prev.limit)
      }))
    } catch (error) {
      console.error('Error fetching alerts:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter alerts
  useEffect(() => {
    let filtered = alerts

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(alert =>
        alert.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.domain.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(alert => alert.status === statusFilter)
    }

    setFilteredAlerts(filtered)
    setPagination(prev => ({
      ...prev,
      totalPages: Math.ceil(filtered.length / prev.limit)
    }))
  }, [alerts, searchTerm, statusFilter])

  // Sort alerts
  const handleSort = (key: keyof Alert) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    setSortConfig({ key, direction })
  }

  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]
    
    // Handle undefined values
    if (aValue === undefined && bValue === undefined) return 0
    if (aValue === undefined) return sortConfig.direction === 'asc' ? -1 : 1
    if (bValue === undefined) return sortConfig.direction === 'asc' ? 1 : -1
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  // Pagination
  const paginatedAlerts = sortedAlerts.slice(
    (pagination.page - 1) * pagination.limit,
    pagination.page * pagination.limit
  )

  // Status badge colors
  const getStatusBadge = (status: string) => {
    const variants = {
      new: 'destructive',
      read: 'secondary',
      archived: 'outline'
    } as const

    const colors = {
      new: 'bg-orange-500',
      read: 'bg-green-500',
      archived: 'bg-gray-500'
    }

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.toUpperCase()}
      </Badge>
    )
  }

  // Export functions
  const exportToCSV = () => {
    const headers = ['Child Name', 'URL', 'Domain', 'Status', 'Timestamp', 'Category']
    const rows = filteredAlerts.map(alert => [
      alert.childName,
      alert.url,
      alert.domain,
      alert.status,
      alert.timestamp,
      alert.category || ''
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `alerts-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const exportToPDF = async () => {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()

    // Add title
    doc.setFontSize(16)
    doc.text('Guardian Shield Alerts Report', 20, 20)

    // Add alerts
    doc.setFontSize(10)
    let yPosition = 40

    filteredAlerts.forEach((alert, index) => {
      if (yPosition > 270) {
        doc.addPage()
        yPosition = 20
      }

      doc.text(`${index + 1}. ${alert.childName}`, 20, yPosition)
      doc.text(`URL: ${alert.url}`, 20, yPosition + 5)
      doc.text(`Status: ${alert.status}`, 20, yPosition + 10)
      doc.text(`Time: ${new Date(alert.timestamp).toLocaleString()}`, 20, yPosition + 15)

      yPosition += 25
    })

    doc.save(`alerts-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  // Update alert status
  const updateAlertStatus = async (alertId: string, newStatus: 'read' | 'archived') => {
    try {
      const { error } = await supabase
        .from('alerts')
        .update({ status: newStatus })
        .eq('id', alertId)

      if (error) {
        console.error('Error updating alert:', error)
        return
      }

      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId ? { ...alert, status: newStatus } : alert
        )
      )
    } catch (error) {
      console.error('Error updating alert:', error)
    }
  }

  const columns: ColumnDef[] = [
    {
      id: 'childName',
      header: 'Child',
      accessorKey: 'childName',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-blue-600">
              {row.childName.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="font-medium">{row.childName}</span>
        </div>
      )
    },
    {
      id: 'url',
      header: 'URL',
      accessorKey: 'url',
      sortable: true,
      cell: (row) => (
        <div className="max-w-xs truncate">
          <a 
            href={row.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {row.url}
          </a>
        </div>
      )
    },
    {
      id: 'timestamp',
      header: 'Time',
      accessorKey: 'timestamp',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          {new Date(row.timestamp).toLocaleString()}
        </div>
      )
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: (row) => getStatusBadge(row.status)
    },
    {
      id: 'actions',
      header: 'Actions',
      accessorKey: 'id',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedAlert(row)
              setShowScreenshotModal(true)
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
          
          {row.status === 'new' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateAlertStatus(row.id, 'read')}
            >
              <CheckCircle className="w-4 h-4" />
            </Button>
          )}
          
          {row.status !== 'archived' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateAlertStatus(row.id, 'archived')}
            >
              <Archive className="w-4 h-4" />
            </Button>
          )}
        </div>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content */}
      <div>
        {/* Top navigation */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              {/* Header space for balance */}
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={exportToCSV}
                disabled={filteredAlerts.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button
                variant="outline"
                onClick={exportToPDF}
                disabled={filteredAlerts.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8 pt-20">
          <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alerts Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time monitoring and security alerts
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={exportToCSV}
            disabled={filteredAlerts.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={exportToPDF}
            disabled={filteredAlerts.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredAlerts.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {filteredAlerts.filter(a => a.status === 'new').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Read</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {filteredAlerts.filter(a => a.status === 'read').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Archived</CardTitle>
            <Archive className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {filteredAlerts.filter(a => a.status === 'archived').length}
            </div>
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
                  placeholder="Search by child name, URL, or domain..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Alerts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts ({filteredAlerts.length})</CardTitle>
          <CardDescription>
            Real-time alerts from Guardian Shield monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading alerts...</p>
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No alerts found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'No security alerts detected'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    {columns.map((column) => (
                      <th 
                        key={column.id}
                        className="text-left p-3 font-medium"
                      >
                        <div className="flex items-center gap-2">
                          {column.header}
                          {column.sortable && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSort(column.accessorKey)}
                            >
                              <span className="text-xs">
                                {sortConfig.key === column.accessorKey && sortConfig.direction === 'asc' ? '↑' : '↓'}
                              </span>
                            </Button>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedAlerts.map((alert) => (
                    <tr key={alert.id} className="border-b hover:bg-muted/50">
                      {columns.map((column) => (
                        <td key={column.id} className="p-3">
                          {column.cell ? column.cell(alert) : alert[column.accessorKey]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, filteredAlerts.length)} of {filteredAlerts.length}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            
            <span className="text-sm">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
              disabled={pagination.page === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Screenshot Modal */}
      {showScreenshotModal && selectedAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Alert Details</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowScreenshotModal(false)}
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">Child Name</label>
                    <p className="text-sm text-gray-600">{selectedAlert.childName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Status</label>
                    <div>{getStatusBadge(selectedAlert.status)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">URL</label>
                    <a 
                      href={selectedAlert.url} 
                      target="_blank" 
                      className="text-sm text-blue-600 hover:underline break-all"
                    >
                      {selectedAlert.url}
                    </a>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Time</label>
                    <p className="text-sm text-gray-600">
                      {new Date(selectedAlert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                {selectedAlert.screenshot && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Screenshot</label>
                    <div className="border rounded-lg overflow-hidden">
                      <img 
                        src={selectedAlert.screenshot} 
                        alt="Alert screenshot" 
                        className="w-full cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => window.open(selectedAlert.screenshot, '_blank')}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
          </div>
        </main>
      </div>
    </div>
  )
}
