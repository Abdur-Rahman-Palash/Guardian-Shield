"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  TrendingUp,
  Download,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface Payment {
  id: string
  date: string
  amount: number
  status: 'completed' | 'pending' | 'failed'
  description: string
  type: 'subscription' | 'one-time'
}

export default function PaymentsPage() {
  const { t } = useLanguage()
  const [payments] = useState<Payment[]>([
    {
      id: '1',
      date: '2024-03-01',
      amount: 9.99,
      status: 'completed',
      description: 'Family Plan Monthly',
      type: 'subscription'
    },
    {
      id: '2',
      date: '2024-02-01',
      amount: 9.99,
      status: 'completed',
      description: 'Family Plan Monthly',
      type: 'subscription'
    },
    {
      id: '3',
      date: '2024-01-15',
      amount: 29.99,
      status: 'completed',
      description: 'Premium Features Add-on',
      type: 'one-time'
    }
  ])

  const currentPlan = {
    name: 'Family Plan',
    price: 9.99,
    billingCycle: 'monthly',
    features: ['Up to 5 children', 'Advanced filtering', 'Real-time alerts', 'Weekly reports'],
    nextBilling: '2024-04-01'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'pending': return 'bg-yellow-500'
      case 'failed': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed'
      case 'pending': return 'Pending'
      case 'failed': return 'Failed'
      default: return 'Unknown'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content */}
      <div>
        {/* Top navigation */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              {/* Header space for balance */}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8 pt-20">
          <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600 mt-1">Manage your subscription and billing</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <CreditCard className="w-4 h-4 mr-2" />
          Update Payment Method
        </Button>
      </div>

      {/* Current Plan */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">Current Plan</h2>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-bold">${currentPlan.price}</span>
              <span className="text-blue-100">/{currentPlan.billingCycle}</span>
            </div>
            <div className="flex items-center gap-2 text-blue-100">
              <Calendar className="w-4 h-4" />
              <span>Next billing: {currentPlan.nextBilling}</span>
            </div>
          </div>
          <div className="text-right">
            <Badge className="bg-white/20 text-white mb-2">Active</Badge>
            <p className="text-blue-100 text-sm">{currentPlan.name}</p>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-blue-500">
          <h3 className="font-semibold mb-3">Plan Features</h3>
          <div className="grid grid-cols-2 gap-2">
            {currentPlan.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-300" />
                <span className="text-blue-100">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Spending</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">$9.99</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">No change</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total This Year</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">$119.88</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">On track</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Last Payment</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">$9.99</p>
              <div className="flex items-center gap-1 mt-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">Successful</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Payment History</h2>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download Statement
          </Button>
        </div>
        
        <div className="divide-y divide-gray-200">
          {payments.map((payment) => (
            <div key={payment.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    payment.type === 'subscription' ? 'bg-blue-100' : 'bg-purple-100'
                  }`}>
                    <CreditCard className={`w-5 h-5 ${
                      payment.type === 'subscription' ? 'text-blue-600' : 'text-purple-600'
                    }`} />
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900">{payment.description}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-600">{payment.date}</span>
                      <Badge variant="outline" className="text-xs">
                        {payment.type === 'subscription' ? 'Recurring' : 'One-time'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${payment.amount}</p>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(payment.status)}`}></div>
                      <span className="text-sm text-gray-600">{getStatusText(payment.status)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade Options */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upgrade Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900">Basic</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">$4.99<span className="text-sm text-gray-600">/month</span></p>
            <p className="text-sm text-gray-600 mt-2">Up to 2 children</p>
            <Button variant="outline" size="sm" className="w-full mt-4">Downgrade</Button>
          </div>
          
          <div className="border-2 border-blue-500 rounded-lg p-4 relative">
            <Badge className="absolute -top-2 left-4 bg-blue-500">Current</Badge>
            <h3 className="font-medium text-gray-900">Family</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">$9.99<span className="text-sm text-gray-600">/month</span></p>
            <p className="text-sm text-gray-600 mt-2">Up to 5 children</p>
            <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">Current Plan</Button>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900">Premium</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">$19.99<span className="text-sm text-gray-600">/month</span></p>
            <p className="text-sm text-gray-600 mt-2">Unlimited children</p>
            <Button variant="outline" size="sm" className="w-full mt-4">Upgrade</Button>
          </div>
        </div>
      </div>
      </div>
        </main>
      </div>
    </div>
  )
}
