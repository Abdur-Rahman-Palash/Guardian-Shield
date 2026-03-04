"use client"

import { useLanguage } from '@/contexts/LanguageContext'

interface TranslationProviderProps {
  children: React.ReactNode
}

export default function TranslationProvider({ children }: TranslationProviderProps) {
  // This component ensures that all child components have access to translations
  return <>{children}</>
}

// Export a hook for easy translation access
export function useTranslation() {
  const { t, language } = useLanguage()
  return { t, language }
}
