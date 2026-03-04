import { createClient } from '@/utils/supabase/server'
import { sendAlertEmail } from '@/lib/email'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    
    const { alertId } = body
    
    if (!alertId) {
      return NextResponse.json({ error: 'Alert ID is required' }, { status: 400 })
    }

    // Fetch alert details
    const { data: alert, error: alertError } = await supabase
      .from('alerts')
      .select(`
        *,
        parent:profiles!alerts_parent_id_fkey (
          email,
          language,
          full_name
        ),
        child:children!alerts_child_id_fkey (
          name
        )
      `)
      .eq('id', alertId)
      .single()

    if (alertError || !alert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 })
    }

    if (!alert.parent?.email) {
      return NextResponse.json({ error: 'Parent email not found' }, { status: 400 })
    }

    // Send email alert
    const emailResult = await sendAlertEmail({
      parentEmail: alert.parent.email,
      childName: alert.child?.name || 'Unknown',
      alertUrl: alert.url,
      alertDomain: alert.domain,
      alertCategory: alert.category || 'other',
      alertSeverity: alert.severity || 'medium',
      screenshot: alert.screenshot,
      timestamp: alert.timestamp,
      language: alert.parent.language || 'en'
    })

    // Update alert status to 'notified'
    await supabase
      .from('alerts')
      .update({ 
        status: 'notified',
        email_sent_at: new Date().toISOString(),
        email_method: emailResult.method
      })
      .eq('id', alertId)

    return NextResponse.json({ 
      success: true, 
      method: emailResult.method,
      alertId 
    })
  } catch (error) {
    console.error('Alert email API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
