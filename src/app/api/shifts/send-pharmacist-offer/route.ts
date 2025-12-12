import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { order_id, mileage, house, hour_rate, comment } = body

    if (!order_id) {
      return NextResponse.json(
        { 
          success: false,
          error: 'order_id is required' 
        },
        { status: 400 }
      )
    }

    // Mock API call - send pharmacist offer
    // In a real app, this would update the database
    console.log('Sending pharmacist offer for shift:', {
      order_id,
      mileage,
      house,
      hour_rate,
      comment
    })

    return NextResponse.json({
      success: true,
      message: 'Pharmacist offer sent successfully',
      data: {
        order_id,
        mileage: mileage || 0,
        house: house || 0,
        hour_rate: hour_rate || 0,
        comment: comment || '',
        sent_at: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error sending pharmacist offer:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
