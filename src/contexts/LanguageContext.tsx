"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'en' | 'bn'

interface Translations {
  [key: string]: {
    en: string
    bn: string
  }
}

const translations: Translations = {
  // Navigation
  'nav.home': { en: 'Home', bn: 'হোম' },
  'nav.dashboard': { en: 'Dashboard', bn: 'ড্যাশবোর্ড' },
  'nav.children': { en: 'Children', bn: 'শিশুরা' },
  'nav.alerts': { en: 'Alerts', bn: 'সতর্কতা' },
  'nav.payments': { en: 'Payments', bn: 'পেমেন্ট' },
  'nav.settings': { en: 'Settings', bn: 'সেটিংস' },
  'nav.features': { en: 'Features', bn: 'বৈশিষ্ট্য' },
  'nav.pricing': { en: 'Pricing', bn: 'মূল্য' },
  
  // Common
  'common.signin': { en: 'Sign In', bn: 'সাইন ইন' },
  'common.getstarted': { en: 'Get Started', bn: 'শুরু করুন' },
  'common.loading': { en: 'Loading...', bn: 'লোড হচ্ছে...' },
  'common.error': { en: 'Error', bn: 'ত্রুটি' },
  'common.success': { en: 'Success', bn: 'সফল' },
  'common.tryagain': { en: 'Try Again', bn: 'আবার চেষ্টা করুন' },
  'common.cancel': { en: 'Cancel', bn: 'বাতিল করুন' },
  'common.save': { en: 'Save', bn: 'সংরক্ষণ করুন' },
  'common.edit': { en: 'Edit', bn: 'সম্পাদনা করুন' },
  'common.delete': { en: 'Delete', bn: 'মুছুন' },
  'common.view': { en: 'View', bn: 'দেখুন' },
  'common.add': { en: 'Add', bn: 'যোগ করুন' },
  'common.search': { en: 'Search', bn: 'অনুসন্ধান' },
  'common.filter': { en: 'Filter', bn: 'ফিল্টার' },
  'common.export': { en: 'Export', bn: 'রপ্তানি' },
  'common.import': { en: 'Import', bn: 'আমদানি' },
  
  // Dashboard
  'dashboard.welcome': { en: 'Welcome to Guardian Shield', bn: 'গার্ডিয়ান শিল্ডে স্বাগতম' },
  'dashboard.protect': { en: 'Protect Your Children Online', bn: 'আপনার সন্তানদের অনলাইনে সুরক্ষিত রাখুন' },
  'dashboard.subtitle': { en: 'Advanced AI-powered family safety platform', bn: 'উন্নত AI-চালিত পারিবারিক নিরাপত্তা প্ল্যাটফর্ম' },
  'dashboard.stats.families': { en: 'Families Protected', bn: 'সুরক্ষিত পরিবার' },
  'dashboard.stats.alerts': { en: 'Alerts Blocked', bn: 'ব্লক করা সতর্কতা' },
  'dashboard.stats.uptime': { en: 'System Uptime', bn: 'সিস্টেম আপটাইম' },
  'dashboard.stats.response': { en: 'Response Time', bn: 'প্রতিক্রিয়া সময়' },
  
  // Children
  'children.title': { en: 'Children Management', bn: 'শিশু ব্যবস্থাপনা' },
  'children.add': { en: 'Add Child', bn: 'শিশু যোগ করুন' },
  'children.profile': { en: 'Child Profile', bn: 'শিশুর প্রোফাইল' },
  'children.age': { en: 'Age', bn: 'বয়স' },
  'children.grade': { en: 'Grade', bn: 'শ্রেণী' },
  'children.status': { en: 'Status', bn: 'অবস্থা' },
  'children.online': { en: 'Online', bn: 'অনলাইন' },
  'children.offline': { en: 'Offline', bn: 'অফলাইন' },
  'children.lastseen': { en: 'Last Seen', bn: 'শেষ দেখা' },
  
  // Alerts
  'alerts.title': { en: 'Security Alerts', bn: 'নিরাপত্তা সতর্কতা' },
  'alerts.new': { en: 'New', bn: 'নতুন' },
  'alerts.read': { en: 'Read', bn: 'পঠিত' },
  'alerts.archived': { en: 'Archived', bn: 'সংরক্ষিত' },
  'alerts.high': { en: 'High Priority', bn: 'উচ্চ অগ্রাধিকার' },
  'alerts.medium': { en: 'Medium Priority', bn: 'মাঝারি অগ্রাধিকার' },
  'alerts.low': { en: 'Low Priority', bn: 'নিম্ন অগ্রাধিকার' },
  'alerts.all': { en: 'All Alerts', bn: 'সব সতর্কতা' },
  'alerts.markread': { en: 'Mark as Read', bn: 'পঠিত হিসেবে চিহ্নিত করুন' },
  'alerts.archive': { en: 'Archive', bn: 'আর্কাইভ করুন' },
  
  // Payments
  'payments.title': { en: 'Payment Plans', bn: 'পেমেন্ট প্ল্যান' },
  'payments.current': { en: 'Current Plan', bn: 'বর্তমান প্ল্যান' },
  'payments.upgrade': { en: 'Upgrade Plan', bn: 'প্ল্যান আপগ্রেড করুন' },
  'payments.history': { en: 'Payment History', bn: 'পেমেন্ট ইতিহাস' },
  'payments.method': { en: 'Payment Method', bn: 'পেমেন্ট পদ্ধতি' },
  'payments.nextbilling': { en: 'Next Billing', bn: 'পরবর্তী বিলিং' },
  'payments.cancel': { en: 'Cancel Subscription', bn: 'সাবস্ক্রিপশন বাতিল করুন' },
  
  // Settings
  'settings.title': { en: 'Settings', bn: 'সেটিংস' },
  'settings.profile': { en: 'Profile Settings', bn: 'প্রোফাইল সেটিংস' },
  'settings.notifications': { en: 'Notifications', bn: 'বিজ্ঞপ্তি' },
  'settings.privacy': { en: 'Privacy & Security', bn: 'গোপনীয়তা ও নিরাপত্তা' },
  'settings.language': { en: 'Language', bn: 'ভাষা' },
  'settings.theme': { en: 'Theme', bn: 'থিম' },
  'settings.account': { en: 'Account Settings', bn: 'অ্যাকাউন্ট সেটিংস' },
  'settings.email': { en: 'Email Address', bn: 'ইমেল ঠিকানা' },
  'settings.phone': { en: 'Phone Number', bn: 'ফোন নম্বর' },
  'settings.password': { en: 'Password', bn: 'পাসওয়ার্ড' },
  'settings.changepassword': { en: 'Change Password', bn: 'পাসওয়ার্ড পরিবর্তন করুন' },
  
  // Features
  'features.title': { en: 'Features', bn: 'বৈশিষ্ট্য' },
  'features.monitoring': { en: 'Real-Time Monitoring', bn: 'রিয়েল-টাইম মনিটরিং' },
  'features.filtering': { en: 'Smart Content Filtering', bn: 'স্মার্ট কন্টেন্ট ফিল্টারিং' },
  'features.alerts': { en: 'Instant Alerts', bn: 'তাৎক্ষণিক সতর্কতা' },
  'features.location': { en: 'Location Tracking', bn: 'অবস্থান ট্র্যাকিং' },
  'features.screentime': { en: 'Screen Time Management', bn: 'স্ক্রিন টাইম ব্যবস্থাপনা' },
  'features.reports': { en: 'Detailed Reports', bn: 'বিস্তারিত প্রতিবেদন' },
  'features.ai': { en: 'AI-Powered Protection', bn: 'AI-চালিত সুরক্ষা' },
  'features.family': { en: 'Family Dashboard', bn: 'পরিবার ড্যাশবোর্ড' },
  'features.instant': { en: 'Get notified immediately when suspicious content is detected', bn: 'সন্দেহজনক কন্টেন্ট সনাক্ত হলে তাৎক্ষণিক জানানো হবে' },
  
  // Hero Section
  'hero.subtitle': { en: 'Advanced AI-powered family safety platform', bn: 'উন্নত AI-চালিত পারিবারিক নিরাপত্তা প্ল্যাটফর্ম' },
  'hero.trial': { en: 'Start Free Trial', bn: 'বিনামূল্যে ট্রায়াল শুরু করুন' },
  'hero.learn': { en: 'Learn More', bn: 'আরও জানুন' },
  
  // Stats
  'stats.families': { en: 'Families Protected', bn: 'সুরক্ষিত পরিবার' },
  'stats.alerts': { en: 'Alerts Blocked', bn: 'ব্লক করা সতর্কতা' },
  'stats.uptime': { en: 'System Uptime', bn: 'সিস্টেম আপটাইম' },
  'stats.response': { en: 'Response Time', bn: 'প্রতিক্রিয়া সময়' },
  
  // Testimonials
  'testimonial.title': { en: 'Trusted by Thousands of Families', bn: 'হাজার হাজার পরিবারের বিশ্বাস' },
  'testimonial.subtitle': { en: 'See what parents are saying about Guardian Shield', bn: 'পিতামাতারা গার্ডিয়ান শিল্ড সম্পর্কে কী বলছেন দেখুন' },
  
  // Pricing
  'pricing.title': { en: 'Pricing', bn: 'মূল্য' },
  'pricing.free': { en: 'Free', bn: 'বিনামূল্য' },
  'pricing.family': { en: 'Family', bn: 'পরিবার' },
  'pricing.school': { en: 'School', bn: 'স্কুল' },
  'pricing.monthly': { en: 'Monthly', bn: 'মাসিক' },
  'pricing.yearly': { en: 'Yearly', bn: 'বার্ষিক' },
  'pricing.starttrial': { en: 'Start Free Trial', bn: 'বিনামূল্যে ট্রায়াল শুরু করুন' },
  'pricing.contact': { en: 'Contact Sales', bn: 'বিক্রয় দলের সাথে যোগাযোগ করুন' },
  
  // Auth
  'auth.welcome': { en: 'Welcome Back', bn: 'আবার স্বাগতম' },
  'auth.login': { en: 'Sign In', bn: 'সাইন ইন' },
  'auth.register': { en: 'Create Account', bn: 'অ্যাকাউন্ট তৈরি করুন' },
  'auth.email': { en: 'Email Address', bn: 'ইমেল ঠিকানা' },
  'auth.password': { en: 'Password', bn: 'পাসওয়ার্ড' },
  'auth.confirmpassword': { en: 'Confirm Password', bn: 'পাসওয়ার্ড নিশ্চিত করুন' },
  'auth.forgot': { en: 'Forgot Password?', bn: 'পাসওয়ার্ড ভুলে গেছেন?' },
  'auth.remember': { en: 'Remember Me', bn: 'আমাকে মনে রাখুন' },
  'auth.noaccount': { en: "Don't have an account?", bn: 'অ্যাকাউন্ট নেই?' },
  'auth.haveaccount': { en: 'Already have an account?', bn: 'ইতিমধ্যে অ্যাকাউন্ট আছে?' },
  'auth.create': { en: 'Create Account', bn: 'অ্যাকাউন্ট তৈরি করুন' },
  
  // Messages
  'msg.loading': { en: 'Loading...', bn: 'লোড হচ্ছে...' },
  'msg.error': { en: 'Something went wrong', bn: 'কিছু ভুল হয়েছে' },
  'msg.success': { en: 'Operation successful', bn: 'অপারেশন সফল' },
  'msg.nodata': { en: 'No data available', bn: 'কোনো ডেটা উপলব্ধ নেই' },
  'msg.network': { en: 'Network error', bn: 'নেটওয়ার্ক ত্রুটি' },
  'msg.offline': { en: 'You are offline', bn: 'আপনি অফলাইনে আছেন' },
  'msg.online': { en: 'You are online', bn: 'আপনি অনলাইনে আছেন' },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    // Get saved language from localStorage or browser preference
    const savedLang = localStorage.getItem('guardian-shield-language') as Language
    if (savedLang && (savedLang === 'en' || savedLang === 'bn')) {
      setLanguage(savedLang)
    } else {
      // Detect browser language
      const browserLang = navigator.language.toLowerCase()
      if (browserLang.includes('bn') || browserLang.includes('bengali')) {
        setLanguage('bn')
      } else {
        setLanguage('en')
      }
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('guardian-shield-language', lang)
    
    // Update HTML lang attribute
    document.documentElement.lang = lang
    
    // Update text direction (though Bengali is also LTR)
    document.documentElement.dir = 'ltr'
    
    // Update body class for font styling
    document.body.className = document.body.className.replace(/lang-\w+/g, '')
    document.body.classList.add(`lang-${lang}`)
    
    // Trigger custom event for language change
    window.dispatchEvent(new CustomEvent('languageChange', { detail: { language: lang } }))
  }

  const t = (key: string): string => {
    return translations[key]?.[language] || key
  }

  const isRTL = false // Bengali and English are both LTR

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
