"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/LanguageContext'
import { 
  Shield, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  ArrowRight,
  Star,
  Lock,
  Globe,
  Heart,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react'

export default function HomePage() {
  const { t } = useLanguage()
  const stats = {
  familiesProtected: {
    value: '10,234',
    label: 'Families Protected'
  },
  alertsBlocked: {
    value: '1.2M',
    label: 'Alerts Blocked'
  },
  uptime: {
    value: '99.9%',
    label: 'System Uptime'
  },
  responseTime: {
    value: '< 100ms',
    label: 'Response Time'
  }
}

  const heroContent = {
    title: t('dashboard.protect'),
    subtitle: t('dashboard.subtitle'),
    cta: t('common.getstarted'),
    features: [t('features.monitoring'), t('features.filtering'), t('features.alerts'), t('features.family')]
  }

  const features = [
    {
      icon: Shield,
      title: t('features.ai'),
      description: t('features.monitoring'),
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Users,
      title: t('features.family'),
      description: 'Monitor up to 5 children with individual profiles and settings',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: AlertTriangle,
      title: t('features.alerts'),
      description: t('features.instant'),
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Lock,
      title: 'Privacy First',
      description: 'Bank-level encryption keeps your family data secure and private',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'Works worldwide with multi-language support and regional content filtering',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      icon: Activity,
      title: 'Real-time Analytics',
      description: 'Track screen time, app usage, and online behavior with detailed insights',
      color: 'from-pink-500 to-pink-600'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Mother of 3',
      content: 'Guardian Shield has given me peace of mind knowing my kids are safe online.',
      rating: 5,
      avatar: 'SJ'
    },
    {
      name: 'Michael Chen',
      role: 'Father of 2',
      content: 'The real-time alerts and detailed reports help me stay involved in my children\'s digital lives.',
      rating: 5,
      avatar: 'MC'
    },
    {
      name: 'Fatema Begum',
      role: 'Mother of 4',
      content: 'Finally, a tool that understands our needs and respects our privacy.',
      rating: 5,
      avatar: 'FB'
    }
  ]

  const plans = [
    {
      name: 'Free',
      price: '৳0',
      description: 'Perfect for getting started',
      features: ['1 child profile', 'Basic alerts', 'Email support'],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Family',
      price: '৳500',
      period: '/year',
      description: 'Most popular for families',
      features: ['5 children profiles', 'Unlimited alerts', 'Screenshot evidence', 'Priority support', 'Daily reports'],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'School',
      price: '৳2000',
      period: '/year',
      description: 'For educational institutions',
      features: ['Unlimited children', 'Admin dashboard', 'Advanced analytics', 'Phone support', 'Custom policies'],
      cta: 'Contact Sales',
      popular: false
    }
  ]

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              Trusted by 10,000+ families worldwide
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Protect Your Children
              </span>
              <br />
              <span className="text-4xl sm:text-5xl lg:text-6xl">Online</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Guardian Shield is your comprehensive digital parenting solution. 
              Monitor, protect, and guide your children through the digital world 
              with advanced AI-powered content filtering and real-time alerts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg" asChild>
                <Link href="/register">
                  <Shield className="w-5 h-5 mr-2" />
                  Start Free Trial
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg" onClick={() => window.open('https://www.linkedin.com/in/abdur-rahman-palash/', '_blank')}>
                <Globe className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">{stats.familiesProtected.value}</div>
                <p className="text-gray-600">{stats.familiesProtected.label}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">{stats.alertsBlocked.value}</div>
                <p className="text-gray-600">{stats.alertsBlocked.label}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">{stats.uptime.value}</div>
                <p className="text-gray-600">{stats.uptime.label}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-1">{stats.responseTime.value}</div>
                <p className="text-gray-600">{stats.responseTime.label}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Keep Your Family Safe
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive suite of tools works together to provide complete digital protection
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {features.map((feature, index) => (
              <Card key={feature.title} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl mb-2">{feature.title}</CardTitle>
                  <CardDescription className="text-lg text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How Guardian Shield Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in minutes and protect your family immediately
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Install & Setup',
                description: 'Install our browser extension and mobile app in minutes',
                icon: Zap
              },
              {
                step: '2',
                title: 'Create Profiles',
                description: 'Add your children and customize protection settings',
                icon: Users
              },
              {
                step: '3',
                title: 'Monitor & Protect',
                description: 'Receive real-time alerts and detailed activity reports',
                icon: Shield
              }
            ].map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">{step.step}</span>
                </div>
                <step.icon className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that works best for your family
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <Card key={plan.name} className={`relative border-2 ${
                plan.popular ? 'border-blue-500 shadow-xl' : 'border-gray-200'
              } hover:shadow-lg transition-shadow duration-300`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period && <span className="text-gray-600">{plan.period}</span>}
                  </div>
                  <CardDescription className="text-gray-600">{plan.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full py-3 ${
                      plan.popular 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => {
                      if (plan.name === 'School') {
                        window.open('mailto:sales@guardian-shield.com?subject=School Plan Inquiry', '_self')
                      } else {
                        window.location.href = '/register'
                      }
                    }}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by Parents Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what families are saying about Guardian Shield
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Protect Your Family?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of parents who trust Guardian Shield to keep their children safe online.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3" asChild>
              <Link href="/register">
                <Shield className="w-5 h-5 mr-2" />
                Start Free Trial
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 px-8 py-3" asChild>
              <Link href="/features">
                <Heart className="w-5 h-5 mr-2" />
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
