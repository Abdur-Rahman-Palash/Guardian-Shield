"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Search, 
  Filter,
  Download,
  Eye,
  CheckCircle,
  Archive,
  MoreHorizontal
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
  width?: string
}

interface AlertsTableProps {
  data: Alert[]
  loading?: boolean
  onStatusUpdate?: (alertId: string, status: 'read' | 'archived') => void
  onScreenshotView?: (alert: Alert) => void
  onExport?: (format: 'csv' | 'pdf') => void
}

export function AlertsTable({ 
  data, 
  loading = false, 
  onStatusUpdate, 
  onScreenshotView,
  onExport 
}: AlertsTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Alert
    direction: 'asc' | 'desc'
  }>({
    key: 'timestamp',
    direction: 'desc'
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Filter and sort data
  const filteredData = data.filter(alert => {
    const matchesSearch = 
      alert.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.domain.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]
    
    // Handle undefined values - they should appear last when sorting
    if (aValue === undefined && bValue === undefined) return 0
    if (aValue === undefined) return 1
    if (bValue === undefined) return -1
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = sortedData.slice(startIndex, endIndex)

  const handleSort = (key: keyof Alert) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      new: 'destructive',
      read: 'secondary',
      archived: 'outline'
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.toUpperCase()}
      </Badge>
    )
  }

  const getSortIcon = (columnKey: keyof Alert) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown className="w-4 h-4" />
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="w-4 h-4" /> : 
      <ArrowDown className="w-4 h-4" />
  }

  const columns: ColumnDef[] = [
    {
      id: 'childName',
      header: 'Child',
      accessorKey: 'childName',
      sortable: true,
      width: '150px',
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
      width: '300px',
      cell: (row) => (
        <div className="max-w-xs truncate">
          <a 
            href={row.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline text-sm"
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
      width: '180px',
      cell: (row) => (
        <div className="text-sm text-gray-600">
          {new Date(row.timestamp).toLocaleString()}
        </div>
      )
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      width: '100px',
      cell: (row) => getStatusBadge(row.status)
    },
    {
      id: 'actions',
      header: 'Actions',
      accessorKey: 'id',
      width: '120px',
      cell: (row) => (
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onScreenshotView?.(row)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          
          {row.status === 'new' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusUpdate?.(row.id, 'read')}
            >
              <CheckCircle className="w-4 h-4" />
            </Button>
          )}
          
          {row.status !== 'archived' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusUpdate?.(row.id, 'archived')}
            >
              <Archive className="w-4 h-4" />
            </Button>
          )}
        </div>
      )
    }
  ]

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Loading alerts...</p>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground">
          No alerts found
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search alerts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
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

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onExport?.('csv')}
          >
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onExport?.('pdf')}
          >
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              {columns.map((column) => (
                <th
                  key={column.id}
                  className={`text-left p-3 font-medium ${column.width || ''}`}
                  onClick={() => column.sortable && handleSort(column.accessorKey)}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable && getSortIcon(column.accessorKey)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row) => (
              <tr key={row.id} className="border-b hover:bg-muted/50">
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={`p-3 ${column.width || ''}`}
                  >
                    {column.cell ? column.cell(row) : row[column.accessorKey]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, sortedData.length)} of {sortedData.length} alerts
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
