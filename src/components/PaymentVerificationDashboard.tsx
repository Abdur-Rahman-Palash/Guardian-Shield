"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Shield, 
  CheckCircle, 
  Clock, 
  Users, 
  MessageCircle,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Eye
} from 'lucide-react'
import { paymentUtils } from './PaymentWhatsAppButton'

interface PaymentRecord {
  id: string
  timestamp: string
  amount: number
  plan: string
  whatsappNumber: string
  nagadNumber: string
  status: 'pending' | 'verified' | 'rejected'
  verifiedAt?: string
  verificationData?: {
    verifiedBy: string
    notes: string
    screenshotUrl?: string
  }
  customerInfo?: {
    name: string
    email: string
    phone: string
  }
}

// Mock data for demonstration - in real app, this would come from a database
const mockPayments: PaymentRecord[] = [
  {
    id: '1',
    timestamp: '2024-03-05T10:30:00Z',
    amount: 500,
    plan: 'Family Plan',
    whatsappNumber: '+8801786433078',
    nagadNumber: '01786433078',
    status: 'verified',
    verifiedAt: '2024-03-05T11:15:00Z',
    verificationData: {
      verifiedBy: 'admin',
      notes: 'Payment confirmed via Nagad transaction ID: TXN123456',
      screenshotUrl: '/screenshots/payment1.jpg'
    },
    customerInfo: {
      name: 'Ahmed Rahman',
      email: 'ahmed@example.com',
      phone: '01812345678'
    }
  },
  {
    id: '2',
    timestamp: '2024-03-05T09:45:00Z',
    amount: 500,
    plan: 'Family Plan',
    whatsappNumber: '+8801786433078',
    nagadNumber: '01786433078',
    status: 'pending',
    customerInfo: {
      name: 'Fatema Begum',
      email: 'fatema@example.com',
      phone: '01798765432'
    }
  }
]

export default function PaymentVerificationDashboard() {
  const [payments, setPayments] = useState<PaymentRecord[]>(mockPayments)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all')
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null)
  const [verificationNotes, setVerificationNotes] = useState('')
  const [showVerificationModal, setShowVerificationModal] = useState(false)

  // Load payment data from localStorage (for demo purposes)
  useEffect(() => {
    const localStoragePayment = paymentUtils.getPaymentStatus()
    if (localStoragePayment && !payments.find(p => p.id === 'local')) {
      const localPayment: PaymentRecord = {
        id: 'local',
        timestamp: localStoragePayment.timestamp,
        amount: localStoragePayment.amount,
        plan: localStoragePayment.plan,
        whatsappNumber: localStoragePayment.whatsappNumber,
        nagadNumber: localStoragePayment.nagadNumber,
        status: localStoragePayment.status,
        verifiedAt: localStoragePayment.verifiedAt,
        verificationData: localStoragePayment.verificationData
      }
      setPayments(prev => [localPayment, ...prev])
    }
  }, [payments])

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.customerInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customerInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customerInfo?.phone?.includes(searchTerm) ||
      payment.plan.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Handle payment verification
  const handleVerifyPayment = (payment: PaymentRecord, approved: boolean) => {
    const updatedPayments = payments.map(p => {
      if (p.id === payment.id) {
        const updatedPayment: PaymentRecord = {
          ...p,
          status: approved ? 'verified' : 'rejected',
          verifiedAt: new Date().toISOString(),
          verificationData: {
            verifiedBy: 'admin', // In real app, this would be the logged-in admin
            notes: verificationNotes
          }
        }
        
        // Update localStorage if this is the local payment
        if (p.id === 'local') {
          paymentUtils.verifyPayment(updatedPayment.verificationData)
        }
        
        return updatedPayment
      }
      return p
    })
    
    setPayments(updatedPayments)
    setShowVerificationModal(false)
    setVerificationNotes('')
    setSelectedPayment(null)
  }

  // Export payments data
  const exportPayments = () => {
    const csvContent = [
      ['ID', 'Customer Name', 'Email', 'Phone', 'Plan', 'Amount', 'Status', 'Timestamp', 'Verified At'].join(','),
      ...filteredPayments.map(p => [
        p.id,
        p.customerInfo?.name || 'N/A',
        p.customerInfo?.email || 'N/A',
        p.customerInfo?.phone || 'N/A',
        p.plan,
        p.amount,
        p.status,
        p.timestamp,
        p.verifiedAt || 'N/A'
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `payments-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary',
      verified: 'default',
      rejected: 'destructive'
    } as const

    const colors = {
      pending: 'bg-yellow-500',
      verified: 'bg-green-500',
      rejected: 'bg-red-500'
    }

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.toUpperCase()}
      </Badge>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment Verification</h1>
          <p className="text-muted-foreground">
            Manage and verify Guardian Shield subscription payments
          </p>
        </div>
        
        <Button onClick={exportPayments} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {payments.filter(p => p.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {payments.filter(p => p.status === 'verified').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ৳{payments.filter(p => p.status === 'verified').reduce((sum, p) => sum + p.amount, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Records ({filteredPayments.length})</CardTitle>
          <CardDescription>
            Recent payment verification requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPayments.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No payments found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'No payment records available'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Customer</th>
                    <th className="text-left p-3 font-medium">Plan</th>
                    <th className="text-left p-3 font-medium">Amount</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Timestamp</th>
                    <th className="text-left p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="border-b hover:bg-muted/50">
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{payment.customerInfo?.name || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{payment.customerInfo?.phone || 'N/A'}</div>
                        </div>
                      </td>
                      <td className="p-3">{payment.plan}</td>
                      <td className="p-3 font-medium">৳{payment.amount}</td>
                      <td className="p-3">{getStatusBadge(payment.status)}</td>
                      <td className="p-3">
                        <div className="text-sm">
                          <div>{new Date(payment.timestamp).toLocaleDateString()}</div>
                          <div className="text-gray-500">{new Date(payment.timestamp).toLocaleTimeString()}</div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {payment.status === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedPayment(payment)
                                setShowVerificationModal(true)
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          )}
                          {payment.verificationData && payment.verificationData.screenshotUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(payment.verificationData!.screenshotUrl, '_blank')}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Verification Modal */}
      {showVerificationModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Verify Payment</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowVerificationModal(false)}
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                {/* Payment Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">Customer Name</label>
                    <p className="text-sm text-gray-600">{selectedPayment.customerInfo?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Phone</label>
                    <p className="text-sm text-gray-600">{selectedPayment.customerInfo?.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Plan</label>
                    <p className="text-sm text-gray-600">{selectedPayment.plan}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Amount</label>
                    <p className="text-sm font-bold text-green-600">৳{selectedPayment.amount}</p>
                  </div>
                </div>

                {/* Verification Notes */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Verification Notes
                    </label>
                    <textarea
                      placeholder="Add notes about this verification (e.g., transaction ID, confirmation details)..."
                      value={verificationNotes}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setVerificationNotes(e.target.value)}
                      rows={3}
                      className="w-full p-2 border rounded-md resize-none"
                    />
                  </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t">
                  <Button
                    onClick={() => handleVerifyPayment(selectedPayment, true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Payment
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleVerifyPayment(selectedPayment, false)}
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Reject Payment
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowVerificationModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
