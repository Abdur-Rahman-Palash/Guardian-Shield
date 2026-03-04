import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Features - Guardian Shield',
  description: 'Discover powerful features of Guardian Shield: AI-powered content filtering, real-time monitoring, location tracking, and comprehensive parental controls.',
  keywords: ['parental control features', 'AI content filtering', 'child monitoring', 'digital safety tools', 'family protection features'],
  openGraph: {
    title: 'Guardian Shield Features - Advanced Parental Controls',
    description: 'Explore comprehensive features designed to protect your children online with AI-powered safety tools.',
    url: '/features',
    images: [
      {
        url: '/og-features.png',
        width: 1200,
        height: 630,
        alt: 'Guardian Shield Features - Advanced Parental Controls',
      }
    ]
  },
  twitter: {
    title: 'Guardian Shield Features - Advanced Parental Controls',
    description: 'Explore comprehensive features designed to protect your children online with AI-powered safety tools.',
    images: ['/og-features.png']
  },
  alternates: {
    canonical: '/features',
  }
}
