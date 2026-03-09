"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import Header from './Header'
import Footer from './Footer'
import Navigation from './Navigation'
import ErrorBoundary from '@/components/ErrorBoundary'
import { LoadingSpinner } from '@/components/LoadingStates'

interface MainLayoutProps {
  children: React.ReactNode
  showFooter?: boolean
  className?: string
}

export default function MainLayout({ children, showFooter = true, className = '' }: MainLayoutProps) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
    
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error('Error checking user:', error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl border border-gray-200">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <Navigation />
        
        <main className={`min-h-screen ${className}`}>
          <ErrorBoundary>
            <div className="relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233B82F6' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundRepeat: 'repeat',
                  backgroundSize: '60px 60px'
                }}></div>
              </div>
              
              {/* Content */}
              <div className="relative z-10">
                {children}
              </div>
            </div>
          </ErrorBoundary>
        </main>
        
        {showFooter && (
          <ErrorBoundary>
            <Footer />
          </ErrorBoundary>
        )}
      </div>
    </ErrorBoundary>
  )
}
