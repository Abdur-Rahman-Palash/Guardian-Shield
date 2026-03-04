"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/contexts/LanguageContext'
import { 
  Users, 
  Plus, 
  Search, 
  Shield, 
  Smartphone, 
  Clock, 
  AlertTriangle,
  MoreHorizontal,
  Settings,
  Eye,
  Ban
} from 'lucide-react'

interface Child {
  id: string
  name: string
  age: number
  device: string
  status: 'online' | 'offline' | 'restricted'
  lastSeen: string
  alerts: number
  avatar: string
}

export default function ChildrenPage() {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [children] = useState<Child[]>([
    {
      id: '1',
      name: 'Ahmed',
      age: 12,
      device: 'iPhone 13',
      status: 'online',
      lastSeen: 'Active now',
      alerts: 2,
      avatar: 'A'
    },
    {
      id: '2',
      name: 'Sara',
      age: 8,
      device: 'iPad Air',
      status: 'offline',
      lastSeen: '5 minutes ago',
      alerts: 0,
      avatar: 'S'
    },
    {
      id: '3',
      name: 'Mohammed',
      age: 15,
      device: 'Samsung Galaxy',
      status: 'restricted',
      lastSeen: '1 hour ago',
      alerts: 5,
      avatar: 'M'
    }
  ])

  const filteredChildren = children.filter(child =>
    child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    child.device.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'offline': return 'bg-gray-400'
      case 'restricted': return 'bg-red-500'
      default: return 'bg-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online'
      case 'offline': return 'Offline'
      case 'restricted': return 'Restricted'
      default: return 'Unknown'
    }
  }

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
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Child
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8 pt-20">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Children</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{children.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Online Now</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {children.filter(c => c.status === 'online').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {children.reduce((sum, c) => sum + c.alerts, 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Devices</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{children.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Search children..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    All Status
                  </Button>
                  <Button variant="outline" size="sm">
                    Online
                  </Button>
                  <Button variant="outline" size="sm">
                    Has Alerts
                  </Button>
                </div>
              </div>
            </div>

            {/* Children List */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Your Children</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {filteredChildren.map((child) => (
                  <div key={child.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">{child.avatar}</span>
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(child.status)} rounded-full border-2 border-white`}></div>
                        </div>

                        {/* Info */}
                        <div>
                          <h3 className="font-semibold text-gray-900">{child.name}</h3>
                          <p className="text-sm text-gray-600">{child.age} years old • {child.device}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {child.lastSeen}
                            </span>
                            <span className="text-xs text-gray-500">
                              Status: {getStatusText(child.status)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3">
                        {child.alerts > 0 && (
                          <Badge variant="destructive" className="bg-red-500">
                            {child.alerts} alerts
                          </Badge>
                        )}
                        
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Empty State (if no children) */}
            {filteredChildren.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No children found</h3>
                <p className="text-gray-600 mb-4">Get started by adding your first child to monitor their device activity.</p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Child
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
