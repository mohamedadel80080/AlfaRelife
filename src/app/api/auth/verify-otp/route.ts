import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { otpStorage } from '@/lib/otp-storage'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, otp } = body

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, error: 'Phone and OTP are required' },
        { status: 400 }
      )
    }

    // Get stored OTP
    const storedData = otpStorage.get(phone)

    if (!storedData) {
      return NextResponse.json(
        { success: false, error: 'OTP not found. Please request a new one.' },
        { status: 404 }
      )
    }

    // Check expiration
    if (otpStorage.isExpired(phone)) {
      otpStorage.delete(phone)
      return NextResponse.json(
        { success: false, error: 'OTP expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      return NextResponse.json(
        { success: false, error: 'Invalid OTP. Please try again.' },
        { status: 400 }
      )
    }

    // OTP is valid, delete it
    otpStorage.delete(phone)

    // Generate JWT token
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-secret-key-change-in-production'
    )

    const token = await new SignJWT({ phone })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d') // Token valid for 7 days
      .sign(secret)

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      token,
      user: {
        phone,
      },
    })
  } catch (error) {
    console.error('Error verifying OTP:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
