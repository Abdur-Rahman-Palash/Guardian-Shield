"use client"

import { useState, useEffect } from 'react'
import { Shield, AlertTriangle, Camera, Settings, X, Eye, EyeOff, Lock, Unlock, Monitor, Wifi, Users } from 'lucide-react'

interface SiteInfo {
  url: string
  domain: string
  isRisky: boolean
  category?: string
  blocked: boolean
}

interface ExtensionStats {
  blockedSites: number
  screenshotsTaken: number
  alertsSent: number
  lastScan: string
}

interface ConnectedDevice {
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

export default function ExtensionNative() {
  const [isVisible, setIsVisible] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentSite, setCurrentSite] = useState<SiteInfo>({
    url: '',
    domain: '',
    isRisky: false,
    category: '',
    blocked: false
  })
  const [stats, setStats] = useState<ExtensionStats>({
    blockedSites: 0,
    screenshotsTaken: 0,
    alertsSent: 0,
    lastScan: new Date().toISOString()
  })
  const [isMonitoring, setIsMonitoring] = useState(true)
  const [isFiltering, setIsFiltering] = useState(true)
  const [connectedDevices, setConnectedDevices] = useState<ConnectedDevice[]>([])
  const [showDevices, setShowDevices] = useState(false)

  // Mock risky domains database
  const riskyDomains = [
    { domain: 'pornhub.com', category: 'adult', severity: 'high' },
    { domain: 'xvideos.com', category: 'adult', severity: 'high' },
    { domain: 'xnxx.com', category: 'adult', severity: 'high' },
    { domain: 'bet365.com', category: 'gambling', severity: 'medium' },
    { domain: 'williamhill.com', category: 'gambling', severity: 'medium' },
    { domain: 'paddypower.com', category: 'gambling', severity: 'medium' },
    { domain: 'darkweb.com', category: 'illegal', severity: 'high' },
    { domain: 'illegaldrugs.com', category: 'illegal', severity: 'high' }
  ]

  useEffect(() => {
    // Get current site information
    const getCurrentSite = () => {
      if (typeof window !== 'undefined') {
        const url = window.location.href
        const domain = window.location.hostname.replace('www.', '')
        
        // Check if site is risky
        const riskyDomain = riskyDomains.find(rd => 
          domain.includes(rd.domain) || rd.domain.includes(domain)
        )
        
        const isRisky = !!riskyDomain
        const category = riskyDomain?.category
        const blocked = isRisky && isFiltering

        setCurrentSite({
          url,
          domain,
          isRisky,
          category,
          blocked
        })

        // Update stats
        if (isRisky) {
          setStats(prev => ({
            ...prev,
            blockedSites: prev.blockedSites + (blocked ? 1 : 0)
          }))
        }
      }
    }

    // Load connected devices
    const loadConnectedDevices = () => {
      const stored = localStorage.getItem('connected_devices')
      if (stored) {
        setConnectedDevices(JSON.parse(stored))
      }
    }

    // Initial check
    getCurrentSite()
    loadConnectedDevices()

    // Monitor URL changes
    const interval = setInterval(() => {
      getCurrentSite()
      loadConnectedDevices()
    }, 2000)
    return () => clearInterval(interval)
  }, [isFiltering])

  // Block site if risky
  useEffect(() => {
    if (currentSite.isRisky && isFiltering && !currentSite.blocked) {
      // Create blocking overlay
      const blockOverlay = createBlockOverlay(currentSite.category || 'RISKY')
      document.body.innerHTML = ''
      document.body.appendChild(blockOverlay)
      
      // Update current site status
      setCurrentSite(prev => ({ ...prev, blocked: true }))
      
      // Send alert
      sendAlert(currentSite)
    }
  }, [currentSite.isRisky, isFiltering])

  const createBlockOverlay = (category: string) => {
    const overlay = document.createElement('div')
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `

    overlay.innerHTML = `
      <div style="
        max-width: 500px;
        width: 90%;
        background: white;
        border-radius: 12px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      ">
        <div style="
          background: #ef4444;
          color: white;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <div style="display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 18px;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              <path d="M12 22V8"/>
            </svg>
            Guardian Shield
          </div>
          <div style="
            background: rgba(255, 255, 255, 0.2);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            color: #ffffff;
            border: 1px solid rgba(255, 255, 255, 0.3);
          ">BLOCKED - ${category.toUpperCase()}</div>
        </div>
        <div style="padding: 30px; text-align: center;">
          <h2 style="color: #1f2937; margin-bottom: 10px; font-size: 24px; font-weight: 700;">Content Blocked</h2>
          <p style="color: #6b7280; margin-bottom: 20px; line-height: 1.5; font-size: 14px;">
            This website has been blocked by Guardian Shield to protect you from harmful content.
          </p>
          <div style="
            background: #f9fafb;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
            text-align: left;
          ">
            <div style="margin-bottom: 8px; font-size: 14px; color: #374151;">
              <strong>Category:</strong> ${category}
            </div>
            <div style="margin-bottom: 8px; font-size: 14px; color: #374151;">
              <strong>URL:</strong> ${currentSite.url}
            </div>
          </div>
          <div style="display: flex; gap: 10px; justify-content: center;">
            <button onclick="window.location.href='about:blank'" style="
              padding: 12px 24px;
              border: none;
              border-radius: 6px;
              font-size: 14px;
              font-weight: 500;
              cursor: pointer;
              background: #3b82f6;
              color: white;
              text-decoration: none;
              display: inline-flex;
              align-items: center;
              gap: 6px;
            ">Go Back</button>
          </div>
        </div>
      </div>
    `

    return overlay
  }

  const sendAlert = (site: SiteInfo) => {
    // Mock alert sending
    console.log('Alert sent for:', site)
    setStats(prev => ({
      ...prev,
      alertsSent: prev.alertsSent + 1
    }))
  }

  const captureScreenshot = () => {
    // Mock screenshot capture
    if (typeof window !== 'undefined') {
      // Create canvas element
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      if (ctx) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        
        // Draw screenshot (mock)
        ctx.fillStyle = '#f3f4f6'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#1f2937'
        ctx.font = '24px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('Screenshot Captured', canvas.width / 2, canvas.height / 2)
        
        // Convert to data URL
        const dataUrl = canvas.toDataURL('image/png')
        
        // Download screenshot
        const link = document.createElement('a')
        link.download = `guardian-shield-${Date.now()}.png`
        link.href = dataUrl
        link.click()
        
        setStats(prev => ({
          ...prev,
          screenshotsTaken: prev.screenshotsTaken + 1
        }))
      }
    }
  }

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring)
  }

  const toggleFiltering = () => {
    setIsFiltering(!isFiltering)
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'laptop':
        return <Monitor className="w-4 h-4" />
      case 'smartphone':
        return <div className="w-4 h-4 bg-blue-600 rounded-sm"></div>
      case 'tablet':
        return <div className="w-4 h-4 bg-green-600 rounded-sm"></div>
      default:
        return <Monitor className="w-4 h-4" />
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

  const getTotalBlockedSites = () => {
    return connectedDevices.reduce((total, device) => total + device.blockedAttempts, 0) + stats.blockedSites
  }

  const getTotalAlerts = () => {
    return connectedDevices.reduce((total, device) => total + device.alertsTriggered, 0) + stats.alertsSent
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-6 left-6 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110"
        title="Show Guardian Shield"
      >
        <Shield className="w-6 h-6" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${currentSite.blocked ? 'bg-red-500' : isMonitoring ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          <span className="font-semibold text-gray-800">Guardian Shield</span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isExpanded ? <X className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
        </button>
      </div>

      {/* Compact View */}
      {!isExpanded && (
        <div className="p-4 w-80">
          <div className="space-y-3">
            {/* Current Site Status */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Current Site</span>
                {currentSite.blocked ? (
                  <Lock className="w-4 h-4 text-red-600" />
                ) : (
                  <Unlock className="w-4 h-4 text-green-600" />
                )}
              </div>
              <div className="text-xs text-gray-600 truncate mb-1">{currentSite.domain || 'Loading...'}</div>
              <div className={`text-sm font-medium ${currentSite.blocked ? 'text-red-600' : currentSite.isRisky ? 'text-yellow-600' : 'text-green-600'}`}>
                {currentSite.blocked ? 'BLOCKED' : currentSite.isRisky ? 'RISKY' : 'SAFE'}
              </div>
            </div>

            {/* Connected Devices Summary */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Connected Devices</span>
                <Wifi className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">{connectedDevices.length} devices</span>
                <span className="text-xs text-gray-600">
                  ({connectedDevices.filter(d => d.status === 'online').length} online)
                </span>
              </div>
              <button
                onClick={() => setShowDevices(!showDevices)}
                className="text-xs text-blue-600 hover:text-blue-700 mt-1"
              >
                {showDevices ? 'Hide' : 'Show'} devices →
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-red-50 p-2 rounded">
                <div className="text-lg font-bold text-red-600">{getTotalBlockedSites()}</div>
                <div className="text-xs text-gray-600">Blocked</div>
              </div>
              <div className="bg-blue-50 p-2 rounded">
                <div className="text-lg font-bold text-blue-600">{stats.screenshotsTaken}</div>
                <div className="text-xs text-gray-600">Screenshots</div>
              </div>
              <div className="bg-yellow-50 p-2 rounded">
                <div className="text-lg font-bold text-yellow-600">{getTotalAlerts()}</div>
                <div className="text-xs text-gray-600">Alerts</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={captureScreenshot}
                className="flex items-center justify-center gap-2 bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors text-sm"
              >
                <Camera className="w-4 h-4" />
                Screenshot
              </button>
              <button
                onClick={toggleFiltering}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                  isFiltering ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isFiltering ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                {isFiltering ? 'Filtering' : 'Paused'}
              </button>
            </div>

            {/* Connected Devices List */}
            {showDevices && (
              <div className="border-t pt-3 mt-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Devices</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {connectedDevices.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-2">No devices connected</p>
                  ) : (
                    connectedDevices.map((device) => (
                      <div key={device.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                        <div className="flex items-center gap-2">
                          {getDeviceIcon(device.type)}
                          <div>
                            <div className="font-medium text-gray-800">{device.name}</div>
                            <div className="text-gray-600">{device.childName}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(device.status)}`}>
                            {device.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Expanded View */}
      {isExpanded && (
        <div className="p-4 w-96">
          <div className="space-y-4">
            {/* Site Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Site Analysis</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">URL:</span>
                  <span className="text-gray-800 truncate ml-2">{currentSite.url}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Domain:</span>
                  <span className="text-gray-800">{currentSite.domain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${
                    currentSite.blocked ? 'text-red-600' : 
                    currentSite.isRisky ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {currentSite.blocked ? 'BLOCKED' : currentSite.isRisky ? 'RISKY' : 'SAFE'}
                  </span>
                </div>
                {currentSite.category && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="text-gray-800">{currentSite.category}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Connected Devices */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Connected Devices ({connectedDevices.length})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {connectedDevices.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No devices connected</p>
                ) : (
                  connectedDevices.map((device) => (
                    <div key={device.id} className="bg-white p-3 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getDeviceIcon(device.type)}
                          <div>
                            <div className="font-medium text-gray-800 text-sm">{device.name}</div>
                            <div className="text-xs text-gray-600">{device.childName}</div>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(device.status)}`}>
                          {device.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <div className="font-medium text-red-600">{device.blockedAttempts}</div>
                          <div className="text-gray-600">Blocked</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-yellow-600">{device.alertsTriggered}</div>
                          <div className="text-gray-600">Alerts</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-blue-600">{device.usageTime}m</div>
                          <div className="text-gray-600">Usage</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Protection Statistics</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Total Blocked:</span>
                  <p className="text-2xl font-bold text-red-600">{getTotalBlockedSites()}</p>
                </div>
                <div>
                  <span className="text-gray-600">Screenshots:</span>
                  <p className="text-2xl font-bold text-blue-600">{stats.screenshotsTaken}</p>
                </div>
                <div>
                  <span className="text-gray-600">Total Alerts:</span>
                  <p className="text-2xl font-bold text-yellow-600">{getTotalAlerts()}</p>
                </div>
                <div>
                  <span className="text-gray-600">Last Scan:</span>
                  <p className="text-sm text-gray-800">{new Date(stats.lastScan).toLocaleTimeString()}</p>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Controls</h4>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <span className="text-sm font-medium">Content Filtering</span>
                  <div className={`w-12 h-6 rounded-full transition-colors ${
                    isFiltering ? 'bg-blue-600' : 'bg-gray-300'
                  }`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                      isFiltering ? 'translate-x-6' : 'translate-x-0.5'
                    }`}></div>
                  </div>
                </label>
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <span className="text-sm font-medium">Monitoring</span>
                  <div className={`w-12 h-6 rounded-full transition-colors ${
                    isMonitoring ? 'bg-blue-600' : 'bg-gray-300'
                  }`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                      isMonitoring ? 'translate-x-6' : 'translate-x-0.5'
                    }`}></div>
                  </div>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={captureScreenshot}
                className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <Camera className="w-4 h-4" />
                Capture Screenshot
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                <X className="w-4 h-4" />
                Minimize
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hide Button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute -top-2 -right-2 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors border border-gray-300"
        title="Hide"
      >
        <X className="w-3 h-3 text-gray-600" />
      </button>
    </div>
  )
}
