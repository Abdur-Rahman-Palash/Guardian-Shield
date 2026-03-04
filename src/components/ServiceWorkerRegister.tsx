"use client"

import { useEffect } from 'react'

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const registerServiceWorker = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
          })

          console.log('Service Worker registered with scope:', registration.scope)

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available; show update notification
                  if (confirm('New version available! Reload to update?')) {
                    window.location.reload()
                  }
                }
              })
            }
          })

          // Periodic update check (every hour)
          setInterval(() => {
            registration.update()
          }, 60 * 60 * 1000)

        } catch (error) {
          console.error('Service Worker registration failed:', error)
        }
      }

      // Register service worker
      registerServiceWorker()

      // Handle service worker messages
      navigator.serviceWorker.addEventListener('message', event => {
        if (event.data && event.data.type === 'CACHE_UPDATED') {
          console.log('Cache updated:', event.data.payload)
        }
      })

    } else {
      console.log('Service Worker not supported')
    }
  }, [])

  return null
}
