import { NextRequest, NextResponse } from 'next/server'
import { otpStorage } from '@/lib/otp-storage'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone } = body

    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      )
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString()

    // Store OTP with 5-minute expiration
    otpStorage.set(phone, otp)

    // In production, send SMS here using Twilio, AWS SNS, or similar service
    console.log(`OTP for ${phone}: ${otp}`)

    // For development/demo, include OTP in response
    const isDevelopment = process.env.NODE_ENV === 'development'

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      // Only include OTP in development for testing
      ...(isDevelopment && { otp }),
    })
  } catch (error) {
    console.error('Error sending OTP:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
