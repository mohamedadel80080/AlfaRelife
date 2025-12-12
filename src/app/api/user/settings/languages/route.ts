import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET: Get user languages
export async function GET() {
  try {
    // For now, we'll use the first user as the current user
    const professional = await db.healthcareProfessional.findFirst({
      include: {
        languages: true
      }
    })

    if (!professional) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: professional.languages.map(lang => lang.name)
    })

  } catch (error) {
    console.error('Error fetching languages:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Update user languages
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { languages } = body

    if (!Array.isArray(languages)) {
      return NextResponse.json(
        { error: 'Languages must be an array' },
        { status: 400 }
      )
    }

    // For now, we'll use the first user as the current user
    const professional = await db.healthcareProfessional.findFirst()

    if (!professional) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Delete existing languages
    await db.healthcareLanguage.deleteMany({
      where: { professionalId: professional.id }
    })

    // Add new languages
    if (languages.length > 0) {
      await db.healthcareLanguage.createMany({
        data: languages.map((name: string) => ({
          name,
          professionalId: professional.id
        }))
      })
    }

    // Update hasLanguages flag
    await db.healthcareProfessional.update({
      where: { id: professional.id },
      data: {
        hasLanguages: languages.length > 0,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Languages updated successfully',
      data: languages
    })

  } catch (error) {
    console.error('Error updating languages:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}