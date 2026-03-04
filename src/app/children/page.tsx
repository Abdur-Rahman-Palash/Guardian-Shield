"use client"

import { useState, useEffect } from 'react'
import { ChildProfileForm } from '@/components/ChildProfileForm'
import { ChildProfileCard } from '@/components/ChildProfileCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Users, Crown, School } from 'lucide-react'
import { getChildren, saveChildren, addChild, getDemoChildren } from '@/actions/children'

export default function ChildrenPage() {
  const [children, setChildren] = useState<any[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingChild, setEditingChild] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userPlan, setUserPlan] = useState<'free' | 'family' | 'school'>('free')

  // Load children data
  useEffect(() => {
    loadChildren()
  }, [])

  const loadChildren = async () => {
    setIsLoading(true)
    try {
      // For demo purposes, use demo data
      // In production, you'd use: const result = await getChildren()
      const demoChildren = await getDemoChildren()
      setChildren(demoChildren)
      
      // Simulate different plans for demo
      setUserPlan('free')
    } catch (error) {
      console.error('Error loading children:', error)
      // Fallback to demo data
      const demoChildren = await getDemoChildren()
      setChildren(demoChildren)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddChild = async (childData: any) => {
    try {
      // For demo purposes, add to local state
      // In production: const result = await addChild(childData)
      const newChild = {
        id: Date.now().toString(),
        ...childData,
        lastActive: new Date().toISOString(),
        alertsCount: Math.floor(Math.random() * 10) // Demo alerts count
      }
      
      setChildren(prev => [...prev, newChild])
      setShowAddForm(false)
    } catch (error) {
      console.error('Error adding child:', error)
      alert('Failed to add child. Please try again.')
    }
  }

  const handleUpdateChild = async (childData: any) => {
    try {
      // For demo purposes, update local state
      // In production: const result = await updateChild(childData.id, childData)
      setChildren(prev => prev.map(child => 
        child.id === childData.id ? { ...childData } : child
      ))
      setEditingChild(null)
    } catch (error) {
      console.error('Error updating child:', error)
      alert('Failed to update child. Please try again.')
    }
  }

  const handleDeleteChild = async (childId: string) => {
    if (!confirm('Are you sure you want to remove this child?')) return
    
    try {
      // For demo purposes, remove from local state
      // In production: const result = await deleteChild(childId)
      setChildren(prev => prev.filter(child => child.id !== childId))
    } catch (error) {
      console.error('Error deleting child:', error)
      alert('Failed to remove child. Please try again.')
    }
  }

  const getMaxChildren = () => {
    switch (userPlan) {
      case 'free': return 5
      case 'family': return 15
      case 'school': return 50
      default: return 5
    }
  }

  const getPlanIcon = () => {
    switch (userPlan) {
      case 'family': return <Users className="w-4 h-4" />
      case 'school': return <School className="w-4 h-4" />
      default: return <Crown className="w-4 h-4" />
    }
  }

  const getPlanColor = () => {
    switch (userPlan) {
      case 'family': return 'bg-blue-500'
      case 'school': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const canAddMore = children.length < getMaxChildren()

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading children...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Children Management</h1>
          <p className="text-muted-foreground">
            Manage your children's profiles and monitoring settings
          </p>
        </div>
        
        {/* Plan Badge */}
        <Badge variant="secondary" className="flex items-center gap-2">
          {getPlanIcon()}
          <span className="capitalize">{userPlan} Plan</span>
        </Badge>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Children</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{children.length}</div>
            <p className="text-xs text-muted-foreground">
              {children.length} of {getMaxChildren()} slots used
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <div className="h-4 w-4 bg-yellow-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {children.reduce((sum, child) => sum + (child.alertsCount || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total alerts across all children
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plan Status</CardTitle>
            <div className={`h-4 w-4 ${getPlanColor()} rounded-full`}></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{userPlan}</div>
            <p className="text-xs text-muted-foreground">
              {canAddMore ? 'Slots available' : 'Plan limit reached'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add Child Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Your Children</h2>
          <p className="text-sm text-muted-foreground">
            {canAddMore 
              ? `You can add ${getMaxChildren() - children.length} more children`
              : 'Maximum children reached for your plan'
            }
          </p>
        </div>
        
        <Button
          onClick={() => setShowAddForm(true)}
          disabled={!canAddMore}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Child
        </Button>
      </div>

      {/* Children Grid */}
      {children.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No children added yet</h3>
            <p className="text-muted-foreground mb-4">
              Get started by adding your first child to monitor their online activity.
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Child
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {children.map((child) => (
            <ChildProfileCard
              key={child.id}
              child={child}
              onEdit={setEditingChild}
              onDelete={handleDeleteChild}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Child Form Modal */}
      {(showAddForm || editingChild) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <ChildProfileForm
              child={editingChild || undefined}
              onSave={editingChild ? handleUpdateChild : handleAddChild}
              onCancel={() => {
                setShowAddForm(false)
                setEditingChild(null)
              }}
              maxChildren={getMaxChildren()}
              currentChildrenCount={children.length}
            />
          </div>
        </div>
      )}
    </div>
  )
}
