"use client"

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Upload, X, Camera, User, Phone, Calendar } from 'lucide-react'

interface Child {
  id: string
  name: string
  age: number
  phone: string
  profilePicture?: string
}

interface ChildProfileFormProps {
  child?: Child
  onSave: (child: Omit<Child, 'id'>) => void
  onCancel?: () => void
  maxChildren?: number
  currentChildrenCount?: number
}

export function ChildProfileForm({ 
  child, 
  onSave, 
  onCancel, 
  maxChildren = 5,
  currentChildrenCount = 0
}: ChildProfileFormProps) {
  const [formData, setFormData] = useState({
    name: child?.name || '',
    age: child?.age || '',
    phone: child?.phone || '',
    profilePicture: child?.profilePicture || ''
  })
  const [previewImage, setPreviewImage] = useState<string | null>(child?.profilePicture || null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size should be less than 5MB')
        return
      }

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPreviewImage(result)
        setFormData(prev => ({ ...prev, profilePicture: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      alert('Please enter child name')
      return
    }

    if (!formData.age || parseInt(formData.age.toString()) < 1 || parseInt(formData.age.toString()) > 18) {
      alert('Please enter a valid age between 1 and 18')
      return
    }

    if (!formData.phone.trim()) {
      alert('Please enter phone number')
      return
    }

    setIsLoading(true)
    
    try {
      await onSave({
        name: formData.name.trim(),
        age: parseInt(formData.age.toString()),
        phone: formData.phone.trim(),
        profilePicture: formData.profilePicture
      })
    } catch (error) {
      console.error('Error saving child:', error)
      alert('Failed to save child profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const removeImage = () => {
    setPreviewImage(null)
    setFormData(prev => ({ ...prev, profilePicture: '' }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const isEditing = !!child
  const canAddMore = currentChildrenCount < maxChildren

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">
              {isEditing ? 'Edit Child Profile' : 'Add Child Profile'}
            </CardTitle>
            <CardDescription>
              {!isEditing && !canAddMore && 
                `Maximum ${maxChildren} children reached for free tier`
              }
              {isEditing && 'Update child information'}
              {!isEditing && canAddMore && 'Add a new child to monitor'}
            </CardDescription>
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
          {/* Profile Picture Upload */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                {previewImage ? (
                  <img 
                    src={previewImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-muted-foreground" />
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                onClick={() => fileInputRef.current?.click()}
                disabled={!canAddMore && !isEditing}
              >
                <Camera className="w-4 h-4" />
              </Button>
              {previewImage && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="absolute top-0 right-0 rounded-full w-6 h-6 p-0 bg-red-500 hover:bg-red-600"
                  onClick={removeImage}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Enter child's name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              disabled={!canAddMore && !isEditing}
              required
            />
          </div>

          {/* Age */}
          <div>
            <label htmlFor="age" className="block text-sm font-medium mb-2">
              Age
            </label>
            <Input
              id="age"
              type="number"
              min="1"
              max="18"
              placeholder="Enter age"
              value={formData.age}
              onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
              disabled={!canAddMore && !isEditing}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Age should be between 1 and 18 years
            </p>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-2">
              Phone Number
            </label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              disabled={!canAddMore && !isEditing}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Include country code for international numbers
            </p>
          </div>

          {/* Plan Limit Info */}
          {!isEditing && (
            <div className="text-sm text-muted-foreground">
              {currentChildrenCount} of {maxChildren} children added (Free tier)
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={isLoading || (!canAddMore && !isEditing)}
              className="flex-1"
            >
              {isLoading ? (
                'Saving...'
              ) : (
                <>
                  {isEditing ? 'Update' : 'Add'} Child
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
