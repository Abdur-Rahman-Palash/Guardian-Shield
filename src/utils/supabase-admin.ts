import { createClient } from '@supabase/supabase-js'
import { RiskySite, Alert, GuardianUser } from '@/types'

// Admin client with service role key for server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

// Test functions for Guardian Shield
export async function addRiskySite(site: Omit<RiskySite, 'id'>): Promise<{ data: RiskySite | null; error: any }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('risky_sites')
      .insert({
        domain: site.domain,
        category: site.category,
        active: site.active,
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding risky site:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Unexpected error adding risky site:', error)
    return { data: null, error }
  }
}

export async function getAlerts(limit: number = 50): Promise<{ data: Alert[] | null; error: any }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('alerts')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching alerts:', error)
      return { data: null, error }
    }

    // Transform database rows to Alert interface
    const alerts: Alert[] = data?.map((alert: any) => ({
      id: alert.id,
      childName: alert.child_name,
      url: alert.url,
      domain: alert.domain,
      screenshot: alert.screenshot,
      timestamp: new Date(alert.timestamp),
      guardianPhone: alert.guardian_phone,
    })) || []

    return { data: alerts, error: null }
  } catch (error) {
    console.error('Unexpected error fetching alerts:', error)
    return { data: null, error }
  }
}

export async function getUserAlerts(userId: string, limit: number = 50): Promise<{ data: Alert[] | null; error: any }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('alerts')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching user alerts:', error)
      return { data: null, error }
    }

    // Transform database rows to Alert interface
    const alerts: Alert[] = data?.map((alert: any) => ({
      id: alert.id,
      childName: alert.child_name,
      url: alert.url,
      domain: alert.domain,
      screenshot: alert.screenshot,
      timestamp: new Date(alert.timestamp),
      guardianPhone: alert.guardian_phone,
    })) || []

    return { data: alerts, error: null }
  } catch (error) {
    console.error('Unexpected error fetching user alerts:', error)
    return { data: null, error }
  }
}

export async function createAlert(alert: Omit<Alert, 'id' | 'timestamp'> & { userId: string }): Promise<{ data: Alert | null; error: any }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('alerts')
      .insert({
        child_name: alert.childName,
        url: alert.url,
        domain: alert.domain,
        screenshot: alert.screenshot,
        guardian_phone: alert.guardianPhone,
        user_id: alert.userId,
        timestamp: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating alert:', error)
      return { data: null, error }
    }

    // Transform database row to Alert interface
    const transformedAlert: Alert = {
      id: (data as any).id,
      childName: (data as any).child_name,
      url: (data as any).url,
      domain: (data as any).domain,
      screenshot: (data as any).screenshot,
      timestamp: new Date((data as any).timestamp),
      guardianPhone: (data as any).guardian_phone,
    }

    return { data: transformedAlert, error: null }
  } catch (error) {
    console.error('Unexpected error creating alert:', error)
    return { data: null, error }
  }
}

export async function getRiskySites(): Promise<{ data: RiskySite[] | null; error: any }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('risky_sites')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching risky sites:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Unexpected error fetching risky sites:', error)
    return { data: null, error }
  }
}

export async function updateRiskySite(id: string, updates: Partial<RiskySite>): Promise<{ data: RiskySite | null; error: any }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('risky_sites')
      .update({
        domain: updates.domain,
        category: updates.category,
        active: updates.active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating risky site:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Unexpected error updating risky site:', error)
    return { data: null, error }
  }
}

export async function deleteRiskySite(id: string): Promise<{ error: any }> {
  try {
    const { error } = await supabaseAdmin
      .from('risky_sites')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting risky site:', error)
      return { error }
    }

    return { error: null }
  } catch (error) {
    console.error('Unexpected error deleting risky site:', error)
    return { error }
  }
}

// User management functions
export async function createUser(user: Omit<GuardianUser, 'id'>): Promise<{ data: GuardianUser | null; error: any }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        email: user.email,
        children: user.children,
        guardian_phone: user.guardianPhone,
        plan: user.plan,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating user:', error)
      return { data: null, error }
    }

    // Transform database row to GuardianUser interface
    const transformedUser: GuardianUser = {
      id: (data as any).id,
      email: (data as any).email,
      children: (data as any).children,
      guardianPhone: (data as any).guardian_phone,
      plan: (data as any).plan,
    }

    return { data: transformedUser, error: null }
  } catch (error) {
    console.error('Unexpected error creating user:', error)
    return { data: null, error }
  }
}

export async function getUserByEmail(email: string): Promise<{ data: GuardianUser | null; error: any }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      console.error('Error fetching user by email:', error)
      return { data: null, error }
    }

    // Transform database row to GuardianUser interface
    const transformedUser: GuardianUser = {
      id: (data as any).id,
      email: (data as any).email,
      children: (data as any).children,
      guardianPhone: (data as any).guardian_phone,
      plan: (data as any).plan,
    }

    return { data: transformedUser, error: null }
  } catch (error) {
    console.error('Unexpected error fetching user by email:', error)
    return { data: null, error }
  }
}

export { supabaseAdmin }
