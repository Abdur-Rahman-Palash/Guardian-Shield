import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export function usePWA() {
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visitCount, setVisitCount] = useState(0)

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isInWebAppiOS = (window.navigator as any).standalone === true
      const isInWebAppChrome = (window.matchMedia('(display-mode: minimal-ui)').matches)
      
      setIsInstalled(isStandalone || isInWebAppiOS || isInWebAppChrome)
    }

    // Track visit count
    const trackVisits = () => {
      const visits = parseInt(localStorage.getItem('pwa-visits') || '0')
      const newVisitCount = visits + 1
      localStorage.setItem('pwa-visits', newVisitCount.toString())
      setVisitCount(newVisitCount)
      
      // Show install prompt after 2 visits
      if (newVisitCount >= 2 && !isInstalled) {
        setTimeout(() => {
          if (installPrompt) {
            handleInstallClick()
          }
        }, 3000) // Show after 3 seconds on second visit
      }
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const promptEvent = e as BeforeInstallPromptEvent
      setInstallPrompt(promptEvent)
      setIsInstallable(true)
    }

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setInstallPrompt(null)
      localStorage.removeItem('pwa-visits') // Reset visit count after install
    }

    // Initialize
    checkInstalled()
    trackVisits()

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [installPrompt, isInstalled])

  const handleInstallClick = async () => {
    if (!installPrompt) return

    try {
      await installPrompt.prompt()
      const { outcome } = await installPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt')
      } else {
        console.log('User dismissed the install prompt')
      }
      
      setInstallPrompt(null)
      setIsInstallable(false)
    } catch (error) {
      console.error('Error during install prompt:', error)
    }
  }

  const dismissInstall = () => {
    setInstallPrompt(null)
    setIsInstallable(false)
    // Don't show again for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true')
  }

  return {
    isInstallable,
    isInstalled,
    visitCount,
    handleInstallClick,
    dismissInstall
  }
}
