"use client"

import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'bn' : 'en'
    setLanguage(newLang)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
      title={language === 'en' ? 'Switch to Bengali' : 'ইংরেজিতে স্যুইচ করুন'}
    >
      <Globe className="w-4 h-4 text-blue-600" />
      <span className="font-medium text-sm">
        {language === 'en' ? 'EN' : 'বাং'}
      </span>
      <span className="text-xs text-gray-500">
        {language === 'en' ? '→ বাং' : '→ EN'}
      </span>
    </Button>
  )
}
