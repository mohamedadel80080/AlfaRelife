import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = 'https://newpharmacy.syntecheg.com/api'

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${API_BASE_URL}/districts`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Proxy districts error:', error)
    return NextResponse.json(
      { message: 'Internal server error', error: String(error) },
      { status: 500 }
    )
  }
}
