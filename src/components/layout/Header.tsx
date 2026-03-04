"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import LiveMap from '@/components/LiveMap'
import NotificationSystem from '@/components/NotificationSystem'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import PWAStatus from '@/components/PWAStatus'
import LanguageToggle from '@/components/LanguageToggle'
import { useLanguage } from '@/contexts/LanguageContext'
import { 
  Shield, 
  Menu, 
  X, 
  Bell, 
  User, 
  LogOut,
  ChevronDown,
  Home,
  Users,
  AlertTriangle,
  CreditCard,
  Settings,
  Zap
} from 'lucide-react'

interface HeaderProps {
  user?: any
}

export default function Header({ user: propUser }: HeaderProps) {
  const { t } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState(2)
  const [user, setUser] = useState<any>(propUser || null)
  const [loading, setLoading] = useState(!propUser)
  const [headerHeight, setHeaderHeight] = useState(64) // Default h-16 = 64px

  const navigation = [
    { name: t('nav.home'), href: '/', icon: Home, current: false },
    { name: t('nav.dashboard'), href: '/dashboard', icon: Shield, current: false },
    { name: t('nav.children'), href: '/dashboard/children', icon: Users, current: false },
    { name: t('nav.alerts'), href: '/dashboard/alerts', icon: AlertTriangle, current: false },
    { name: t('nav.payments'), href: '/dashboard/payments', icon: CreditCard, current: false },
    { name: t('nav.settings'), href: '/dashboard/settings', icon: Settings, current: false },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    const checkUser = async () => {
      if (propUser) {
        setUser(propUser)
        setLoading(false)
        return
      }

      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error('Error checking user:', error)
      } finally {
        setLoading(false)
      }
    }

    // Update header height based on mobile menu state
    const updateHeaderHeight = () => {
      const header = document.querySelector('header')
      if (header) {
        const height = header.getBoundingClientRect().height
        setHeaderHeight(height)
      }
    }

    handleScroll()
    checkUser()
    updateHeaderHeight()
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', updateHeaderHeight)

    // Update height when mobile menu opens/closes
    const observer = new MutationObserver(updateHeaderHeight)
    const headerElement = document.querySelector('header')
    if (headerElement) {
      observer.observe(headerElement, { 
        childList: true, 
        subtree: true, 
        attributes: true 
      })
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateHeaderHeight)
      observer.disconnect()
    }
  }, [mobileMenuOpen, propUser]) // Re-run when mobile menu state changes

  if (loading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="h-full flex items-center justify-center">
          <div className="animate-pulse flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <span className="text-gray-400">Loading...</span>
          </div>
        </div>
      </header>
    )
  }

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50' 
          : 'bg-white/90 backdrop-blur-sm border-b border-gray-100/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3 group">
                <div className={`relative transition-transform duration-300 group-hover:scale-110 ${
                  scrolled ? 'w-10 h-10' : 'w-12 h-12'
                }`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                </div>
                <div className="hidden sm:block">
                  <h1 className={`font-bold transition-all duration-300 ${
                    scrolled ? 'text-lg' : 'text-xl'
                  } text-gray-900`}>
                    Guardian Shield
                  </h1>
                  <p className={`text-xs transition-all duration-300 ${
                    scrolled ? 'opacity-0' : 'opacity-100'
                  } text-blue-600`}>
                   
                  </p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    item.current
                      ? 'bg-blue-50 text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Language Toggle */}
              <div className="hidden sm:block">
                <LanguageToggle />
              </div>
              
              {/* PWA Status */}
              <PWAStatus />
              
              {/* Notifications */}
              {user && (
                <NotificationSystem />
              )}

              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center gap-2 hover:bg-blue-50"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </Button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      <Link
                        href="/dashboard/settings"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Settings className="w-4 h-4" />
                        {t('nav.settings')}
                      </Link>
                      <button
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden sm:flex hover:bg-blue-50"
                    asChild
                  >
                    <Link href="/login">{t('common.signin')}</Link>
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    asChild
                  >
                    <Link href="/register">
                      {t('common.getstarted')}
                      <Zap className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
              {!user && (
                <>
                  <Link
                    href="/login"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Shield className="w-4 h-4" />
                    <span>Get Started</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Overlay for dropdowns */}
      {profileMenuOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => {
            setProfileMenuOpen(false)
          }}
        />
      )}
    </>
  )
}
