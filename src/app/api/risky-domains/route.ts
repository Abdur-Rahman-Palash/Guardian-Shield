import { NextRequest, NextResponse } from 'next/server'

// Mock risky domains data - in production, this would come from your database
const mockRiskyDomains = [
  {
    domain: 'pornhub.com',
    category: 'adult',
    severity: 'high',
    active: true
  },
  {
    domain: 'xvideos.com',
    category: 'adult',
    severity: 'high',
    active: true
  },
  {
    domain: 'bet365.com',
    category: 'gambling',
    severity: 'medium',
    active: true
  },
  {
    domain: 'pokerstars.com',
    category: 'gambling',
    severity: 'medium',
    active: true
  },
  {
    domain: 'facebook.com',
    category: 'social',
    severity: 'low',
    active: false
  },
  {
    domain: 'twitter.com',
    category: 'social',
    severity: 'low',
    active: false
  }
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const active = searchParams.get('active')

    let filteredDomains = mockRiskyDomains

    // Filter by category if specified
    if (category) {
      filteredDomains = filteredDomains.filter(domain => 
        domain.category === category
      )
    }

    // Filter by active status if specified
    if (active !== null) {
      const isActive = active === 'true'
      filteredDomains = filteredDomains.filter(domain => 
        domain.active === isActive
      )
    }

    return NextResponse.json({
      success: true,
      domains: filteredDomains,
      total: filteredDomains.length,
      lastUpdated: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error fetching risky domains:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch risky domains',
        domains: [],
        total: 0
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { domain, category, severity = 'medium', active = true } = body

    // Validate required fields
    if (!domain || !category) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Domain and category are required' 
        },
        { status: 400 }
      )
    }

    // In production, you would save this to your database
    const newDomain = {
      domain,
      category,
      severity,
      active,
      addedAt: new Date().toISOString()
    }

    console.log('New risky domain added:', newDomain)

    return NextResponse.json({
      success: true,
      domain: newDomain,
      message: 'Risky domain added successfully'
    })

  } catch (error) {
    console.error('Error adding risky domain:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to add risky domain' 
      },
      { status: 500 }
    )
  }
}
