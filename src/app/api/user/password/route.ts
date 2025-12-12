import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { oldPassword, password } = body

    if (!oldPassword || !password) {
      return NextResponse.json(
        { error: 'Old password and new password are required' },
        { status: 400 }
      )
    }

    // For now, we'll use the first user as the current user
    // In a real app, you'd get the user ID from authentication session
    const professional = await db.healthcareProfessional.findFirst()

    if (!professional) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Verify old password
    const isOldPasswordValid = await bcrypt.compare(oldPassword, professional.password)
    if (!isOldPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(password, 10)

    // Update password
    await db.healthcareProfessional.update({
      where: { id: professional.id },
      data: {
        password: hashedNewPassword,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully'
    })

  } catch (error) {
    console.error('Error updating password:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}