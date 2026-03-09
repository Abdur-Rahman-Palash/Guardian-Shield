import { NextRequest, NextResponse } from 'next/server'

// Mock alerts storage - in production, this would be saved to your database
let mockAlerts: any[] = []

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const childName = searchParams.get('childName')
    const limit = parseInt(searchParams.get('limit') || '10')

    let filteredAlerts = mockAlerts

    // Filter by child name if specified
    if (childName) {
      filteredAlerts = filteredAlerts.filter(alert =>
        alert.childName === childName
      )
    }

    // Sort by timestamp (newest first) and limit
    filteredAlerts = filteredAlerts
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)

    return NextResponse.json({
      success: true,
      alerts: filteredAlerts,
      total: filteredAlerts.length
    })

  } catch (error) {
    console.error('Error fetching alerts:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch alerts',
        alerts: [],
        total: 0
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type')
    
    if (contentType?.includes('multipart/form-data')) {
      // Handle screenshot upload
      const formData = await request.formData()
      const screenshot = formData.get('screenshot') as File
      const childName = formData.get('childName') as string
      const url = formData.get('url') as string
      const timestamp = formData.get('timestamp') as string

      if (!screenshot || !childName) {
        return NextResponse.json(
          {
            success: false,
            error: 'Screenshot and child name are required'
          },
          { status: 400 }
        )
      }

      // In production, you would save the screenshot to cloud storage
      const screenshotUrl = `/screenshots/${Date.now()}-${screenshot.name}`

      const newAlert = {
        id: Date.now().toString(),
        childName,
        url,
        timestamp,
        type: 'screenshot',
        screenshotUrl,
        message: 'Screenshot captured',
        severity: 'medium',
        acknowledged: false
      }

      mockAlerts.push(newAlert)
      console.log('Screenshot alert received:', newAlert)

      return NextResponse.json({
        success: true,
        alert: newAlert,
        message: 'Screenshot alert saved successfully'
      })

    } else {
      // Handle manual alert
      const body = await request.json()
      const { childName, message, url, timestamp, manual } = body

      if (!childName || !message) {
        return NextResponse.json(
          {
            success: false,
            error: 'Child name and message are required'
          },
          { status: 400 }
        )
      }

      const newAlert = {
        id: Date.now().toString(),
        childName,
        message,
        url,
        timestamp: timestamp || new Date().toISOString(),
        type: manual ? 'manual' : 'automatic',
        severity: 'medium',
        acknowledged: false
      }

      mockAlerts.push(newAlert)
      console.log('Manual alert received:', newAlert)

      return NextResponse.json({
        success: true,
        alert: newAlert,
        message: 'Alert saved successfully'
      })
    }

  } catch (error) {
    console.error('Error saving alert:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to save alert'
      },
      { status: 500 }
    )
  }
}
