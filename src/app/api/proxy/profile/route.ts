import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = 'http://127.0.0.1:8000/api'

export async function GET(request: NextRequest) {
  try {
    // Get authorization header from request
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Authorization header required' },
        { status: 401 }
      )
    }

    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Proxy profile error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
