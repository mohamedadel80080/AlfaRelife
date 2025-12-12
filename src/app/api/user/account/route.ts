import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function DELETE(request: NextRequest) {
  try {
    // For now, we'll use the first user as the current user
    // In a real app, you'd get the user ID from authentication session
    const professional = await db.healthcareProfessional.findFirst()

    if (!professional) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Delete related records first (due to foreign key constraints)
    await db.healthcareLanguage.deleteMany({
      where: { professionalId: professional.id }
    })

    await db.healthcareSkill.deleteMany({
      where: { professionalId: professional.id }
    })

    await db.healthcareSoftware.deleteMany({
      where: { professionalId: professional.id }
    })

    await db.healthcareAnswer.deleteMany({
      where: { professionalId: professional.id }
    })

    await db.otpCode.deleteMany({
      where: { professionalId: professional.id }
    })

    // Delete the professional
    await db.healthcareProfessional.delete({
      where: { id: professional.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting account:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}