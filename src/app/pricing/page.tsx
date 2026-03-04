"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  X, 
  Star, 
  Users, 
  Shield, 
  Zap,
  Crown,
  Building,
  ArrowRight,
  HelpCircle,
  Heart
} from 'lucide-react'

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [selectedPlan, setSelectedPlan] = useState<string>('family')

  const plans = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for trying out Guardian Shield',
      icon: Shield,
      price: { monthly: 0, yearly: 0 },
      features: [
        'Monitor 1 child',
        'Basic web filtering',
        'Weekly reports',
        'Email alerts',
        'Mobile app access',
        'Community support'
      ],
      limitations: [
        'Limited alerts per month',
        'No advanced filtering',
        'No location tracking',
        'No priority support'
      ],
      color: 'from-gray-500 to-gray-600',
      popular: false
    },
    {
      id: 'family',
      name: 'Family',
      description: 'Most popular for families with multiple children',
      icon: Users,
      price: { monthly: 9.99, yearly: 99.99 },
      features: [
        'Monitor up to 5 children',
        'Advanced AI filtering',
        'Real-time alerts',
        'Location tracking',
        'Screen time management',
        'App blocking',
        'Weekly & monthly reports',
        'Email & push notifications',
        'Priority support',
        '30-day history'
      ],
      limitations: [],
      color: 'from-blue-500 to-blue-600',
      popular: true
    },
    {
      id: 'school',
      name: 'School',
      description: 'Comprehensive solution for educational institutions',
      icon: Building,
      price: { monthly: 49.99, yearly: 499.99 },
      features: [
        'Unlimited students',
        'Advanced monitoring & filtering',
        'Admin dashboard',
        'Teacher access controls',
        'Classroom management',
        'Detailed analytics',
        'Custom policies',
        'Dedicated support manager',
        'Training sessions',
        'Unlimited history',
        'API access',
        'Custom integrations'
      ],
      limitations: [],
      color: 'from-purple-500 to-purple-600',
      popular: false
    }
  ]

  const faqs = [
    {
      question: 'Can I change plans anytime?',
      answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, and PayPal. All payments are processed securely.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes! All paid plans come with a 14-day free trial. No credit card required to start.'
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Absolutely. You can cancel your subscription at any time with no cancellation fees.'
    },
    {
      question: 'Do you offer discounts?',
      answer: 'Yes! Save 20% with annual billing. We also offer special discounts for schools and non-profits.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes. We use bank-level encryption and never sell your data. Your privacy is our top priority.'
    }
  ]

  const getDisplayPrice = (plan: typeof plans[0]) => {
    const price = billingCycle === 'yearly' ? plan.price.yearly : plan.price.monthly
    return price === 0 ? 'Free' : `$${price}`
  }

  const getBillingText = (plan: typeof plans[0]) => {
    if (plan.price.monthly === 0) return 'Forever'
    return billingCycle === 'yearly' ? '/year' : '/month'
  }

  const getYearlySavings = (plan: typeof plans[0]) => {
    if (plan.price.monthly === 0) return null
    const monthlyTotal = plan.price.monthly * 12
    const savings = monthlyTotal - plan.price.yearly
    return savings > 0 ? `Save $${savings}/year` : null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800">Pricing</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Simple, Transparent
            <span className="text-blue-600"> Pricing</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Choose the perfect plan for your family. All plans include our core safety features with no hidden fees.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly
              <Badge className="ml-2 bg-green-100 text-green-800 text-xs">Save 20%</Badge>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all ${
                  plan.popular ? 'ring-2 ring-blue-500 transform scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
                    Most Popular
                  </div>
                )}
                
                <div className={`p-8 bg-gradient-to-br ${plan.color} text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <plan.icon className="w-8 h-8" />
                    {plan.popular && <Crown className="w-5 h-5" />}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="opacity-90 mb-6">{plan.description}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{getDisplayPrice(plan)}</span>
                    <span className="opacity-90">{getBillingText(plan)}</span>
                  </div>
                  {billingCycle === 'yearly' && getYearlySavings(plan) && (
                    <p className="text-sm mt-2 opacity-90">{getYearlySavings(plan)}</p>
                  )}
                </div>
                
                <div className="p-8">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                    {plan.limitations.map((limitation, index) => (
                      <li key={index} className="flex items-start gap-3 opacity-60">
                        <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-500">{limitation}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    className={`w-full py-3 ${
                      plan.popular
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {plan.price.monthly === 0 ? 'Get Started' : 'Start Free Trial'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Compare All Features</h2>
            <p className="text-xl text-gray-600">See exactly what's included in each plan</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-4 gap-4 p-6 border-b">
              <div className="font-medium text-gray-900">Feature</div>
              {plans.map((plan) => (
                <div key={plan.id} className="text-center font-medium text-gray-900">
                  {plan.name}
                </div>
              ))}
            </div>
            
            {[
              'Children monitored',
              'AI-powered filtering',
              'Real-time alerts',
              'Location tracking',
              'Screen time limits',
              'App blocking',
              'Weekly reports',
              'Priority support',
              'Custom policies',
              'API access'
            ].map((feature, index) => (
              <div key={index} className="grid md:grid-cols-4 gap-4 p-6 border-b">
                <div className="font-medium text-gray-700">{feature}</div>
                {plans.map((plan) => {
                  const hasFeature = 
                    plan.id === 'free' && index < 5 ||
                    plan.id === 'family' && index < 8 ||
                    plan.id === 'school'
                  
                  return (
                    <div key={plan.id} className="text-center">
                      {hasFeature ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 mx-auto" />
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Got questions? We've got answers.</p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border">
                <button className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50">
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <HelpCircle className="w-5 h-5 text-gray-400" />
                </button>
                <div className="px-6 pb-4">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of families who trust Guardian Shield to keep their children safe online.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Start Free Trial
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
