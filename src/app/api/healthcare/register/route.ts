import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      address,
      city,
      districtId,
      postcode,
      position,
      licence,
      province,
      licenceImage,
      profileImage,
      lat,
      lng,
      businessName,
      gst
    } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !password) {
      return NextResponse.json(
        { error: 'Missing required personal information' },
        { status: 400 }
      )
    }

    if (!address || !city || !districtId || !postcode || !position || !licence || !province || !businessName || !gst) {
      return NextResponse.json(
        { error: 'Missing required business information' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.healthcareProfessional.findFirst({
      where: {
        OR: [
          { email },
          { phone }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or phone already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create healthcare professional
    const professional = await db.healthcareProfessional.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        address,
        city,
        districtId,
        postcode,
        position,
        licence,
        province,
        licenceImage: licenceImage || '',
        profileImage: profileImage || '',
        lat: lat || 0,
        lng: lng || 0,
        businessName,
        gst,
        isVerified: false,
        phoneVerified: false
      }
    })

    // Return success response (without password)
    const { password: _, ...professionalWithoutPassword } = professional

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      professional: professionalWithoutPassword
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}