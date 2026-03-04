import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import MainLayout from "@/components/layout/MainLayout"
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister"
import PWAInstall from "@/components/PWAInstall"
import { LanguageProvider } from "@/contexts/LanguageContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Guardian Shield - Family Safety Platform",
    template: "%s | Guardian Shield"
  },
  description: "Protect your children online with Guardian Shield. Advanced AI-powered content filtering, real-time alerts, and comprehensive digital parenting tools.",
  keywords: ["parental control", "child safety", "digital parenting", "content filtering", "online safety", "family protection"],
  authors: [{ name: "Guardian Shield Team" }],
  creator: "Guardian Shield",
  publisher: "Guardian Shield",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://guardianshield.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en': '/en',
      'bn': '/bn',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://guardianshield.com',
    title: 'Guardian Shield - Family Safety Platform',
    description: 'Protect your children online with Guardian Shield. Advanced AI-powered content filtering and real-time alerts.',
    siteName: 'Guardian Shield',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Guardian Shield - Family Safety Platform',
      },
      {
        url: '/og-image-square.png',
        width: 1200,
        height: 1200,
        alt: 'Guardian Shield - Protect Your Children Online',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@guardianshield',
    creator: '@guardianshield',
    title: 'Guardian Shield - Family Safety Platform',
    description: 'Protect your children online with Guardian Shield. Advanced AI-powered content filtering and real-time alerts.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  other: {
    'msapplication-TileColor': '#2563eb',
    'msapplication-config': '/browserconfig.xml',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Guardian Shield" />
        <meta name="application-name" content="Guardian Shield" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#2563eb" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ServiceWorkerRegister />
        <LanguageProvider>
          <MainLayout>
            {children}
          </MainLayout>
          <PWAInstall />
        </LanguageProvider>
      </body>
    </html>
  )
}
