"use client"

import { useState, useEffect } from 'react'
import { Shield, Play, Pause, RotateCcw, Users, Monitor, Wifi, AlertTriangle, CheckCircle } from 'lucide-react'

interface DemoDevice {
  id: string
  name: string
  childName: string
  macAddress: string
  type: 'laptop' | 'smartphone' | 'tablet' | 'desktop'
  status: 'online' | 'offline' | 'restricted'
  lastSeen: string
  usageTime: number
  blockedAttempts: number
  alertsTriggered: number
}

interface DemoData {
  devices: DemoDevice[]
  blockedSites: number
  screenshotsTaken: number
  alertsSent: number
  currentSite: {
    url: string
    domain: string
    isRisky: boolean
    category?: string
    blocked: boolean
  }
  dailyObservations: any[]
}

export default function DemoMode() {
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [demoData, setDemoData] = useState<DemoData>({
    devices: [],
    blockedSites: 0,
    screenshotsTaken: 0,
    alertsSent: 0,
    currentSite: {
      url: 'https://google.com',
      domain: 'google.com',
      isRisky: false,
      category: '',
      blocked: false
    },
    dailyObservations: []
  })
  const [currentStep, setCurrentStep] = useState(0)
  const [demoInterval, setDemoInterval] = useState<NodeJS.Timeout | null>(null)

  const demoSteps = [
    // Step 1: Safe site
    {
      site: {
        url: 'https://google.com',
        domain: 'google.com',
        isRisky: false,
        category: '',
        blocked: false
      },
      message: 'Child is browsing safely on Google'
    },
    // Step 2: Risky site detected
    {
      site: {
        url: 'https://bet365.com',
        domain: 'bet365.com',
        isRisky: true,
        category: 'gambling',
        blocked: true
      },
      message: 'Guardian Shield detected gambling site and blocked it!'
    },
    // Step 3: Adult site detected
    {
      site: {
        url: 'https://pornhub.com',
        domain: 'pornhub.com',
        isRisky: true,
        category: 'adult',
        blocked: true
      },
      message: 'Adult content blocked immediately!'
    },
    // Step 4: Back to safe site
    {
      site: {
        url: 'https://youtube.com',
        domain: 'youtube.com',
        isRisky: false,
        category: '',
        blocked: false
      },
      message: 'Child continues browsing safely'
    },
    // Step 5: Another risky attempt
    {
      site: {
        url: 'https://xvideos.com',
        domain: 'xvideos.com',
        isRisky: true,
        category: 'adult',
        blocked: true
      },
      message: 'Another adult site blocked!'
    }
  ]

  const demoDevices: DemoDevice[] = [
    {
      id: '1',
      name: "Sarah's Laptop",
      childName: 'Sarah',
      macAddress: 'A1:B2:C3:D4:E5:F6',
      type: 'laptop',
      status: 'online',
      lastSeen: new Date().toISOString(),
      usageTime: 245,
      blockedAttempts: 12,
      alertsTriggered: 8
    },
    {
      id: '2',
      name: "John's Phone",
      childName: 'John',
      macAddress: 'G7:H8:I9:J0:K1:L2',
      type: 'smartphone',
      status: 'online',
      lastSeen: new Date().toISOString(),
      usageTime: 180,
      blockedAttempts: 8,
      alertsTriggered: 5
    },
    {
      id: '3',
      name: "Emma's Tablet",
      childName: 'Emma',
      macAddress: 'M3:N4:O5:P6:Q7:R8',
      type: 'tablet',
      status: 'offline',
      lastSeen: new Date(Date.now() - 30 * 60000).toISOString(),
      usageTime: 120,
      blockedAttempts: 5,
      alertsTriggered: 3
    }
  ]

  useEffect(() => {
    // Initialize demo data
    setDemoData(prev => ({
      ...prev,
      devices: demoDevices,
      dailyObservations: generateDemoObservations(demoDevices)
    }))
  }, [])

  const generateDemoObservations = (devices: DemoDevice[]) => {
    return devices.map(device => ({
      date: new Date().toISOString().split('T')[0],
      deviceName: device.name,
      childName: device.childName,
      observations: {
        totalUsageTime: device.usageTime,
        blockedSites: device.blockedAttempts,
        alertsTriggered: device.alertsTriggered,
        riskLevel: device.blockedAttempts > 10 ? 'high' : device.blockedAttempts > 5 ? 'medium' : 'low',
        topBlockedCategories: ['social', 'gaming', 'adult'],
        unusualActivity: ['Late night activity detected']
      },
      recommendations: {
        adjustSettings: true,
        conversationTopics: ['Online safety', 'Screen time management'],
        timeRestrictions: ['Limit social media after 9 PM'],
        newRules: ['Enable stricter content filtering']
      }
    }))
  }

  const startDemo = () => {
    setIsDemoMode(true)
    setIsPlaying(true)
    setCurrentStep(0)
    
    // Save demo data to localStorage for other components to use
    localStorage.setItem('demo_mode', 'true')
    localStorage.setItem('connected_devices', JSON.stringify(demoDevices))
    localStorage.setItem('daily_observations', JSON.stringify(generateDemoObservations(demoDevices)))
    
    // Start demo sequence
    runDemoSequence()
  }

  const runDemoSequence = () => {
    let stepIndex = 0
    
    const interval = setInterval(() => {
      if (stepIndex >= demoSteps.length) {
        stepIndex = 0 // Loop back to start
      }
      
      const step = demoSteps[stepIndex]
      
      // Update current site
      setDemoData(prev => ({
        ...prev,
        currentSite: step.site,
        blockedSites: prev.blockedSites + (step.site.blocked ? 1 : 0),
        alertsSent: prev.alertsSent + (step.site.blocked ? 1 : 0)
      }))
      
      // Update device stats
      const updatedDevices = demoDevices.map((device, index) => {
        if (index === 0) { // Update Sarah's device for demo
          return {
            ...device,
            blockedAttempts: device.blockedAttempts + (step.site.blocked ? 1 : 0),
            alertsTriggered: device.alertsTriggered + (step.site.blocked ? 1 : 0),
            usageTime: device.usageTime + 5,
            lastSeen: new Date().toISOString()
          }
        }
        return device
      })
      
      setDemoData(prev => ({
        ...prev,
        devices: updatedDevices
      }))
      
      // Update localStorage
      localStorage.setItem('connected_devices', JSON.stringify(updatedDevices))
      
      setCurrentStep(stepIndex)
      stepIndex++
    }, 3000) // Change step every 3 seconds
    
    setDemoInterval(interval)
  }

  const stopDemo = () => {
    setIsPlaying(false)
    if (demoInterval) {
      clearInterval(demoInterval)
      setDemoInterval(null)
    }
  }

  const resetDemo = () => {
    stopDemo()
    setIsDemoMode(false)
    setCurrentStep(0)
    setDemoData({
      devices: demoDevices,
      blockedSites: 0,
      screenshotsTaken: 0,
      alertsSent: 0,
      currentSite: {
        url: 'https://google.com',
        domain: 'google.com',
        isRisky: false,
        category: '',
        blocked: false
      },
      dailyObservations: generateDemoObservations(demoDevices)
    })
    
    // Clear demo mode
    localStorage.removeItem('demo_mode')
    localStorage.removeItem('connected_devices')
    localStorage.removeItem('daily_observations')
  }

  const captureDemoScreenshot = () => {
    setDemoData(prev => ({
      ...prev,
      screenshotsTaken: prev.screenshotsTaken + 1
    }))
  }

  if (!isDemoMode) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={startDemo}
          className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          Start Demo Mode
        </button>
      </div>
    )
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-80">
      {/* Demo Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Demo Mode</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            LIVE
          </span>
        </div>
      </div>

      {/* Current Demo Step */}
      <div className="bg-blue-50 p-3 rounded-lg mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Monitor className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">Current Site</span>
        </div>
        <div className="text-sm text-gray-800 font-mono truncate mb-1">
          {demoData.currentSite.url}
        </div>
        <div className={`text-sm font-medium ${
          demoData.currentSite.blocked ? 'text-red-600' : 
          demoData.currentSite.isRisky ? 'text-yellow-600' : 'text-green-600'
        }`}>
          {demoData.currentSite.blocked ? 'BLOCKED' : 'SAFE'}
        </div>
        {demoData.currentSite.category && (
          <div className="text-xs text-gray-600 mt-1">
            Category: {demoData.currentSite.category}
          </div>
        )}
      </div>

      {/* Demo Message */}
      <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg mb-4">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-4 h-4 text-yellow-600" />
          <span className="text-sm font-medium text-yellow-900">Demo Action</span>
        </div>
        <p className="text-sm text-yellow-800">
          {demoSteps[currentStep]?.message || 'Demo running...'}
        </p>
      </div>

      {/* Demo Statistics */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-red-50 p-2 rounded text-center">
          <div className="text-lg font-bold text-red-600">{demoData.blockedSites}</div>
          <div className="text-xs text-gray-600">Blocked</div>
        </div>
        <div className="bg-blue-50 p-2 rounded text-center">
          <div className="text-lg font-bold text-blue-600">{demoData.screenshotsTaken}</div>
          <div className="text-xs text-gray-600">Screenshots</div>
        </div>
        <div className="bg-yellow-50 p-2 rounded text-center">
          <div className="text-lg font-bold text-yellow-600">{demoData.alertsSent}</div>
          <div className="text-xs text-gray-600">Alerts</div>
        </div>
      </div>

      {/* Connected Devices */}
      <div className="bg-gray-50 p-3 rounded-lg mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Demo Devices</span>
          <Wifi className="w-4 h-4 text-blue-600" />
        </div>
        <div className="space-y-2">
          {demoData.devices.map((device) => (
            <div key={device.id} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  device.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
                <span className="font-medium">{device.name}</span>
              </div>
              <span className="text-gray-600">{device.childName}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Demo Controls */}
      <div className="flex gap-2">
        {isPlaying ? (
          <button
            onClick={stopDemo}
            className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <Pause className="w-4 h-4" />
            Pause
          </button>
        ) : (
          <button
            onClick={() => {
              setIsPlaying(true)
              runDemoSequence()
            }}
            className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            Play
          </button>
        )}
        <button
          onClick={captureDemoScreenshot}
          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          📸 Screenshot
        </button>
        <button
          onClick={resetDemo}
          className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Demo Progress */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>Demo Progress</span>
          <span>{currentStep + 1} / {demoSteps.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}
