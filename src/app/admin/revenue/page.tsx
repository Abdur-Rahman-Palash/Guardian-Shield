"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  CreditCard, 
  Calendar,
  Download,
  ArrowUp,
  ArrowDown,
  Activity,
  Target
} from 'lucide-react'

interface RevenueData {
  totalRevenue: number
  monthlyRevenue: number
  yearlyRevenue: number
  pendingRevenue: number
  totalPayments: number
  verifiedPayments: number
  pendingPayments: number
  monthlyGrowth: number
  yearlyGrowth: number
  averagePayment: number
  conversionRate: number
}

interface MonthlyRevenue {
  month: string
  revenue: number
  payments: number
  growth: number
}

interface PlanRevenue {
  plan: string
  revenue: number
  count: number
  percentage: number
}

export default function RevenueDashboard() {
  const [revenueData, setRevenueData] = useState<RevenueData>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    yearlyRevenue: 0,
    pendingRevenue: 0,
    totalPayments: 0,
    verifiedPayments: 0,
    pendingPayments: 0,
    monthlyGrowth: 0,
    yearlyGrowth: 0,
    averagePayment: 0,
    conversionRate: 0
  })
  const [monthlyData, setMonthlyData] = useState<MonthlyRevenue[]>([])
  const [planData, setPlanData] = useState<PlanRevenue[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'year' | 'all'>('month')

  const supabase = createClient()

  useEffect(() => {
    fetchRevenueData()
  }, [selectedPeriod])

  const fetchRevenueData = async () => {
    setLoading(true)
    try {
      const { data: payments, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching payments:', error)
        return
      }

      const verifiedPayments = payments?.filter(p => p.status === 'verified') || []
      const pendingPayments = payments?.filter(p => p.status === 'pending') || []

      // Calculate revenue metrics
      const totalRevenue = verifiedPayments.reduce((sum, p) => sum + (p.amount || 0), 0)
      const pendingRevenue = pendingPayments.reduce((sum, p) => sum + (p.amount || 0), 0)
      
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      const monthlyRevenue = verifiedPayments
        .filter(p => {
          const date = new Date(p.created_at)
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear
        })
        .reduce((sum, p) => sum + (p.amount || 0), 0)

      const yearlyRevenue = verifiedPayments
        .filter(p => new Date(p.created_at).getFullYear() === currentYear)
        .reduce((sum, p) => sum + (p.amount || 0), 0)

      // Calculate growth rates
      const lastMonthRevenue = verifiedPayments
        .filter(p => {
          const date = new Date(p.created_at)
          return date.getMonth() === (currentMonth - 1 + 12) % 12 && 
                 (date.getMonth() < currentMonth ? date.getFullYear() === currentYear : date.getFullYear() === currentYear - 1)
        })
        .reduce((sum, p) => sum + (p.amount || 0), 0)

      const monthlyGrowth = lastMonthRevenue > 0 ? 
        ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0

      const lastYearRevenue = verifiedPayments
        .filter(p => new Date(p.created_at).getFullYear() === currentYear - 1)
        .reduce((sum, p) => sum + (p.amount || 0), 0)

      const yearlyGrowth = lastYearRevenue > 0 ? 
        ((yearlyRevenue - lastYearRevenue) / lastYearRevenue) * 100 : 0

      // Calculate average payment and conversion rate
      const averagePayment = verifiedPayments.length > 0 ? totalRevenue / verifiedPayments.length : 0
      const conversionRate = payments && payments.length > 0 ? 
        (verifiedPayments.length / payments.length) * 100 : 0

      // Generate monthly data for the last 12 months
      const monthlyDataArray = []
      for (let i = 11; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const monthRevenue = verifiedPayments
          .filter(p => {
            const paymentDate = new Date(p.created_at)
            return paymentDate.getMonth() === date.getMonth() && 
                   paymentDate.getFullYear() === date.getFullYear()
          })
          .reduce((sum, p) => sum + (p.amount || 0), 0)
        
        const monthPayments = verifiedPayments.filter(p => {
          const paymentDate = new Date(p.created_at)
          return paymentDate.getMonth() === date.getMonth() && 
                 paymentDate.getFullYear() === date.getFullYear()
        }).length

        const previousMonthRevenue = i > 0 ? 
          verifiedPayments
            .filter(p => {
              const paymentDate = new Date(p.created_at)
              const prevDate = new Date(date)
              prevDate.setMonth(prevDate.getMonth() - 1)
              return paymentDate.getMonth() === prevDate.getMonth() && 
                     paymentDate.getFullYear() === prevDate.getFullYear()
            })
            .reduce((sum, p) => sum + (p.amount || 0), 0) : 0

        const growth = previousMonthRevenue > 0 ? 
          ((monthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 : 0

        monthlyDataArray.push({
          month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          revenue: monthRevenue,
          payments: monthPayments,
          growth
        })
      }

      // Calculate plan revenue breakdown
      const planRevenueMap = new Map<string, { revenue: number; count: number }>()
      verifiedPayments.forEach(payment => {
        const plan = payment.plan || 'unknown'
        if (!planRevenueMap.has(plan)) {
          planRevenueMap.set(plan, { revenue: 0, count: 0 })
        }
        const planData = planRevenueMap.get(plan)!
        planData.revenue += payment.amount || 0
        planData.count += 1
      })

      const planRevenueArray = Array.from(planRevenueMap.entries()).map(([plan, data]) => ({
        plan,
        revenue: data.revenue,
        count: data.count,
        percentage: totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0
      }))

      setRevenueData({
        totalRevenue,
        monthlyRevenue,
        yearlyRevenue,
        pendingRevenue,
        totalPayments: payments?.length || 0,
        verifiedPayments: verifiedPayments.length,
        pendingPayments: pendingPayments.length,
        monthlyGrowth,
        yearlyGrowth,
        averagePayment,
        conversionRate
      })

      setMonthlyData(monthlyDataArray)
      setPlanData(planRevenueArray)
    } catch (error) {
      console.error('Error fetching revenue data:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportRevenueData = () => {
    const csvContent = [
      ['Metric', 'Value'],
      ['Total Revenue', revenueData.totalRevenue.toString()],
      ['Monthly Revenue', revenueData.monthlyRevenue.toString()],
      ['Yearly Revenue', revenueData.yearlyRevenue.toString()],
      ['Total Payments', revenueData.totalPayments.toString()],
      ['Verified Payments', revenueData.verifiedPayments.toString()],
      ['Pending Payments', revenueData.pendingPayments.toString()],
      ['Average Payment', revenueData.averagePayment.toString()],
      ['Conversion Rate', revenueData.conversionRate.toString()],
      ['Monthly Growth', revenueData.monthlyGrowth.toString()],
      ['Yearly Growth', revenueData.yearlyGrowth.toString()],
      [],
      ['Monthly Breakdown'],
      ['Month', 'Revenue', 'Payments', 'Growth %'],
      ...monthlyData.map(m => [m.month, m.revenue.toString(), m.payments.toString(), m.growth.toString()]),
      [],
      ['Plan Breakdown'],
      ['Plan', 'Revenue', 'Count', 'Percentage'],
      ...planData.map(p => [p.plan, p.revenue.toString(), p.count.toString(), p.percentage.toString()])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `revenue-report-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Revenue Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor earnings and financial performance
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
          
          <Button onClick={exportRevenueData} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Revenue Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">৳{revenueData.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {revenueData.yearlyGrowth >= 0 ? (
                <ArrowUp className="w-3 h-3 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="w-3 h-3 text-red-500 mr-1" />
              )}
              <span className={revenueData.yearlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
                {revenueData.yearlyGrowth.toFixed(1)}% this year
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">৳{revenueData.monthlyRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {revenueData.monthlyGrowth >= 0 ? (
                <ArrowUp className="w-3 h-3 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="w-3 h-3 text-red-500 mr-1" />
              )}
              <span className={revenueData.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
                {revenueData.monthlyGrowth.toFixed(1)}% this month
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenueData.verifiedPayments}</div>
            <p className="text-xs text-muted-foreground">
              {revenueData.pendingPayments} pending
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{revenueData.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Avg: ৳{revenueData.averagePayment.toFixed(0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
          <CardDescription>
            Monthly revenue performance over the last 12 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyData.map((month, index) => (
              <div key={month.month} className="flex items-center gap-4">
                <div className="w-16 text-sm text-gray-600">{month.month}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                  <div 
                    className="bg-blue-600 h-8 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                    style={{ 
                      width: `${Math.min((month.revenue / Math.max(...monthlyData.map(m => m.revenue))) * 100, 100)}%` 
                    }}
                  >
                    <span className="text-xs text-white font-medium">
                      ৳{month.revenue.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="w-20 text-right">
                  <div className="text-sm font-medium">{month.payments} payments</div>
                  <div className={`text-xs ${month.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {month.growth >= 0 ? '+' : ''}{month.growth.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Plan Revenue Breakdown */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Plan</CardTitle>
            <CardDescription>
              Breakdown of revenue by subscription plans
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {planData.map((plan) => (
                <div key={plan.plan} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium capitalize">{plan.plan}</span>
                    <div className="text-right">
                      <div className="font-bold">৳{plan.revenue.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">{plan.count} users</div>
                    </div>
                  </div>
                  <div className="bg-gray-200 rounded-full h-4 relative">
                    <div 
                      className="bg-green-600 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${plan.percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500">{plan.percentage.toFixed(1)}% of total revenue</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Status</CardTitle>
            <CardDescription>
              Overview of payment verification status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium">Verified Payments</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">{revenueData.verifiedPayments}</div>
                  <div className="text-sm text-gray-500">৳{revenueData.totalRevenue.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="font-medium">Pending Payments</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-yellow-600">{revenueData.pendingPayments}</div>
                  <div className="text-sm text-gray-500">৳{revenueData.pendingRevenue.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="font-medium">Total Payments</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">{revenueData.totalPayments}</div>
                  <div className="text-sm text-gray-500">
                    {revenueData.conversionRate.toFixed(1)}% conversion
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>
            Key performance indicators for revenue optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                ৳{revenueData.averagePayment.toFixed(0)}
              </div>
              <p className="text-sm text-gray-600">Average Payment</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {revenueData.monthlyGrowth >= 0 ? '+' : ''}{revenueData.monthlyGrowth.toFixed(1)}%
              </div>
              <p className="text-sm text-gray-600">Monthly Growth</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {revenueData.conversionRate.toFixed(1)}%
              </div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {monthlyData[monthlyData.length - 1]?.payments || 0}
              </div>
              <p className="text-sm text-gray-600">This Month Payments</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
