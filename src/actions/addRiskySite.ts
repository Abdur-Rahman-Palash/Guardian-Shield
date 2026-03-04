'use server'

import { revalidatePath } from 'next/cache'
import { addRiskySite as addRiskySiteToDb } from '@/utils/supabase-admin'
import { RiskySite } from '@/types'

export async function addRiskySite(site: Omit<RiskySite, 'id'>) {
  try {
    const { data, error } = await addRiskySiteToDb(site)
    
    if (error) {
      return {
        success: false,
        error: error.message || 'Failed to add risky site'
      }
    }

    // Revalidate the risky sites page to show new data
    revalidatePath('/admin/risky-sites')
    
    return {
      success: true,
      data: data
    }
  } catch (error) {
    console.error('Error in addRiskySite action:', error)
    return {
      success: false,
      error: 'An unexpected error occurred'
    }
  }
}

export async function updateRiskySite(id: string, updates: Partial<RiskySite>) {
  try {
    const { updateRiskySite: updateSite } = await import('@/utils/supabase-admin')
    const { data, error } = await updateSite(id, updates)
    
    if (error) {
      return {
        success: false,
        error: error.message || 'Failed to update risky site'
      }
    }

    // Revalidate the risky sites page to show updated data
    revalidatePath('/admin/risky-sites')
    
    return {
      success: true,
      data: data
    }
  } catch (error) {
    console.error('Error in updateRiskySite action:', error)
    return {
      success: false,
      error: 'An unexpected error occurred'
    }
  }
}

export async function deleteRiskySite(id: string) {
  try {
    const { deleteRiskySite: deleteSite } = await import('@/utils/supabase-admin')
    const { error } = await deleteSite(id)
    
    if (error) {
      return {
        success: false,
        error: error.message || 'Failed to delete risky site'
      }
    }

    // Revalidate the risky sites page to show updated data
    revalidatePath('/admin/risky-sites')
    
    return {
      success: true
    }
  } catch (error) {
    console.error('Error in deleteRiskySite action:', error)
    return {
      success: false,
      error: 'An unexpected error occurred'
    }
  }
}

export async function getRiskySites() {
  try {
    const { getRiskySites: getSites } = await import('@/utils/supabase-admin')
    const { data, error } = await getSites()
    
    if (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch risky sites'
      }
    }

    return {
      success: true,
      data: data || []
    }
  } catch (error) {
    console.error('Error in getRiskySites action:', error)
    return {
      success: false,
      error: 'An unexpected error occurred'
    }
  }
}

export async function importRiskySites(sites: Omit<RiskySite, 'id'>[]) {
  try {
    const results = []
    
    for (const site of sites) {
      const result = await addRiskySite(site)
      results.push(result)
    }
    
    const successCount = results.filter(r => r.success).length
    const errorCount = results.filter(r => !r.success).length
    
    // Revalidate the risky sites page to show new data
    revalidatePath('/admin/risky-sites')
    
    return {
      success: true,
      data: {
        total: sites.length,
        successCount,
        errorCount,
        results
      }
    }
  } catch (error) {
    console.error('Error in importRiskySites action:', error)
    return {
      success: false,
      error: 'An unexpected error occurred'
    }
  }
}
