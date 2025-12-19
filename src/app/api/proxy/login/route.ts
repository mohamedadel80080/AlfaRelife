import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = 'http://127.0.0.1:8000/api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Proxy login error:', error)
    return NextResponse.json(
      { message: 'Internal server error', error: String(error) },
      { status: 500 }
    )
  }
}
