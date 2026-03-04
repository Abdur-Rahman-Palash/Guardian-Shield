import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing - Guardian Shield',
  description: 'Choose the perfect Guardian Shield plan for your family. Free, Family, and School plans with comprehensive parental controls and AI-powered safety features.',
  keywords: ['parental control pricing', 'family safety plans', 'child protection cost', 'digital parenting subscription', 'school safety pricing'],
  openGraph: {
    title: 'Guardian Shield Pricing - Affordable Family Protection',
    description: 'Transparent pricing plans for every family. Start with our free plan or upgrade to advanced features with our Family and School plans.',
    url: '/pricing',
    images: [
      {
        url: '/og-pricing.png',
        width: 1200,
        height: 630,
        alt: 'Guardian Shield Pricing - Affordable Family Protection',
      }
    ]
  },
  twitter: {
    title: 'Guardian Shield Pricing - Affordable Family Protection',
    description: 'Transparent pricing plans for every family. Start with our free plan or upgrade to advanced features.',
    images: ['/og-pricing.png']
  },
  alternates: {
    canonical: '/pricing',
  }
}
