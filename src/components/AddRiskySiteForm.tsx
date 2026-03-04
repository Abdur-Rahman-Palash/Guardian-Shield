"use client"

import { useState } from 'react'
import { RiskySite } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, X } from 'lucide-react'

interface AddRiskySiteFormProps {
  onSiteAdd?: (site: Omit<RiskySite, 'id'>) => void
  onCancel?: () => void
}

export function AddRiskySiteForm({ onSiteAdd, onCancel }: AddRiskySiteFormProps) {
  const [domain, setDomain] = useState('')
  const [category, setCategory] = useState<'porn' | 'gambling' | 'other'>('other')
  const [active, setActive] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!domain.trim()) {
      alert('Please enter a domain')
      return
    }

    setIsLoading(true)
    
    try {
      const newSite: Omit<RiskySite, 'id'> = {
        domain: domain.trim().toLowerCase(),
        category,
        active
      }

      if (onSiteAdd) {
        await onSiteAdd(newSite)
      }

      // Reset form
      setDomain('')
      setCategory('other')
      setActive(true)
    } catch (error) {
      console.error('Error adding site:', error)
      alert('Failed to add site. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const categories = [
    { value: 'porn', label: 'Porn', variant: 'destructive' as const },
    { value: 'gambling', label: 'Gambling', variant: 'secondary' as const },
    { value: 'other', label: 'Other', variant: 'outline' as const }
  ]

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Add Risky Site</CardTitle>
            <CardDescription>Add a new domain to the blocklist</CardDescription>
          </div>
          {onCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="domain" className="block text-sm font-medium mb-2">
              Domain
            </label>
            <Input
              id="domain"
              type="text"
              placeholder="example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter the domain without protocol (e.g., example.com)
            </p>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-2">
              Category
            </label>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value as any)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    category === cat.value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-foreground border-border hover:bg-muted'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium">Active</span>
            </label>
            <p className="text-xs text-muted-foreground mt-1">
              When active, this domain will be blocked
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={isLoading || !domain.trim()}
              className="flex-1"
            >
              {isLoading ? (
                'Adding...'
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Site
                </>
              )}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
