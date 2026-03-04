"use client"

import { useState, useEffect } from 'react'
import { RiskySite } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Filter, Download, Upload, Plus, Trash2, Edit, Eye, EyeOff } from 'lucide-react'
import { exportToCSV, importFromCSV, generateRiskySites } from '@/lib/riskySites'

interface RiskySitesTableProps {
  initialSites?: RiskySite[]
  onSiteUpdate?: (site: RiskySite) => void
  onSiteDelete?: (siteId: string) => void
  onSiteAdd?: (site: Omit<RiskySite, 'id'>) => void
  adminOnly?: boolean
}

export function RiskySitesTable({ 
  initialSites = [], 
  onSiteUpdate, 
  onSiteDelete, 
  onSiteAdd,
  adminOnly = false 
}: RiskySitesTableProps) {
  const [sites, setSites] = useState<RiskySite[]>(initialSites)
  const [filteredSites, setFilteredSites] = useState<RiskySite[]>(initialSites)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'porn' | 'gambling' | 'other'>('all')
  const [showActiveOnly, setShowActiveOnly] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Filter sites based on search and filters
  useEffect(() => {
    let filtered = sites

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(site => 
        site.domain.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(site => site.category === selectedCategory)
    }

    // Active filter
    if (showActiveOnly) {
      filtered = filtered.filter(site => site.active)
    }

    setFilteredSites(filtered)
  }, [sites, searchQuery, selectedCategory, showActiveOnly])

  // Toggle site active status
  const handleToggleActive = async (site: RiskySite) => {
    if (!adminOnly) return
    
    setIsLoading(true)
    try {
      const updatedSite = { ...site, active: !site.active }
      
      if (onSiteUpdate) {
        await onSiteUpdate(updatedSite)
      }
      
      setSites(prev => prev.map(s => s.id === site.id ? updatedSite : s))
    } catch (error) {
      console.error('Error updating site:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Delete site
  const handleDeleteSite = async (siteId: string) => {
    if (!adminOnly) return
    
    if (!confirm('Are you sure you want to delete this site?')) return
    
    setIsLoading(true)
    try {
      if (onSiteDelete) {
        await onSiteDelete(siteId)
      }
      
      setSites(prev => prev.filter(s => s.id !== siteId))
    } catch (error) {
      console.error('Error deleting site:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Export to CSV
  const handleExportCSV = () => {
    const csv = exportToCSV(filteredSites)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'risky-sites.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Import from CSV
  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const csv = e.target?.result as string
      try {
        const importedSites = importFromCSV(csv)
        setSites(prev => [...prev, ...importedSites])
      } catch (error) {
        console.error('Error importing CSV:', error)
        alert('Error importing CSV. Please check the file format.')
      }
    }
    reader.readAsText(file)
  }

  // Load sample data
  const handleLoadSampleData = () => {
    const sampleData = generateRiskySites()
    setSites(prev => [...prev, ...sampleData])
  }

  const getCategoryBadge = (category: string) => {
    const variants = {
      porn: 'destructive',
      gambling: 'secondary',
      other: 'outline'
    } as const

    return (
      <Badge variant={variants[category as keyof typeof variants] || 'outline'}>
        {category}
      </Badge>
    )
  }

  const statistics = {
    total: sites.length,
    active: sites.filter(s => s.active).length,
    inactive: sites.filter(s => !s.active).length,
    porn: sites.filter(s => s.category === 'porn').length,
    gambling: sites.filter(s => s.category === 'gambling').length,
    other: sites.filter(s => s.category === 'other').length
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statistics.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{statistics.inactive}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <div>Porn: {statistics.porn}</div>
              <div>Gambling: {statistics.gambling}</div>
              <div>Other: {statistics.other}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Controls</CardTitle>
          <CardDescription>Manage and filter risky sites</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search domains..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Categories</option>
              <option value="porn">Porn</option>
              <option value="gambling">Gambling</option>
              <option value="other">Other</option>
            </select>

            {/* Active Filter */}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showActiveOnly}
                onChange={(e) => setShowActiveOnly(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Active Only</span>
            </label>

            {/* Actions */}
            <div className="flex gap-2">
              {adminOnly && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLoadSampleData}
                    disabled={isLoading}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Load Sample
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportCSV}
                    disabled={filteredSites.length === 0}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('csv-import')?.click()}
                    disabled={isLoading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                  <input
                    id="csv-import"
                    type="file"
                    accept=".csv"
                    onChange={handleImportCSV}
                    className="hidden"
                  />
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Risky Sites ({filteredSites.length})</CardTitle>
          <CardDescription>
            Manage blocked websites and content categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSites.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      No risky sites found. {adminOnly && 'Load sample data or import from CSV to get started.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSites.map((site) => (
                    <TableRow key={site.id}>
                      <TableCell className="font-medium">{site.domain}</TableCell>
                      <TableCell>{getCategoryBadge(site.category)}</TableCell>
                      <TableCell>
                        <Badge variant={site.active ? 'default' : 'secondary'}>
                          {site.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {adminOnly && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleActive(site)}
                                disabled={isLoading}
                              >
                                {site.active ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteSite(site.id)}
                                disabled={isLoading}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
