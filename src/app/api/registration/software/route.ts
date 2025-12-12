import { NextRequest, NextResponse } from 'next/server'

// Mock data for software
const SOFTWARES_DATA = [
  { id: 1, title: "software1", selected: false },
  { id: 2, title: "software2", selected: false },
  { id: 3, title: "Kroll", selected: false },
  { id: 4, title: "Propel", selected: false },
  { id: 5, title: "HealthWatch", selected: false }
]

// GET: Get software data
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: SOFTWARES_DATA
    })
  } catch (error) {
    console.error('Error fetching software:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Update software selection
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { softwares } = body

    if (!Array.isArray(softwares)) {
      return NextResponse.json(
        { error: 'Software must be an array' },
        { status: 400 }
      )
    }

    // Update the selected status in the mock data
    const updatedSoftware = SOFTWARES_DATA.map(software => ({
      ...software,
      selected: softwares.includes(software.title)
    }))

    return NextResponse.json({
      success: true,
      message: 'Software updated successfully',
      data: updatedSoftware
    })

  } catch (error) {
    console.error('Error updating software:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}