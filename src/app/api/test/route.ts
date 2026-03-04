import { NextRequest, NextResponse } from 'next/server'
import { addRiskySite, getAlerts, getUserAlerts } from '@/utils/supabase-admin'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const test = searchParams.get('test')

    switch (test) {
      case 'addRiskySite': {
        const result = await addRiskySite({
          domain: 'test-site.com',
          category: 'other',
          active: true,
        })
        return NextResponse.json(result)
      }

      case 'getAlerts': {
        const limit = parseInt(searchParams.get('limit') || '10')
        const result = await getAlerts(limit)
        return NextResponse.json(result)
      }

      case 'getUserAlerts': {
        const userId = searchParams.get('userId')
        if (!userId) {
          return NextResponse.json({ error: 'userId is required' }, { status: 400 })
        }
        const limit = parseInt(searchParams.get('limit') || '10')
        const result = await getUserAlerts(userId, limit)
        return NextResponse.json(result)
      }

      default:
        return NextResponse.json({ 
          message: 'Available test endpoints:',
          tests: [
            '/api/test?test=addRiskySite',
            '/api/test?test=getAlerts&limit=10',
            '/api/test?test=getUserAlerts&userId=USER_ID&limit=10'
          ]
        })
    }
  } catch (error) {
    console.error('Test API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { test, data } = body

    switch (test) {
      case 'addRiskySite': {
        const result = await addRiskySite(data)
        return NextResponse.json(result)
      }

      default:
        return NextResponse.json({ error: 'Invalid test type' }, { status: 400 })
    }
  } catch (error) {
    console.error('Test API POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
