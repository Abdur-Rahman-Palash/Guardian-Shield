"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { guardianDB } from '@/lib/database/realDatabase'
import type { RealDevice, RealSiteVisit, RealAlert, RealDailyObservation } from '@/lib/database/realDatabase'

interface RealDataContextType {
  devices: RealDevice[]
  siteVisits: RealSiteVisit[]
  alerts: RealAlert[]
  dailyObservations: RealDailyObservation[]
  isLoading: boolean
  error: string | null
  refreshData: () => Promise<void>
  addDevice: (device: Omit<RealDevice, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  recordSiteVisit: (visit: Omit<RealSiteVisit, 'id'>) => Promise<void>
  createAlert: (alert: Omit<RealAlert, 'id' | 'created_at'>) => Promise<void>
}

const RealDataContext = createContext<RealDataContextType | undefined>(undefined)

export function RealDataProvider({ children }: { children: React.ReactNode }) {
  const [devices, setDevices] = useState<RealDevice[]>([])
  const [siteVisits, setSiteVisits] = useState<RealSiteVisit[]>([])
  const [alerts, setAlerts] = useState<RealAlert[]>([])
  const [dailyObservations, setDailyObservations] = useState<RealDailyObservation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { createClient } = await import('@/utils/supabase/client')
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          setUserId(user.id)
        } else {
          // For demo purposes, use a mock user ID
          setUserId('demo-user-id')
        }
      } catch (error) {
        console.error('Error getting current user:', error)
        setUserId('demo-user-id')
      }
    }

    getCurrentUser()
  }, [])

  // Load data when userId is available
  useEffect(() => {
    if (userId) {
      loadData()
    }
  }, [userId])

  const loadData = async () => {
    if (!userId) return

    setIsLoading(true)
    setError(null)

    try {
      // Load all data in parallel
      const [devicesData, siteVisitsData, alertsData, observationsData] = await Promise.all([
        guardianDB.getDevicesByUserId(userId),
        guardianDB.getRecentSiteVisits('', 100), // Will be filtered by user_id in the database
        guardianDB.getAlertsByUserId(userId, 100),
        guardianDB.getDailyObservations(userId, 
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          new Date().toISOString().split('T')[0]
        )
      ])

      setDevices(devicesData)
      setSiteVisits(siteVisitsData)
      setAlerts(alertsData)
      setDailyObservations(observationsData)
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load data')
      
      // Fallback to demo data if database fails
      loadDemoData()
    } finally {
      setIsLoading(false)
    }
  }

  const loadDemoData = () => {
    // Fallback demo data
    const demoDevices: RealDevice[] = [
      {
        id: 'demo-device-1',
        user_id: userId || 'demo-user-id',
        name: "Sarah's Laptop",
        child_name: 'Sarah',
        mac_address: 'A1:B2:C3:D4:E5:F6',
        device_type: 'laptop',
        status: 'online',
        last_seen: new Date().toISOString(),
        usage_time: 245,
        blocked_attempts: 12,
        alerts_triggered: 8,
        parental_level: 'moderate',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'demo-device-2',
        user_id: userId || 'demo-user-id',
        name: "John's Phone",
        child_name: 'John',
        mac_address: 'G7:H8:I9:J0:K1:L2',
        device_type: 'smartphone',
        status: 'online',
        last_seen: new Date().toISOString(),
        usage_time: 180,
        blocked_attempts: 8,
        alerts_triggered: 5,
        parental_level: 'moderate',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'demo-device-3',
        user_id: userId || 'demo-user-id',
        name: "Emma's Tablet",
        child_name: 'Emma',
        mac_address: 'M3:N4:O5:P6:Q7:R8',
        device_type: 'tablet',
        status: 'offline',
        last_seen: new Date(Date.now() - 30 * 60000).toISOString(),
        usage_time: 120,
        blocked_attempts: 5,
        alerts_triggered: 3,
        parental_level: 'lenient',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]

    const demoSiteVisits: RealSiteVisit[] = [
      {
        id: 'demo-visit-1',
        device_id: 'demo-device-1',
        user_id: userId || 'demo-user-id',
        url: 'https://google.com',
        domain: 'google.com',
        is_risky: false,
        category: 'search',
        blocked: false,
        visit_time: new Date().toISOString(),
        duration: 300
      },
      {
        id: 'demo-visit-2',
        device_id: 'demo-device-1',
        user_id: userId || 'demo-user-id',
        url: 'https://bet365.com',
        domain: 'bet365.com',
        is_risky: true,
        category: 'gambling',
        blocked: true,
        visit_time: new Date(Date.now() - 10 * 60000).toISOString(),
        duration: 5
      }
    ]

    const demoAlerts: RealAlert[] = [
      {
        id: 'demo-alert-1',
        device_id: 'demo-device-1',
        user_id: userId || 'demo-user-id',
        alert_type: 'blocked_site',
        message: 'Blocked access to gambling site: bet365.com',
        severity: 'high',
        resolved: false,
        created_at: new Date(Date.now() - 5 * 60000).toISOString()
      },
      {
        id: 'demo-alert-2',
        device_id: 'demo-device-2',
        user_id: userId || 'demo-user-id',
        alert_type: 'unusual_activity',
        message: 'Late night browsing detected',
        severity: 'medium',
        resolved: false,
        created_at: new Date(Date.now() - 15 * 60000).toISOString()
      }
    ]

    const demoObservations: RealDailyObservation[] = [
      {
        id: 'demo-obs-1',
        device_id: 'demo-device-1',
        user_id: userId || 'demo-user-id',
        date: new Date().toISOString().split('T')[0],
        total_usage_time: 245,
        blocked_sites: 12,
        alerts_triggered: 8,
        risk_level: 'medium',
        top_blocked_categories: ['gambling', 'adult'],
        unusual_activity: ['Late night activity'],
        recommendations: {
          adjust_settings: true,
          conversation_topics: ['Online safety'],
          time_restrictions: ['Limit after 9 PM'],
          new_rules: ['Stricter filtering']
        },
        created_at: new Date().toISOString()
      }
    ]

    setDevices(demoDevices)
    setSiteVisits(demoSiteVisits)
    setAlerts(demoAlerts)
    setDailyObservations(demoObservations)
  }

  const refreshData = async () => {
    await loadData()
  }

  const addDevice = async (device: Omit<RealDevice, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newDevice = await guardianDB.registerDevice(device)
      setDevices(prev => [newDevice, ...prev])
    } catch (error) {
      console.error('Error adding device:', error)
      throw error
    }
  }

  const recordSiteVisit = async (visit: Omit<RealSiteVisit, 'id'>) => {
    try {
      const newVisit = await guardianDB.recordSiteVisit(visit)
      setSiteVisits(prev => [newVisit, ...prev])
    } catch (error) {
      console.error('Error recording site visit:', error)
      throw error
    }
  }

  const createAlert = async (alert: Omit<RealAlert, 'id' | 'created_at'>) => {
    try {
      const newAlert = await guardianDB.createAlert(alert)
      setAlerts(prev => [newAlert, ...prev])
    } catch (error) {
      console.error('Error creating alert:', error)
      throw error
    }
  }

  const value: RealDataContextType = {
    devices,
    siteVisits,
    alerts,
    dailyObservations,
    isLoading,
    error,
    refreshData,
    addDevice,
    recordSiteVisit,
    createAlert
  }

  return (
    <RealDataContext.Provider value={value}>
      {children}
    </RealDataContext.Provider>
  )
}

export function useRealData() {
  const context = useContext(RealDataContext)
  if (context === undefined) {
    throw new Error('useRealData must be used within a RealDataProvider')
  }
  return context
}
