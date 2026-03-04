// Real-time tracking service for Guardian Shield

export interface Location {
  latitude: number
  longitude: number
  timestamp: Date
  accuracy?: number
}

export interface Geofence {
  id: string
  name: string
  latitude: number
  longitude: number
  radius: number // in meters
  type: 'safe' | 'restricted'
}

export interface ChildLocation {
  childId: string
  location: Location
  isWithinGeofence: boolean
  currentGeofence?: Geofence
  speed?: number
  heading?: number
}

export interface WebActivity {
  childId: string
  url: string
  domain: string
  title: string
  timestamp: Date
  category: 'safe' | 'suspicious' | 'blocked'
  screenshot?: string
  duration: number // time spent on page in seconds
}

export interface TrackingAlert {
  id: string
  childId: string
  childName: string
  type: 'geofence breach' | 'suspicious activity' | 'device offline' | 'emergency'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  location?: Location
  timestamp: Date
  acknowledged: boolean
}

class TrackingService {
  private geofences: Geofence[] = []
  private alerts: TrackingAlert[] = []
  private locationHistory: Map<string, Location[]> = new Map()
  private webActivity: Map<string, WebActivity[]> = new Map()
  private listeners: Map<string, Function[]> = new Map()
  private simulationInterval: NodeJS.Timeout | null = null

  constructor() {
    this.initializeDefaultGeofences()
  }

  private initializeDefaultGeofences() {
    // Default safe zones (example locations in Dhaka)
    this.geofences = [
      {
        id: 'home',
        name: 'Home',
        latitude: 23.8103,
        longitude: 90.4125,
        radius: 100,
        type: 'safe'
      },
      {
        id: 'school',
        name: 'School',
        latitude: 23.8315,
        longitude: 90.4113,
        radius: 200,
        type: 'safe'
      },
      {
        id: 'restricted_area',
        name: 'Restricted Area',
        latitude: 23.7500,
        longitude: 90.3900,
        radius: 500,
        type: 'restricted'
      }
    ]
  }

  // Event listener system
  public on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(callback)
  }

  public off(event: string, callback: Function) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  private emit(event: string, data: any) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.forEach(callback => callback(data))
    }
  }

  // Location tracking
  public async getCurrentLocation(childId: string): Promise<Location> {
    // Simulate getting current location
    // In real app, this would get from device GPS
    return this.simulateLocation(childId)
  }

  private simulateLocation(childId: string): Location {
    const baseLocations = {
      '1': { lat: 23.8103, lng: 90.4125 }, // Ahmed - near home
      '2': { lat: 23.8315, lng: 90.4113 }, // Sara - at school
      '3': { lat: 23.7500, lng: 90.3900 }  // Mohammed - moving
    }

    const base = baseLocations[childId as keyof typeof baseLocations] || { lat: 23.8103, lng: 90.4125 }
    
    // Add some random movement
    const latitude = base.lat + (Math.random() - 0.5) * 0.01
    const longitude = base.lng + (Math.random() - 0.5) * 0.01
    
    return {
      latitude,
      longitude,
      timestamp: new Date(),
      accuracy: Math.random() * 10 + 5
    }
  }

  public startRealTimeTracking() {
    if (this.simulationInterval) return

    this.simulationInterval = setInterval(() => {
      this.updateAllLocations()
      this.simulateWebActivity()
    }, 5000) // Update every 5 seconds
  }

  public stopRealTimeTracking() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval)
      this.simulationInterval = null
    }
  }

  private updateAllLocations() {
    const childIds = ['1', '2', '3'] // Simulated child IDs
    
    childIds.forEach(childId => {
      const location = this.simulateLocation(childId)
      this.updateLocation(childId, location)
    })
  }

  private updateLocation(childId: string, location: Location) {
    // Add to history
    if (!this.locationHistory.has(childId)) {
      this.locationHistory.set(childId, [])
    }
    const history = this.locationHistory.get(childId)!
    history.push(location)
    
    // Keep only last 100 locations
    if (history.length > 100) {
      history.shift()
    }

    // Check geofences
    const geofenceStatus = this.checkGeofences(location)
    
    const childLocation: ChildLocation = {
      childId,
      location,
      isWithinGeofence: geofenceStatus.isWithin,
      currentGeofence: geofenceStatus.geofence,
      speed: Math.random() * 20, // Simulated speed km/h
      heading: Math.random() * 360 // Simulated heading
    }

    // Emit location update
    this.emit('locationUpdate', childLocation)

    // Check for geofence breaches
    if (geofenceStatus.breach) {
      this.createGeofenceAlert(childId, geofenceStatus.geofence!, location)
    }
  }

  private checkGeofences(location: Location): { isWithin: boolean; geofence?: Geofence; breach?: boolean } {
    for (const geofence of this.geofences) {
      const distance = this.calculateDistance(location, geofence)
      if (distance <= geofence.radius) {
        const wasOutside = !this.isCurrentlyInGeofence(location, geofence)
        return {
          isWithin: true,
          geofence,
          breach: geofence.type === 'restricted' && wasOutside
        }
      }
    }
    return { isWithin: false }
  }

  private isCurrentlyInGeofence(location: Location, geofence: Geofence): boolean {
    // Simplified check - in real app, would check previous location
    return false
  }

  private calculateDistance(location1: Location, location2: Geofence): number {
    // Haversine formula for calculating distance between two points
    const R = 6371e3 // Earth's radius in meters
    const dLat = this.toRadians(location2.latitude - location1.latitude)
    const dLon = this.toRadians(location2.longitude - location1.longitude)
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(this.toRadians(location1.latitude)) * Math.cos(this.toRadians(location2.latitude)) *
              Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  private createGeofenceAlert(childId: string, geofence: Geofence, location: Location) {
    const alert: TrackingAlert = {
      id: `alert_${Date.now()}_${childId}`,
      childId,
      childName: this.getChildName(childId),
      type: geofence.type === 'restricted' ? 'geofence breach' : 'geofence breach',
      severity: geofence.type === 'restricted' ? 'high' : 'medium',
      message: `${geofence.type === 'restricted' ? 'Entered restricted area' : 'Left safe zone'}: ${geofence.name}`,
      location,
      timestamp: new Date(),
      acknowledged: false
    }

    this.alerts.unshift(alert)
    this.emit('newAlert', alert)
  }

  private getChildName(childId: string): string {
    const names = {
      '1': 'Ahmed',
      '2': 'Sara',
      '3': 'Mohammed'
    }
    return names[childId as keyof typeof names] || 'Unknown'
  }

  // Web activity simulation
  private simulateWebActivity() {
    const childIds = ['1', '2', '3']
    const suspiciousSites = [
      { url: 'https://suspicious-site.com', domain: 'suspicious-site.com', title: 'Suspicious Content', category: 'suspicious' as const },
      { url: 'https://another-bad-site.com', domain: 'another-bad-site.com', title: 'Bad Content', category: 'blocked' as const }
    ]
    const safeSites = [
      { url: 'https://youtube.com', domain: 'youtube.com', title: 'YouTube', category: 'safe' as const },
      { url: 'https://google.com', domain: 'google.com', title: 'Google', category: 'safe' as const },
      { url: 'https://khanacademy.org', domain: 'khanacademy.org', title: 'Khan Academy', category: 'safe' as const }
    ]

    childIds.forEach(childId => {
      if (Math.random() > 0.7) { // 30% chance of new activity
        const isSuspicious = Math.random() > 0.8 // 20% chance of suspicious activity
        const sites = isSuspicious ? suspiciousSites : safeSites
        const site = sites[Math.floor(Math.random() * sites.length)]

        const activity: WebActivity = {
          childId,
          url: site.url,
          domain: site.domain,
          title: site.title,
          timestamp: new Date(),
          category: site.category,
          duration: Math.floor(Math.random() * 300) + 30 // 30-330 seconds
        }

        this.addWebActivity(activity)

        if (site.category === 'suspicious' || site.category === 'blocked') {
          this.createWebActivityAlert(childId, activity)
        }
      }
    })
  }

  private addWebActivity(activity: WebActivity) {
    if (!this.webActivity.has(activity.childId)) {
      this.webActivity.set(activity.childId, [])
    }
    const activities = this.webActivity.get(activity.childId)!
    activities.unshift(activity)
    
    // Keep only last 50 activities
    if (activities.length > 50) {
      activities.pop()
    }

    this.emit('webActivity', activity)
  }

  private createWebActivityAlert(childId: string, activity: WebActivity) {
    const alert: TrackingAlert = {
      id: `web_alert_${Date.now()}_${childId}`,
      childId,
      childName: this.getChildName(childId),
      type: 'suspicious activity',
      severity: activity.category === 'blocked' ? 'high' : 'medium',
      message: `Visited ${activity.category === 'blocked' ? 'blocked' : 'suspicious'} site: ${activity.domain}`,
      timestamp: new Date(),
      acknowledged: false
    }

    this.alerts.unshift(alert)
    this.emit('newAlert', alert)
  }

  // Getters
  public getGeofences(): Geofence[] {
    return this.geofences
  }

  public getAlerts(): TrackingAlert[] {
    return this.alerts
  }

  public getLocationHistory(childId: string): Location[] {
    return this.locationHistory.get(childId) || []
  }

  public getWebActivity(childId: string): WebActivity[] {
    return this.webActivity.get(childId) || []
  }

  public acknowledgeAlert(alertId: string) {
    const alert = this.alerts.find(a => a.id === alertId)
    if (alert) {
      alert.acknowledged = true
      this.emit('alertAcknowledged', alert)
    }
  }

  public addGeofence(geofence: Omit<Geofence, 'id'>) {
    const newGeofence: Geofence = {
      ...geofence,
      id: `geofence_${Date.now()}`
    }
    this.geofences.push(newGeofence)
    this.emit('geofenceAdded', newGeofence)
    return newGeofence
  }

  public removeGeofence(geofenceId: string) {
    const index = this.geofences.findIndex(g => g.id === geofenceId)
    if (index > -1) {
      const removed = this.geofences.splice(index, 1)[0]
      this.emit('geofenceRemoved', removed)
      return removed
    }
    return null
  }
}

// Singleton instance
export const trackingService = new TrackingService()
