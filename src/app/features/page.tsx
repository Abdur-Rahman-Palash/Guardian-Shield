"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  Users, 
  AlertTriangle, 
  Smartphone, 
  Globe, 
  Lock,
  Eye,
  Clock,
  Settings,
  Download,
  CheckCircle,
  ArrowRight,
  Star,
  Zap,
  Heart,
  Award,
  Activity
} from 'lucide-react'

export default function FeaturesPage() {
  const [activeTab, setActiveTab] = useState('monitoring')

  const features = {
    monitoring: [
      {
        icon: Eye,
        title: 'Real-Time Monitoring',
        description: 'Watch your children\'s online activities in real-time with live dashboard updates',
        image: '/screenshots/monitoring-dashboard.png',
        benefits: ['Live activity feed', 'Screen time tracking', 'App usage monitoring', 'Website visit history']
      },
      {
        icon: Clock,
        title: 'Time Management',
        description: 'Set healthy screen time limits and schedules for each child',
        image: '/screenshots/time-management.png',
        benefits: ['Custom time limits', 'Bedtime schedules', 'Homework focus time', 'Weekend rules']
      },
      {
        icon: Globe,
        title: 'Web Filtering',
        description: 'Block inappropriate content automatically with AI-powered filtering',
        image: '/screenshots/web-filtering.png',
        benefits: ['Adult content blocking', 'Social media control', 'Game restrictions', 'YouTube safety']
      }
    ],
    safety: [
      {
        icon: AlertTriangle,
        title: 'Smart Alerts',
        description: 'Get instant notifications about suspicious activities or content',
        image: '/screenshots/smart-alerts.png',
        benefits: ['Real-time alerts', 'Email notifications', 'Push notifications', 'Alert history']
      },
      {
        icon: Lock,
        title: 'Privacy Protection',
        description: 'Bank-level encryption keeps your family data secure and private',
        image: '/screenshots/privacy-protection.png',
        benefits: ['End-to-end encryption', 'Secure data storage', 'Privacy controls', 'GDPR compliant']
      },
      {
        icon: Smartphone,
        title: 'Location Tracking',
        description: 'Know where your children are with GPS location tracking',
        image: '/screenshots/location-tracking.png',
        benefits: ['Real-time location', 'Geofencing', 'Location history', 'Safe zones']
      }
    ],
    family: [
      {
        icon: Users,
        title: 'Multiple Profiles',
        description: 'Manage up to 5 children with individual settings and rules',
        image: '/screenshots/family-profiles.png',
        benefits: ['Individual profiles', 'Age-appropriate settings', 'Custom rules per child', 'Family dashboard']
      },
      {
        icon: Settings,
        title: 'Easy Setup',
        description: 'Get started in minutes with our simple setup process',
        image: '/screenshots/easy-setup.png',
        benefits: ['Quick installation', 'Step-by-step guide', 'Video tutorials', '24/7 support']
      },
      {
        icon: Download,
        title: 'Cross-Platform',
        description: 'Works on all devices - phones, tablets, and computers',
        image: '/screenshots/cross-platform.png',
        benefits: ['iOS & Android apps', 'Windows & Mac', 'Chrome extension', 'Web dashboard']
      }
    ]
  }

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Mother of 3',
      avatar: 'SJ',
      content: 'Guardian Shield has given me peace of mind knowing my kids are safe online. The alerts are incredibly helpful!',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Father of 2',
      avatar: 'MC',
      content: 'The best parental control app I\'ve used. Easy to set up and the AI filtering actually works!',
      rating: 5
    },
    {
      name: 'Emily Davis',
      role: 'Mother of 1',
      avatar: 'ED',
      content: 'Love the family dashboard! I can monitor all my kids\' activities from one place.',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800">Features</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Everything You Need to
            <span className="text-blue-600"> Protect Your Family</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Comprehensive parental controls powered by AI to keep your children safe online while giving them the freedom to explore.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Start Free Trial
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" size="lg">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Tabs */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-lg shadow-sm p-1 inline-flex">
              {['monitoring', 'safety', 'family'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-md font-medium transition-colors ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features[activeTab as keyof typeof features].map((feature, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                  <feature.icon className="w-16 h-16 text-blue-600" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">See Guardian Shield in Action</h2>
            <p className="text-xl text-gray-600">Powerful features designed for modern families</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Intuitive Dashboard</h3>
                  <p className="text-gray-600">Clean, easy-to-use interface for monitoring all your children's activities</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                  <p className="text-gray-600">Real-time updates and instant alerts when something needs your attention</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Built with Love</h3>
                  <p className="text-gray-600">Designed by parents, for parents who care about digital safety</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-xl p-4">
              <div className="aspect-video bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Dashboard Screenshot</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Thousands of Families</h2>
            <p className="text-xl text-gray-600">See what parents are saying about Guardian Shield</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Protect Your Family?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of parents who trust Guardian Shield to keep their children safe online.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Start Free Trial
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
