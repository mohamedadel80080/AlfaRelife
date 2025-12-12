import { NextRequest, NextResponse } from 'next/server'

// Mock data for languages, skills, and softwares
const LANGUAGES_DATA = [
  { id: 1, title: "en", selected: false },
  { id: 2, title: "ar", selected: false },
  { id: 3, title: "English", selected: false },
  { id: 4, title: "French", selected: false },
  { id: 5, title: "Hindi", selected: false },
  { id: 6, title: "Pakistani", selected: false },
  { id: 7, title: "wwwwwwwwwwwwww", selected: false },
  { id: 8, title: "eeeeeeeeeeeeeeeeeee", selected: false },
  { id: 9, title: "ggggggggggggggggggg", selected: false },
  { id: 10, title: "dddddddddddddddddd", selected: false },
  { id: 11, title: "aaaaaaaaaaaaaaaaa", selected: false }
]

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

const SOFTWARES_DATA = [
  { id: 1, title: "software1", selected: false },
  { id: 2, title: "software2", selected: false },
  { id: 3, title: "Kroll", selected: false },
  { id: 4, title: "Propel", selected: false },
  { id: 5, title: "HealthWatch", selected: false }
]

// GET: Get languages data
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: LANGUAGES_DATA
    })
  } catch (error) {
    console.error('Error fetching languages:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Update languages selection
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

    // Update the selected status in the mock data
    const updatedLanguages = LANGUAGES_DATA.map(lang => ({
      ...lang,
      selected: languages.includes(lang.title)
    }))

    return NextResponse.json({
      success: true,
      message: 'Languages updated successfully',
      data: updatedLanguages
    })

  } catch (error) {
    console.error('Error updating languages:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}