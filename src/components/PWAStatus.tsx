"use client"

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Wifi, WifiOff, Download, CheckCircle, AlertCircle } from 'lucide-react'

export default function PWAStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [isInstalled, setIsInstalled] = useState(false)
  const [cacheStatus, setCacheStatus] = useState<'checking' | 'cached' | 'error'>('checking')

  useEffect(() => {
    // Check online status
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    // Check if installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isInWebAppiOS = (window.navigator as any).standalone === true
      const isInWebAppChrome = window.matchMedia('(display-mode: minimal-ui)').matches
      
      setIsInstalled(isStandalone || isInWebAppiOS || isInWebAppChrome)
    }

    // Check cache status
    const checkCacheStatus = async () => {
      if ('caches' in window) {
        try {
          const cache = await caches.open('guardian-shield-v1')
          const keys = await cache.keys()
          setCacheStatus(keys.length > 0 ? 'cached' : 'error')
        } catch (error) {
          setCacheStatus('error')
        }
      }
    }

    updateOnlineStatus()
    checkInstalled()
    checkCacheStatus()

    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  const getStatusColor = () => {
    if (!isOnline) return 'destructive'
    if (isInstalled) return 'default'
    if (cacheStatus === 'cached') return 'secondary'
    return 'outline'
  }

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="w-3 h-3" />
    if (isInstalled) return <CheckCircle className="w-3 h-3" />
    if (cacheStatus === 'cached') return <Download className="w-3 h-3" />
    return <AlertCircle className="w-3 h-3" />
  }

  const getStatusText = () => {
    if (!isOnline) return 'Offline'
    if (isInstalled) return 'Installed'
    if (cacheStatus === 'cached') return 'Ready'
    return 'Online'
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant={getStatusColor()} className="flex items-center gap-1">
        {getStatusIcon()}
        <span className="text-xs">{getStatusText()}</span>
      </Badge>
    </div>
  )
}
