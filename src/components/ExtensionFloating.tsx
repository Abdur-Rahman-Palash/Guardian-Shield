"use client"

import { useState, useEffect } from 'react'
import { Chrome, Shield, AlertTriangle, Camera, Settings, X } from 'lucide-react'
import type { NextPage } from 'next'

interface ExtensionStatus {
  isInstalled: boolean
  isEnabled: boolean
  blockedSites: number
  lastAlert: string | null
}

export default function ExtensionFloating() {
  const [isVisible, setIsVisible] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const [extensionStatus, setExtensionStatus] = useState<ExtensionStatus>({
    isInstalled: false,
    isEnabled: false,
    blockedSites: 0,
    lastAlert: null
  })

  useEffect(() => {
    // Check if extension is installed
    const checkExtension = async () => {
      try {
        if (typeof window !== 'undefined' && window.chrome?.runtime) {
          // Try to communicate with extension
          window.chrome.runtime.sendMessage(
            'YOUR_EXTENSION_ID', // Replace with actual extension ID
            { type: 'GET_STATUS' },
            (response: any) => {
              if (window.chrome?.runtime?.lastError) {
                // Extension not installed or not responding
                setExtensionStatus({
                  isInstalled: false,
                  isEnabled: false,
                  blockedSites: 0,
                  lastAlert: null
                })
              } else {
                // Extension is installed and responding
                setExtensionStatus({
                  isInstalled: true,
                  isEnabled: response?.enabled || false,
                  blockedSites: response?.blockedSites || 0,
                  lastAlert: response?.lastAlert || null
                })
              }
            }
          )
        } else {
          // Chrome APIs not available
          setExtensionStatus({
            isInstalled: false,
            isEnabled: false,
            blockedSites: 0,
            lastAlert: null
          })
        }
      } catch (error) {
        console.error('Error checking extension:', error)
        setExtensionStatus({
          isInstalled: false,
          isEnabled: false,
          blockedSites: 0,
          lastAlert: null
        })
      }
    }

    checkExtension()
    const interval = setInterval(checkExtension, 5000) // Check every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const handleInstallExtension = () => {
    // Open Chrome Web Store or local extension file
    window.open('https://chrome.google.com/webstore/detail/guardian-shield/YOUR_EXTENSION_ID', '_blank')
  }

  const handleOpenExtension = () => {
    // Open extension popup
    if (typeof window !== 'undefined' && window.chrome?.action) {
      window.chrome.action.openPopup()
    }
  }

  const handleCaptureScreenshot = () => {
    // Send message to extension to capture screenshot
    if (typeof window !== 'undefined' && window.chrome?.runtime) {
      window.chrome.runtime.sendMessage('YOUR_EXTENSION_ID', { type: 'CAPTURE_SCREENSHOT' })
    }
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
          <div className={`w-3 h-3 rounded-full ${extensionStatus.isInstalled ? 'bg-green-500' : 'bg-red-500'}`}></div>
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
        <div className="p-4">
          {!extensionStatus.isInstalled ? (
            <div className="text-center">
              <Chrome className="w-8 h-8 mx-auto mb-3 text-gray-400" />
              <p className="text-sm text-gray-600 mb-3">Extension not installed</p>
              <button
                onClick={handleInstallExtension}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Install Extension
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`text-sm font-medium ${extensionStatus.isEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                  {extensionStatus.isEnabled ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Blocked</span>
                <span className="text-sm font-medium text-red-600">{extensionStatus.blockedSites}</span>
              </div>
              <button
                onClick={handleOpenExtension}
                className="w-full bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Open Extension
              </button>
            </div>
          )}
        </div>
      )}

      {/* Expanded View */}
      {isExpanded && (
        <div className="p-4 w-80">
          {!extensionStatus.isInstalled ? (
            <div className="text-center">
              <Shield className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="font-semibold text-gray-800 mb-2">Install Guardian Shield</h3>
              <p className="text-sm text-gray-600 mb-4">
                Protect your children from harmful content with real-time monitoring and alerts.
              </p>
              <button
                onClick={handleInstallExtension}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Chrome className="w-4 h-4 inline mr-2" />
                Install for Chrome
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Status Overview */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Protection Status</span>
                  <div className={`w-2 h-2 rounded-full ${extensionStatus.isEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Blocked Sites</span>
                    <p className="font-semibold text-red-600">{extensionStatus.blockedSites}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Status</span>
                    <p className={`font-semibold ${extensionStatus.isEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                      {extensionStatus.isEnabled ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleOpenExtension}
                    className="flex items-center justify-center gap-2 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                  >
                    <Shield className="w-4 h-4" />
                    Open
                  </button>
                  <button
                    onClick={handleCaptureScreenshot}
                    className="flex items-center justify-center gap-2 bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors text-sm"
                  >
                    <Camera className="w-4 h-4" />
                    Screenshot
                  </button>
                </div>
              </div>

              {/* Last Alert */}
              {extensionStatus.lastAlert && (
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-gray-700">Last Alert</span>
                  </div>
                  <p className="text-xs text-gray-600">{extensionStatus.lastAlert}</p>
                </div>
              )}

              {/* Hide Button */}
              <button
                onClick={() => setIsExpanded(false)}
                className="w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Minimize
              </button>
            </div>
          )}
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
