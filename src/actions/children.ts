'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { supabaseAdmin } from '@/utils/supabase-admin'

interface Child {
  id?: string
  name: string
  age: number
  phone: string
  profilePicture?: string
}

interface GuardianUser {
  id: string
  email: string
  children: string[]
  guardianPhone: string
  plan: 'free' | 'family' | 'school'
}

// Get current user (simplified - in production, you'd use proper auth)
async function getCurrentUser(): Promise<{ id: string; email: string } | null> {
  // This is a simplified version. In production, you'd:
  // 1. Get user from Supabase auth
  // 2. Verify session
  // 3. Return user data
  
  // For demo purposes, return a mock user
  return {
    id: 'demo-user-id',
    email: 'demo@example.com'
  }
}

// Get user's children
export async function getChildren() {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return {
        success: false,
        error: 'User not authenticated'
      }
    }

    const supabase = await createClient()
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('children')
      .eq('id', currentUser.id)
      .single()

    if (userError) {
      return {
        success: false,
        error: userError.message || 'Failed to fetch children'
      }
    }

    // Parse children array (stored as JSON in database)
    const children = userData?.children || []

    return {
      success: true,
      data: children
    }
  } catch (error) {
    console.error('Error in getChildren action:', error)
    return {
      success: false,
      error: 'An unexpected error occurred'
    }
  }
}

// Save children array to user profile
export async function saveChildren(children: Child[]) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return {
        success: false,
        error: 'User not authenticated'
      }
    }

    // Check plan limits
    const plan = await getUserPlan(currentUser.id)
    const maxChildren = getMaxChildrenForPlan(plan)
    
    if (children.length > maxChildren) {
      return {
        success: false,
        error: `Maximum ${maxChildren} children allowed for ${plan} plan`
      }
    }

    const supabase = await createClient()
    const { error } = await supabase
      .from('users')
      .update({ 
        children: children.map(child => ({
          id: child.id || generateId(),
          name: child.name,
          age: child.age,
          phone: child.phone,
          profilePicture: child.profilePicture
        }))
      })
      .eq('id', currentUser.id)

    if (error) {
      return {
        success: false,
        error: error.message || 'Failed to save children'
      }
    }

    // Revalidate pages that show children
    revalidatePath('/dashboard')
    revalidatePath('/children')
    revalidatePath('/settings')

    return {
      success: true,
      data: children
    }
  } catch (error) {
    console.error('Error in saveChildren action:', error)
    return {
      success: false,
      error: 'An unexpected error occurred'
    }
  }
}

// Add a single child
export async function addChild(child: Omit<Child, 'id'>) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return {
        success: false,
        error: 'User not authenticated'
      }
    }

    // Get current children
    const { data: currentChildren } = await getChildren()
    if (!currentChildren) {
      return {
        success: false,
        error: 'Failed to fetch current children'
      }
    }

    // Check plan limits
    const plan = await getUserPlan(currentUser.id)
    const maxChildren = getMaxChildrenForPlan(plan)
    
    if (currentChildren.length >= maxChildren) {
      return {
        success: false,
        error: `Maximum ${maxChildren} children allowed for ${plan} plan`
      }
    }

    // Add new child
    const newChild = {
      id: generateId(),
      ...child
    }

    const updatedChildren = [...currentChildren, newChild]
    return await saveChildren(updatedChildren)
  } catch (error) {
    console.error('Error in addChild action:', error)
    return {
      success: false,
      error: 'An unexpected error occurred'
    }
  }
}

// Update a child
export async function updateChild(childId: string, updates: Partial<Child>) {
  try {
    const { data: currentChildren } = await getChildren()
    if (!currentChildren) {
      return {
        success: false,
        error: 'Failed to fetch current children'
      }
    }

    const updatedChildren = currentChildren.map((child: any) =>
      child.id === childId ? { ...child, ...updates } : child
    )

    return await saveChildren(updatedChildren)
  } catch (error) {
    console.error('Error in updateChild action:', error)
    return {
      success: false,
      error: 'An unexpected error occurred'
    }
  }
}

// Delete a child
export async function deleteChild(childId: string) {
  try {
    const { data: currentChildren } = await getChildren()
    if (!currentChildren) {
      return {
        success: false,
        error: 'Failed to fetch current children'
      }
    }

    const updatedChildren = currentChildren.filter((child: any) => child.id !== childId)
    return await saveChildren(updatedChildren)
  } catch (error) {
    console.error('Error in deleteChild action:', error)
    return {
      success: false,
      error: 'An unexpected error occurred'
    }
  }
}

// Upload profile picture to Supabase Storage
export async function uploadProfilePicture(file: File, childId: string) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return {
        success: false,
        error: 'User not authenticated'
      }
    }

    // Validate file
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'File must be an image'
      }
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      return {
        success: false,
        error: 'File size must be less than 5MB'
      }
    }

    // Upload to Supabase Storage
    const fileName = `${currentUser.id}/${childId}/${Date.now()}-${file.name}`
    
    const { data, error } = await supabaseAdmin.storage
      .from('profile-pictures')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (error) {
      return {
        success: false,
        error: error.message || 'Failed to upload profile picture'
      }
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('profile-pictures')
      .getPublicUrl(fileName)

    return {
      success: true,
      data: publicUrl
    }
  } catch (error) {
    console.error('Error in uploadProfilePicture action:', error)
    return {
      success: false,
      error: 'An unexpected error occurred'
    }
  }
}

// Get user's plan
async function getUserPlan(userId: string): Promise<'free' | 'family' | 'school'> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('users')
      .select('plan')
      .eq('id', userId)
      .single()

    if (error || !data) {
      return 'free' // Default to free plan
    }

    return data.plan || 'free'
  } catch (error) {
    console.error('Error getting user plan:', error)
    return 'free'
  }
}

// Get max children allowed for plan
function getMaxChildrenForPlan(plan: 'free' | 'family' | 'school'): number {
  switch (plan) {
    case 'free':
      return 5
    case 'family':
      return 15
    case 'school':
      return 50
    default:
      return 5
  }
}

// Generate unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Get demo data
export async function getDemoChildren(): Promise<Child[]> {
  return [
    {
      id: 'demo-1',
      name: 'Rahim',
      age: 12,
      phone: '+1234567890',
      profilePicture: undefined
    },
    {
      id: 'demo-2',
      name: 'Karima',
      age: 10,
      phone: '+1234567891',
      profilePicture: undefined
    },
    {
      id: 'demo-3',
      name: 'Jamal',
      age: 14,
      phone: '+1234567892',
      profilePicture: undefined
    }
  ]
}
