'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

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

// Get all alerts
export async function getAlerts() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .order('timestamp', { ascending: false })

    if (error) {
      console.error('Error fetching alerts:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Error in getAlerts action:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Get alerts by status
export async function getAlertsByStatus(status: 'new' | 'read' | 'archived') {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('status', status)
      .order('timestamp', { ascending: false })

    if (error) {
      console.error('Error fetching alerts by status:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Error in getAlertsByStatus action:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Get alerts by child
export async function getAlertsByChild(childName: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('child_name', childName)
      .order('timestamp', { ascending: false })

    if (error) {
      console.error('Error fetching alerts by child:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Error in getAlertsByChild action:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Create new alert
export async function createAlert(alert: Omit<Alert, 'id' | 'timestamp'>) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('alerts')
      .insert({
        ...alert,
        timestamp: new Date().toISOString(),
        status: 'new'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating alert:', error)
      return { success: false, error: error.message }
    }

    // Revalidate alerts page
    revalidatePath('/dashboard/alerts')

    return { success: true, data }
  } catch (error) {
    console.error('Error in createAlert action:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Update alert status
export async function updateAlertStatus(alertId: string, status: 'new' | 'read' | 'archived') {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('alerts')
      .update({ status })
      .eq('id', alertId)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating alert status:', error)
      return { success: false, error: error.message }
    }
    
    // Revalidate alerts page
    revalidatePath('/dashboard/alerts')
    
    return { success: true, data }
  } catch (error) {
    console.error('Error in updateAlertStatus action:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Delete alert
export async function deleteAlert(alertId: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('alerts')
      .delete()
      .eq('id', alertId)

    if (error) {
      console.error('Error deleting alert:', error)
      return { success: false, error: error.message }
    }

    // Revalidate alerts page
    revalidatePath('/dashboard/alerts')

    return { success: true }
  } catch (error) {
    console.error('Error in deleteAlert action:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Archive multiple alerts
export async function archiveMultipleAlerts(alertIds: string[]) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('alerts')
      .update({ status: 'archived' })
      .in('id', alertIds)
      .select()

    if (error) {
      console.error('Error archiving alerts:', error)
      return { success: false, error: error.message }
    }

    // Revalidate alerts page
    revalidatePath('/dashboard/alerts')

    return { success: true, data }
  } catch (error) {
    console.error('Error in archiveMultipleAlerts action:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Get alert statistics
export async function getAlertStats() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('alerts')
      .select('status')

    if (error) {
      console.error('Error fetching alert stats:', error)
      return { success: false, error: error.message }
    }

    const stats = {
      total: data?.length || 0,
      new: data?.filter(alert => alert.status === 'new').length || 0,
      read: data?.filter(alert => alert.status === 'read').length || 0,
      archived: data?.filter(alert => alert.status === 'archived').length || 0
    }

    return { success: true, data: stats }
  } catch (error) {
    console.error('Error in getAlertStats action:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Export alerts to CSV
export async function exportAlertsToCSV() {
  try {
    const { success, data } = await getAlerts()
    
    if (!success || !data) {
      return { success: false, error: 'Failed to fetch alerts' }
    }

    const headers = ['Child Name', 'URL', 'Domain', 'Status', 'Timestamp', 'Category', 'Severity']
    const rows = data.map(alert => [
      alert.childName,
      alert.url,
      alert.domain,
      alert.status,
      alert.timestamp,
      alert.category || '',
      alert.severity || ''
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    return { success: true, data: csvContent }
  } catch (error) {
    console.error('Error in exportAlertsToCSV action:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
