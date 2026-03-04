"use client"

import { useState } from 'react'
import { usePWA } from '@/hooks/usePWA'
import { Button } from '@/components/ui/button'
import { X, Download, Smartphone, Rocket } from 'lucide-react'

export default function PWAInstall() {
  const { isInstallable, isInstalled, visitCount, handleInstallClick, dismissInstall } = usePWA()
  const [showBanner, setShowBanner] = useState(false)

  // Show banner after 2 visits if installable and not dismissed
  useState(() => {
    if (isInstallable && !isInstalled && visitCount >= 2) {
      const wasDismissed = sessionStorage.getItem('pwa-install-dismissed')
      if (!wasDismissed) {
        setTimeout(() => setShowBanner(true), 2000)
      }
    }
  })

  if (!showBanner || isInstalled || !isInstallable) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-2xl p-4 z-50 transform transition-all duration-300 ease-in-out">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white mb-1 flex items-center gap-2">
              <Rocket className="w-4 h-4" />
              Install Guardian Shield
            </h3>
            <p className="text-blue-100 text-sm leading-tight">
              Get instant access to family safety features. Works offline and sends real-time alerts!
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                ✓ Offline Access
              </span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                ✓ Faster Loading
              </span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                ✓ Push Alerts
              </span>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => {
            dismissInstall()
            setShowBanner(false)
          }}
          className="ml-2 text-white/80 hover:text-white transition-colors flex-shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex gap-2 mt-3">
        <Button
          onClick={handleInstallClick}
          className="flex-1 bg-white text-blue-600 hover:bg-blue-50 font-medium"
          size="sm"
        >
          <Download className="w-4 h-4 mr-2" />
          Install App
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowBanner(false)}
          className="border-white/30 text-white hover:bg-white/10"
          size="sm"
        >
          Maybe Later
        </Button>
      </div>
    </div>
  )
}

// Mobile Install Prompt Component
export function MobileInstallPrompt() {
  const { isInstallable, isInstalled, handleInstallClick } = usePWA()

  if (!isInstallable || isInstalled) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Smartphone className="w-5 h-5" />
          <span className="text-sm font-medium">Install Guardian Shield for better experience</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleInstallClick}
            className="bg-white text-blue-600 hover:bg-blue-50 text-sm font-medium px-4 py-1"
            size="sm"
          >
            Install
          </Button>
        </div>
      </div>
    </div>
  )
}
