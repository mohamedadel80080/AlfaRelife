import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { order_id } = body

    if (!order_id) {
      return NextResponse.json(
        { 
          success: false,
          error: 'order_id is required' 
        },
        { status: 400 }
      )
    }

    // Mock API call - accept pharmacy offer
    // In a real app, this would update the database
    console.log('Accepting pharmacy offer for shift:', order_id)

    return NextResponse.json({
      success: true,
      message: 'Pharmacy offer accepted successfully',
      data: {
        order_id,
        accepted: true,
        accepted_at: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error accepting pharmacy offer:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
