import { NextRequest, NextResponse } from 'next/server'

// Mock data for skills
const SKILLS_DATA = [
  { id: 4, title: "Blister pack", selected: false },
  { id: 5, title: "Additional Prescribing Authorization", selected: false },
  { id: 6, title: "Cash Trained", selected: false },
  { id: 7, title: "Diabetes Education", selected: false },
  { id: 8, title: "Injection Certified", selected: false },
  { id: 9, title: "Medication Review", selected: false },
  { id: 10, title: "Methadone/Suboxone", selected: false },
  { id: 11, title: "Minor Ailment Prescribing", selected: false },
  { id: 12, title: "Smoking Cessation", selected: false },
  { id: 13, title: "Travel Health Education", selected: false }
]

// GET: Get skills data
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: SKILLS_DATA
    })
  } catch (error) {
    console.error('Error fetching skills:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Update skills selection
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

    // Update the selected status in the mock data
    const updatedSkills = SKILLS_DATA.map(skill => ({
      ...skill,
      selected: skills.includes(skill.title)
    }))

    return NextResponse.json({
      success: true,
      message: 'Skills updated successfully',
      data: updatedSkills
    })

  } catch (error) {
    console.error('Error updating skills:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}