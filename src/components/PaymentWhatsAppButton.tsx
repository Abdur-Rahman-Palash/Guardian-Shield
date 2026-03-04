"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, CheckCircle, Shield, Users, Camera } from 'lucide-react'

interface PaymentWhatsAppButtonProps {
  className?: string
  variant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const WHATSAPP_NUMBER = '+8801786433078'
const PAYMENT_MESSAGE = 'GuardianShield%20Family%20Plan%20৳500'
const PAYMENT_AMOUNT = 500
const NAGAD_NUMBER = '01786433078'

export default function PaymentWhatsAppButton({ 
  className = '',
  variant = 'default',
  size = 'default'
}: PaymentWhatsAppButtonProps) {
  const [paymentInitiated, setPaymentInitiated] = useState(false)

  const handlePaymentClick = () => {
    // Track payment initiation in localStorage
    const paymentData = {
      initiated: true,
      timestamp: new Date().toISOString(),
      amount: PAYMENT_AMOUNT,
      plan: 'Family Plan',
      whatsappNumber: WHATSAPP_NUMBER,
      nagadNumber: NAGAD_NUMBER,
      status: 'pending'
    }
    
    localStorage.setItem('guardianShield_payment', JSON.stringify(paymentData))
    setPaymentInitiated(true)
    
    // Redirect to WhatsApp
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${PAYMENT_MESSAGE}`
    window.open(whatsappUrl, '_blank')
  }

  const getPaymentStatus = () => {
    if (typeof window === 'undefined') return null
    const stored = localStorage.getItem('guardianShield_payment')
    return stored ? JSON.parse(stored) : null
  }

  const paymentStatus = getPaymentStatus()

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Payment Status */}
      {paymentStatus && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-blue-600" />
              Payment Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Plan:</span>
              <Badge variant="outline">{paymentStatus.plan}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Amount:</span>
              <span className="text-sm font-bold text-green-600">৳{paymentStatus.amount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status:</span>
              <Badge 
                variant={paymentStatus.status === 'verified' ? 'default' : 'secondary'}
                className={paymentStatus.status === 'verified' ? 'bg-green-500' : ''}
              >
                {paymentStatus.status === 'verified' ? 'Verified' : 'Pending'}
              </Badge>
            </div>
            {paymentStatus.timestamp && (
              <div className="text-xs text-gray-500">
                Initiated: {new Date(paymentStatus.timestamp).toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Payment Button */}
      <Button
        onClick={handlePaymentClick}
        variant={variant}
        size={size}
        className="w-full"
        disabled={paymentInitiated}
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        {paymentInitiated ? 'Payment Initiated' : `Pay ৳${PAYMENT_AMOUNT} via WhatsApp`}
      </Button>

      {/* Payment Instructions */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Payment Instructions</CardTitle>
          <CardDescription className="text-sm">
            Complete your Guardian Shield Family Plan subscription
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Plan Features */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              Family Plan Features
            </h4>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Unlimited alerts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>5 children profiles</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Screenshot proof</span>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="border-t pt-3 space-y-2">
            <h4 className="font-medium text-sm">Payment Details</h4>
            <div className="bg-gray-50 p-3 rounded-md space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Amount:</span>
                <span className="font-bold text-green-600">৳{PAYMENT_AMOUNT}/year</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Nagad Number:</span>
                <span className="font-mono">{NAGAD_NUMBER}</span>
              </div>
            </div>
          </div>

          {/* WhatsApp Message Template */}
          <div className="border-t pt-3 space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-green-600" />
              WhatsApp Message Template
            </h4>
            <div className="bg-green-50 border border-green-200 p-3 rounded-md">
              <p className="text-sm text-gray-600">
                Send payment confirmation screenshot to verify your subscription
              </p>
            </div>
          </div>

          {/* Important Notes */}
          <div className="border-t pt-3">
            <div className="flex items-start gap-2 text-xs text-gray-600">
              <Camera className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium mb-1">Important:</p>
                <p>After payment, please send a screenshot of your payment confirmation to verify your subscription.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Utility functions for payment tracking
export const paymentUtils = {
  // Get payment status
  getPaymentStatus: () => {
    if (typeof window === 'undefined') return null
    const stored = localStorage.getItem('guardianShield_payment')
    return stored ? JSON.parse(stored) : null
  },

  // Mark payment as verified
  verifyPayment: (verificationData: any) => {
    if (typeof window === 'undefined') return false
    
    const currentData = paymentUtils.getPaymentStatus()
    if (!currentData) return false

    const updatedData = {
      ...currentData,
      status: 'verified',
      verifiedAt: new Date().toISOString(),
      verificationData
    }

    localStorage.setItem('guardianShield_payment', JSON.stringify(updatedData))
    return true
  },

  // Check if user has active subscription
  hasActiveSubscription: () => {
    const status = paymentUtils.getPaymentStatus()
    return status?.status === 'verified'
  },

  // Clear payment data
  clearPaymentData: () => {
    if (typeof window === 'undefined') return
    localStorage.removeItem('guardianShield_payment')
  }
}
