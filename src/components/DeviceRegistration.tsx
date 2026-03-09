"use client"

import { useState, useEffect } from 'react'
import { Shield, Monitor, Wifi, Clock, Users, CheckCircle, AlertCircle, Laptop, Smartphone, Tablet } from 'lucide-react'

interface Device {
  id: string
  name: string
  macAddress: string
  type: 'laptop' | 'smartphone' | 'tablet' | 'desktop'
  status: 'online' | 'offline' | 'restricted'
  lastSeen: string
  usageTime: number
  blockedAttempts: number
  alertsTriggered: number
  childName: string
  parentalLevel: 'strict' | 'moderate' | 'lenient'
}

interface DailyObservation {
  date: string
  deviceName: string
  childName: string
  observations: {
    totalUsageTime: number
    blockedSites: number
    alertsTriggered: number
    riskLevel: 'low' | 'medium' | 'high'
    topBlockedCategories: string[]
    unusualActivity: string[]
  }
  recommendations: {
    adjustSettings: boolean
    conversationTopics: string[]
    timeRestrictions: string[]
    newRules: string[]
  }
}

export default function DeviceRegistration() {
  const [devices, setDevices] = useState<Device[]>([])
  const [showRegistration, setShowRegistration] = useState(false)
  const [newDevice, setNewDevice] = useState({
    name: '',
    childName: '',
    parentalLevel: 'moderate' as const
  })
  const [observations, setObservations] = useState<DailyObservation[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  // Get MAC address and device info
  useEffect(() => {
    const getDeviceInfo = async () => {
      try {
        // Get MAC address (simplified for web)
        const macAddress = await getMacAddress()
        
        // Get device type
        const deviceType = getDeviceType()
        
        // Get device name
        const deviceName = getDeviceName()
        
        // Check if device already registered
        const existingDevice = devices.find(d => d.macAddress === macAddress)
        
        if (!existingDevice && macAddress) {
          const device: Device = {
            id: Date.now().toString(),
            name: deviceName,
            macAddress,
            type: deviceType,
            status: 'online',
            lastSeen: new Date().toISOString(),
            usageTime: 0,
            blockedAttempts: 0,
            alertsTriggered: 0,
            childName: '',
            parentalLevel: 'moderate'
          }
          
          setDevices(prev => [...prev, device])
          setShowRegistration(true)
        }
      } catch (error) {
        console.error('Error getting device info:', error)
      }
    }

    getDeviceInfo()
    loadObservations()
  }, [])

  const getMacAddress = async (): Promise<string> => {
    // Simplified MAC address generation for demo
    // In production, this would use WebRTC or other methods
    const storedMac = localStorage.getItem('device_mac_address')
    if (storedMac) return storedMac
    
    const mac = 'XX:XX:XX:XX:XX:XX'.replace(/X/g, () => 
      '0123456789ABCDEF'[Math.floor(Math.random() * 16)]
    )
    localStorage.setItem('device_mac_address', mac)
    return mac
  }

  const getDeviceType = (): 'laptop' | 'smartphone' | 'tablet' | 'desktop' => {
    const userAgent = navigator.userAgent.toLowerCase()
    
    if (userAgent.includes('mobile') || userAgent.includes('android') || userAgent.includes('iphone')) {
      if (userAgent.includes('tablet') || userAgent.includes('ipad')) {
        return 'tablet'
      }
      return 'smartphone'
    }
    
    return 'laptop'
  }

  const getDeviceName = (): string => {
    const userAgent = navigator.userAgent
    const platform = navigator.platform
    
    if (userAgent.includes('Windows')) {
      return `Windows-${platform || 'PC'}`
    } else if (userAgent.includes('Mac')) {
      return `Mac-${platform || 'Computer'}`
    } else if (userAgent.includes('Linux')) {
      return `Linux-${platform || 'PC'}`
    } else if (userAgent.includes('Android')) {
      return 'Android-Device'
    } else if (userAgent.includes('iPhone')) {
      return 'iPhone'
    } else if (userAgent.includes('iPad')) {
      return 'iPad'
    }
    
    return 'Unknown-Device'
  }

  const loadObservations = () => {
    const stored = localStorage.getItem('daily_observations')
    if (stored) {
      setObservations(JSON.parse(stored))
    }
  }

  const saveObservations = (newObservations: DailyObservation[]) => {
    localStorage.setItem('daily_observations', JSON.stringify(newObservations))
  }

  const registerDevice = () => {
    if (!newDevice.name || !newDevice.childName) {
      alert('Please fill in all fields')
      return
    }

    const macAddress = localStorage.getItem('device_mac_address')
    const deviceType = getDeviceType()
    
    const device: Device = {
      id: Date.now().toString(),
      name: newDevice.name,
      macAddress: macAddress || '',
      type: deviceType,
      status: 'online',
      lastSeen: new Date().toISOString(),
      usageTime: 0,
      blockedAttempts: 0,
      alertsTriggered: 0,
      childName: newDevice.childName,
      parentalLevel: newDevice.parentalLevel
    }

    setDevices(prev => prev.map(d => 
      d.macAddress === macAddress ? device : d
    ))
    
    setNewDevice({ name: '', childName: '', parentalLevel: 'moderate' })
    setShowRegistration(false)
    
    // Save to connected devices for floating extension
    const connectedDevices = JSON.parse(localStorage.getItem('connected_devices') || '[]')
    const existingIndex = connectedDevices.findIndex((d: any) => d.macAddress === macAddress)
    
    const connectedDevice = {
      id: device.id,
      name: device.name,
      childName: device.childName,
      macAddress: device.macAddress,
      type: device.type,
      status: device.status,
      lastSeen: device.lastSeen,
      usageTime: device.usageTime,
      blockedAttempts: device.blockedAttempts,
      alertsTriggered: device.alertsTriggered
    }
    
    if (existingIndex >= 0) {
      connectedDevices[existingIndex] = connectedDevice
    } else {
      connectedDevices.push(connectedDevice)
    }
    
    localStorage.setItem('connected_devices', JSON.stringify(connectedDevices))
    
    // Generate initial observation
    generateDailyObservation(device)
  }

  const generateDailyObservation = (device: Device) => {
    const today = new Date().toISOString().split('T')[0]
    const existingObservation = observations.find(o => o.date === today && o.deviceName === device.name)
    
    if (!existingObservation) {
      const observation: DailyObservation = {
        date: today,
        deviceName: device.name,
        childName: device.childName,
        observations: {
          totalUsageTime: Math.floor(Math.random() * 480), // Random minutes
          blockedSites: Math.floor(Math.random() * 10),
          alertsTriggered: Math.floor(Math.random() * 5),
          riskLevel: 'medium',
          topBlockedCategories: ['social', 'gaming', 'adult'],
          unusualActivity: ['Late night activity detected']
        },
        recommendations: {
          adjustSettings: true,
          conversationTopics: ['Online safety', 'Screen time management'],
          timeRestrictions: ['Limit social media after 9 PM'],
          newRules: ['Enable stricter content filtering']
        }
      }
      
      const updatedObservations = [...observations, observation]
      setObservations(updatedObservations)
      saveObservations(updatedObservations)
    }
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'laptop':
        return <Laptop className="w-5 h-5" />
      case 'smartphone':
        return <Smartphone className="w-5 h-5" />
      case 'tablet':
        return <Tablet className="w-5 h-5" />
      default:
        return <Monitor className="w-5 h-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-600 bg-green-100'
      case 'offline':
        return 'text-gray-600 bg-gray-100'
      case 'restricted':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-yellow-600 bg-yellow-100'
    }
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-600 bg-green-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'high':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  if (showRegistration) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Register Device</h3>
            <button
              onClick={() => setShowRegistration(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Device Name
              </label>
              <input
                type="text"
                value={newDevice.name}
                onChange={(e) => setNewDevice(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Sarah's Laptop"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Child's Name
              </label>
              <input
                type="text"
                value={newDevice.childName}
                onChange={(e) => setNewDevice(prev => ({ ...prev, childName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Sarah"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parental Control Level
              </label>
              <select
                value={newDevice.parentalLevel}
                onChange={(e) => setNewDevice(prev => ({ ...prev, parentalLevel: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="lenient">Lenient</option>
                <option value="moderate">Moderate</option>
                <option value="strict">Strict</option>
              </select>
            </div>
            
            <button
              onClick={registerDevice}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Register Device
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-white" />
              <h2 className="text-xl font-bold text-white">Device Registration & Daily Observation</h2>
            </div>
            <div className="flex items-center gap-2 text-white text-sm">
              <Wifi className="w-4 h-4" />
              <span>{devices.filter(d => d.status === 'online').length} Online</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Registered Devices */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              Registered Devices
            </h3>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {devices.map((device) => (
                <div key={device.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(device.type)}
                      <div>
                        <h4 className="font-medium text-gray-900">{device.name}</h4>
                        <p className="text-sm text-gray-600">{device.childName}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(device.status)}`}>
                      {device.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">MAC Address:</span>
                      <span className="font-mono text-gray-900">{device.macAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Seen:</span>
                      <span className="text-gray-900">{new Date(device.lastSeen).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Usage Time:</span>
                      <span className="text-gray-900">{device.usageTime} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Blocked:</span>
                      <span className="text-red-600 font-medium">{device.blockedAttempts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Alerts:</span>
                      <span className="text-yellow-600 font-medium">{device.alertsTriggered}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Observations */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Daily Observations & Recommendations
            </h3>
            
            {/* Date Selector */}
            <div className="mb-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="space-y-4">
              {observations
                .filter(obs => obs.date === selectedDate)
                .map((observation, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {observation.deviceName} - {observation.childName}
                        </h4>
                        <p className="text-sm text-gray-600">{observation.date}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(observation.observations.riskLevel)}`}>
                        {observation.observations.riskLevel.toUpperCase()} RISK
                      </span>
                    </div>
                    
                    {/* Observations */}
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <h5 className="font-medium text-gray-900">Usage Statistics</h5>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Usage:</span>
                            <span className="font-medium">{observation.observations.totalUsageTime} min</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Blocked Sites:</span>
                            <span className="font-medium text-red-600">{observation.observations.blockedSites}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Alerts Triggered:</span>
                            <span className="font-medium text-yellow-600">{observation.observations.alertsTriggered}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h5 className="font-medium text-gray-900">Risk Analysis</h5>
                        <div className="space-y-1 text-sm">
                          <div>
                            <span className="text-gray-600">Top Blocked Categories:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {observation.observations.topBlockedCategories.map((cat, i) => (
                                <span key={i} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                                  {cat}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Unusual Activity:</span>
                            <ul className="mt-1 space-y-1">
                              {observation.observations.unusualActivity.map((activity, i) => (
                                <li key={i} className="text-yellow-600">• {activity}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Recommendations */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h5 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        AI Recommendations
                      </h5>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium text-blue-900">Conversation Topics:</span>
                            <ul className="mt-1 space-y-1 text-sm">
                              {observation.recommendations.conversationTopics.map((topic, i) => (
                                <li key={i} className="text-blue-700">• {topic}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-blue-900">Time Restrictions:</span>
                            <ul className="mt-1 space-y-1 text-sm">
                              {observation.recommendations.timeRestrictions.map((restriction, i) => (
                                <li key={i} className="text-blue-700">• {restriction}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium text-blue-900">New Rules:</span>
                            <ul className="mt-1 space-y-1 text-sm">
                              {observation.recommendations.newRules.map((rule, i) => (
                                <li key={i} className="text-blue-700">• {rule}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-blue-700">
                              {observation.recommendations.adjustSettings ? 'Adjust parental settings' : 'Settings are optimal'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
