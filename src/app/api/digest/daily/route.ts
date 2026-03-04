import { createClient } from '@/utils/supabase/server'
import { sendDailyDigest } from '@/lib/email'
import { NextRequest, NextResponse } from 'next/server'

// This would typically be triggered by a cron job service like Vercel Cron Jobs
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get all parents who have opted in for daily digests
    const { data: parents, error: parentsError } = await supabase
      .from('profiles')
      .select('id, email, full_name, language, daily_digest_enabled')
      .eq('daily_digest_enabled', true)

    if (parentsError) {
      console.error('Error fetching parents:', parentsError)
      return NextResponse.json({ error: 'Failed to fetch parents' }, { status: 500 })
    }

    if (!parents || parents.length === 0) {
      return NextResponse.json({ message: 'No parents opted in for daily digest' })
    }

    const today = new Date().toISOString().split('T')[0]
    const results = []

    // Send daily digest to each parent
    for (const parent of parents) {
      try {
        // Get today's alerts for this parent's children
        const { data: alerts, error: alertsError } = await supabase
          .from('alerts')
          .select(`
            *,
            child:children!alerts_child_id_fkey (
              name
            )
          `)
          .eq('parent_id', parent.id)
          .gte('created_at', `${today}T00:00:00.000Z`)
          .lt('created_at', `${today}T23:59:59.999Z`)

        if (alertsError) {
          console.error(`Error fetching alerts for parent ${parent.id}:`, alertsError)
          continue
        }

        // Calculate digest data
        const totalAlerts = alerts?.length || 0
        const highRiskAlerts = alerts?.filter(a => a.severity === 'high').length || 0
        
        const alertsByCategory = alerts?.reduce((acc, alert) => {
          const category = alert.category || 'other'
          acc[category] = (acc[category] || 0) + 1
          return acc
        }, {} as Record<string, number>) || {}

        const alertsByChild = alerts?.reduce((acc, alert) => {
          const childName = alert.child?.name || 'Unknown'
          acc[childName] = (acc[childName] || 0) + 1
          return acc
        }, {} as Record<string, number>) || {}

        // Send daily digest email
        const digestData = {
          parentEmail: parent.email,
          parentName: parent.full_name || 'Parent',
          totalAlerts,
          alertsByCategory,
          alertsByChild,
          highRiskAlerts,
          date: new Date().toLocaleDateString(),
          language: parent.language || 'en'
        }

        const emailResult = await sendDailyDigest(digestData)
        
        results.push({
          parentId: parent.id,
          email: parent.email,
          success: emailResult.success,
          method: emailResult.method,
          totalAlerts
        })

        // Log digest sent
        await supabase
          .from('daily_digests')
          .insert({
            parent_id: parent.id,
            date: today,
            total_alerts: totalAlerts,
            high_risk_alerts: highRiskAlerts,
            email_sent_at: new Date().toISOString(),
            email_method: emailResult.method
          })

      } catch (error) {
        console.error(`Error sending digest to parent ${parent.id}:`, error)
        results.push({
          parentId: parent.id,
          email: parent.email,
          success: false,
          error: (error as Error).message
        })
      }
    }

    return NextResponse.json({
      success: true,
      date: today,
      totalParents: parents.length,
      results
    })
  } catch (error) {
    console.error('Daily digest API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

// Manual trigger for testing
export async function POST(request: NextRequest) {
  return GET(request)
}
