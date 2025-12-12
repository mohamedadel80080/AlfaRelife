import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET: Get user softwares
export async function GET() {
  try {
    // For now, we'll use the first user as the current user
    const professional = await db.healthcareProfessional.findFirst({
      include: {
        softwares: true
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
      data: professional.softwares.map(software => software.name)
    })

  } catch (error) {
    console.error('Error fetching softwares:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Update user softwares
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { softwares } = body

    if (!Array.isArray(softwares)) {
      return NextResponse.json(
        { error: 'Softwares must be an array' },
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

    // Delete existing softwares
    await db.healthcareSoftware.deleteMany({
      where: { professionalId: professional.id }
    })

    // Add new softwares
    if (softwares.length > 0) {
      await db.healthcareSoftware.createMany({
        data: softwares.map((name: string) => ({
          name,
          professionalId: professional.id
        }))
      })
    }

    // Update hasSoftwares flag
    await db.healthcareProfessional.update({
      where: { id: professional.id },
      data: {
        hasSoftwares: softwares.length > 0,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Softwares updated successfully',
      data: softwares
    })

  } catch (error) {
    console.error('Error updating softwares:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}