"use client"

import { useState, useEffect } from 'react'

interface ExtensionStatus {
  isInstalled: boolean
  isEnabled: boolean
  version?: string
  lastChecked: Date
  tabUrl?: string
  isRiskySite?: boolean
  riskyCategory?: 'porn' | 'gambling' | 'other'
}

export function useExtensionStatus() {
  const [status, setStatus] = useState<ExtensionStatus>({
    isInstalled: false,
    isEnabled: false,
    lastChecked: new Date()
  })
  const [isLoading, setIsLoading] = useState(true)

  // Check if extension is installed and enabled
  const checkExtensionStatus = async () => {
    setIsLoading(true)
    
    try {
      // Try to communicate with the extension
      if (typeof window !== 'undefined') {
        // Method 1: Check for extension's content script
        const extensionIndicator = document.getElementById('guardian-shield-extension')
        const isInstalled = !!extensionIndicator
        
        // Method 2: Try to send message to extension
        let extensionVersion = undefined
        let isEnabled = false
        
        if (isInstalled) {
          const versionAttr = extensionIndicator.getAttribute('data-version')
          extensionVersion = versionAttr || undefined
          isEnabled = extensionIndicator.getAttribute('data-enabled') === 'true'
        }

        // Method 3: Check current tab URL
        const currentUrl = window.location.href
        const isRiskySite = await checkIfRiskySite(currentUrl)
        const riskyCategory = getRiskyCategory(currentUrl)

        setStatus({
          isInstalled,
          isEnabled,
          version: extensionVersion,
          lastChecked: new Date(),
          tabUrl: currentUrl,
          isRiskySite,
          riskyCategory
        })
      }
    } catch (error) {
      console.error('Error checking extension status:', error)
      setStatus(prev => ({
        ...prev,
        isInstalled: false,
        isEnabled: false,
        lastChecked: new Date()
      }))
    } finally {
      setIsLoading(false)
    }
  }

  // Check if current URL is a risky site
  const checkIfRiskySite = async (url: string): Promise<boolean> => {
    try {
      const domain = new URL(url).hostname.replace('www.', '')
      
      // Call API to check if domain is risky
      const response = await fetch('/api/check-domain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ domain })
      })
      
      if (response.ok) {
        const result = await response.json()
        return result.isRisky
      }
      
      // Fallback: Check against known risky domains
      const riskyDomains = await getRiskyDomains()
      return riskyDomains.some(riskyDomain => 
        domain.includes(riskyDomain) || riskyDomain.includes(domain)
      )
    } catch (error) {
      console.error('Error checking risky site:', error)
      return false
    }
  }

  // Get risky category for URL
  const getRiskyCategory = (url: string): 'porn' | 'gambling' | 'other' | undefined => {
    try {
      const domain = new URL(url).hostname.replace('www.', '')
      
      // Check against known categories
      if (isPornDomain(domain)) return 'porn'
      if (isGamblingDomain(domain)) return 'gambling'
      if (isOtherRiskyDomain(domain)) return 'other'
      
      return undefined
    } catch (error) {
      console.error('Error getting risky category:', error)
      return undefined
    }
  }

  // Get risky domains from API or local storage
  const getRiskyDomains = async (): Promise<string[]> => {
    try {
      const response = await fetch('/api/risky-domains')
      if (response.ok) {
        const data = await response.json()
        return data.domains || []
      }
    } catch (error) {
      console.error('Error fetching risky domains:', error)
    }
    
    // Fallback to local storage
    const stored = localStorage.getItem('guardian-shield-risky-domains')
    return stored ? JSON.parse(stored) : []
  }

  // Domain category checks
  const isPornDomain = (domain: string): boolean => {
    const pornKeywords = ['porn', 'xxx', 'sex', 'adult', 'nsfw']
    return pornKeywords.some(keyword => domain.includes(keyword))
  }

  const isGamblingDomain = (domain: string): boolean => {
    const gamblingKeywords = ['bet', 'casino', 'poker', 'gambling', 'lottery']
    return gamblingKeywords.some(keyword => domain.includes(keyword))
  }

  const isOtherRiskyDomain = (domain: string): boolean => {
    const otherKeywords = ['dark', 'illegal', 'weapon', 'drug']
    return otherKeywords.some(keyword => domain.includes(keyword))
  }

  // Install extension
  const installExtension = () => {
    // Chrome Web Store URL
    const chromeUrl = 'https://chrome.google.com/webstore/detail/guardian-shield/extension-id'
    
    // Firefox Add-ons URL
    const firefoxUrl = 'https://addons.mozilla.org/en-US/firefox/addon/guardian-shield/'
    
    // Detect browser and open appropriate store
    if (typeof window !== 'undefined') {
      const isFirefox = navigator.userAgent.toLowerCase().includes('firefox')
      const url = isFirefox ? firefoxUrl : chromeUrl
      
      window.open(url, '_blank')
    }
  }

  // Send manual alert
  const sendManualAlert = async (childName: string, message: string) => {
    try {
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          childName,
          message,
          url: window.location.href,
          timestamp: new Date().toISOString(),
          manual: true
        })
      })
      
      if (response.ok) {
        return { success: true }
      } else {
        throw new Error('Failed to send alert')
      }
    } catch (error) {
      console.error('Error sending manual alert:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return { success: false, error: errorMessage }
    }
  }

  // Listen for extension messages
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleMessage = (event: MessageEvent) => {
        if (event.source === window && event.data.type === 'GUARDIAN_SHIELD_EXTENSION') {
          setStatus(prev => ({
            ...prev,
            ...event.data.payload
          }))
        }
      }

      window.addEventListener('message', handleMessage)
      
      return () => {
        window.removeEventListener('message', handleMessage)
      }
    }
  }, [])

  // Check extension status on mount and periodically
  useEffect(() => {
    checkExtensionStatus()
    
    // Check every 30 seconds
    const interval = setInterval(checkExtensionStatus, 30000)
    
    return () => clearInterval(interval)
  }, [])

  return {
    status,
    isLoading,
    checkExtensionStatus,
    installExtension,
    sendManualAlert,
    refreshStatus: checkExtensionStatus
  }
}
