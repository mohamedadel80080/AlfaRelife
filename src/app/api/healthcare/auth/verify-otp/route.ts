import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST: Verify OTP
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, otp } = body

    if (!phone || !otp) {
      return NextResponse.json(
        { error: 'Phone number and OTP are required' },
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

    // Find valid OTP code
    const otpRecord = await db.otpCode.findFirst({
      where: {
        professionalId: professional.id,
        code: otp,
        isUsed: false,
        expiresAt: {
          gt: new Date()
        }
      }
    })

    if (!otpRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      )
    }

    // Mark OTP as used
    await db.otpCode.update({
      where: { id: otpRecord.id },
      data: { isUsed: true }
    })

    // Update professional phone verification status
    await db.healthcareProfessional.update({
      where: { id: professional.id },
      data: { phoneVerified: true }
    })

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      professional: {
        id: professional.id,
        firstName: professional.firstName,
        lastName: professional.lastName,
        email: professional.email,
        phone: professional.phone,
        isVerified: professional.isVerified,
        phoneVerified: true
      }
    })

  } catch (error) {
    console.error('Error verifying OTP:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}