import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST: Send OTP
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone } = body

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      )
    }

    // Find professional by phone
    const professional = await db.healthcareProfessional.findUnique({
      where: { phone }
    })

    if (!professional) {
      return NextResponse.json(
        { error: 'Professional not found' },
        { status: 404 }
      )
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Delete any existing unused OTP codes
    await db.otpCode.deleteMany({
      where: {
        professionalId: professional.id,
        isUsed: false
      }
    })

    // Create new OTP code
    await db.otpCode.create({
      data: {
        code: otp,
        expiresAt,
        professionalId: professional.id
      }
    })

    // In development, log the OTP (in production, send via SMS)
    if (process.env.NODE_ENV === 'development') {
      console.log(`OTP for ${phone}: ${otp}`)
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      // In development, return the OTP for testing
      ...(process.env.NODE_ENV === 'development' && { otp })
    })

  } catch (error) {
    console.error('Error sending OTP:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}