import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET: Get user skills
export async function GET() {
  try {
    // For now, we'll use the first user as the current user
    const professional = await db.healthcareProfessional.findFirst({
      include: {
        skills: true
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
      data: professional.skills.map(skill => skill.name)
    })

  } catch (error) {
    console.error('Error fetching skills:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Update user skills
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { skills } = body

    if (!Array.isArray(skills)) {
      return NextResponse.json(
        { error: 'Skills must be an array' },
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

    // Delete existing skills
    await db.healthcareSkill.deleteMany({
      where: { professionalId: professional.id }
    })

    // Add new skills
    if (skills.length > 0) {
      await db.healthcareSkill.createMany({
        data: skills.map((name: string) => ({
          name,
          professionalId: professional.id
        }))
      })
    }

    // Update hasSkills flag
    await db.healthcareProfessional.update({
      where: { id: professional.id },
      data: {
        hasSkills: skills.length > 0,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Skills updated successfully',
      data: skills
    })

  } catch (error) {
    console.error('Error updating skills:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}