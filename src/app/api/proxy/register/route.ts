import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = 'https://newpharmacy.syntecheg.com/api'

export async function POST(request: NextRequest) {
  try {
    // Get the FormData from the request
    const formData = await request.formData()

    // Forward the FormData directly to the external API
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        // Don't set Content-Type - let fetch set it with boundary for multipart/form-data
      },
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Proxy registration error:', error)
    return NextResponse.json(
      { message: 'Internal server error', error: String(error) },
      { status: 500 }
    )
  }
}
