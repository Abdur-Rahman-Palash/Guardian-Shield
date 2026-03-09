// Real Database Implementation for Guardian Shield
// This file replaces mock data with real database operations

import { createClient } from '@/utils/supabase/client'

export interface RealDevice {
  id: string
  name: string
  child_name: string
  mac_address: string
  device_type: 'laptop' | 'smartphone' | 'tablet' | 'desktop'
  status: 'online' | 'offline' | 'restricted'
  last_seen: string
  usage_time: number
  blocked_attempts: number
  alerts_triggered: number
  parental_level: 'lenient' | 'moderate' | 'strict'
  user_id: string
  created_at: string
  updated_at: string
}

export interface RealSiteVisit {
  id: string
  device_id: string
  url: string
  domain: string
  is_risky: boolean
  category?: string
  blocked: boolean
  visit_time: string
  duration: number
  user_id: string
}

export interface RealAlert {
  id: string
  device_id: string
  alert_type: 'blocked_site' | 'unusual_activity' | 'time_limit' | 'risk_detected'
  message: string
  severity: 'low' | 'medium' | 'high'
  resolved: boolean
  created_at: string
  user_id: string
}

export interface RealDailyObservation {
  id: string
  device_id: string
  date: string
  total_usage_time: number
  blocked_sites: number
  alerts_triggered: number
  risk_level: 'low' | 'medium' | 'high'
  top_blocked_categories: string[]
  unusual_activity: string[]
  recommendations: {
    adjust_settings: boolean
    conversation_topics: string[]
    time_restrictions: string[]
    new_rules: string[]
  }
  user_id: string
  created_at: string
}

export interface RealRiskyDomain {
  id: string
  domain: string
  category: 'adult' | 'gambling' | 'illegal' | 'social' | 'gaming' | 'other'
  severity: 'low' | 'medium' | 'high'
  active: boolean
  created_at: string
  updated_at: string
}

// Database Operations Class
export class GuardianShieldDatabase {
  private supabase = createClient()

  // Device Management
  async registerDevice(device: Omit<RealDevice, 'id' | 'created_at' | 'updated_at'>): Promise<RealDevice> {
    try {
      const { data, error } = await this.supabase
        .from('devices')
        .insert([{
          ...device,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error registering device:', error)
      throw error
    }
  }

  async getDevicesByUserId(userId: string): Promise<RealDevice[]> {
    try {
      const { data, error } = await this.supabase
        .from('devices')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting devices:', error)
      throw error
    }
  }

  async updateDeviceStatus(deviceId: string, status: RealDevice['status']): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('devices')
        .update({ 
          status,
          last_seen: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', deviceId)

      if (error) throw error
    } catch (error) {
      console.error('Error updating device status:', error)
      throw error
    }
  }

  async updateDeviceStats(deviceId: string, stats: {
    usage_time?: number
    blocked_attempts?: number
    alerts_triggered?: number
  }): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('devices')
        .update({
          ...stats,
          updated_at: new Date().toISOString()
        })
        .eq('id', deviceId)

      if (error) throw error
    } catch (error) {
      console.error('Error updating device stats:', error)
      throw error
    }
  }

  // Site Visit Tracking
  async recordSiteVisit(visit: Omit<RealSiteVisit, 'id'>): Promise<RealSiteVisit> {
    try {
      const { data, error } = await this.supabase
        .from('site_visits')
        .insert([visit])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error recording site visit:', error)
      throw error
    }
  }

  async getRecentSiteVisits(deviceId: string, limit: number = 50): Promise<RealSiteVisit[]> {
    try {
      const { data, error } = await this.supabase
        .from('site_visits')
        .select('*')
        .eq('device_id', deviceId)
        .order('visit_time', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting site visits:', error)
      throw error
    }
  }

  // Alert Management
  async createAlert(alert: Omit<RealAlert, 'id' | 'created_at'>): Promise<RealAlert> {
    try {
      const { data, error } = await this.supabase
        .from('alerts')
        .insert([{
          ...alert,
          created_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating alert:', error)
      throw error
    }
  }

  async getAlertsByUserId(userId: string, limit: number = 100): Promise<RealAlert[]> {
    try {
      const { data, error } = await this.supabase
        .from('alerts')
        .select(`
          *,
          devices (
            name,
            child_name
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting alerts:', error)
      throw error
    }
  }

  async resolveAlert(alertId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('alerts')
        .update({ resolved: true })
        .eq('id', alertId)

      if (error) throw error
    } catch (error) {
      console.error('Error resolving alert:', error)
      throw error
    }
  }

  // Daily Observations
  async createDailyObservation(observation: Omit<RealDailyObservation, 'id' | 'created_at'>): Promise<RealDailyObservation> {
    try {
      const { data, error } = await this.supabase
        .from('daily_observations')
        .insert([{
          ...observation,
          created_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating daily observation:', error)
      throw error
    }
  }

  async getDailyObservations(userId: string, startDate: string, endDate: string): Promise<RealDailyObservation[]> {
    try {
      const { data, error } = await this.supabase
        .from('daily_observations')
        .select(`
          *,
          devices (
            name,
            child_name
          )
        `)
        .eq('user_id', userId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting daily observations:', error)
      throw error
    }
  }

  // Risky Domains Management
  async getRiskyDomains(activeOnly: boolean = true): Promise<RealRiskyDomain[]> {
    try {
      let query = this.supabase
        .from('risky_domains')
        .select('*')
        .order('created_at', { ascending: false })

      if (activeOnly) {
        query = query.eq('active', true)
      }

      const { data, error } = await query
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting risky domains:', error)
      throw error
    }
  }

  async addRiskyDomain(domain: Omit<RealRiskyDomain, 'id' | 'created_at' | 'updated_at'>): Promise<RealRiskyDomain> {
    try {
      const { data, error } = await this.supabase
        .from('risky_domains')
        .insert([{
          ...domain,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error adding risky domain:', error)
      throw error
    }
  }

  // Analytics and Statistics
  async getUsageStats(userId: string, period: 'day' | 'week' | 'month'): Promise<{
    totalDevices: number
    totalUsageTime: number
    totalBlockedSites: number
    totalAlerts: number
    topCategories: { category: string; count: number }[]
    riskDistribution: { level: string; count: number }[]
  }> {
    try {
      // Get devices
      const { data: devices, error: devicesError } = await this.supabase
        .from('devices')
        .select('id')
        .eq('user_id', userId)

      if (devicesError) throw devicesError

      const deviceIds = devices?.map(d => d.id) || []

      // Calculate date range
      const now = new Date()
      let startDate: Date
      switch (period) {
        case 'day':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
          break
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
      }

      // Get site visits
      const { data: siteVisits, error: visitsError } = await this.supabase
        .from('site_visits')
        .select('*')
        .in('device_id', deviceIds)
        .gte('visit_time', startDate.toISOString())

      if (visitsError) throw visitsError

      // Get alerts
      const { data: alerts, error: alertsError } = await this.supabase
        .from('alerts')
        .select('*')
        .in('device_id', deviceIds)
        .gte('created_at', startDate.toISOString())

      if (alertsError) throw alertsError

      // Calculate statistics
      const totalUsageTime = siteVisits?.reduce((sum, visit) => sum + visit.duration, 0) || 0
      const totalBlockedSites = siteVisits?.filter(visit => visit.blocked).length || 0
      const totalAlerts = alerts?.length || 0

      // Get top categories
      const categoryCount: { [key: string]: number } = {}
      siteVisits?.forEach(visit => {
        if (visit.category) {
          categoryCount[visit.category] = (categoryCount[visit.category] || 0) + 1
        }
      })
      const topCategories = Object.entries(categoryCount)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      // Get risk distribution
      const riskCount: { [key: string]: number } = { low: 0, medium: 0, high: 0 }
      alerts?.forEach(alert => {
        riskCount[alert.severity]++
      })
      const riskDistribution: { level: string; count: number }[] = Object.entries(riskCount)
        .map(([level, count]) => ({ level, count }))

      return {
        totalDevices: deviceIds.length,
        totalUsageTime,
        totalBlockedSites,
        totalAlerts,
        topCategories,
        riskDistribution
      }
    } catch (error) {
      console.error('Error getting usage stats:', error)
      throw error
    }
  }

  // Initialize Database with Default Data
  async initializeDatabase(): Promise<void> {
    try {
      // Check if risky domains exist
      const { data: existingDomains, error: checkError } = await this.supabase
        .from('risky_domains')
        .select('id')
        .limit(1)

      if (checkError) throw checkError

      // If no domains exist, add default risky domains
      if (!existingDomains || existingDomains.length === 0) {
        const defaultDomains = [
          { domain: 'pornhub.com', category: 'adult' as const, severity: 'high' as const, active: true },
          { domain: 'xvideos.com', category: 'adult' as const, severity: 'high' as const, active: true },
          { domain: 'xnxx.com', category: 'adult' as const, severity: 'high' as const, active: true },
          { domain: 'bet365.com', category: 'gambling' as const, severity: 'medium' as const, active: true },
          { domain: 'williamhill.com', category: 'gambling' as const, severity: 'medium' as const, active: true },
          { domain: 'paddypower.com', category: 'gambling' as const, severity: 'medium' as const, active: true },
          { domain: 'darkweb.com', category: 'illegal' as const, severity: 'high' as const, active: true },
          { domain: 'illegaldrugs.com', category: 'illegal' as const, severity: 'high' as const, active: true },
          { domain: 'facebook.com', category: 'social' as const, severity: 'low' as const, active: true },
          { domain: 'instagram.com', category: 'social' as const, severity: 'low' as const, active: true },
          { domain: 'twitter.com', category: 'social' as const, severity: 'low' as const, active: true },
          { domain: 'tiktok.com', category: 'social' as const, severity: 'low' as const, active: true },
        ]

        for (const domain of defaultDomains) {
          await this.addRiskyDomain(domain)
        }
      }
    } catch (error) {
      console.error('Error initializing database:', error)
      throw error
    }
  }
}

// Export singleton instance
export const guardianDB = new GuardianShieldDatabase()
