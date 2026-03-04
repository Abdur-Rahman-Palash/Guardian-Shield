import { createClient } from '@/utils/supabase/server'
import { sendPaymentEmail } from '@/lib/email'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    
    const { paymentId } = body
    
    if (!paymentId) {
      return NextResponse.json({ error: 'Payment ID is required' }, { status: 400 })
    }

    // Fetch payment details
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select(`
        *,
        user:profiles!payments_user_id_fkey (
          email,
          language,
          full_name
        )
      `)
      .eq('id', paymentId)
      .single()

    if (paymentError || !payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    if (!payment.user?.email) {
      return NextResponse.json({ error: 'User email not found' }, { status: 400 })
    }

    // Send payment confirmation email
    const emailResult = await sendPaymentEmail({
      userEmail: payment.user.email,
      userName: payment.user.full_name || 'User',
      plan: payment.plan,
      amount: payment.amount,
      paymentMethod: payment.payment_method || 'Unknown',
      transactionId: payment.transaction_id,
      language: payment.user.language || 'en'
    })

    // Update payment record
    await supabase
      .from('payments')
      .update({ 
        email_sent_at: new Date().toISOString(),
        email_method: emailResult.method
      })
      .eq('id', paymentId)

    return NextResponse.json({ 
      success: true, 
      method: emailResult.method,
      paymentId 
    })
  } catch (error) {
    console.error('Payment email API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
