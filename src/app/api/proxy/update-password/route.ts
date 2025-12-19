import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = 'http://127.0.0.1:8000/api'

export async function POST(request: NextRequest) {
  try {
    // Get authorization header from request
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Authorization header required' },
        { status: 401 }
      )
    }

    // Get the request body
    const body = await request.json()

    const response = await fetch(`${API_BASE_URL}/update/password`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Proxy update password error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
